#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""二进制 strings 提取（GNU strings 等价，无依赖）。
用法: py_strings.py <file> [--min N] [--grep PATTERN]
输出: 匹配行按出现顺序；--grep 给正则，否则全量（按频次 top）。"""
import re, sys, os, collections

def strings(path, minlen=6):
    data = open(path, 'rb').read()
    pat = re.compile(rb'[\x20-\x7e]{%d,}' % minlen)
    for m in pat.finditer(data):
        yield m.start(), m.group().decode('latin-1')

def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__); return
    path = args[0]
    minlen = 6
    pattern = None
    i = 1
    while i < len(args):
        if args[i] == '--min': minlen = int(args[i+1]); i += 2
        elif args[i] == '--grep': pattern = re.compile(args[i+1]); i += 2
        else: i += 1
    hits = []
    freq = collections.Counter()
    for off, s in strings(path, minlen):
        if pattern is None:
            freq[s] += 1
        elif pattern.search(s):
            hits.append((off, s))
    if pattern is None:
        for s, c in freq.most_common(200):
            print(f"{c:4d}  {s[:160]}")
    else:
        for off, s in hits:
            print(f"{off:#010x}  {s[:160]}")
        print(f"\n共 {len(hits)} 行", file=sys.stderr)

if __name__ == '__main__':
    main()
