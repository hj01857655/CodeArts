#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bun 单文件可执行内嵌 JS 层提取器。
格式（实测）：...<上一文件内容>\x00B:/~BUN/root/<name>\x00<文件内容>...
用法: py_extract_bun.py <exe> <outdir>
产物: <outdir>/<name>（每个 chunk 一个文件）+ _index.tsv（name, size, offset）"""
import os, re, sys

def main():
    exe, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    data = open(exe, 'rb').read()
    # 所有内嵌文件头: \x00 B:/~BUN/<path> \x00
    marker = re.compile(rb'\x00B:/~BUN/([^\x00\x01-\x1f]{1,120}?)\x00')
    heads = [(m.start(1), m.end(), m.group(1).decode('utf-8', 'replace')) for m in marker.finditer(data)]
    # 去重（同名多个入口 import 会重复出现头）——按 offset 取唯一
    seen = {}
    for off, end, name in heads:
        seen.setdefault(name, (off, end))
    rows = []
    for name, (off, end) in sorted(seen.items(), key=lambda kv: kv[1][0]):
        # 内容终点 = 下一个更靠后的文件头（所有头的起点集合）
        nxt = [h[0] - 1 for h in heads if h[0] > end]   # 头前的 \x00 是内容终点
        limit = min(nxt) if nxt else len(data)
        content = data[end:limit]
        safe = name.replace('/', '_')
        with open(os.path.join(outdir, safe), 'wb') as f:
            f.write(content)
        rows.append((name, len(content), off))
    with open(os.path.join(outdir, '_index.tsv'), 'w', encoding='utf-8') as f:
        f.write('name\tsize\theader_offset\n')
        for name, size, off in rows:
            f.write(f"{name}\t{size}\t{off:#x}\n")
    total = sum(r[1] for r in rows)
    print(f"提取 {len(rows)} 个文件，共 {total/1048576:.0f}MB -> {outdir}")
    for name, size, off in rows[:10]:
        print(f"  {size/1048576:8.2f}MB  {name}")
    if len(rows) > 10:
        print(f"  ... (+{len(rows)-10})")

if __name__ == '__main__':
    main()
