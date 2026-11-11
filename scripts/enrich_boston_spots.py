import urllib.request
import json
from datetime import datetime, timezone

SUPABASE_URL = "https://oaqzbymmhusbhvscfcrp.supabase.co"
SUPABASE_KEY = "sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp"

boston_enrichments = {
    "spot-1794431661351": {
        "name": "Beacon Hill Books & Cafe",
        "neighborhood": "Beacon Hill",
        "category": "books",
        "hours": "Tue-Sat 09:00 - 19:00, Sun 12:00 - 17:00",
        "notes": "Five-story Greek Revival brownstone transformed into an exquisite storybook bookshop with squirrel mascot Paige, fireplace reading nooks, and a subterranean garden café serving afternoon tea.",
        "photo_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431647101": {
        "name": "Boston Common",
        "neighborhood": "Beacon Hill / Downtown",
        "category": "parks_nature",
        "hours": "Daily 06:00 - 23:00",
        "notes": "America's oldest public park dating back to 1634. Sweeping elm-canopied lawns, Frog Pond, historic monuments, and the southern anchor of Boston's iconic Emerald Necklace.",
        "photo_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431638579": {
        "name": "Boston Public Garden",
        "neighborhood": "Back Bay / Beacon Hill",
        "category": "parks_nature",
        "hours": "Daily 06:00 - 23:00",
        "notes": "America's first public botanical garden (1837), famed for weeping willows framing the lagoon, historic Swan Boats, Victorian cast-iron suspension bridge, and the beloved bronze 'Make Way for Ducklings' statues.",
        "photo_url": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431672572": {
        "name": "Brattle Book Shop",
        "neighborhood": "Downtown Crossing",
        "category": "books",
        "hours": "Mon-Sat 09:00 - 17:30",
        "notes": "Legendary antiquarian bookstore operating since 1825. Features three floors of rare first editions and an open-air alleyway book lot lined with bargain bookshelves beneath literary murals.",
        "photo_url": "https://images.unsplash.com/photo-1507842229450-790075c32877?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431775944": {
        "name": "Commonwealth Ave Mall",
        "neighborhood": "Back Bay",
        "category": "parks_nature",
        "hours": "24/7",
        "notes": "Parisian-inspired grand promenade stretching through the heart of Back Bay, flanked by majestic French second-empire brownstones, manicured magnolia trees, and bronze historical monuments.",
        "photo_url": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431711227": {
        "name": "Commonwealth Books",
        "neighborhood": "Downtown Crossing",
        "category": "books",
        "hours": "Mon-Sat 10:00 - 18:00, Sun 11:00 - 17:00",
        "notes": "Hidden antiquarian gem tucked away on Boston's oldest historic pedestrian alleyway (Spring Lane). Packed with vintage leatherbound volumes, rare antique prints, and historic cartography.",
        "photo_url": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431605029": {
        "name": "Isabella Stewart Gardner Museum",
        "neighborhood": "Fenway-Kenmore",
        "category": "museums_art",
        "hours": "Wed-Mon 11:00 - 17:00 (Thu until 21:00, Tue Closed)",
        "notes": "Astonishing 15th-century Venetian palazzo constructed around a sunlit glass-roofed interior flowering courtyard, housing Gardner's world-class eclectic art collection and the evocative empty frames from the 1990 heist.",
        "photo_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431625581": {
        "name": "L.A. Burdick Chocolates",
        "neighborhood": "Back Bay",
        "category": "pastry_bakery",
        "hours": "Daily 08:00 - 20:00",
        "notes": "Classic European-style tearoom and artisan chocolatier celebrated for rich drinking chocolate, handmade chocolate mice, French pastries, and an intimate Parisian salon atmosphere on Clarendon Street.",
        "photo_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431594188": {
        "name": "Museum of Fine Arts",
        "neighborhood": "Fenway-Kenmore",
        "category": "museums_art",
        "hours": "Thu-Mon 10:00 - 17:00, Tue-Wed Closed",
        "notes": "World-renowned encyclopedic institution housing one of the greatest global collections of French Impressionism, ancient Egyptian treasures, classical Japanese arts, and contemporary American masterworks.",
        "photo_url": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80"
    },
    "spot-1794431695958": {
        "name": "Tatte Bakery & Cafe",
        "neighborhood": "Beacon Hill",
        "category": "pastry_bakery",
        "hours": "Daily 07:00 - 20:00",
        "notes": "Charming Beacon Hill corner bakery with signature subway tile aesthetic, flaky morning buns, pistachio croissants, shakshuka, and exceptional espresso drinks.",
        "photo_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
    }
}

def enrich():
    now_iso = datetime.now(timezone.utc).isoformat()
    success = 0
    for spot_id, data in boston_enrichments.items():
        payload = {
            "neighborhood": data["neighborhood"],
            "category": data["category"],
            "hours": data["hours"],
            "notes": data["notes"],
            "photo_url": data["photo_url"],
            "updated_at": now_iso
        }
        url = f"{SUPABASE_URL}/rest/v1/spots?id=eq.{spot_id}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
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
                if resp.status in (200, 204):
                    print(f"✓ Enriched {data['name']}")
                    success += 1
                else:
                    print(f"✗ Failed {data['name']}: {resp.status}")
        except Exception as e:
            print(f"✗ Error {data['name']}: {e}")

    print(f"\nDone: {success}/{len(boston_enrichments)} Boston spots enriched.")

if __name__ == "__main__":
    enrich()
