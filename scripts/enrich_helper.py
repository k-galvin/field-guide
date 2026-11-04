import json
import urllib.request
import urllib.error
import time

SUPABASE_URL = "https://oaqzbymmhusbhvscfcrp.supabase.co"
SUPABASE_KEY = "sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp"

def get_spots():
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/spots?select=*",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def update_spot(spot_id, updates):
    body = json.dumps(updates).encode('utf-8')
    url = f"{SUPABASE_URL}/rest/v1/spots?id=eq.{spot_id}"
    req = urllib.request.Request(
        url,
        data=body,
        method="PATCH",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status in (200, 204)
    except urllib.error.HTTPError as e:
        print(f"Error updating {spot_id}: {e.code} {e.read().decode('utf-8')}")
        return False

print("Enrichment helper initialized.")
