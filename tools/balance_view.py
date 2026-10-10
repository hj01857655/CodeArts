#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""balance_view.py —— 解析 balance 响应字段并计算剩余额度"""
import io, json, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

F = r'C:\Users\12925\AppData\Roaming\Reqable\capture\1790841737450398-183-1-res-raw-body.reqable'

o = json.loads(open(F, 'rb').read())
print(f"error_code : {o['error_code']}")
print(f"error_msg  : {o['error_msg']}\n")

r = o['result']
print('=== result 全部字段 ===')
for k, v in r.items():
    print(f'  {k:<24}: {v}')

q = r['daily_token_limit']
u = r['daily_tokens_used']
m_lim = r['monthly_token_limit']
m_use = r['monthly_tokens_used']

print('\n=== 用量 ===')
print(f'  每日额度 daily_token_limit : {q:,}')
print(f'  每日已用 daily_tokens_used: {u:,}  ({u / q * 100:.3f}%)')
print(f'  每日剩余                  : {q - u:,}')
print(f'  total_balance             : {r["total_balance"]:,}')
print(f'  total_quota               : {r["total_quota"]:,}')
print(f'  used_amount               : {r["used_amount"]:,}')
print(f'  校验 limit - used == balance : {q - u == r["total_balance"]}')

print(f'\n  月度额度 monthly_token_limit : {m_lim:,}  (0 = 不限)')
print(f'  月度已用 monthly_tokens_used: {m_use:,}')
print(f'  expire_time                  : {r["expire_time"]}  (0 = 不过期)')
print(f'  channel                      : {r["channel"]}')