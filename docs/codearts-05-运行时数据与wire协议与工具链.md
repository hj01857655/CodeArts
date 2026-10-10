# 05 运行时数据、会话 wire 协议与工具执行链（A 级：实值 + 源码双证）

> 证据：`~/.codeartsdoer/codearts-data/` 实测（opencode.db 18 表、storage 树、checkpoint、sandbox_runner）、`tools/oscrypt_decrypt.py` 解出的会话实值、`re/bun_extract/` 内核 JS 层。

## 1. 运行时数据根（KERNEL_DATA_DIR 实值）

扩展注入 `KERNEL_DATA_DIR`（03 §3），实值落点 **`~/.codeartsdoer/`**（509MB `codearts-data/` + 166MB 内核资产）：

```
~/.codeartsdoer/
├── .gitignore, package.json, history-snip.jsonc
├── CodeArts_Agent/                 # 内核 exe 多版本 + 各版本配置目录（03 §2）
├── codearts-data/                  # ★ KERNEL_DATA_DIR 本体（509MB）
│   ├── opencode.db (+ .touch)      # ★ 主库（SQLite/drizzle，18 表）
│   ├── opencode.db-wal
│   ├── codearts.json               # 数据面配置
│   ├── 1/data … 4/data/            # 分片数据目录（数字分片）
│   ├── checkpoint/checkpoint_<16hex>/
│   │   ├── config.json             # {version, status:"diff", projectPath, createdAt}
│   │   ├── data/ses_*/             # 每会话子目录
│   │   └── objects/<2hex>/<64hex>  # 内容寻址对象（原始文件快照，sha256 名）
│   ├── storage/
│   │   ├── permission/config.json  # {"bash_mode":"always_allow"}
│   │   ├── permission/global.json  # 权限规则数组（见 §5）
│   │   ├── sandbox/config.json     # {"network_policy":"deny_all"}
│   │   ├── sandbox/sandbox.json    # {filesystem:{readWrite:[],readOnly:[]}, resources:{cpu:50,memory:8}}
│   │   ├── session_diff/*.json     # 164 个会话级 diff
│   │   ├── session_file_diff/*.json
│   │   └── migration
│   ├── sandbox_runner/3.0.2-20260920102918/sandbox/win32-x64/
│   │   ├── windows_sandbox.exe     # Windows 沙箱执行器
│   │   └── _internal/              # PyInstaller 打包（python3*.dll + .pyd 族）
│   ├── microphone/1.0.0-…/win32-x64/windows_microphone.exe
│   ├── cron/scheduled_tasks.json   # {"tasks":[]}
│   ├── custom-dir/data
│   └── log/
├── memory/<路径slug>/               # 记忆库（C--Program Files-CodeArts Agent 等）
├── skills/                         # 技能库（api-security、apk-reverse、code-audit…）
├── agents/ agent-team/ evolve/ generative-ui/ rule/ cache/
```

`codearts.json` 与 `package.json` 为数据面的轻量配置（`~/.config/opencode/opencode.json` 仅 `{"$schema":…}`，即原生 opencode 面未被使用，全走 codearts-data）。

## 2. opencode.db 主库（18 表，实测行数）

| 表 | 行数 | 字段要点 |
|---|---|---|
| session | 11 | id(`ses_f3b0…`)、project_id、parent_id、slug(**人类可读随机词组** `clever-nebula`)、directory、title、version(内核版本串)、share_url、summary_{additions,deletions,files,diffs}、revert、permission、time_{created,updated,compacting,archived}、workspace_id |
| message | 381 | id(`msg_0c4f…`)、session_id、time_created/updated、**data(JSON)** |
| part | 1655 | id、message_id、session_id、time_*、**data(JSON)** |
| project | 4 | id、worktree（`E:\VSCodeSpace\codearts2api` / `*` / `/` / `global`）、vcs、name、icon_*、commands、time_*、sandboxes |
| cag_file_diff | 124 | session_id、sub_session_id、file_path、user_message_id、source、call_id、is_new_agent_output、**is_accepted**、additions、deletions |
| cag_session_extra | 4 | session_id、has_origin_session、origin_session_version、origin_session、**is_favorite/favorite_at** |
| todo | 9 | session_id、content、status、priority、position、time_* |
| preference | 3 | user_id、domain_id、type、content、namespace、is_deleted |
| account / control_account / account_state | 0 | access_token、refresh_token、token_expiry（**opencode 原生 OAuth 面，本机未启用**） |
| event / event_sequence | 0 | 事件溯源表（当前为空，历史事件已投影进 message/part） |
| permission | 0 | project_id、data |
| session_share | 0 | session_id、secret、url |
| workspace | 0 | branch、project_id、type、directory |
| cag_message_extra | 0 | origin_message 版本链 |
| __drizzle_migrations | 11 | 迁移记录 |

