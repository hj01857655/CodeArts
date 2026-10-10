#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
sts_refresh.py —— 用 refresh_token + DPoP 续期 STS 凭证。

DPoP 复现: ES256(P-256) JWT, header {alg:ES256, typ:dpop+jwt, jwk:<publicKeyJwk>}
claims   : {htm, htu, iat, jti}
"""
import base64, hashlib, io, json, os, sys, time, urllib.parse, urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

CREDS = r'E:\VSCodeSpace\ZCode\CodeArts\re\capture\secret_storage\HuaweiCloudSession.json'
STS_HOST = 'https://sts.cn-north-4.myhuaweicloud.com'


def b64u(d):
    if isinstance(d, str):
        d = d.encode()
    return base64.urlsafe_b64encode(d).rstrip(b'=').decode()


# ---------- ES256 DPoP ----------
try:
    from cryptography.hazmat.primitives.asymmetric import ec, padding
    from cryptography.hazmat.primitives import hashes, serialization
    HAVE_CRYPTO = True
except ImportError:
    HAVE_CRYPTO = False


def make_dpop(priv_jwk, htm, htu):
    if not HAVE_CRYPTO:
        raise SystemExit('需要 cryptography: pip install cryptography')

    x = base64.urlsafe_b64decode(priv_jwk['x'] + '=' * (-len(priv_jwk['x']) % 4))
    y = base64.urlsafe_b64decode(priv_jwk['y'] + '=' * (-len(priv_jwk['y']) % 4))
    d = base64.urlsafe_b64decode(priv_jwk['d'] + '=' * (-len(priv_jwk['d']) % 4))

    num = int.from_bytes(x, 'big')
    p = pow(2, 256) - 2 ** 224 + 2 ** 192 + 2 ** 96 - 1
    pub = ec.EllipticCurvePublicNumbers(num, int.from_bytes(y, 'big'), ec.SECP256R1())
    priv = ec.EllipticCurvePrivateNumbers(int.from_bytes(d, 'big'), pub)
    key = priv.private_key()

    header = {'alg': 'ES256', 'typ': 'dpop+jwt', 'jwk': {'kty': 'EC', 'crv': 'P-256',
                                                       'x': priv_jwk['x'], 'y': priv_jwk['y']}}
    payload = {'htm': htm, 'htu': htu, 'iat': int(time.time()),
               'jti': b64u(os.urandom(16))}

    seg = f'{b64u(json.dumps(header))}.{b64u(json.dumps(payload))}'
    sig = key.sign(seg.encode(), ec.ECDSA(hashes.SHA256()))
    der = sig.public_bytes(serialization.Encoding.DER,
                           serialization.PublicFormat.SubjectPublicKeyInfo) \
        if hasattr(sig, 'public_bytes') else sig
    # ECDSA(ec.ECDSA) 已返回 DER，用其 r/s 重编码为 JOSE 格式
    from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature
    r, s = decode_dss_signature(sig)
    raw = r.to_bytes(32, 'big') + s.to_bytes(32, 'big')
    return f'{seg}.{b64u(raw)}'


REFRESH_TOKEN = (
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImNuLW5vcnRoLTQ6NSJ9'
    '.eyJleHAiOjE3OTI2ODU1MTgsImlhdCI6MTc5MDgzNzE1MywiaXNzIjoiY24tbm9ydGgtNCIs'
    'InR5cGUiOiJyZWZyZXNoVG9rZW4iLCJ1c2VyX3Byb2ZpbGUiOiJleUpoWTJOdmRXNTBYMmxr'
    'SWpvaU1EZzJZakF5TnpFd09UQXdNalV6TWpCbU4yTmpNREV6Wm1Gak5qaGlOREFpTENKaFkyTnZk'
    'VzUwWDI1aGJXVWlPaUpvYWpBeE9EVTNOalUxSWl3aVptVmhkSFZ5WlhOZmMzZHBkR05vWlhNaU9u'
    'c2laVzVoWW14bFgzQmtjRFVpT25SeWRXVjlMQ0p3Y21sdVkybHdZV3hmYVdRaU9pSXdPRFppTURJ'
    'M01XTTFPREJtTTJWbE1XWTRPR013TVRNeE5EWXpNV0V6WVNJc0luQnlhVzVqYVhCaGJGOXBjMTl5YjI5'
    'MFgzVnpaWElpT25SeWRXVXNJbkJ5YVc1amFYQmhiRjkxY200aU9pSnBZVzA2T2pBNE5tSXdNamN4'
    'TURrd01ESTFNekl3Wmpkall6QXhNMlpoWXpZNFlqUXdPblZ6WlhJNmFHb3dNVGcxTnpZMU5TSjki'
    'LCJjbGllbnRfaWQiOiJjb2RlYXJ0cy1hZ2VudCIsImNuZiI6eyJqa3QiOiItZnBOQkJUWjBPMmFOal'
    'dBazNMTmdFSFdHV05PVG5rd2ZWaDdJRU9uMGxJIn0sImp0aSI6IjhkNDQ5YjVlLTBmNWQtNGQyZS05'
    'ZjgyLTIxYjg3YTYyYzc3NSIsImZlZGVyYXRpb24iOm51bGx9'
    '.OpWTvU-Snk9yiip1Wqd1N47S5JqAfQTMWmDAIXAMqzpjyfQDGnw9sAjtsI-55xhZTvr0S6aGMuLKIr'
    'zteQgRZ3yJmZc8MbCceyAposbidfIDyiiOrZU4529A9s8PfDHUPnXpOufgPS0Yi_WlJ1gYqxfyLjt'
    'ivG6XWAnUKUDsN3s9tKHlgi-bpdwzWg161GwWw9k5f8vlWO9i4rQyWm-7ji7R8zT8I-RHr40lzQPW'
    'te9CBthF_4GVM55UrMQbVWlHD9kRxF2w-qlOmoYiQkENILvxySKVZOQTjiBCvKSeUFqOd61eGIiIat'
    'c8zsNZT3krE7IhQ8WAqavSuedxuednyQ')


def refresh(creds):
    d = json.load(open(CREDS, encoding='utf-8'))
    rt = REFRESH_TOKEN
    dpk = d.get('loginContext', {}).get('dpopKeyPair', {}).get('privateKeyJwk')
    cver = d.get('loginContext', {}).get('pkcePair', {}).get('codeVerifier')
    cid = d.get('loginContext', {}).get('client_id') or 'vscode-codebot'

    url = f'{STS_HOST}/v1/oauth2/tokens'
    form = urllib.parse.urlencode({
        'client_id': 'codearts-agent',
        'code_verifier': cver,
        'grant_type': 'refresh_token',
        'refresh_token': rt,
    }).encode()

    dpop = make_dpop(dpk, 'POST', url)
    req = urllib.request.Request(url, data=form, method='POST')
    req.add_header('DPoP', dpop)
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')

    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')
    except Exception as e:
        return -1, f'{type(e).__name__}: {e}'


code, body = refresh(None)
print(f'HTTP {code}')
print(body[:900])