# -*- coding: utf-8 -*-
"""
CodeArts OpenAI 兼容代理
=========================
把华为云 CodeArts 模型接口（openpangu-2.0-pro）包装成标准 OpenAI
Chat Completions API，供 Claude Code / OpenCode / Cline / Cherry Studio
等任何支持自定义 OpenAI Base URL 的工具直接使用。

启动方式:
    pip install -r requirements.txt
    python server.py

默认监听:  http://127.0.0.1:8787
OpenAI Base URL: http://127.0.0.1:8787/v1
"""
import datetime
import hashlib
import hmac
import json
import logging
import os
import threading
import time
import urllib.parse
from logging.handlers import RotatingFileHandler

import requests
from dotenv import load_dotenv
from flask import Flask, Response, g, jsonify, request
from requests.adapters import HTTPAdapter

import benefit
import credential_provider

load_dotenv()

def _current_creds() -> dict:
    return credential_provider.cred_and_env()

# CodeArts 目标端点（从抓包确认）
BASE_URL = "https://snap-access.cn-north-4.myhuaweicloud.com"
TARGET = BASE_URL + "/api/v2/chat/completions"
HOST = "snap-access.cn-north-4.myhuaweicloud.com"
AGENT_LIST_URL = BASE_URL + "/v1/agent-center/agents/useragents?offset=0&limit=100"
AGENT_DETAIL_PATH = "/v1/agent-center/agents/detail"

# 自动同步失败时的兜底列表（仅老套餐模型，走 AgentCenter 通道）；正常启动会用云端返回的列表覆盖它
FALLBACK_AGENT_MODELS = ["openpangu-2.0-pro", "openpangu-2.0-flash", "GLM-5.2"]
# 免费模型兜底列表（IDE 抓包确认）：走 maas_type=benefit 通道，签名时必须额外携带
# maas_type / model-id / model-name 三个头，否则报 "model is not registered"；
# 老套餐模型带上这些头反而会报 "unsupported model"，因此两条通道严格区分。
BENEFIT_MODELS = [
    "glm-5.3-flash",
    "deepseek-v4-pro-0813",
    "deepseek-v4-flash-0731",
]
FALLBACK_MODELS = FALLBACK_AGENT_MODELS + BENEFIT_MODELS
# opengw 免费额度网关（IDE 抓包确认）：永久 AK/SK 即可访问，gateway/config 返回免费模型列表
OPENGW_BASE = "https://opengw.developer.huaweicloud.com"
OPENGW_CONFIG_URL = OPENGW_BASE + "/api/v1/gateway/config"
# 模型同步时自动领取限时福利（幂等；不领取则福利模型调用必报 benefit not found）
BENEFIT_AUTO_CLAIM = os.getenv("CODEARTS_BENEFIT_AUTO_CLAIM", "1").strip() not in ("0", "false", "False", "no", "")
# 上游业务错误码：并发限流可退避重试，积分耗尽不可重试直接透传语义
UPSTREAM_RETRY_CODES = {"TM.00001041"}
UPSTREAM_RETRY_MAX = 3
UPSTREAM_RETRY_BACKOFF = 2.0
UPSTREAM_CREDIT_CODES = {"TM.00001050"}
# 模型缓存与代理程序放在同一目录，便于迁移、备份和排查
MODEL_CACHE_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "models-cache.json"
)
# AgentCenter 通道模型（决定是否用 benefit 签名；不在其中的模型一律按 benefit 处理，
# 这样 IDE 以后新增免费模型无需改代码，直接传模型名即可）
AGENT_MODELS = list(FALLBACK_AGENT_MODELS)
SUPPORTED_MODELS = list(FALLBACK_MODELS)
MODEL_DETAILS = {}

# 代理监听地址；改端口只需改这里（或设环境变量），启动日志会同步变化
LISTEN_HOST = os.getenv("CODEARTS_PROXY_HOST", "127.0.0.1")
LISTEN_PORT = int(os.getenv("CODEARTS_PROXY_PORT", "8787"))
# API Key 鉴权（与 qoder2api 同一套约定）：不设则无鉴权；设了则 /v1 与 /admin/api
# 必须携带 Authorization: Bearer <key>，不匹配返回 401。面板页豁免，key 注入页面后
# 由前端自动携带调用管理接口。
API_KEY = os.getenv("API_KEY", "").strip()

app = Flask(__name__)

# 上游连接池：复用 TLS 连接，避免每次请求重新握手（对话与模型同步都走这里）
_upstream = requests.Session()
_adapter = HTTPAdapter(pool_connections=4, pool_maxsize=16, max_retries=0)
_upstream.mount("https://", _adapter)
_upstream.mount("http://", _adapter)

# ── 请求日志（与 qoder2api 同一标准：request.log 轮转 + rid + in:/done: 双行）──
LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "request.log")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[
        RotatingFileHandler(LOG_FILE, maxBytes=2 * 1024 * 1024, backupCount=3, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)
# werkzeug 访问行在响应*开始*时打（流式会误导，且与 done 行重复），禁掉
logging.getLogger("werkzeug").disabled = True

# ── 请求/响应原文落盘（默认 dumps/，DUMP_DIR 改路径，DUMP=0 关闭）─────────────
# 只落 body 原文，绝不落 HTTP header：Authorization 里是明文网关 key，且 body 需可直接重放
DUMP_DIR = os.environ.get("DUMP_DIR", "") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "dumps")
DUMP_ON = os.environ.get("DUMP", "1").strip() != "0"
DUMP_MAX_BYTES = 512 * 1024   # 单方向落盘上限，防超大响应撑爆磁盘
DUMP_MAX_FILES = int(os.environ.get("DUMP_MAX_FILES", "200"))  # ≤0 表示不轮转

