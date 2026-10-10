#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从内核日志提取「完整 chat body + 完整非签名头集」配对样本，
并验证 payloadHash 环节 = sha256(body 字符串)。

用途：CodeArts 对话接口签名（SDK-HMAC-SHA256 v9）的部分验证。
日志侧 `[header-debug] full headers` 按源码 filter 掉了 Authorization/X-Security-token，
`chat body` 侧打印完整 JSON.stringify(body)，两者靠时间戳邻近配对。
"""
import argparse, hashlib, json, os, re, sys

LOGDIR = r'C:\Users\12925\.codeartsdoer\codearts-data\log'
EMPTY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"


def scan(logdir, limit=6):
    """扫日志，输出 (file, ts, headers_json, body) 配对样本。"""
    samples = []
    for fn in sorted(os.listdir(logdir)):
        if not fn.endswith('.log'):
            continue
        path = os.path.join(logdir, fn)
        try:
            with open(path, encoding='utf-8', errors='replace') as f:
                content = f.read()
        except Exception:
            continue
        if 'chat body' not in content:
            continue
        # 1) 抓 header-debug 行
        hdrs = []
        for m in re.finditer(r'\[header-debug\] full headers: (\{.*?\}), globalConfig', content):
            try:
                hdrs.append((m.start(), json.loads(m.group(1))))
            except Exception:
                pass
        # 2) 抓 chat body（形如 [service] [trace] chat body {json}）
        bodies = []
        for m in re.finditer(r'chat body (\{.*)', content):
            raw = m.group(1)
            # JSON 可能被日志截断/转义；用括号配平截取
            depth, end = 0, None
            in_str, esc = False, False
            for i, ch in enumerate(raw):
                if in_str:
                    if esc: esc = False
                    elif ch == '\\': esc = True
                    elif ch == '"': in_str = False
                    continue
                if ch == '"': in_str = True
                elif ch == '{': depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        break
            if end:
                bodies.append((m.start(), raw[:end]))
        for pos, b in bodies:
            # 找位置最接近的 header-debug（按偏移距离排序取首个）
            cands = sorted(((abs(hp - pos), h) for hp, h in hdrs if abs(hp - pos) < 200000),
                           key=lambda x: x[0])
            if not cands:
                continue
            h = cands[0][1]
            samples.append({'file': fn, 'body': b, 'headers': h})
            if len(samples) >= limit:
                return samples
    return samples


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                                  '..', 're', 'capture', 'sign_sample.json'))
    args = ap.parse_args()

    samples = scan(LOGDIR)
    if not samples:
        print('未找到配对样本', file=sys.stderr)
        sys.exit(1)

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    kept = []
    print(f'找到 {len(samples)} 组配对样本\n')
    for i, s in enumerate(samples[:3], 1):
        body = s['body']
        h = s['headers']
        ph = hashlib.sha256(body.encode('utf-8')).hexdigest()
        print(f'--- 样本 {i}  ({s["file"]})')
        print(f'  body 长度      : {len(body)} 字符')
        print(f'  payloadHash    : {ph}')
        print(f'  body 合法 JSON : ', end='')
        try:
            obj = json.loads(body)
            print(f'是；顶层键 = {sorted(obj.keys())}')
        except Exception as e:
            print(f'否（{e}）—— 日志侧可能已截断')
        print(f'  X-Sdk-Date     : {h.get("X-Sdk-Date") or h.get("x-sdk-date")}')
        print(f'  host           : {h.get("host")}')
        print(f'  model-id       : {h.get("model-id")}')
        print(f'  x-ot-function  : {h.get("x-ot-function")}')
        print(f'  x-ot-session-id: {h.get("x-ot-session-id")}')
        print(f'  参与签名头数   : {len([k for k in h if k.lower() != "x-security-token"])}（+x-security-token）')
        print(f'  含 ContentSha256头: {"X-Sdk-Content-Sha256" in h or "x-sdk-content-sha256" in h}\n')
        kept.append({'file': s['file'], 'payload_hash': ph, 'body_len': len(body),
                     'headers': h, 'body': body})

    json.dump(kept, open(args.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('样本已存:', os.path.normpath(args.out))
    print('\n注意：日志侧 header-debug 按源码 filter 掉了 Authorization，')
    print('      因此本样本只够验证 payloadHash 与头集构造，不能比对 Signature。')


if __name__ == '__main__':
    main()
