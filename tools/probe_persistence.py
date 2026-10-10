#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""#4 取证：codearts-data 持久化布局补全（storage/session_diff/permission/sandbox/project.id 规则）"""
import os, json, sqlite3, hashlib

base = r'C:\Users\12925\.codeartsdoer\codearts-data'
BS = chr(92)

print('=== storage/ 树 ===')
for root, dirs, files in os.walk(os.path.join(base, 'storage')):
    rel = os.path.relpath(root, base)
    depth = 0 if rel == '.' else rel.count(os.sep) + 1
    if depth <= 2:
        print(rel, '|', files[:6], f'({len(files)} files)' if files else '')

sd = os.path.join(base, 'storage', 'session_diff')
if os.path.isdir(sd):
    fs = sorted(os.listdir(sd))
    print(f'\nsession_diff: {len(fs)} 个文件')
    f = fs[0]
    d = json.load(open(os.path.join(sd, f), encoding='utf-8'))
    print('样本:', f, '->', json.dumps(d, ensure_ascii=False)[:400])

for rel in ['storage' + BS + 'permission' + BS + 'config.json',
            'storage' + BS + 'permission' + BS + 'global.json',
            'storage' + BS + 'sandbox' + BS + 'config.json',
            'storage' + BS + 'sandbox' + BS + 'sandbox.json']:
    fp = os.path.join(base, rel)
    if os.path.exists(fp):
        c = open(fp, encoding='utf-8').read()
        print(f'\n--- {rel} ({len(c)}B):')
        print(c[:500])

db = os.path.join(base, 'opencode.db')
con = sqlite3.connect(f'file:{db}?mode=ro', uri=True)
rows = list(con.execute("SELECT id, worktree FROM project"))
for pid, wt in rows:
    hit = None
    for cand in [wt, wt.lower(), wt.replace(BS, '/'), wt.rstrip(BS), wt.rstrip(BS) + BS]:
        if hashlib.sha256(cand.encode()).hexdigest() == pid:
            hit = cand
            break
    print('\nproject:', pid, '| worktree:', wt, '=> sha256 match:', repr(hit))
con.close()
