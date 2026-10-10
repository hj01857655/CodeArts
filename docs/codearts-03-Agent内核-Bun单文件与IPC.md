# 03 Agent 内核：Bun 单文件可执行与 IPC（A 级：提取产物 + 源码 + 实值三证）

> 对象：`agentkernelServer-win32-x64.exe`（173,069,240 B）。
> 证据链：`re/bun_extract/`（312 文件/71MB，`tools/py_extract_bun.py` 提取）+ `vscode-codebot/out/extension.js`（spawn 侧）+ `~/.codeartsdoer/CodeArts_Agent/`（运行时落盘实值）。

## 1. 内核是什么

- **Bun v1.3.14 单文件可执行**（内嵌 `bun-windows-x64.zip` 运行时 + JS 应用层）。JS 层以 `\x00 B:/~BUN/<路径> \x00` 分段嵌入，提取器按此切出 312 个文件（chunk JS、wasm、zip、dll、node 模块）。
- 应用本体是 **opencode 系 agent 运行时**（CLI 名 `codearts`，`OPENCODE_MODE`/`OPENCODE_*` 环境变量族贯穿；`~/.config/opencode/` 为原生数据目录，`opencode.json` 当前仅 `$schema`）。
- 内嵌资产（提取产物 `_index.tsv` 大项）：`codebase-cli-pkg-*.js`（21MB，代码库索引 CLI）、`toolset-win32-x64-*.zip`（8.2MB 工具集）、`microphone-win32-x64-*.zip`（7.8MB 音频）、tree-sitter 语法 wasm 族（ts/bash/powershell/zig/markdown…）、`opentui-*.dll`（TUI）、`rust_pty-*.dll`（PTY）、`watcher-*.node`（文件监听）。

## 2. 部署形态（扩展→用户目录复制 + 版本隔离）

```
安装目录 extensions/vscode-codebot/agentkernelServer-win32-x64.exe   (173MB)
   │  扩展初始化时复制
   ▼
~\.codeartsdoer\CodeArts_Agent\
├── AgentKernel_Vscode_26_9_500_1_0_0-1149958125686336.exe   ← 实际被 spawn 的内核（命名带 IDE 版本+内核版本）
├── AgentKernel_Vscode_26_9_101_…exe / 26_9_102_…exe          ← 历史版本并存（多版本共存）
├── Vscode_26_9_500-1_0_0-1149958125686336\server_config.properties
├── Vscode_26_9_101-…/  Vscode_26_9_102-…/
└── assets-manifest.json                                      ← 资源清单（version 1，file/directory 两类）
```

- 部署记录：`globalStorage/huaweicloud.codearts-snap/<IDE版本>/.assets-dir.json`：
  `{ version:1, assetsDir:"c:\\Users\\12925\\.codeartsdoer\\CodeArts_Agent", serverConfigDirRelativePath:"Vscode_26_9_500-1_0_0-1149958125686336" }`
- `extension.js` 卸载钩子会用正则 `const ASSETS_DIR = …;` 改写内嵌卸载脚本中的资产目录常量（`uninstall.js` 15KB）。

### server_config.properties（实值，A 级）

```ini
## CodeMate WebServer Configuration
# IDE Type: CodeArts_Agent
pid=27216
port=32641
version=1.0.0-1149958125686336
```

**内核自登记 pid/port** —— 扩展与 Webview 据此直连。

## 3. 进程启动（spawn 侧，extension.js 闭环）

```js
spawn(kernelExe, [`--port=${k}`, "serve"], {
  detached: true, windowsHide: true,
  stdio: ["ignore", stdoutLogFd, stderrLogFd],   // 日志落盘到 kernel 日志目录
  env: { ...process.env, NO_COLOR:"1",
         KERNEL_DATA_DIR, KERNEL_LOG_DIR, KERNEL_CONFIG_DIR, BUILT_IN_CONFIG_DIR,
         IS_PROD, PLUGIN_ENV,        // PLUGIN_ENV="hc" 时密码强制
         SCENARIO,
         OPENCODE_CONFIG, OPENCODE_CONFIG_FILE,
         CODE_AGENT_IDLE_SHUTDOWN,   // 空闲自杀
         OPENCODE_SKIP_MIGRATIONS, OPENCODE_CHANNEL,
         OPENCODE_SERVER_USERNAME: ze,   // 默认 "codearts"（hc 版）/ "opencode"
         OPENCODE_SERVER_PASSWORD: Be,   // 随机，每次会话生成
         IDE } }
```

端口选择：优先复用上次 `server_config.properties` 的端口（`ze.port`），不可用（TIME_WAIT）则 `lre()` 生成新端口；`serve` 命令自身 `port===0` 时兜底 4096。
配套动作：Win32 下写注册表 `HKCU\…\Windows Error Reporting\LocalDumps\<exe名>`（DumpType=2/DumpFolder/DumpCount=10）收集崩溃 dump；日志目录滚动清理（`*.log` 按前缀族）。

## 4. serve 命令与服务器（内核侧，root_src_index.js）

```js
N({ command:"serve", describe:"starts a headless codearts server",
    builder:_u,   // 含 --dir（attach 远程路径）等
    handler: async (D) => {
      // OPENCODE_MODE=cli && PLUGIN_ENV=hc 且无 CODEARTS_SERVER_PASSWORD/OPENCODE_SERVER_PASSWORD → exit(1)
      let u = await iF(D);            // listen 选项
      let F = Ju.listen(u);           // Bun.serve 包装
      console.log(`codearts server listening on http://${F.hostname}:${F.port}`);
      await new Promise(()=>{});      // 常驻
    }})
