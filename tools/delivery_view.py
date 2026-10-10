import io, json, sys
from urllib.parse import urlparse

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

H = (r'E:\VSCodeSpace\ZCode\CodeArts'
     r'\css-complain-drcn.platform.dbankcloud.cn_2026_10_01_18_07_33.har')
har = json.load(open(H, encoding='utf-8'))

for i, e in enumerate(har['log']['entries']):
    if '/v1/ops/delivery' not in e['request']['url']:
        continue
    txt = e['response']['content']['text']
    o = json.loads(txt)
    d = o['data']

    print(f'code={o["code"]} message={o["message"]}')
    print(f'data 字段: {list(d.keys())}')
    print(f'channel={d["channel"]}  serverTime={d["serverTime"]}')
    print(f'items 数: {len(d["items"])}\n')

    for k, v in d.items():
        if k not in ('items',):
            print(f'  {k} = {v}')

    print('\n=== items 明细 ===')
    for it in d['items']:
        cfg = {}
        try:
            cfg = json.loads(it.get('displayConfig') or '{}')
        except Exception:
            pass
        print(f'\n[campaignId={it["campaignId"]}] {it["title"]}')
        for k, v in it.items():
            if k == 'displayConfig':
                continue
            print(f'    {k}: {v}')
        if cfg:
            print(f'    displayConfig.description: {cfg.get("description","")[:110]}')
            btn = cfg.get('claimButtonText', {})
            if btn:
                print(f'    claimButtonText: {btn}')
    break