**关键结构**：message/part 为「行存 + JSON data」混合（opencode 的 event-sourcing → projector 落库模式）。`session.id` 形如 `ses_f3b0d0e41ffeFo229mZzA3s35F`（前缀 `ses_` + 26 字符 base62 熵）；**`project.id` = 该 git 仓库的根提交 SHA（40 hex），已解，见 §4.1**。

### 2.1 message.data 字段集（60 条样本并集）

`role`(user/assistant)、`parentID`、`agent`(build)、`mode`(build)、`model:{providerID,modelID}`（user 侧）、`modelID`+`providerID`+`path:{cwd,root}`+`cost`+`tokens:{input,output,reasoning,cache:{read,write}}`+`finish`+`error`+`summary:{diffs}`+`tools`+`time:{created,completed}`（assistant 侧）。

实值样本：`providerID:"inferhub-provider"`，`modelID:"deepseek-v4-flash-0731"`；user 消息 `model:{providerID:"inferhub-provider",modelID:"deepseek-v4-flash-0731"}`。

### 2.2 part.data 六型（实测分布）

| type | 行数 | 字段 |
|---|---|---|
| tool | 445 | type、tool(`read`)、callID(`call_f781…`)、**state:{status,input,output}**、cost、tokens、time、metadata |
| step-start | 323 | `{type:"step-start"}` |
| step-finish | 306 | + finish reason/tokens |
| text | 291 | type、text、**metadata.isUserInput**（区分用户输入/模型输出） |
| reasoning | 289 | type、text（思维链全文落盘） |
| compaction | 1 | 上下文压缩标记 |

实值：tool `read` 的 `state.input={filePath}`，`state.output` 为带 `<path><type><entries>` 标签的目录列表；reasoning 文本为完整中文推理链（"用户想让我看看项目…"）。

## 3. 会话 wire 协议（IPC 侧，扩展↔内核）

### 3.1 prompt 请求（POST /session/{sessionID}/message）

body 字段（内核 client 定义，root_chunk-f6gesmpx.js）：

```
path:  sessionID
query: directory?, workspace?
body:  { messageID?, model?, agent?, noReply?, tools?, format?, system?, variant?, parts }
```

- `parts` 为消息内容数组（text/file/tool 等 part 形状，同 §2.2）。
- 相关：`GET /session/{id}/message?limit&before`（历史）、`DELETE /session/{id}/message/{messageID}`、`GET /session/{id}/message/{messageID}`（单条）、`POST /session/{id}/message` 的异步孪生 `POST /session/{id}/prompt_async`（SSE）。
- 会话 CRUD：`/session`（create/list/get/delete/fork/children/revert/summarize/abort），`/session/status`（并发忙闲）。

### 3.2 SSE 事件流（GET /event、/global/event、/sync-event）

响应头：`Content-Type: text/event-stream; charset=utf-8`、`Cache-Control: no-cache, no-transform`、`X-Accel-Buffering: no`、`X-Content-Type-Options: nosniff`、`Connection: keep-alive`。帧格式：`data: <JSON>\n\n`（无 `event:` 字段名，类型在 JSON 的 `type` 里）。首帧为 `{"type":"server.connected","properties":{}}`。

事件类型枚举（`XJ`/`Kat`，root_chunk-9bq6rhqj.js）：

| 枚举 | 值 |
|---|---|
| `XJ`（核心事件） | message.updated、message.part.updated、message.part.delta、message.part.removed、session.status、session.idle、session.updated、session.error、permission.updated、permission.asked、permission.replied、question.asked |
| `Kat`（+ 增量扩展） | XJ 全集 + text.delta、text.done、thinking.delta、thinking.done、tool.update、question、permission.ask、permission.reply、step.start、step.done |
| 会话/状态枚举 | role `nv=[user,assistant]`；part type `Qm=[text,tool,reasoning,step-start,step-finish,file]`；part status `tv=[running,completed,error,pending]`；session status `qJ=[busy,idle]`；permission reply `WJ=[once,always,reject]` |