_seq_lock = threading.Lock()
_req_seq = 0


def _next_req_id():
    global _req_seq
    with _seq_lock:
        _req_seq += 1
        return "r%04d" % _req_seq


def _dump_trim():
    """dump 数量超过 DUMP_MAX_FILES 时按 mtime 删最旧（明文提示词会无限增长）。"""
    if DUMP_MAX_FILES <= 0:
        return
    try:
        entries = sorted((e for e in os.scandir(DUMP_DIR) if e.is_file()),
                         key=lambda e: e.stat().st_mtime)
    except OSError:
        return
    for stale in entries[:len(entries) - DUMP_MAX_FILES]:
        try:
            os.remove(stale.path)
        except OSError:
            pass


def _dump_save(rid, kind, data):
    """把请求/响应原文落盘到 dumps/<rid>.<kind>.txt（DUMP=0 时跳过）。"""
    if not DUMP_ON or not data:
        return
    try:
        os.makedirs(DUMP_DIR, exist_ok=True)
        text = data if isinstance(data, str) else data.decode("utf-8", "replace")
        truncated = len(text) > DUMP_MAX_BYTES
        path = os.path.join(DUMP_DIR, "%s.%s.txt%s" % (rid, kind, ".truncated" if truncated else ""))
        with open(path, "w", encoding="utf-8") as f:
            f.write(text[:DUMP_MAX_BYTES])
        _dump_trim()
    except OSError as e:
        logger.warning("[%s] 落盘失败: %s", rid, e)


@app.before_request
def _log_request():
    """rid/t0 在最早的 before_request 赋值（401 短路也要有 done 行可关联）。"""
    g.rid = _next_req_id()
    g.t0 = time.time()
    if request.path in ("/", "/admin", "/favicon.ico"):
        return
    body = request.get_data(as_text=True)
    summary = ""
    try:
        j = json.loads(body)
        summary = "model=%s msgs=%d tools=%d stream=%s" % (
            j.get("model"), len(j.get("messages") or []),
            len(j.get("tools") or []), j.get("stream"))
    except Exception:
        pass
    # UA 是日志里唯一的客户端归因维度（API key 全客户端共用、ip 恒为 127.0.0.1）；
    # 折掉换行防伪造多行日志
    ua = (request.headers.get("User-Agent") or "-").replace("\r", " ").replace("\n", " ")
    logger.info("[%s] in: %s %s | %s | ua=%s | body=%dB",
                g.rid, request.method, request.path, summary or "n/a", ua, len(body))
    _dump_save(g.rid, "req", body)
    return None


@app.after_request
def _log_response(response):
    """非流式记 done 并落盘 dumps/<rid>.resp.txt；流式响应不能在这里读取（会整块缓冲），
    完成行与落盘由 _stream_log 在流末发出。"""
    if request.path in ("/", "/admin", "/favicon.ico"):
        return response
    if response.is_streamed:
        return response
    try:
        resp_body = response.get_data(as_text=True)
    except Exception:
        return response
    logger.info("[%s] done: status=%d %dB %.1fs",
                getattr(g, "rid", "?"), response.status_code,
                len(resp_body), time.time() - getattr(g, "t0", time.time()))
    _dump_save(getattr(g, "rid", "?"), "resp", resp_body)
    return response


def _stream_log(gen, rid, t0):
    """包裹 SSE 生成器：TTFT、字节数、原文落盘 dumps/<rid>.resp.txt、done/断开/中断日志。
    rid/t0 必须在请求上下文中取出后传入（生成器被消费时 g 已销毁）。"""
    total = 0
    ttft = None
    buf = [] if DUMP_ON else None
    try:
        for piece in gen:
            if ttft is None:
                ttft = time.time() - t0
            total += len(piece)
            if buf is not None:
                buf.append(piece)
            yield piece
        if buf is not None:
            _dump_save(rid, "resp", b"".join(buf))
        logger.info("[%s] done: stream %dB %.1fs ttft=%s",
                    rid, total, time.time() - t0,
                    ("%.1fs" % ttft) if ttft is not None else "-")
    except GeneratorExit:
        logger.warning("[%s] client 断开: stream %dB %.1fs", rid, total, time.time() - t0)
        raise
    except Exception as e:
        logger.error("[%s] stream 中断: %s (%dB %.1fs)", rid, e, total, time.time() - t0)
        raise


def _signed_request(method: str, url: str, body: bytes = b"", extra_headers=None, timeout=30):
    """发送带华为云 SDK-HMAC-SHA256 签名的请求。"""
    creds = _current_creds()
    parsed = urllib.parse.urlparse(url)
    path = parsed.path or "/"
    canonical_uri = path if path.endswith("/") else path + "/"
    params = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)
    params.sort(key=lambda item: (item[0], item[1]))
    quote = lambda value: urllib.parse.quote(str(value), safe="-_.~")
    canonical_query = "&".join(
        f"{quote(key)}={quote(value)}" for key, value in params
    )

    headers = {}
    for key, value in (extra_headers or {}).items():
        headers[key.lower()] = str(value)
    headers["host"] = parsed.netloc
    headers.setdefault("content-type", "application/json")
    sdk_date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    headers["x-sdk-date"] = sdk_date
    if creds.get("token"):
        headers["x-security-token"] = creds["token"]

    signed_names = sorted(headers)
    canonical_headers = "".join(
        f"{name}:{headers[name].strip()}\n" for name in signed_names
    )
    signed_headers = ";".join(signed_names)
    payload_hash = hashlib.sha256(body).hexdigest()
    canonical_request = (
        f"{method.upper()}\n{canonical_uri}\n{canonical_query}\n"
        f"{canonical_headers}\n{signed_headers}\n{payload_hash}"
    )
    string_to_sign = (
        f"SDK-HMAC-SHA256\n{sdk_date}\n"
        f"{hashlib.sha256(canonical_request.encode()).hexdigest()}"
    )
    signature = hmac.new(
        creds["sk"].encode(), string_to_sign.encode(), hashlib.sha256
    ).hexdigest()
    headers["authorization"] = (
        f"SDK-HMAC-SHA256 Access={creds['ak']}, SignedHeaders={signed_headers}, "
        f"Signature={signature}"
    )
    return _upstream.request(
        method.upper(), url, data=body or None, headers=headers, timeout=timeout
    )


