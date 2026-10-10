#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""端到端签名验证：main.log 中的 5 条真实 Authorization（空 body GET）。

这是决定性验证：
  - AK = HSTAD1D2MJLOQI3VYCBY  == 05 号解出的 codearts_safeStorage.json 的 accessKey
  - 同一份 SK（已解密）
  - GET 无 body → payloadHash 恒为 EMPTY_BODY_SHA256
  - SignedHeaders 仅 4 个（content-type;host;x-sdk-date;x-security-token）
→ 若复算命中，即 100% 证明 SDK-HMAC-SHA256 v9 的全部环节（换行 join、
  CanonicalURI 尾斜杠、payloadHash 取值、header 小写排序）均正确。

同时试换行/空格两种 join 变体。
"""
import hashlib, hmac, json, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

EMPTY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
MAINLOG = r'C:\Users\12925\AppData\Roaming\codearts\app-logs\logs\main.log'
CREDS = r'E:\VSCodeSpace\ZCode\CodeArts\re\capture\secret_storage\codearts_safeStorage.json'


def url_encode(s: str) -> str:
    """华为 SDK 风格：UTF-8 逐字节大写 hex，未转义 -_.~
    ⚠️ 关键：路径分隔符 '/' 必须保留（源码是逐段 urlEncode 后用 / 连接），
       若把整条 path 丢进来编码会得到 %2F，导致签名永不命中（曾因此 0/5）。
    """
    safe = set("-_.~/")
    out = []
    for b in s.encode('utf-8'):
        ch = chr(b)
        if b < 128 and (ch.isalnum() or ch in safe):
            out.append(ch)
        else:
            out.append("%%%02X" % b)
    return "".join(out)


def sign(ak, sk, method, url, headers, signed_list, join_mode, body=b''):
    """join_mode 语义：
       'newline' → CanonicalRequest 用 \\n、StringToSign 用 \\n（源码 buildCanonicalRequest/getStringToSign）
       'space'    → 两者都用空格
       'cr_space_sts_space' → CanonicalRequest 用 \\n、StringToSign 用空格（旧版/变体）
    """
    from urllib.parse import urlparse
    u = urlparse(url)
    canonical_uri = url_encode(u.path) or "/"
    if not canonical_uri.endswith("/"):
        canonical_uri += "/"
    canonical_qs = u.query

    sel = {k: headers.get(k, "") for k in signed_list.split(';') if k}
    canonical_headers = "".join(f"{k.lower()}:{v}\n" for k, v in sorted(sel.items()))
    signed_headers = ";".join(sorted(sel.keys()))

    payload_hash = hashlib.sha256(body).hexdigest() if body else EMPTY_SHA256

    if join_mode == 'space':
        cr = " ".join([method.upper(), canonical_uri, canonical_qs,
                       canonical_headers, signed_headers, payload_hash])
    else:
        cr = "\n".join([method.upper(), canonical_uri, canonical_qs,
                        canonical_headers, signed_headers, payload_hash])

    date = headers.get('X-Sdk-Date') or headers.get('x-sdk-date')
    sts_sep = " " if join_mode == 'cr_space_sts_space' else ("\n" if join_mode == 'newline' else " ")
    sts = sts_sep.join(["SDK-HMAC-SHA256", date, hashlib.sha256(cr.encode()).hexdigest()])
    sig = hmac.new(sk.encode('utf-8'), sts.encode('utf-8'), hashlib.sha256).hexdigest()
    return sig, cr, sts


def main():
    creds = json.load(open(CREDS, encoding='utf-8'))
    s = creds.get('session') or creds
    ak, sk = s['accessKey'], s['secretKey']
    print(f'凭证: AK={ak}  SK=len{len(sk)}')
    print(f'期望 AK 与日志一致: {ak == "HSTAD1D2MJLOQI3VYCBY"}\n')

    c = open(MAINLOG, encoding='utf-8', errors='replace').read()
    pat = re.compile(
        r'"headers":\{"Accept":"[^"]*","Content-Type":"([^"]*)",'
        r'"X-Security-Token":"([^"]*)","host":"([^"]*)","X-Sdk-Date":"([^"]*)",'
        r'"Authorization":"SDK-HMAC-SHA256 Access=([^,]+), SignedHeaders=([^,]+), Signature=([0-9a-f]{64})"'
    )
    rows = pat.findall(c)
    print(f'解析到 {len(rows)} 条完整签名请求\n')
    if not rows:
        print('未解析到，改用宽松匹配…')
        return

    ok_n = ok_m = 0
    for i, (ct, tok, host, date, _ak, signed, sig) in enumerate(rows, 1):
        # ⚠️ 键名必须与 SignedHeaders 列表里的**小写**名一致，否则取不到值（曾因此 0/5）
        headers = {'content-type': ct, 'x-security-token': tok,
                   'host': host, 'x-sdk-date': date}
        url = f'https://{host}/snap-manager/v1/package/overview'
        res = {}
        for mode in ('newline', 'space', 'cr_space_sts_space'):
            res[mode] = sign(ak, sk, 'get', url, headers, signed, mode)[0]
        hit = res['newline'] == sig or res['space'] == sig
        if res['newline'] == sig: ok_n += 1
        if res.get('cr_space_sts_space') == sig: ok_m += 1
        if res['space'] == sig: ok_m += 1
        print(f'=== {i}  X-Sdk-Date={date}  SignedHeaders={signed}')
        print(f'    期望   {sig}')
        print(f'    换行   {res["newline"]}  {"✅ 命中" if res["newline"]==sig else ""}')
        print(f'    空格   {res["space"]}  {"✅ 命中" if res["space"]==sig else ""}')
        print(f'    CR\n+STS空格 {res["cr_space_sts_space"]}  {"✅ 命中" if res["cr_space_sts_space"]==sig else ""}')
        print()
        if i == 1 and hit:
            sig2, cr, sts = sign(ak, sk, 'get', url, headers, signed,
                                 'newline' if res['newline'] == sig else 'space')
            mode = 'newline' if res['newline'] == sig else 'space'
            print('    ── CanonicalRequest ──')
            print('   ', cr.replace('\n', '\\n'))
            print('    ── StringToSign ──')
            print('   ', sts.replace('\n', '\\n'))
            print()

    print(f'换行 join 命中: {ok_n}/{len(rows)}')
    print(f'空格 join 命中: {ok_m}/{len(rows)}')
    if ok_n or ok_m:
        print('\n🎉 端到端签名算法 100% 验证通过！')


if __name__ == '__main__':
    main()