`/global/event` 帧 = `{directory, payload}`；`/sync-event` 帧 = `{payload:{…event, type: versionedType(def.type, version)}}`（版本化事件，投影器 `ln.init({projectors, convertEvent})` 落库；`session.updated` 在投影时补 `info` 全量）。工作区同步：每个 workspace 独立 `GET /event` 长连接，1s 重连退避、250ms 轮询（`workspace-sync` 服务）。

### 3.3 WebSocket 线协议（`/im/welink` 路由，`HZ` adapter）

帧类型常量：`register` / `register_ok` / `register_rejected` / `heartbeat` / `tool_event` / `tool_done` / `tool_error` / `session_created` / `status_response`；错误 `session_not_found`；契约违例抛 `WireContractViolation`（zod 校验，`k.payloads()`）。命令枚举：`invoke`/`status_query`；会话动作：`chat`/`create_session`/`close_session`/`permission_reply`/`abort_session`/`question_reply`/`status_query`。

### 3.4 message.updated 事件 schema（zod，P…`Pat`/`h5n`）

```js
{ type: "message.updated",
  properties: { sessionID, messageID,
                info: { id, sessionID, role: "user"|"assistant",
                        time: {created, updated?}, model?, summary?, finish? } } }
```

`finish:{reason}`、`model:{providerID,modelID,options?}`、`summary` 均可选。

## 4. 会话持久化格式（存储侧）

- **主存 opencode.db**（§2）；`session_diff/ses_*.json` 存会话级 diff（164 个，当前样本为空数组 `[]`）。
- **checkpoint**（版本化快照）：`checkpoint_<16hex>/{config.json, data/ses_*/, objects/<2>/<64>}`；`config.json` 形如 `{version:"1.0.0", status:"diff", projectPath:"E:\\VSCodeSpace\\codearts2api", createdAt: <ms>}`；`objects/` 是 sha256 内容寻址的原始文件快照（样本为 `.vue`/`.js` 源码明文，7KB/2KB 级）。四个 checkpoint 对应四个工作区（codearts2api、Kiro\mitm、CodeArts Agent、CodeArts Agent\*）。**目录名 = `sha256(projectPath)` 的前 15 个 hex 字符**（4/4 全中，已解，见 §4.1）。
- **会话 id 前缀**：`ses_`(session)、`msg_`(message)、`call_`(tool callID)；`cag_*` 表为 CodeArts Agent 扩展层（文件 diff 采纳态、收藏会话）。

### 4.1 两个 id 生成规则（已解，实值 4/4 验证）

**(A) `project.id` = git 仓库根提交 SHA**

生成逻辑在 `root_chunk-sb5g03zb.js` 的 `Project.fromDirectory`（Effect 服务 `@opencode/Project` layer）：

1. 向上查找 `.git` 目录（`up({targets:[".git"], start:directory})`）；**找不到 → `id = "global"`, `worktree = "/"`**。
2. 读 `<gitdir>/opencode` 文件（`i = readFileString(join(gitdir,"opencode"))`）——该文件不存在则 `s = undefined`。
3. 无 git 可执行文件或 `git rev-parse --git-common-dir` 失败 → `id = s ?? "global"`。
4. **若 `s` 仍为空** → 执行 `git rev-list --max-parents=0 HEAD`，取**根提交 SHA**（首个 commit）作为 `id`，并**回写** `<git-common-dir>/.git/opencode`（`writeFileString`）持久化，下次直接命中。
5. `git rev-parse --show-toplevel` 决定 `worktree`（主仓）/ `sandbox`（子模块与 worktree 场景）。
6. 入库时若 `id !== "global"`，执行 `UPDATE session SET project_id = <id> WHERE project_id = 'global' AND directory = <worktree>`——把历史会话改挂到真实项目。

**实值验证**：

| project.id（opencode.db） | worktree | `.git/opencode` 内容 | = 根提交 SHA？ |
|---|---|---|---|
| `c81342bb64789ebc4adc5991a940345f209df9a5` | `E:\VSCodeSpace\codearts2api` | `c81342bb…d9a5` | ✅ `git rev-list --max-parents=0 HEAD` 同值 |
| `ac597c8e756e0117d935bb009a9a0bda5edd3180` | `E:\VSCodeSpace\Kiro\mitm` | （未落盘） | ✅ 由 `rev-list` 推导 |
| `global` | `/` | — | 非 git 根目录哨兵 |
| `*` | `*` | — | **迁移种子行**：`code-agent-migration` 插入 `{id:"*",worktree:"*",name:"Default",sandboxes:[]}`（`root_chunk-9bq6rhqj.js` 的 `grt()`），非真实项目 |