def _hmac_headers(body: bytes, benefit: bool = False, model_id: str = "") -> dict:
    """构造华为云 SDK-HMAC-SHA256 签名请求头（仅适用于 POST /api/v2/chat/completions）。

    benefit=True 时按 IDE 免费模型通道附加 maas_type / model-id / model-name 三个头，
    这三个头必须参与签名，否则上游返回 "The model is not registered"。
    """
    creds = _current_creds()
    now = datetime.datetime.now(datetime.timezone.utc)
    sdk_date = now.strftime("%Y%m%dT%H%M%SZ")

    # 注意：华为云签名规范要求消息头名称一律转小写再参与签名
    headers = {
        "host": HOST,
        "content-type": "application/json",
        "x-sdk-date": sdk_date,
    }
    if creds.get("token"):
        headers["x-security-token"] = creds["token"]
    if benefit and model_id:
        headers["maas_type"] = "benefit"
        headers["model-id"] = model_id
        headers["model-name"] = model_id

    signed_names = sorted(headers.keys())
    canonical_headers = "".join(f"{k}:{headers[k].strip()}\n" for k in signed_names)
    signed_headers = ";".join(signed_names)

    # CanonicalRequest: POST + URI(带尾斜杠) + 空查询串 + 规范头 + 签名头 + body哈希
    canonical_uri = "/api/v2/chat/completions/"
    payload_hash = hashlib.sha256(body).hexdigest()
    canonical_request = (
        f"POST\n{canonical_uri}\n\n"
        f"{canonical_headers}\n{signed_headers}\n{payload_hash}"
    )

    # StringToSign: 算法 + 时间戳 + CanonicalRequest哈希
    hashed_canonical = hashlib.sha256(canonical_request.encode()).hexdigest()
    string_to_sign = f"SDK-HMAC-SHA256\n{sdk_date}\n{hashed_canonical}"

    signature = hmac.new(creds["sk"].encode(), string_to_sign.encode(), hashlib.sha256).hexdigest()

    headers["Authorization"] = (
        f"SDK-HMAC-SHA256 Access={creds['ak']}, "
        f"SignedHeaders={signed_headers}, Signature={signature}"
    )
    return headers


def _load_model_cache() -> bool:
    """加载本地模型缓存，返回是否成功。"""
    global SUPPORTED_MODELS, MODEL_DETAILS
    try:
        with open(MODEL_CACHE_PATH, "r", encoding="utf-8") as file:
            cached = json.load(file)
        models = cached.get("models", [])
        if not models:
            return False
        SUPPORTED_MODELS = [item["id"] for item in models if item.get("id")]
        MODEL_DETAILS = {item["id"]: item for item in models if item.get("id")}
        # 缓存里的 AgentCenter 模型参与通道判断；旧缓存无 channel 字段时默认
        # 视为 agent 通道；不在缓存里的新模型一律按 benefit 处理。
        AGENT_MODELS.clear()
        AGENT_MODELS.extend(
            item["id"]
            for item in models
            if item.get("channel", "agent") == "agent"
        )
        return bool(SUPPORTED_MODELS)
    except (OSError, ValueError, TypeError, KeyError):
        return False


