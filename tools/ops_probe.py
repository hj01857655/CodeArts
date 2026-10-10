#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ops_probe.py —— 用内核 AK/SK 对扩展层 /v1/ops/delivery 做只读探测。
只发 GET，不做任何写操作。
"""
import hashlib, hmac, io, json, sys, urllib.request, urllib.error

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT = r'E:\VSCodeSpace\ZCode\CodeArts'
CREDS = ROOT + r'\re\capture\secret_storage\HuaweiCloudSession.json'

creds = json.load(open(CREDS, encoding='utf-8'))
AK, SK = creds['accessKey'], creds['secretKey']
STS = ('hQpjbi1ub3J0aC00AQAABXFIU1RBWkJNWFVLSVVVWjcwVEVER0TBvmeZk2uRcZ'
       'CvitTiHzSmiyKG-3XIbE8e7SAq33CgY4lM3J02Lkf4EIhSKS4aEJfqwI3Ji2i-'
       'KWoWVXHhFGLW43olQ_zND5-KRPBrTT7Hvoy14hd8-eMrQ2p_CC8kd9wKiGPAYk'
       '9x1lFsNgWm-pMa-MmXDPQd4zXIEKM9iAQCiLYcLU6OtJ-amgLiHJILBlYyBB57pH'
       'CxCXvhz1dy18qc7bQjpk4oNkTxsAK5HTPWSAo_uV11vJq8Zvz8aAvixViF2mMCUT'
       'K8tqNRsY3meEFNYGnVJ47W4ynwLIR3KGauu9XU1UpAS0Mw0XfjCizoddo0EzQP'
       'aRsR5pSDPSE-BC82otJiuzaRXIU-ORLgtF6Sgeqwgagkk_sPdZy83W-WdwVX9-gQ-'
       'D0GRb-xx9Y_9U1HuMj3Iq8QR8Mfq0NiSMK6z85X3YbODIiz16NoRwLNd8NWeiW'
       'ZjkxADrWMhpi1cVHo_2oNkkW5ob_TIcuzVtMpHmLkbayE-ChyI6kd')

HOST = 'snap-access.cn-north-4.myhuaweicloud.com'
SDK_DATE = '20261001T080114Z'
TRACE = '4acfe1c9666c44fb84c72ab3b38d5c70'

SIGNED = ('agent-type;content-type;host;ide-name;ide-version;plugin-name;'
          'plugin-version;x-auth-token;x-language;x-sdk-date;'
          'x-security-token;x-snap-traceid')

H = {
    'content-type': 'application/json',
    'host': HOST,
    'ide-name': 'CodeArts Agent',
    'ide-version': '1.109.5',
    'plugin-name': 'snap_vscode',
    'plugin-version': '26.9.500',
    'x-auth-token': '',
    'x-language': 'zh-cn',
    'x-sdk-date': SDK_DATE,
    'x-security-token': STS,
    'x-snap-traceid': TRACE,
    'agent-type': 'PromptCenter',
}


def sha(s):
    return hashlib.sha256(s.encode('utf-8')).hexdigest()


def sign(path):
    ch = ''.join(f'{k}:{H[k]}\n' for k in SIGNED.split(';'))
    cr = '\n'.join(['GET', path, '', ch, SIGNED, sha('')])
    sts = '\n'.join(['SDK-HMAC-SHA256', SDK_DATE, sha(cr)])
    key = hmac.new(AK.encode(), sts.encode(), hashlib.sha256).digest()
    return hmac.new(key, sts.encode(), hashlib.sha256).hexdigest()


def probe(path):
    url = f'https://{HOST}{path}'
    sig = sign(path)
    req = urllib.request.Request(url, method='GET')
    req.add_header('Accept', 'application/json')
    req.add_header('content-type', 'application/json')
    for k, v in H.items():
        if k != 'host':
            req.add_header(k, v)
    req.add_header('Authorization',
                   f'SDK-HMAC-SHA256 Access={AK}, SignedHeaders={SIGNED}, '
                   f'Signature={sig}')
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read().decode('utf-8', 'replace')
            return r.status, body
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')
    except Exception as e:
        return -1, f'{type(e).__name__}: {e}'


print(f'AK: {AK}\n')

# 先试 GET（只读）
for p in ['/v1/ops/delivery?channel=IDE',
          '/v1/ops/credit/usage?type=session&id=probe',
          '/v1/ops/invite/generate?channel=IDE']:
    code, body = probe(p)
    print('=' * 66)
    print(f'GET  {p}\n  HTTP {code}\n  {body[:420]}\n')

# 再试 POST + 空体（claim/confirm 很可能要 POST）
print('\n' + '#' * 66)
print('# POST 探测')
print('#' * 66)


def probe_post(path, payload=b'{}'):
    url = f'https://{HOST}{path}'
    sig = sign(path)
    req = urllib.request.Request(url, data=payload, method='POST')
    req.add_header('Accept', 'application/json')
    req.add_header('content-type', 'application/json')
    for k, v in H.items():
        if k != 'host':
            req.add_header(k, v)
    req.add_header('Authorization',
                   f'SDK-HMAC-SHA256 Access={AK}, SignedHeaders={SIGNED}, '
                   f'Signature={sig}')
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')
    except Exception as e:
        return -1, f'{type(e).__name__}: {e}'


def sign_post(path):
    """POST 时 payloadHash 参与签名"""
    ch = ''.join(f'{k}:{H[k]}\n' for k in SIGNED.split(';'))
    cr = '\n'.join(['POST', path, '', ch, SIGNED, sha('{}')])
    sts = '\n'.join(['SDK-HMAC-SHA256', SDK_DATE, sha(cr)])
    key = hmac.new(AK.encode(), sts.encode(), hashlib.sha256).digest()
    return hmac.new(key, sts.encode(), hashlib.sha256).hexdigest()


def probe_post2(path, body='{}'):
    url = f'https://{HOST}{path}'
    sig = sign_post(path)
    req = urllib.request.Request(url, data=body.encode(), method='POST')
    req.add_header('Accept', 'application/json')
    req.add_header('content-type', 'application/json')
    for k, v in H.items():
        if k != 'host':
            req.add_header(k, v)
    req.add_header('Authorization',
                   f'SDK-HMAC-SHA256 Access={AK}, SignedHeaders={SIGNED}, '
                   f'Signature={sig}')
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')
    except Exception as e:
        return -1, f'{type(e).__name__}: {e}'


for p in ['/v1/ops/claim?channel=IDE',
          '/v1/ops/confirm?channel=IDE']:
    code, body = probe_post2(p)
    print('=' * 66)
    print(f'POST {p}  body={{}}\n  HTTP {code}\n  {body[:420]}\n')