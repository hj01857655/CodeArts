import io, json, sys
from urllib.parse import parse_qs, urlparse

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

H = (r'E:\VSCodeSpace\ZCode\CodeArts'
     r'\css-complain-drcn.platform.dbankcloud.cn_2026_10_01_18_07_33.har')
har = json.load(open(H, encoding='utf-8'))

for i, e in enumerate(har['log']['entries']):
    if 'riskData' not in e['request']['url']:
        continue

    q = parse_qs(e['request']['postData']['text'])
    print('=== riskData 表单字段 ===')
    for k, v in q.items():
        val = v[0]
        print(f'\n  {k}  （{len(val)} 字符）')
        if k == 'devID':
            print(f'    {val}')
            print(f'    {len(val)} hex = {len(val) // 2} 字节')
        else:
            print(f'    {val[:150]}{"…" if len(val) > 150 else ""}')

    print('\n=== 响应 ===')
    print(' ', e['response']['content']['text'])

    dev = q['devID'][0]
    print(f'\n=== devID 前 16 位 {dev[:16]}… 在全 HAR 出现处 ===')
    n = 0
    for j, e2 in enumerate(har['log']['entries']):
        if dev[:16] in json.dumps(e2, ensure_ascii=False):
            n += 1
            if n <= 6:
                u = urlparse(e2['request']['url'])
                print(f'  #{j} {e2["request"]["method"]} '
                      f'{u.netloc}{u.path[:46]}')
    print(f'  共 {n} 处')
    break