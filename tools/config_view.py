import io, json, os, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

CAP = r'C:\Users\12925\AppData\Roaming\Reqable\capture'
F = os.path.join(CAP, '1790841681854078-119-1-res-raw-body.reqable')

o = json.loads(open(F, 'rb').read())
r = o['result']

print(f"error_code : {o['error_code']}")
print(f"error_msg  : {o['error_msg']}")
print(f"\nbase_url: {r['base_url']}")
print(f"模型数  : {len(r['models'])}\n")

print(f'{"model_id":<26}{"ctx_window":>13}{"max_tokens":>13}{"sort":>7}')
print('-' * 60)
for m in sorted(r['models'], key=lambda x: x['sort']):
    print(f"{m['model_id']:<26}{m['context_window']:>13,}"
          f"{m['max_tokens']:>13,}{m['sort']:>7}")

print('\n=== 字段全集 ===')
keys = set()
for m in r['models']:
    keys |= set(m.keys())
print(' ', sorted(keys))

print('\n=== 与实际对话请求的对照 ===')
print('  config: deepseek-v4-flash-0731  ctx=1,048,576  max_tokens=393,216')
print('  实测  : max_tokens=32000 (低于 config 上限)')
print('  实测  : messages[0].system 长度 23,796 字符')