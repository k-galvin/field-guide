import urllib.request
import urllib.parse
import json
from datetime import datetime, timezone

SUPABASE_URL = "https://oaqzbymmhusbhvscfcrp.supabase.co"
SUPABASE_KEY = "sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp"

FRENCH_MAPPING = {
    # Provence
    "Palais des Papes": "Provence",
    "Pont Saint-Bénézet (Pont d'Avignon)": "Provence",
    "Collection Lambert": "Provence",
    "Café Tulipe Specialty Coffee": "Provence",
    "Gordes Village & Viewpoint": "Provence",

    # Loire Valley
    "Château de Chambord": "Loire Valley",
    "Château de Chenonceau": "Loire Valley",
    "Château de Villandry": "Loire Valley",
    "Domaine de Chaumont-sur-Loire": "Loire Valley",
    "Château d'Amboise": "Loire Valley",
    "Boulangerie Pâtisserie Bigot": "Loire Valley",

    # Normandy
    "Claude Monet's House & Water Lilies Gardens": "Normandy",
    "Hôtel Baudy (Historic Impressionist Inn)": "Normandy",
    "Musée des Impressionnismes Giverny": "Normandy",
    "Mont-Saint-Michel": "Normandy",
    "Musée de la Tapisserie de Bayeux": "Normandy",
    "Le Moulin de la Galette": "Normandy",

    # Versailles
    "Palace of Versailles (Château de Versailles)": "Versailles",
    "Petit Trianon & Queen's Hamlet": "Versailles",
    "Airelles Château de Versailles, Le Grand Contrôle": "Versailles",
}

ITALIAN_MAPPING = {
    # Tuscany
    "Siena Cathedral (Duomo di Santa Maria Assunta)": "Tuscany",
    "Palazzo Pubblico & Piazza del Campo": "Tuscany",
    "Guinigi Tower (Torre Guinigi)": "Tuscany",
    "Mura di Lucca (Walls of Lucca)": "Tuscany",

    # Italian Riviera
    "Chiesa di San Giorgio": "Italian Riviera",
    "Castello Brown": "Italian Riviera",
    "Villa Durazzo": "Italian Riviera",
}

ALL_MAPPING = {**FRENCH_MAPPING, **ITALIAN_MAPPING}

def update_supabase_spots():
    print("Fetching spots from Supabase to migrate...")
    # Fetch all spots in French Countryside and Italian Countryside
    for old_city in ["French Countryside", "Italian Countryside"]:
        q = urllib.parse.quote(old_city)
        url = f"{SUPABASE_URL}/rest/v1/spots?city=eq.{q}&select=id,name"
        req = urllib.request.Request(url, headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        })
        with urllib.request.urlopen(req) as resp:
            spots = json.loads(resp.read().decode("utf-8"))

        print(f"Found {len(spots)} spots under {old_city}")
        for s in spots:
            spot_id = s["id"]
            spot_name = s["name"]
            new_city = ALL_MAPPING.get(spot_name)
            if not new_city:
                # Try partial match
                for name_key, target_city in ALL_MAPPING.items():
                    if name_key in spot_name or spot_name in name_key:
                        new_city = target_city
                        break
            if new_city:
                print(f"  Migrating '{spot_name}' -> {new_city}")
                data = json.dumps({
                    "city": new_city,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }).encode("utf-8")
                patch_req = urllib.request.Request(
                    f"{SUPABASE_URL}/rest/v1/spots?id=eq.{spot_id}",
                    data=data,
                    headers={
                        "apikey": SUPABASE_KEY,
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },
                    method="PATCH"
                )
                with urllib.request.urlopen(patch_req) as patch_resp:
                    if patch_resp.status not in (200, 204):
                        print(f"    Failed: {patch_resp.status}")
            else:
                print(f"  WARNING: No new city mapping found for '{spot_name}'")

def update_supabase_cities():
    print("Updating Supabase field_guide_cities...")
    # Delete legacy cities
    for old in ["French Countryside", "Italian Countryside", "Avignon", "Giverny"]:
        q = urllib.parse.quote(old)
        del_req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/field_guide_cities?name=eq.{q}",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            },
            method="DELETE"
        )
        try:
            with urllib.request.urlopen(del_req) as resp:
                print(f"  Deleted '{old}': {resp.status}")
        except Exception as e:
            print(f"  Error deleting '{old}': {e}")

    # Add new cities
    new_cities = [
        {"name": "Provence"},
        {"name": "Tuscany"},
        {"name": "Italian Riviera"},
        {"name": "Loire Valley"},
        {"name": "Normandy"},
        {"name": "Versailles"}
    ]
    post_req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/field_guide_cities",
        data=json.dumps(new_cities).encode("utf-8"),
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(post_req) as resp:
            print(f"  Inserted new regional cities: {resp.status}")
    except Exception as e:
        print(f"  Error inserting cities: {e}")

def update_sample_data_file():
    print("Updating js/sample-data.js...")
    with open("js/sample-data.js", "r") as f:
        content = f.read()

    updated = content
    # For each mapping, replace city: 'French Countryside' or city: 'Italian Countryside'
    # in the block that has name: '...'
    import re
    count = 0
    for spot_name, new_city in ALL_MAPPING.items():
        # Match pattern: name:\s*['"]re.escape(spot_name)['"][\s\S]*?city:\s*['"][^'"]+['"]
        pattern = re.compile(
            rf"(name:\s*['\"]{re.escape(spot_name)}['\"][\s\S]*?city:\s*['\"])[^'\"]+(['\"])",
            re.MULTILINE
        )
        if pattern.search(updated):
            updated = pattern.sub(rf"\g<1>{new_city}\g<2>", updated)
            count += 1
        else:
            # Try escaping single quotes in spot_name
            escaped_name = spot_name.replace("'", "\\'")
            pattern2 = re.compile(
                rf"(name:\s*['\"]{re.escape(escaped_name)}['\"][\s\S]*?city:\s*['\"])[^'\"]+(['\"])",
                re.MULTILINE
            )
            if pattern2.search(updated):
                updated = pattern2.sub(rf"\g<1>{new_city}\g<2>", updated)
                count += 1
            else:
                print(f"  ? Could not find spot '{spot_name}' in sample-data.js")

    with open("js/sample-data.js", "w") as f:
        f.write(updated)
    print(f"Updated {count} spots in js/sample-data.js")

if __name__ == "__main__":
    update_supabase_spots()
    update_supabase_cities()
    update_sample_data_file()
