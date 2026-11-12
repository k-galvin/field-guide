import urllib.request
import ssl
import io
import os
import time
import json
from datetime import datetime, timezone
from PIL import Image

ctx = ssl.create_default_context()
HEADERS = {'User-Agent': 'ArchivalFieldGuide/2.0 (curator@coolplanck.guide)'}

REAL_SPOT_PHOTOS = {
    # 1. Taos (Historic Plaza & Taos Pueblo)
    "spot-santa-fe-taos": "https://upload.wikimedia.org/wikipedia/commons/6/65/USA_09643_Taos_Pueblo_Luca_Galuzzi_2007.jpg",

    # 2. La Boca (Santa Fe) - Authentic historic Santa Fe Plaza / Marcy St area
    "spot-santa-fe-la-boca": "https://upload.wikimedia.org/wikipedia/commons/4/44/Santa_Fe_Plaza.jpg",

    # 3. Enchantment Resort (Sedona) - Boynton Canyon red rocks where Enchantment Resort is nestled
    "spot-sedona-enchantment-resort": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Fall_colors_in_Boynton_Canyon.jpg",

    # 4. La Quinta Resort & Club (Palm Springs) - The iconic La Quinta Resort pool with casitas, palms, and mountains
    "spot-palm-springs-la-quinta-resort": "https://upload.wikimedia.org/wikipedia/commons/1/17/La_Quinta_Resort_Pool.JPG",

    # 5. Coachella Festival (Palm Springs) - Coachella festival crowd and stage at Empire Polo Club
    "spot-palm-springs-coachella-festival": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Coachella_2012_%286941735926%29.jpg",

    # 6. Grand Canyon National Park (South Rim) - Sunset over Grand Canyon South Rim
    "spot-grand-canyon-south-rim": "https://upload.wikimedia.org/wikipedia/commons/1/12/Grand_Canyon_South_Rim_at_Sunset.jpg",

    # 7. Sugar Bowl (Phoenix) - The actual iconic pink Sugar Bowl restaurant exterior in Old Town Scottsdale
    "spot-phoenix-sugar-bowl": "https://upload.wikimedia.org/wikipedia/commons/4/47/Sugar_Bowl_Exterior.jpg",

    # 8. Fairmont Le Château Frontenac (Quebec City) - Authentic Château Frontenac at dusk in Old Quebec
    "spot-quebec-city-chateau-frontenac": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Chateau_Frontenac_at_dusk_in_Quebec_City.jpg",

    # 9. Fairmont Banff Springs (Banff) - The actual Fairmont Banff Springs Hotel with Bow River and Rockies
    "spot-banff-fairmont-banff-springs": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Fairmont_Banff_Springs_Hotel%2C_south_view_20240820_2.jpg",

    # 10. Monterey Bay Aquarium (Monterey) - The actual exterior of the Monterey Bay Aquarium on Cannery Row
    "spot-monterey-aquarium": "https://upload.wikimedia.org/wikipedia/commons/2/26/Monterey_Bay_Aquarium_exterior_August_2016.jpg",

    # 11. Bart's Books (Ojai) - The actual outdoor open-air Bart's Books courtyard and shelves in Ojai
    "spot-ojai-barts-books": "https://upload.wikimedia.org/wikipedia/commons/3/34/Bart%27s_books.JPG",

    # 12. Rory's Place (Ojai) - The authentic Ojai Spanish Arcade on East Ojai Ave where Rory's Place is located
    "spot-ojai-rorys-place": "https://upload.wikimedia.org/wikipedia/commons/2/28/Ojai_Arcade_-_Ojai%2C_CA.jpg",

    # 13. Zareen's (South Bay Area) - The actual Zareen's restaurant on California Avenue in Palo Alto
    "spot-south-bay-zareens-palo-alto": "https://upload.wikimedia.org/wikipedia/commons/6/62/Zareen%27s_Palo_Alto%2C_California_01.jpg",

    # 14. Filoli Historic House & Garden (South Bay Area) - The actual formal sunken gardens of Filoli
    "spot-south-bay-filoli-gardens": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Filoli_Garden%2C_Filoli%2C_Woodside%2C_San_Mateo_County%2C_Northern_California_14.jpg",

    # 15. Half Moon Bay Books (South Bay Area) - Historic Main Street in Half Moon Bay where the bookshop sits
    "spot-south-bay-half-moon-bay-books": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Half_Moon_Bay_California_Main_Street.jpg",

    # 16. Mountain View Farmers Market (South Bay Area) - The actual Sunday Mountain View Farmers Market at Caltrain
    "spot-south-bay-mountain-view-farmers-market": "https://upload.wikimedia.org/wikipedia/commons/4/42/Mountain_View_Farmers%27_Market%2C_Mountain_View%2C_California_02.jpg",

    # 17. Half Moon Bay State Beach (South Bay Area) - The actual Half Moon Bay State Beach coastline
    "spot-south-bay-half-moon-bay-beach": "https://upload.wikimedia.org/wikipedia/commons/d/de/Half_Moon_Bay_State_Beach_1.jpg",

    # 18. Marin Country Mart (Marin) - The actual rustic timber buildings and open square at Larkspur Landing
    "spot-marin-country-mart": "https://upload.wikimedia.org/wikipedia/commons/4/46/Larkspur_Landing_3019_02.JPG",

    # 19. Mill Valley Public Library (Marin) - The actual redwood-enshrouded timber exterior of Mill Valley Public Library
    "spot-marin-mill-valley-library": "https://upload.wikimedia.org/wikipedia/commons/5/52/Mill_Valley_Public_Library%2C_exterior_%28May_2024%29.jpg",

    # 20. Marin County Civic Center (Marin) - Frank Lloyd Wright's actual Marin County Civic Center with blue arches
    "spot-marin-civic-center": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Marin_County_Civic_Center_%282026%29-L1001193.jpg"
}

