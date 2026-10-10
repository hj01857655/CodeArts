#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""token_usage.py —— 统计本地已消耗 token（来自 opencode.db message 表）"""
import io, json, sqlite3, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DB = r'C:\Users\12925\.codeartsdoer\codearts-data\opencode.db'
c = sqlite3.connect(DB)
cols = [r[1] for r in c.execute('PRAGMA table_info("message")')]
print('message 表列:', cols)

col = next((x for x in ('data', 'json', 'body', 'info') if x in cols), None)
if not col:
    sys.exit('未找到载荷列')

rows = list(c.execute(f'SELECT "{col}" FROM message ORDER BY rowid DESC LIMIT 2000'))
tot = {'input': 0, 'output': 0, 'reasoning': 0, 'cache_read': 0, 'cost': 0.0}
n = 0
sample = None

for (raw,) in rows:
    try:
        o = json.loads(raw)
    except Exception:
        continue
    tk = o.get('tokens') or {}
    if not tk:
        continue
    n += 1
    tot['input'] += tk.get('input', 0) or 0
    tot['output'] += tk.get('output', 0) or 0
    tot['reasoning'] += tk.get('reasoning', 0) or 0
    tot['cache_read'] += (tk.get('cache') or {}).read \
        if False else (tk.get('cache') or {}).get('read', 0) or 0
    tot['cost'] += o.get('cost', 0) or 0
    if sample is None:
        sample = o

print(f'\n扫描 {len(rows)} 条消息，其中 {n} 条带 tokens:')
for k in ('input', 'output', 'reasoning', 'cache_read'):
    print(f'  {k:<12}: {tot[k]:,.0f}')
print(f'  {"cost":<12}: {tot["cost"]:.6f}')
print(f'  {"input+out":<12}: {tot["input"] + tot["output"]:,.0f}')

if sample:
    print('\n单条 message 字段:', list(sample.keys()))
    if sample.get('tokens'):
        print('  tokens:', sample['tokens'])
    print(f'  cost={sample.get("cost")}  providerID={sample.get("providerID")}  '
          f'modelID={sample.get("modelID")}')