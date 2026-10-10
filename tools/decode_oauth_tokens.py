#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""codearts oauth2 tokens 请求解析（从归档原始请求提取，避免转录误差）。
输入：re/capture/req_oauth2_tokens.txt（原始请求全文）
产物：re/capture/decoded/ 下逐文件落盘 + stdout 全量打印。"""
import base64, json, os, re, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
CAPTURE = os.path.normpath(os.path.join(HERE, '..', 're', 'capture', 'req_oauth2_tokens.txt'))
OUTDIR = os.path.normpath(os.path.join(HERE, '..', 're', 'capture', 'decoded'))

def b64url_decode(s):
    s = s.replace('-', '+').replace('_', '/')
    s += '=' * (-len(s) % 4)
    return base64.b64decode(s)

def decode_jwt(token, label, outdir, depth=0):
    pad = '  ' * depth
    print(f"\n{pad}{'='*66}\n{pad}## {label}\n{pad}{'='*66}")
    parts = token.split('.')
    if len(parts) < 2:
        print(f"{pad}  (非标准 JWT)"); return {}
    try:
        h = json.loads(b64url_decode(parts[0]))
    except Exception as e:
        h = {"_decode_error": str(e)}
    try:
        p = json.loads(b64url_decode(parts[1]))
    except Exception as e:
        p = {"_decode_error": str(e)}
    # 时间字段人类化
    extra = {}
    for k in ('exp', 'iat', 'nbf'):
        if isinstance(p.get(k), (int, float)):
            extra[k + '_utc'] = datetime.datetime.utcfromtimestamp(p[k]).isoformat() + 'Z'
    print(f"{pad}HEADER: {json.dumps(h, ensure_ascii=False)}")
    p = {**p, **extra} if isinstance(p, dict) else p
    print(f"{pad}PAYLOAD:\n{pad}" + json.dumps(p, indent=1, ensure_ascii=False))
    # 存盘
    safe = label.replace('/', '_')
    open(os.path.join(outdir, safe + '.json'), 'w', encoding='utf-8').write(
        json.dumps({'header': h, 'payload': p}, indent=1, ensure_ascii=False))
    if len(parts) == 3:
        sig = b64url_decode(parts[2])
        open(os.path.join(outdir, safe + '.sig.bin'), 'wb').write(sig)
        print(f"{pad}[sig] {len(sig)} bytes -> {safe}.sig.bin")
    # 展开内嵌 JWT
    if isinstance(p, dict):
        for k, v in p.items():
            if isinstance(v, str) and v.startswith('eyJ') and v.count('.') == 2:
                print(f"{pad}  [内嵌 JWT: {k}]")
                decode_jwt(v, f"{label}.{k}", outdir, depth + 1)
    return p

def main():
    os.makedirs(OUTDIR, exist_ok=True)
    raw = open(CAPTURE, encoding='utf-8').read().replace('\r\n', '\n')
    body = raw.split('\n\n', 1)[-1].strip()
    form = dict(re.findall(r'([\w.]+)=([^&]*)', body))
    for k, v in form.items():
        from urllib.parse import unquote
        print(f"FORM {k}: {unquote(v)[:80]}{'…' if len(unquote(v))>80 else ''} (len={len(unquote(v))})")

    dpop = re.search(r'^DPoP:\s*(\S+)', raw, re.M)
    if dpop:
        decode_jwt(dpop.group(1), 'dpop', OUTDIR)
    if 'refresh_token' in form:
        decode_jwt(form['refresh_token'], 'refresh_token', OUTDIR)
    print(f"\n完成，产物目录: {OUTDIR}")

if __name__ == '__main__':
    main()