def download_and_optimize():
    os.makedirs('images/spots', exist_ok=True)
    print(f"Downloading and optimizing real photos for all {len(REAL_SPOT_PHOTOS)} spots...")

    for spot_id, url in REAL_SPOT_PHOTOS.items():
        dest = f"images/spots/{spot_id}.jpg"
        print(f"Fetching {spot_id} from {url[:70]}...")
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
                raw_bytes = r.read()
            im = Image.open(io.BytesIO(raw_bytes)).convert('RGB')
            im.thumbnail((1200, 800), Image.Resampling.LANCZOS)
            im.save(dest, 'JPEG', quality=85, optimize=True)
            size_kb = os.path.getsize(dest) // 1024
            print(f"  ✓ Saved {dest} ({im.size[0]}x{im.size[1]}, {size_kb} KB)")
        except Exception as e:
            print(f"  ✗ FAILED to download for {spot_id}: {e}")
        time.sleep(0.3)

def update_sample_data():
    print("Updating js/sample-data.js with local real photo paths...")
    with open('js/sample-data.js', 'r') as f:
        content = f.read()

    updated = content
    for spot_id in REAL_SPOT_PHOTOS.keys():
        local_path = f"images/spots/{spot_id}.jpg"
        # Find the spot block and update photoUrl
        # Pattern: id: 'spot-id', ... photoUrl: '...'
        import re
        pattern = re.compile(rf"(id:\s*'{re.escape(spot_id)}'[\s\S]*?photoUrl:\s*')[^']+(\')", re.MULTILINE)
        if pattern.search(updated):
            updated = pattern.sub(rf"\g<1>{local_path}\g<2>", updated)
            print(f"  ✓ Updated photoUrl for {spot_id}")
        else:
            print(f"  ? Spot {spot_id} not matched in sample-data.js")

    with open('js/sample-data.js', 'w') as f:
        f.write(updated)
    print("js/sample-data.js updated successfully.")

def update_supabase():
    SUPABASE_URL = "https://oaqzbymmhusbhvscfcrp.supabase.co"
    SUPABASE_KEY = "sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp"
    print("Updating Supabase spots table with real photo paths...")

    updates = []
    for spot_id in REAL_SPOT_PHOTOS.keys():
        local_path = f"images/spots/{spot_id}.jpg"
        updates.append({
            "id": spot_id,
            "photo_url": local_path,
            "updated_at": datetime.now(timezone.utc).isoformat()
        })

    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/spots",
        data=json.dumps(updates).encode("utf-8"),
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            print("Supabase photo_url update status:", resp.status)
    except Exception as e:
        print("Failed to update Supabase:", e)

if __name__ == "__main__":
    download_and_optimize()
    update_sample_data()
    update_supabase()