```

`Ju.listen`（root_chunk-bzhpyc94.js）：
- `Bun.serve({ hostname, idleTimeout:0, fetch: ControlPlaneRoutes().fetch, websocket: ue, port })`；`port===0` 先试 4096 再随机。
- 可选 **mDNS 发布**（`mdns && hostname 非回环` → `Vi.publish(port, mdnsDomain)`）——LAN 发现钩子。
- 中间件链（yHttp）：
  1. OPTIONS 直通（CORS）；
  2. **Basic Auth**：`cli`/`tui` 模式读 `CODEARTS_SERVER_PASSWORD ?? OPENCODE_SERVER_PASSWORD`（用户名 `CODEARTS_SERVER_USERNAME ?? OPENCODE_SERVER_USERNAME ?? ("codearts"|"opencode")`）；非 CLI 模式只认 `OPENCODE_SERVER_PASSWORD`（未设=无鉴权，启动告警 "server is unsecured"）；
  3. 请求日志（`/log` 路径自身不记日志）。
- 流式豁免：`/event`、`/global/event`、`/global/sync-event` 与 `POST /session/:id/message|prompt_async` 不走标准响应包装（SSE）。

## 5. IPC 路由面（ControlPlaneRoutes 全量，312 文件汇总）

opencode 控制面（REST + SSE + WebSocket），按域分组：

| 域 | 路由 |
|---|---|
| 会话 | `/session`（CRUD/list）、`/session/status`、`/open-sessions`、`/select-session`、`/chatkit/sessions`、`/realtime/sessions`、`/realtime/transcription_sessions` |
| 消息 | `POST /session/:id/message`、`POST /session/:id/prompt_async`（SSE 流）、`/emit-event`、`/event`、`/sync-event` |
| 配置 | `/config`（12 处引用）、`/config/reload`、`/global-config-plugin`、`/global/white-list` |
| 代码库/索引 | `/v1/index`、`/v1/indexed/files`、`/v1/all-file/count`、`/v1/ignore/file`、`/v1/files`、`/v1/embedded/file`、`/codebaseservice/v1/codebase/*`（含 progress/branches）、`/v1/lsp`、`/file`、`/file/content`、`/file/status`、`/find`、`/find/file`、`/find/symbol`、`/vcs`、`/vcs/diff` |
| Agent/MCP | `/agent`、`/agent/reload-state`、`/v1/agent-center/agents/useragents`（v1/v2）、`/v1/mcp-tools`、`/v1/builtin-tools`（内核）、`/v1/local-tools/permission`、`/mcp-session-id` 头 |
| 技能/命令 | `/skill`、`/skills`、`/v1/skill`、`/command`、`/execute-command` |
| 语音/实时 | `/realtime/transcription_sessions`、`/api/v1/queue/status` |
| 运维 | `/log`、`/lsp`（调试子命令 diagnostics/symbols）、`/instance/dispose`、`/cag/instance/reload`、`/tasks/logs`、`/auth`、`/v1/auth/hash` |
| 内核 OAuth | `POST /v1/oauth2/tokens`（内核侧第二 OAuth 面，4 处引用，见 02 §6）、`/qr-auth/{start,status,cancel}`（扫码授权） |
| 共享 | `POST /session/:id/share`（CLI 侧 `--share`/`OPENCODE_AUTO_SHARE`/`config.share="auto"` 触发） |

客户端事件面：`run [message..]` CLI 支持 `--attach http://localhost:4096 --password <CODEARTS_SERVER_PASSWORD>`（Basic Auth）+ `--dir`（远程工作目录）——即**内核可脱离 IDE 独立 attach 使用**（CLI 形态）。

## 6. 数据目录约定（KERNEL_* 环境变量 + 原生 opencode 面）

| 目录 | 内容 |
|---|---|
| `KERNEL_DATA_DIR`（扩展注入） | 内核数据根 |
| `KERNEL_LOG_DIR` | 日志（stdout/stderr 双文件按时间戳命名 + 滚动清理） |
| `KERNEL_CONFIG_DIR` / `BUILT_IN_CONFIG_DIR` | 服务器配置（server_config.properties 所在）/ 内置配置 |
| `~/.config/opencode/` | opencode 原生：`opencode.json`（config）、`auth.json`（**备用凭证落点**，XDG 优先，当前未生成）、`AGENTS.md`（CodeGraph 引导，自动维护 `<!-- CODEGRAPH_START -->` 段）、`skills/`（当前空） |
| `OPENCODE_MEMORY_DIR` 或 `~/.config/opencode/memory/<repoHash|repoPathSlug>` | 记忆系统（memory-plugin：`MEMORY.md`、`.dream-lock`、`.dream-sessions.json`、`.extraction-state.json`；负反馈元数据 hit_count/low_quality_hit_count） |

## 7. 一句话结论

Agent 内核 = **opencode 系 agent 运行时（Bun 单文件可执行）**：扩展复制内核到 `~/.codeartsdoer`（多版本并存）后以 `--port <k> serve` detached 拉起，自登记 pid/port 到 `server_config.properties`；IPC 是 HTTP Basic Auth 保护的 opencode 控制面（REST+SSE+WS，~40 路由），同时暴露独立 CLI attach 形态（4096 默认端口 + mDNS 钩子）。内核内嵌代码库索引（codebase-cli 21MB + codegraph/tree-sitter 族）、TUI/PTY/工具集/音频资产，并自带第二套 IAM OAuth（AK/SK 签名栈，见 04）。