另：文件系统迁移路径（`root_src_index.js`）从 `project/*.json` 的**文件名**（`basename(path,".json")`）取 id，即历史 JSON 存储时代 id 就是根提交 SHA —— 两种存储的 id 规则一致。

**(B) `checkpoint_<hex>` = `sha256(projectPath)[:15]`**

| checkpoint 目录 | projectPath | sha256 前 15 位 | 匹配 |
|---|---|---|---|
| `checkpoint_8906aa64594102bd` | `E:\VSCodeSpace\codearts2api` | `8906aa64594102b` | ✅ |
| `checkpoint_a31ab486f45c5f72` | `E:\VSCodeSpace\Kiro\mitm` | `a31ab486f45c5f7` | ✅ |
| `checkpoint_d82b5896dfde0c26` | `C:\Program Files\CodeArts Agent` | `d82b5896dfde0c2` | ✅ |
| `checkpoint_89d36281d2ab57aa` | `C:\Program Files\CodeArts Agent\*` | `89d36281d2ab57a` | ✅ |

（`objects/<2hex>/<64hex>` 则是完整 sha256 文件内容哈希，与目录名规则无关。）

## 5. 工具执行链（注册表 + bash 沙箱 + 审批）

### 5.1 内置工具集（CLI/TUI 清单 `uF`，root_src_index.js）

`bash, read, write, edit, list, glob, grep, webfetch, task, todowrite`（10 个）——与 opencode 内核工具族一致；另一组聚合含 `edit, write, apply_patch, multiedit, bash, read, glob, grep, list, webfetch`（含 apply_patch/multiedit 变体）。`codesearch/codegraph` 为本地工具（见 5.4）。subagent 工具面另有 `str_replace_editor`/`str_replace_based_edit_tool`/`web_search_exa`/`get_code_context_exa`（exa 搜索）、`computer`（CUA）。

Agent 模式（`create` 命令 choices）：`all / primary / subagent`；内置 agent：`build / plan / general`（+ `summarize`、`btw`、`compaction`）。

### 5.2 bash 三模式（`BashMode` 枚举，root_chunk-cjmr6nt5.js）

`["always_allow","always_ask","sandbox"]`。与 UI 双向映射（root_chunk-q7hn5d0s.js run-mode-store）：`always_allow↔auto`、`always_ask↔manual`、`sandbox↔sandbox`；执行态模式名 `auto_mode/manual_mode/sandbox_mode/whitelist_mode`。

本机实值：`storage/permission/config.json = {"bash_mode":"always_allow"}`（当前允许全部 bash）——由 `app-settings.json` 的 `work.autoApproval={"bash":false,"sandboxCommand":true}` 与扩展首次启动的 `isInitSandbox` 流程共同决定（见 5.5）。

### 5.3 默认权限策略（合并链，Yj()）

默认全局规则 `global.json`（本机实值，节选）：

| permission | action | 备注 |
|---|---|---|
| edit / write / external_directory_write | allow | 文件写入默认放行 |
| webfetch | ask | 抓取需确认 |
| websearch | allow | |
| browser | ask | |
| external_directory_read | ask | |
| （另有 external_directory、dotfile 等） | | |

内核默认策略表（`w`/`W` 常量）与全局规则做 merge：bash 由 `bash_mode` 决定（`always_allow→allow`；`sandbox/whitelist→ask` + 白名单）；危险命令（`dangers`）经 `dZ()` 判定后走确认；`sandbox_risk_command`/`sandboxCommand` 为已废弃权限（读取时剔除）。

### 5.4 内核路由面的工具三族

| 路由 | 用途 | 返回 |
|---|---|---|
| `GET /v1/builtin-tools` | 内置工具（动态 import `chunk-5ac5hqhw.js` 的 `fetchBuiltInTools`） | `[{toolSetName, toolSet, description, tools[]}]` |
| `GET /v1/mcp-tools` | MCP 工具及状态 | `[{mcp_name, status}]` |
| `GET/POST /v1/local-tools/*` | 本地工具（codegraph 索引开关/手动索引/codebase 搜索） | `{status}`/`{result}`/`{manual:bool}` |
| `GET /v1/lsp` | LSP | |
| `POST /v1/auth/hash` | 插件安装 hash（返回 `hash/kernel_version/timestamp/app_id`，配合 `x-ot-trace-id`/`x-ot-span-id`） | |

### 5.5 沙箱执行与 isInitSandbox 接线

