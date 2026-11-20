#!/usr/bin/env python3
"""Download every image currently hosted on Squarespace into this site's /images folder
and rewrite the HTML to use the local copies. Run this BEFORE the Squarespace site is switched off.
Usage:  python3 localize-images.py        (run from inside the site folder, on a computer with internet access)"""
import json, os, glob, urllib.request
here=os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
m=json.load(open('images/images.json'))
ok=bad=0
for loc,url in m.items():
    os.makedirs(os.path.dirname(loc),exist_ok=True)
    if not os.path.exists(loc):
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
            open(loc,'wb').write(urllib.request.urlopen(req,timeout=60).read()); ok+=1
        except Exception as e:
            print('FAILED',url,e); bad+=1; continue
for f in glob.glob('*.html'):
    t=open(f,encoding='utf-8').read()
    for loc,url in m.items():
        if os.path.exists(loc): t=t.replace(url,loc)
    open(f,'w',encoding='utf-8').write(t)
print('downloaded',ok,'failed',bad)