def _save_model_cache(models) -> None:
    os.makedirs(os.path.dirname(MODEL_CACHE_PATH), exist_ok=True)
    payload = {
        "updated_at": int(time.time()),
        "models": models,
    }
    temp_path = MODEL_CACHE_PATH + ".tmp"
    with open(temp_path, "w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)
    os.replace(temp_path, MODEL_CACHE_PATH)


def _refresh_benefit_models() -> list:
    """从 opengw 免费额度网关动态获取免费模型列表（IDE 抓包确认的接口）。

    返回模型详情列表；失败时返回空列表，由调用方回退到 BENEFIT_MODELS 兜底。
    """
    # 先领取限时福利（幂等）：未领取时福利模型调用必报 InferHub.4004.200 benefit not found。
    # 领取失败只记日志，不阻断模型列表同步。
    if BENEFIT_AUTO_CLAIM:
        try:
            benefit.claim()
        except Exception as error:
            logger.warning("限时福利自动领取失败（不影响模型列表同步）: %s", error)
    try:
        response = _signed_request("GET", OPENGW_CONFIG_URL, timeout=30)
        response.raise_for_status()
        result = response.json().get("result") or {}
        models = result.get("models") or []
        discovered = []
        for model in models:
            model_id = model.get("model_id")
            if not model_id or any(item["id"] == model_id for item in discovered):
                continue
            discovered.append(
                {
                    "id": model_id,
                    "object": "model",
                    "owned_by": "codearts",
                    "channel": "benefit",
                    "name": model.get("model_name") or model_id,
                    "description": "免费额度模型（签到领取）",
                    "context_window": model.get("context_window"),
                    "max_tokens": model.get("max_tokens"),
                    "supports_images": False,
                }
            )
        return discovered
    except (requests.RequestException, ValueError, TypeError, KeyError) as error:
        logger.warning("免费模型列表同步失败，将使用兜底列表: %s", error)
        return []


def _refresh_models() -> bool:
    """从 CodeArts AgentCenter 获取当前账号可用模型（仅老套餐通道）。"""
    global SUPPORTED_MODELS, MODEL_DETAILS
    try:
        # 与 CodeArts CLI 抓包一致：AgentCenter 接口需要这个路由头。
        response = _signed_request(
            "GET",
            AGENT_LIST_URL,
            extra_headers={
                "agent-type": "AgentCenter",
                "x-language": "zh-cn",
                "accept": "application/json",
            },
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        agents = data.get("agents", [])
        if not agents:
            return False

        # 优先主 Agent；若某个详情无模型，再尝试其他主 Agent。
        candidates = sorted(
            agents,
            key=lambda item: (
                not bool(item.get("is_primary_agent")),
                item.get("agent_order") is None,
                item.get("agent_order") or 999999,
            ),
        )
        discovered = []
        for agent in candidates:
            agent_id = agent.get("agent_id")
            if not agent_id:
                continue
            detail_url = (
                f"{BASE_URL}{AGENT_DETAIL_PATH}?agent_id="
                f"{urllib.parse.quote(str(agent_id), safe='')}"
            )
            detail_response = _signed_request(
                "GET",
                detail_url,
                extra_headers={
                    "agent-type": "AgentCenter",
                    "x-language": "zh-cn",
                    "accept": "application/json",
                },
                timeout=30,
            )
            if detail_response.status_code != 200:
                continue
            detail = detail_response.json()
            for model in (detail.get("gpts", {}).get("models", []) or []):
                model_id = model.get("model_id") or model.get("model_alias")
                if not model_id or any(item["id"] == model_id for item in discovered):
                    continue
                params = model.get("model_parameters") or {}
                discovered.append(
                    {
                        "id": model_id,
                        "object": "model",
                        "owned_by": "codearts",
                        "channel": "agent",
                        "name": model.get("model_alias") or model.get("model_name") or model_id,
                        "description": model.get("model_desc") or "",
                        "context_window": params.get("context_window"),
                        "max_tokens": params.get("max_tokens"),
                        "supports_images": params.get("supports_images", False),
                        "enable_queue": params.get("enable_queue", False),
                    }
                )
            if discovered:
                # 主 Agent 已拿到完整模型列表，避免不必要请求。
                break

        if not discovered:
            return False
        # benefit 免费模型不在 AgentCenter 列表里，从 opengw 网关动态同步；
        # 同步失败时回退到 BENEFIT_MODELS 兜底，保证 /v1/models 可见。
        benefit_models = _refresh_benefit_models()
        if not benefit_models:
            benefit_models = [
                {"id": model_id, "channel": "benefit", "object": "model",
                 "owned_by": "codearts", "name": model_id}
                for model_id in BENEFIT_MODELS
            ]
        known = {item["id"] for item in discovered}
        for item in benefit_models:
            if item["id"] not in known:
                discovered.append(item)
        SUPPORTED_MODELS = [item["id"] for item in discovered]
        MODEL_DETAILS = {item["id"]: item for item in discovered}
        AGENT_MODELS.clear()
        AGENT_MODELS.extend(
            item["id"] for item in discovered if item.get("channel") == "agent"
        )
        _save_model_cache(discovered)
        logger.info("已自动同步模型: %s", ", ".join(SUPPORTED_MODELS))
        return True
    except (requests.RequestException, ValueError, TypeError, KeyError, OSError) as error:
        logger.warning("自动同步模型失败，将使用缓存或兜底列表: %s", error)
        return False


_refresh_trigger_lock = threading.Lock()
_refresh_in_progress = False


def _refresh_models_if_needed() -> None:
    """模型列表短时缓存，避免 Cherry Studio 频繁轮询时重复请求。

    缓存过期时不再阻塞当前聊天请求：完全没有可用模型（首启动无缓存）才同步
    刷新；否则触发后台刷新，当前请求沿用旧列表，避免上游变慢拖住对话。
    """
    global _refresh_in_progress
    # 进程刚启动时先把缓存详情装载到内存；不能只依赖兜底模型名。
    if not MODEL_DETAILS:
        _load_model_cache()
    try:
        age = time.time() - os.path.getmtime(MODEL_CACHE_PATH)
    except OSError:
        age = float("inf")
    if age <= 300:
        return
    if not SUPPORTED_MODELS:
        if not _refresh_models():
            _load_model_cache()
        return
    with _refresh_trigger_lock:
        if _refresh_in_progress:
            return
        _refresh_in_progress = True

    def _background_refresh():
        global _refresh_in_progress
        try:
            _refresh_models()
        finally:
            _refresh_in_progress = False

    threading.Thread(target=_background_refresh, daemon=True, name="model-refresh").start()


def _normalize_finish_reason(value):
    """把 CodeArts 的结束原因转换为 OpenAI 客户端能识别的值。"""
    if value in (None, "other"):
        return "stop"
    return value


def _parse_sse_bytes(raw: bytes):
    """把上游 SSE 聚合为一个 OpenAI chat.completion JSON。"""
    text_parts = []
    reasoning_parts = []
    tool_calls = {}
    result = {
        "id": None,
        "object": "chat.completion",
        "created": None,
        "model": None,
        "choices": [{
            "index": 0,
            "message": {"role": "assistant", "content": ""},
            "finish_reason": "stop",
        }],
    }
    usage = None
    last_finish_reason = None

    for line in raw.splitlines():
        line = line.strip()
        if not line or not line.startswith(b"data:"):
            continue
        payload = line[5:].lstrip()
        if payload == b"[DONE]":
            continue
        try:
            chunk = json.loads(payload.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            continue

        # CodeArts 可能以 HTTP 200 返回业务错误，需要保留错误信息。
        if chunk.get("error_code") or chunk.get("error_msg"):
            return {
                "error": {
                    "message": chunk.get("error_msg") or "CodeArts upstream error",
                    "type": "upstream_error",
                    "code": chunk.get("error_code"),
                }
            }

        for key in ("id", "created", "model"):
            if chunk.get(key) is not None:
                result[key] = chunk[key]
        if chunk.get("usage"):
            usage = chunk["usage"]

        for choice in chunk.get("choices") or []:
            reason = choice.get("finish_reason")
            if reason is not None:
                last_finish_reason = _normalize_finish_reason(reason)
            delta = choice.get("delta") or {}
            if isinstance(delta.get("content"), str):
                text_parts.append(delta["content"])
            if isinstance(delta.get("reasoning_content"), str):
                reasoning_parts.append(delta["reasoning_content"])
            for call in delta.get("tool_calls") or []:
                index = call.get("index", 0)
                current = tool_calls.setdefault(index, {
                    "id": call.get("id"),
                    "type": call.get("type", "function"),
                    "function": {"name": "", "arguments": ""},
                })
                if call.get("id"):
                    current["id"] = call["id"]
                if call.get("type"):
                    current["type"] = call["type"]
                function = call.get("function") or {}
                if function.get("name"):
                    current["function"]["name"] += function["name"]
                if function.get("arguments"):
                    current["function"]["arguments"] += function["arguments"]

    message = result["choices"][0]["message"]
    message["content"] = "".join(text_parts)
    if reasoning_parts:
        message["reasoning_content"] = "".join(reasoning_parts)
    if tool_calls:
        message["tool_calls"] = [tool_calls[index] for index in sorted(tool_calls)]
    result["choices"][0]["finish_reason"] = last_finish_reason or ("tool_calls" if tool_calls else "stop")
    if usage:
        result["usage"] = usage
    return result


def _parse_upstream_json(upstream):
    """兼容上游普通 JSON 和错误地返回 SSE 的情况。"""
    raw = upstream.content
    try:
        result = json.loads(raw.decode("utf-8"))
        if isinstance(result, dict) and result.get("choices"):
            for choice in result["choices"]:
                choice["finish_reason"] = _normalize_finish_reason(choice.get("finish_reason"))
        return result
    except (UnicodeDecodeError, json.JSONDecodeError):
        return _parse_sse_bytes(raw)


def _cors(resp: Response) -> Response:
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return resp


@app.before_request
def check_api_key():
    if not API_KEY or request.method == "OPTIONS":
        return
    if request.path in ("/", "/admin", "/favicon.ico"):
        return
    auth = request.headers.get("Authorization", "")
    token = auth[7:].strip() if auth.startswith("Bearer ") else ""
    if token != API_KEY:
        return _cors(jsonify({"error": {"message": "Invalid API key", "type": "invalid_request_error"}})), 401


@app.after_request
def after_request(resp: Response) -> Response:
    return _cors(resp)


def _model_payload(model_id: str) -> dict:
    """生成 OpenAI 模型对象，并附带常见能力元数据。"""
    detail = MODEL_DETAILS.get(model_id, {})
    context_window = detail.get("context_window")
    max_tokens = detail.get("max_tokens")
    supports_images = bool(detail.get("supports_images", False))
    payload = {
        "id": model_id,
        "object": "model",
        "created": 0,
        "owned_by": "codearts",
        "name": detail.get("name") or model_id,
        "description": detail.get("description") or "",
        # 常见 OpenAI 兼容客户端会读取其中一部分；未知字段会被安全忽略。
        "context_window": context_window,
        "context_length": context_window,
        "max_tokens": max_tokens,
        "max_output_tokens": max_tokens,
        "supports_images": supports_images,
        "vision": supports_images,
        "supports_vision": supports_images,
        "supports_function_calling": True,
        "supports_tool_calling": True,
        "supports_reasoning": True,
        "input_modalities": ["text", "image"] if supports_images else ["text"],
        "output_modalities": ["text"],
        "supported_parameters": [
            "temperature",
            "top_p",
            "max_tokens",
            "stream",
            "tools",
            "tool_choice",
            "response_format",
        ],
    }
    return {key: value for key, value in payload.items() if value is not None}


@app.route("/v1/models", methods=["GET", "OPTIONS"])
def list_models():
    if request.method == "OPTIONS":
        return _cors(Response(""))
    _refresh_models_if_needed()
    return jsonify({
        "object": "list",
        "data": [_model_payload(model_id) for model_id in SUPPORTED_MODELS],
    })


@app.route("/v1/models/<path:model_id>", methods=["GET", "OPTIONS"])
def get_model(model_id):
    """提供标准 OpenAI 单模型详情接口，方便客户端二次读取能力。"""
    if request.method == "OPTIONS":
        return _cors(Response(""))
    _refresh_models_if_needed()
    if model_id not in SUPPORTED_MODELS:
        return _cors(jsonify({
            "error": {
                "message": f"model '{model_id}' not found",
                "type": "invalid_request_error",
                "code": "model_not_found",
            }
        })), 404
    return jsonify(_model_payload(model_id))


@app.route("/v1/chat/completions", methods=["POST", "OPTIONS"])
def chat_completions():
    if request.method == "OPTIONS":
        return _cors(Response(""))

    body = request.get_data()
    if not body:
        return _cors(jsonify({"error": {"message": "empty body"}})), 400
    try:
        req_json = json.loads(body)
    except Exception:
        return _cors(jsonify({"error": {"message": "invalid JSON body"}})), 400

    # 模型名归一化；请求聊天时也按短缓存周期同步一次模型列表
    _refresh_models_if_needed()
    model = req_json.get("model", SUPPORTED_MODELS[0])
    if model not in SUPPORTED_MODELS:
        return (
            _cors(
                jsonify(
                    {
                        "error": {
                            "message": f"model '{model}' 不在当前账号可用模型列表中",
                            "type": "invalid_request_error",
                            "param": "model",
                            "code": "model_not_found",
                        }
                    }
                )
            ),
            404,
        )
    req_json["model"] = model

    # 通道判断：AgentCenter 老套餐模型用基础签名；其余（免费 benefit 模型）
    # 必须带 maas_type/model-id/model-name 三个签名头，否则上游报未注册。
    benefit = model not in AGENT_MODELS

    # 客户端是否要流式
    want_stream = bool(req_json.get("stream", False))

    # 重新序列化 body（确保与签名时一致）
    body = json.dumps(req_json, ensure_ascii=False).encode("utf-8")
    headers = _hmac_headers(body, benefit=benefit, model_id=model)

    attempt = 0
    while True:
        try:
            upstream = _upstream.post(
                TARGET, data=body, headers=headers, stream=True, timeout=(10, 600)
            )
        except Exception as e:
            logger.error("[%s] 上游请求异常: %s", g.rid, e)
            return _cors(jsonify({"error": {"message": f"upstream error: {e}"}})), 502

        if upstream.status_code == 200:
            break

        # 响应尚未开始，此处重试对客户端完全透明（流式同样适用）
        detail = ""
        error_code = ""
        error_msg = ""
        try:
            detail = upstream.text[:2000]
            err = upstream.json()
            error_code = str(err.get("error_code") or "")
            error_msg = str(err.get("error_msg") or "")
        except Exception:
            pass

        # 积分耗尽：重试无意义，透传上游语义（402 避免客户端自动重试循环）
        if error_code in UPSTREAM_CREDIT_CODES:
            logger.warning("[%s] [402] 上游积分耗尽: %s %s", g.rid, error_code, error_msg)
            return _cors(jsonify({"error": {
                "message": error_msg or "upstream credits exhausted",
                "type": "insufficient_quota",
                "code": error_code,
            }})), 402

        # 并发限流：退避重试
        if error_code in UPSTREAM_RETRY_CODES and attempt < UPSTREAM_RETRY_MAX:
            attempt += 1
            delay = UPSTREAM_RETRY_BACKOFF * attempt
            logger.warning("[%s] [重试] 上游 %s，%.0fs 后第 %d/%d 次重试",
                           g.rid, error_code, delay, attempt, UPSTREAM_RETRY_MAX)
            time.sleep(delay)
            continue

        logger.error("[%s] [502] 上游返回非 200: status=%d body=%.500s",
                     g.rid, upstream.status_code, detail)
        return (
            _cors(
                jsonify(
                    {
                        "error": {
                            "message": f"upstream {upstream.status_code}: {detail}"
                        }
                    }
                )
            ),
            502,
        )

    if want_stream:
        def generate():
            """严格转发为 OpenAI SSE；仅对 benefit 流补齐缺失的结束原因。"""
            content_type = (upstream.headers.get("Content-Type") or "").lower()
            is_benefit = model not in AGENT_MODELS
            saw_done = False
            saw_finish_reason = False

            # 上游偶尔会在请求 stream=true 时返回普通 JSON，包装成单个 SSE 帧。
            if "text/event-stream" not in content_type:
                result = _parse_upstream_json(upstream)
                for choice in result.get("choices") or []:
                    if choice.get("finish_reason") in (None, "other"):
                        choice["finish_reason"] = "stop"
                payload = json.dumps(result, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
                yield b"data: " + payload + b"\n\n"
                yield b"data: [DONE]\n\n"
                return

            for raw_line in upstream.iter_lines(decode_unicode=False):
                if not raw_line:
                    continue
                if not raw_line.startswith(b"data:"):
                    if raw_line.startswith(b":"):
                        yield raw_line + b"\n\n"
                    continue

                payload = raw_line[5:].strip()
                if payload == b"[DONE]":
                    # benefit 流需要先确认是否缺少 finish_reason；agent 流则保持
                    # 原来的即时转发行为，避免改变 agent 客户端状态机。
                    if not is_benefit:
                        if not saw_done:
                            yield b"data: [DONE]\n\n"
                            saw_done = True
                    else:
                        saw_done = True
                    continue
                try:
                    chunk = json.loads(payload.decode("utf-8"))
                    # 上游错误帧（如 InferHub.001001005.400 param invalid）：
                    # 原样透传会被 Agent Runtime 当成空响应 → "no content and no
                    # tool calls" 无限重试。转成 OpenAI error 帧并终止流，让
                    # 客户端直接看到真实原因。
                    if chunk.get("error_code") or chunk.get("error_msg"):
                        err_text = "%s %s" % (chunk.get("error_code") or "",
                                              chunk.get("error_msg") or "upstream error")
                        logger.error("[%s] 流中上游错误帧: %s", g.rid, err_text)
                        yield b"data: " + json.dumps(
                            {"error": {"message": err_text.strip(),
                                       "type": "upstream_error",
                                       "code": chunk.get("error_code")}},
                            ensure_ascii=False, separators=(",", ":")
                        ).encode("utf-8") + b"\n\n"
                        yield b"data: [DONE]\n\n"
                        saw_done = True
                        return
                    for choice in chunk.get("choices") or []:
                        reason = choice.get("finish_reason")
                        if reason is not None:
                            saw_finish_reason = True
                            if reason == "other":
                                choice["finish_reason"] = "stop"
                        # DeepSeek benefit 流会发送 content:null、reasoning_content 有值。
                        # 部分 Agent Runtime 只接受字符串 content，会将 null chunk
                        # 误判为无响应；OpenAI 兼容格式中空字符串表达同样语义。
                        delta = choice.get("delta")
                        if isinstance(delta, dict) and delta.get("content") is None:
                            delta["content"] = ""
                    payload = json.dumps(chunk, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
                    yield b"data: " + payload + b"\n\n"
                except (UnicodeDecodeError, json.JSONDecodeError):
                    continue

            # 只对免费 benefit 模型补齐完全缺失的 finish_reason；不重发任何上游 chunk。
            if is_benefit and not saw_finish_reason:
                yield b"data: " + json.dumps(
                    {
                        "id": "proxy-finish",
                        "object": "chat.completion.chunk",
                        "created": int(time.time()),
                        "model": model,
                        "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
                    }, ensure_ascii=False, separators=(",", ":")
                ).encode("utf-8") + b"\n\n"
            if is_benefit and not saw_done:
                yield b"data: [DONE]\n\n"
            elif is_benefit:
                # 上游 [DONE] 被延迟到这里，确保补块在 [DONE] 之前。
                yield b"data: [DONE]\n\n"
            # agent 分支保持原有行为：如果上游异常断流、没有发送 [DONE]，
            # 代理仍补一个 [DONE]，与修改前的实现一致。
            if not is_benefit and not saw_done:
                yield b"data: [DONE]\n\n"

        resp = Response(_stream_log(generate(), g.rid, g.t0), status=200,
                        mimetype="text/event-stream")
        resp.headers["Cache-Control"] = "no-cache, no-transform"
        resp.headers["Content-Type"] = "text/event-stream; charset=utf-8"
        resp.headers["X-Accel-Buffering"] = "no"
        return _cors(resp)

    # 非流式：无论上游返回 JSON 还是 SSE，都统一聚合成单个 JSON。
    # CodeArts 在排队、重试或特定模型场景下可能即使请求 stream=false
    # 仍返回 text/event-stream；直接转发会导致客户端把 data: 当作 JSON 解析。
    result = _parse_upstream_json(upstream)
    if isinstance(result, dict) and result.get("error"):
        logger.error("[%s] [502] 上游业务错误: %s", g.rid, result.get("error"))
        resp = Response(
            json.dumps(result, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
            status=502,
            content_type="application/json; charset=utf-8",
        )
        return _cors(resp)
    output = json.dumps(result, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    resp = Response(output, status=200, content_type="application/json; charset=utf-8")
    return _cors(resp)


# ── 积分余额（snap-access 网关，agent 通道模型消耗）──────────────────────
_credit_cache = {"at": 0.0, "data": None}


def _credit_balance_cached(max_age: int = 60) -> dict:
    """积分余额短缓存；面板刷新不必每次打上游。"""
    now = time.time()
    if _credit_cache["data"] is None or now - _credit_cache["at"] > max_age:
        try:
            _credit_cache["data"] = benefit.credit_balance()
        except Exception as error:
            logger.warning("积分余额查询失败: %s", error)
            if _credit_cache["data"] is None:
                _credit_cache["data"] = {}
        _credit_cache["at"] = now
    return _credit_cache["data"]


# ── 管理面板 ──────────────────────────────────────────────────────────
PANEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "panel.html")


@app.route("/", methods=["GET"])
@app.route("/admin", methods=["GET"])
def serve_panel():
    with open(PANEL_PATH, "r", encoding="utf-8") as f:
        html = f.read()
    # 将 key 注入面板页，前端 fetch 自动携带；面板仅监听本机，注入面不扩大暴露面
    if API_KEY:
        html = html.replace(
            "</head>",
            f"<script>window.__API_KEY__ = {json.dumps(API_KEY)};</script>\n</head>",
            1,
        )
    return Response(html, content_type="text/html; charset=utf-8")


@app.route("/admin/api/overview", methods=["GET", "OPTIONS"])
def admin_overview():
    if request.method == "OPTIONS":
        return _cors(Response(""))
    creds = _current_creds()
    notice = credential_provider.token_notice(creds)
    expires_at = creds.get("expires_at") or ""
    remain_text = "—"
    valid = bool(creds.get("token"))
    if expires_at and valid:
        try:
            exp = datetime.datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
            remain = (exp - datetime.datetime.now(datetime.timezone.utc)).total_seconds()
            if remain > 0:
                hours = int(remain // 3600)
                mins = int((remain % 3600) // 60)
                remain_text = f"{hours} 小时 {mins} 分钟"
            else:
                remain_text = "已过期"
                valid = False
        except ValueError:
            pass
    cred_info = {
        "source": "auths 文件" if creds.get("_auth_file") else ("CodeArts IDE 会话" if valid else "未找到"),
        "ak": creds.get("ak", ""),
        "expires_at": expires_at,
        "valid": valid,
        "remain_text": remain_text,
        "notice": notice or "正常",
    }
    _refresh_models_if_needed()
    models = []
    for mid in SUPPORTED_MODELS:
        detail = MODEL_DETAILS.get(mid, {})
        models.append({"id": mid, "channel": detail.get("channel", "agent"), "name": detail.get("name", mid)})
    benefit_info = {}
    try:
        status = benefit.claim_status()
        # create_time 为毫秒时间戳，直接透传（前端 new Date 按毫秒解析）
        benefit_info["last_checkin"] = status.get("create_time") or None
    except Exception:
        benefit_info["last_checkin"] = None
    try:
        bal = benefit.balance()
        benefit_info.update(bal)
    except Exception:
        pass
    # 积分通道（snap-access 网关）与福利额度同属 benefit，一并返回
    credits = _credit_balance_cached()
    if credits:
        benefit_info["credit_total"] = credits.get("total")
        benefit_info["credit_used"] = credits.get("used")
        benefit_info["credit_remain"] = credits.get("remain")
    return jsonify({
        "service": "CodeArts2api",
        "credential": cred_info,
        "models": models,
        "benefit": benefit_info,
        "schedule": {"auto_checkin": BENEFIT_AUTO_CLAIM},
    })


@app.route("/admin/api/checkin", methods=["POST", "OPTIONS"])
def admin_checkin():
    if request.method == "OPTIONS":
        return _cors(Response(""))
    try:
        benefit.claim()
        messages = []
        bal = benefit.balance()
        remain = bal.get("total_balance") or 0
        total = bal.get("total_quota") or 0
        messages.append(f"Token {remain:,}/{total:,}")
        try:
            credit_status = benefit.do_credit_claim()
            _credit_cache["at"] = 0.0
            credits = benefit.credit_balance()
            if credits:
                messages.append(f"积分 {credits.get('remain'):,}/{credits.get('total'):,}（{credit_status}）")
        except Exception as credit_error:
            logger.warning("积分领取失败（不影响 Token 签到）: %s", credit_error)
        return jsonify({"ok": True, "message": "签到成功：" + "，".join(messages)})
    except Exception as e:
        return jsonify({"ok": False, "message": f"签到失败: {e}"}), 500


@app.route("/admin/api/reload-models", methods=["POST", "OPTIONS"])
def admin_reload_models():
    if request.method == "OPTIONS":
        return _cors(Response(""))
    ok = _refresh_models()
    return jsonify({"ok": ok, "message": f"已同步 {len(SUPPORTED_MODELS)} 个模型" if ok else "同步失败，使用缓存"})


_last_checkin_date = None


def _benefit_checkin_loop():
    """后台每日自动签到领取限时福利（幂等），成功后打印余额。

    启动即签到一次，之后每小时检查是否跨入新的一天；跨了就再签。
    先查签到状态，当天已签则跳过；领取失败不标记日期，下一小时自动重试。
    """
    global _last_checkin_date
    while True:
        today = datetime.date.today()
        if _last_checkin_date != today:
            try:
                # 先查签到状态，当天已签则跳过
                try:
                    status = benefit.claim_status()
                    last_ms = status.get("create_time")
                    if last_ms and datetime.datetime.fromtimestamp(last_ms / 1000).date() == today:
                        _last_checkin_date = today
                        print(f"[签到] {today} 当天已签到，跳过")
                        time.sleep(3600)
                        continue
                except Exception:
                    pass  # 查不到状态就继续尝试领取
                before = time.time()
                claim_result = benefit.claim()
                _last_checkin_date = today
                info = benefit.balance()
                total = info.get("total_quota") or 0
                remain = info.get("total_balance") or 0
                claim_ms = (claim_result or {}).get("create_time")
                # 积分通道（每日 1000 积分，agent 模型消耗）与福利同一条日志汇报，幂等安全
                credit_text = ""
                try:
                    credit_status = benefit.do_credit_claim()
                    _credit_cache["at"] = 0.0
                    credits = benefit.credit_balance()
                    if credits:
                        credit_text = f"，积分 {credits.get('remain'):,}/{credits.get('total'):,}（{credit_status}）"
                except Exception as credit_error:
                    credit_text = f"，积分查询失败: {credit_error}"
                if claim_ms and claim_ms / 1000 < before - 10:
                    print(f"[签到] {today} 当天已签到，Token {remain:,}/{total:,}{credit_text}")
                else:
                    print(f"[签到] {today} 福利领取成功，Token {remain:,}/{total:,}{credit_text}")
            except Exception as error:
                print(f"[签到] {today} 限时福利领取失败: {error}")
        time.sleep(3600)


if __name__ == "__main__":
    # 启动时先同步一次真实模型列表（失败则回退到缓存/兜底列表），再打印。
    if not _refresh_models():
        _load_model_cache()
    creds = _current_creds()
    if creds.get("token"):
        source = "auths 文件" if creds.get("_auth_file") else "CodeArts IDE 会话"
        print(f"凭证来源: {source}", credential_provider.token_notice(creds))
    else:
        print("凭证来源: 未找到凭证，请运行 python oauth.py 登录或在 CodeArts IDE 中登录")
    print(f"CodeArts OpenAI 兼容代理已启动: http://{LISTEN_HOST}:{LISTEN_PORT}")
    print(f"OpenAI Base URL: http://{LISTEN_HOST}:{LISTEN_PORT}/v1")
    print("鉴权:", f"已启用 API_KEY（Bearer）" if API_KEY else "未设置 API_KEY（无鉴权）")
    print("可用模型:", SUPPORTED_MODELS)
    print("按 Ctrl+C 停止")
    if BENEFIT_AUTO_CLAIM:
        threading.Thread(target=_benefit_checkin_loop, daemon=True, name="benefit-checkin").start()
    app.run(host=LISTEN_HOST, port=LISTEN_PORT, threaded=True)