- 沙箱执行器：`sandbox_runner/<ver>/sandbox/win32-x64/windows_sandbox.exe`（PyInstaller，win32 专供）；`network_policy` 默认 `deny_all`（可配）；沙箱资源上限 `{cpu:50, memory:8}`（sandbox.json）。
- 扩展首次启动（`updatePluginSetting`）：若 globalState 无 `CodeAgent.isInitSandbox` → 置 `"true"`，并依次 `addToolPolicyDecision("executeCommand")` + `setBashMode({type:"sandboxCommand",value:true,agentId:"CodeAgent"})` + 写入 autoApproval → 即**默认以沙箱命令模式启动**（与 §5.2 实测 always_allow 并存：后者是用户后续在 UI 改为 auto 后的落盘）。
- autoApproval 状态键：`globalState["<agentId>.autoApproval"]`（JSON：`{executeCommand, sandboxCommand, whiteListCommand}`）。
- 危险命令面：bash 工具先 `parsePermissions(cwd, command)` 得 `{reads,writes,deletes,dangers}`，`isDangerous` 触发确认弹窗（UI 选项 1 允许一次 / 2 拒绝 / 3 always allow / 4 切沙箱，对应 `permission.bash.setMode`）。

## 6. 会话实值（oscrypt 解密，tools/oscrypt_decrypt.py）

**双秘密实体**（均 v10 + AES-256-GCM，本 fork 的 os_crypt 变体，密钥 = `Local State`.os_crypt.encrypted_key 经 DPAPI）：

1. `%APPDATA%\codearts\secretStorage\<64hex>.enc` = base64(v10‖nonce‖ct‖tag) → 内含 `{"session":{…},"loginContext":{…}}`（VS Code 系 safeStorage 通道）。
2. `state.vscdb` ItemTable 键 `secret://{"extensionId":"huaweicloud.authentication","key":"HuaweiCloudSession"}` 值 `{type:"Buffer",data:[…]}`（扩展 SecretStorage 通道）。

解密实值（脱敏）：

| 字段 | codearts/*（safeStorage） | state.vscdb（HuaweiCloudSession） |
|---|---|---|
| 账号 | userName `hj01857655`，userId/domainId `086b0271…` | account.id `086b0271c580f3ee1f88c01314631a3a` |
| accessKey | `HSTAD1D2MJ…`（20 字符，**STS 临时 AK**） | `HSTA7R7SR5…`（20） |
| secretKey | 40 字符 | 40 字符 |
| securityToken | 556 字符 | 560 字符 |
| expiresAt | `1789660298402`（ms） | `2026-09-30…`（ISO） |
| refreshToken | RS256 JWT（1208 字符） | 1216 字符 |
| clientId / stationType | `codearts` / `HC` | id=`huawei-cloud-authentication` |
| loginContext | pkcePair{codeVerifier,…} + dpopKeyPair{privateKeyJwk,publicKeyJwk} | 同 |
| 其他 | createdAt | scopes[]、safelyRenewTokenInterval=3605041ms（约 60min 续期窗口）、accessToken=""（AK/SK 型会话） |

**两处 accessKey 不同**（HSTAD1D2MJ… vs HSTA7R7SR5…）→ 两个实体是两次独立换发的临时凭证（安全 token 各异），会话互不通用；续期由内核定时器（`safelyRenewTokenInterval`）驱动 refresh。

## 7. 一句话结论

运行时数据全在 `~/.codeartsdoer/codearts-data/`：**opencode.db（drizzle，18 表，message/part 行存+JSON data 的 projector 模式）+ checkpoint（sha256(projectPath)[:14] 目录名的 sha256 内容寻址快照）+ storage（permission/sandbox/session_diff）+ sandbox_runner（windows_sandbox.exe，网络默认 deny_all）**。IPC 是 opencode 控制面：prompt 请求 11 字段、SSE 无名帧（`data: {type,…}`，XJ/Kat 双事件枚举，server.connected 起手）、另有 `/im/welink` WebSocket 线协议（register/heartbeat/tool_event 族）。bash 三模式 `always_allow/always_ask/sandbox` + 全局权限表（edit/write allow、webfetch/browser ask）驱动审批，扩展首启强制 `isInitSandbox`。凭证双实体（safeStorage.enc 与 vscdb `secret://` 键）都是 v10+AES-256-GCM，DPAPI 保护 os_crypt 钥，内含 STS 临时 AK/SK + STS token + refresh JWT + DPoP 私钥 JWK。
