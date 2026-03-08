import sys
import urllib.request
import json
try:
    req = urllib.request.Request("http://localhost:8000/auth/signup", data=b'{"name":"test","email":"test10@test.com","password":"password"}', headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        print(resp.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print(e.read().decode("utf-8"))
