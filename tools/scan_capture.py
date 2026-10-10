import io, json, os, re, sys
from collections import Counter, OrderedDict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

CAP = r'C:\Users\12925\AppData\Roaming\Reqable\capture'
MDB = r'C:\Users\12925\AppData\Roaming\Reqable\box\data.mdb'

# ---------- 1. body 目录里的全部内容 ----------
rows = []
for n in os.listdir(CAP):
    p = os.path.join(CAP, n)
    if not os.path.isfile(p):
        continue
    kind = ('REQ' if 'req_raw-body' in n else
            'RES' if 'res-raw-body' in n else
            'REQ-X' if 'req-extract-body' in n else 'RES-X')
    try:
        d = open(p, 'rb').read()
    except Exception:
        continue
    rows.append((n, kind, len(d), d))

print('=' * 72)
print(f'body 目录：共 {len(rows)} 个文件 '
      f'{sum(r[2] for r in rows) / 1024:.0f} KB')
print('=' * 72)
for k, v in Counter(r[1] for r in rows).most_common():
    print(f'  {k:<8}: {v}')

# ---------- 2. 识别业务 payload ----------
print('\n' + '=' * 72)
print('业务 payload 识别')
print('=' * 72)

CLS = [
    ('chat/completions', lambda d: b'chat/completions' in d[:200] or
     (b'"model":"deepseek' in d[:200])),
    ('balance 响应', lambda d: b'daily_token_limit' in d),
    ('claim 响应', lambda d: b'"error_code":"0000"' in d and
     b'user_name' in d and b'daily_token_limit' not in d),
    ('config 响应', lambda d: b'"models"' in d or b'model_alias' in d),
    ('token 列表请求', lambda d: b'"model_names"' in d),
    ('技能/工作区', lambda d: b'page_num' in d),
    ('遥测上报', lambda d: b'"device_name"' in d),
    ('插件上报', lambda d: b'"plugin_name"' in d),
    ('task 上报', lambda d: b'"task":"plan-execute"' in d),
]

found = {}
for n, kind, sz, d in rows:
    for label, fn in CLS:
        try:
            if fn(d):
                found.setdefault(label, []).append((n, kind, sz, d))
                break
        except Exception:
            pass

for label, lst in found.items():
    print(f'\n--- {label}  ({len(lst)} 个) ---')
    for n, kind, sz, d in lst[:2]:
        print(f'  [{kind}] {sz:>7}B  {n[:40]}')
        print(f'    {d[:260].decode("utf-8", "replace")}')

# ---------- 3. data.mdb 里的 URL ----------
print('\n' + '=' * 72)
print('data.mdb 中的接口路径')
print('=' * 72)

m = open(MDB, 'rb').read()
urls = re.findall(rb'https://[a-zA-Z0-9._-]+(?:\.com|\.cn)[a-zA-Z0-9/_.\-]*', m)
cnt = Counter(u.decode('utf-8', 'replace') for u in urls)
for u, c in cnt.most_common(40):
    print(f'  {c:>3}x  {u}')

# api 路径
print('\n--- api 路径 ---')
apis = re.findall(rb'/api/v[0-9]+/[a-zA-Z0-9/_\-.]+', m)
for a, c in Counter(x.decode() for x in apis).most_common(30):
    print(f'  {c:>3}x  {a}')