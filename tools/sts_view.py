#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""解码 STS 换发响应 + DPoP JWT"""
import base64, io, json, sys
from datetime import datetime, timezone

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

H = (r'E:\VSCodeSpace\ZCode\CodeArts'
     r'\css-complain-drcn.platform.dbankcloud.cn_2026_10_01_18_07_33.har')
har = json.load(open(H, encoding='utf-8'))

for i, e in enumerate(har['log']['entries']):
    if 'oauth2/tokens' not in e['request']['url'] or \
            e['response']['status'] != 200:
        continue

    o = json.loads(e['response']['content']['text'])
    print('=== 响应顶层字段 ===')
    for k, v in o.items():
        if k != 'credentials':
            print(f'  {k}: {v}')

    print('\n=== credentials ===')
    for k, v in o['credentials'].items():
        s = str(v)
        if len(s) > 84:
            s = s[:84] + f'…(len={len(s)})'
        print(f'  {k}: {s}')

    exp = o['credentials'].get('expiration')
    if exp:
        t = datetime.fromisoformat(exp.replace('Z', '+00:00'))
        base = datetime(2026, 10, 1, 9, 52, 33, tzinfo=timezone.utc)
        print(f'\n  expiration  : {exp}')
        print(f'  有效期      : {t - base}')

    print('\n=== DPoP JWT ===')
    dpop = next(h['value'] for h in e['request']['headers']
                if h['name'] == 'DPoP')
    seg = dpop.split('.')
    for name, s in zip(('header', 'payload'), seg[:2]):
        pad = '=' * (-len(s) % 4)
        val = json.loads(base64.urlsafe_b64decode(s + pad))
        print(f'  {name}: {json.dumps(val, ensure_ascii=False)}')
    print(f'  signature  : {len(seg[2])} 字符 (ES256 = 64B → base64url 86)')
    break