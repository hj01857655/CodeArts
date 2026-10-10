#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""CodeArts Agent 会话秘密解密（Electron/Chromium os_crypt + DPAPI 双跳）。

已确认的两处秘密实体：
1. %APPDATA%\\codearts\\secretStorage\\8f4ebc74…be37.enc
   = base64( v10 || AES-256-CBC(明文) )，密钥来自 codearts\\Local State → os_crypt.encrypted_key（DPAPI 保护）
2. %APPDATA%\\codearts-agent\\User\\globalStorage\\state.vscdb ItemTable
   键 secret://{"extensionId":"huaweicloud.authentication","key":"HuaweiCloudSession"}
   值 {"type":"Buffer","data":[...]} = v10 || AES-CBC 密文（10068 字符 JSON，密文 7547B）
   密钥来自 codearts-agent\\Local State → os_crypt.encrypted_key（DPAPI 保护）

产物：re/capture/secret_storage/（敏感字段打码摘要，明文 JSON 落盘）
"""
import base64, ctypes, json, os, re, sqlite3
from ctypes import wintypes
from Crypto.Cipher import AES

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.normpath(os.path.join(HERE, '..', 're', 'capture', 'secret_storage'))

class DATA_BLOB(ctypes.Structure):
    _fields_ = [("cbData", wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]

def dpapi_unprotect(data: bytes) -> bytes:
    buf = (ctypes.c_char * len(data)).from_buffer_copy(data)
    blob_in = DATA_BLOB(len(data), ctypes.cast(buf, ctypes.POINTER(ctypes.c_char)))
    blob_out = DATA_BLOB()
    if not ctypes.windll.crypt32.CryptUnprotectData(
            ctypes.byref(blob_in), None, None, None, None, 0x01, ctypes.byref(blob_out)):
        raise ctypes.WinError()
    out = ctypes.string_at(blob_out.pbData, blob_out.cbData)
    ctypes.windll.kernel32.LocalFree(blob_out.pbData)
    return out

def get_oscrypt_key(local_state: str) -> bytes:
    d = json.load(open(local_state, encoding='utf-8'))
    raw = base64.b64decode(d['os_crypt']['encrypted_key'])
    assert raw[:5] == b'DPAPI', raw[:5]
    return dpapi_unprotect(raw[5:])  # 32B AES-256 key

def v10_decrypt(ciphertext: bytes, key: bytes) -> bytes:
    # 本 fork 的 os_crypt 为 AES-256-GCM 变体：v10 | 12B nonce | ct || 16B tag（非 CBC，长度不对齐 16）
    assert ciphertext[:3] == b'v10', ciphertext[:3]
    body = ciphertext[3:]
    nonce, data = body[:12], body[12:]
    c = AES.new(key, AES.MODE_GCM, nonce=nonce)
    return c.decrypt_and_verify(data[:-16], data[-16:])

def dump_secret(label: str, blob: bytes, key: bytes):
    pt = v10_decrypt(blob, key)
    txt = pt.decode('utf-8', 'replace')
    out = os.path.join(OUTDIR, label + '.json')
    open(out, 'w', encoding='utf-8').write(txt)
    print(f'\n{"="*70}\n## {label}  (明文 {len(txt)} chars -> {os.path.basename(out)})')
    try:
        obj = json.loads(txt)
    except Exception as e:
        print('  非 JSON:', e, ' head:', txt[:120])
        return
    if not isinstance(obj, dict):
        print('  ', str(obj)[:200])
        return
    for k, v in obj.items():
        s = v if isinstance(v, str) else json.dumps(v, ensure_ascii=False, default=str)
        if isinstance(v, (dict, list)):
            print(f'  [{k}] {type(v).__name__} len={len(s)}')
            if isinstance(v, dict):
                for k2, v2 in list(v.items())[:12]:
                    s2 = v2 if isinstance(v2, str) else json.dumps(v2, ensure_ascii=False, default=str)
                    print(f'      {k2}: {mask(s2)}')
        else:
            print(f'  [{k}] {mask(s)}')

def mask(s, head=10, tail=6):
    s = str(s)
    if len(s) <= head + tail + 3:
        return s
    return f"{s[:head]}…{s[-tail:]} (len={len(s)})"

def main():
    os.makedirs(OUTDIR, exist_ok=True)
    # --- 实体 1: codearts 桌面应用 safeStorage ---
    enc_dir = r'C:\Users\12925\AppData\Roaming\codearts\secretStorage'
    fn = next(f for f in os.listdir(enc_dir) if f.endswith('.enc'))
    b1 = base64.b64decode(open(os.path.join(enc_dir, fn), 'rb').read())
    key1 = get_oscrypt_key(r'C:\Users\12925\AppData\Roaming\codearts\Local State')
    print(f'[1] {fn}: level1 {len(b1)}B, prefix={b1[:3]}, key1={key1[:8].hex()}…')
    dump_secret('codearts_safeStorage', b1, key1)
    # --- 实体 2: VS Code fork state.vscdb secret:// ---
    db = r'C:\Users\12925\AppData\Roaming\codearts-agent\User\globalStorage\state.vscdb'
    con = sqlite3.connect(f'file:{db}?mode=ro', uri=True)
    row = con.execute("""SELECT value FROM ItemTable
        WHERE key='secret://{"extensionId":"huaweicloud.authentication","key":"HuaweiCloudSession"}'""").fetchone()
    con.close()
    obj = json.loads(row[0])
    assert obj['type'] == 'Buffer'
    b2 = bytes(obj['data'])
    key2 = get_oscrypt_key(r'C:\Users\12925\AppData\Roaming\codearts-agent\Local State')
    print(f'\n[2] HuaweiCloudSession: {len(b2)}B, prefix={b2[:3]}, key2={key2[:8].hex()}…')
    dump_secret('HuaweiCloudSession', b2, key2)
    print('\n完成。产物目录:', OUTDIR)

if __name__ == '__main__':
    main()
