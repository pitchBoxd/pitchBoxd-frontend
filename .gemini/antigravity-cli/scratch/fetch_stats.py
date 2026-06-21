import urllib.request
import json

try:
    with urllib.request.urlopen("http://localhost:8080/api/v1/matches/1/detail/stats") as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print("Error fetching match stats:", e)
