import urllib.request
import json
from datetime import datetime, timezone

SUPABASE_URL = "https://oaqzbymmhusbhvscfcrp.supabase.co"
SUPABASE_KEY = "sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp"

NEW_CITIES = [
    "Banff",
    "Grand Canyon",
    "Marin",
    "Monterey",
    "Ojai",
    "Palm Springs",
    "Sedona",
    "South Bay Area"
]

NEW_SPOTS = [
    # 1. Santa Fe: Taos
    {
        "id": "spot-santa-fe-taos",
        "name": "Taos (Historic Plaza & Taos Pueblo)",
        "city": "Santa Fe",
        "neighborhood": "Taos / Northern New Mexico",
        "category": "museums_art",
        "status": "visited",
        "favorite": True,
        "lat": 36.4389,
        "lng": -105.5458,
        "hours": "Thu - Mon 09:00 - 16:00",
        "notes": "Storied multi-storied adobe pueblo and historic artist colony north of Santa Fe. Continuously inhabited for over a millennium, showcasing vibrant indigenous craft, adobe galleries, and dramatic Sangre de Cristo mountain vistas.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 2. Santa Fe: La Boca
    {
        "id": "spot-santa-fe-la-boca",
        "name": "La Boca",
        "city": "Santa Fe",
        "neighborhood": "Downtown / Historic Plaza",
        "category": "wine_small_plates",
        "status": "visited",
        "favorite": False,
        "lat": 35.6888,
        "lng": -105.9388,
        "hours": "Daily 17:00 - 21:00",
        "notes": "Intimate Spanish tapas and natural wine bar by Chef James Campbell Caruso, steps from Santa Fe Plaza. Celebrated for artisan Iberian cheeses, grilled octopus, jamón ibérico, and Spanish sherry flights.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 3. Sedona: Enchantment Resort
    {
        "id": "spot-sedona-enchantment-resort",
        "name": "Enchantment Resort",
        "city": "Sedona",
        "neighborhood": "Boynton Canyon",
        "category": "hotels_stays",
        "status": "visited",
        "favorite": True,
        "lat": 34.9125,
        "lng": -111.8542,
        "hours": "Open 24 hours",
        "notes": "Secluded luxury adobe sanctuary tucked into the dramatic red-rock amphitheater of Boynton Canyon. Home to the legendary Mii amo destination spa, scenic canyon trails, and starlit courtyard firepits.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 4. Palm Springs: La Quinta Resort & Club
    {
        "id": "spot-palm-springs-la-quinta-resort",
        "name": "La Quinta Resort & Club",
        "city": "Palm Springs",
        "neighborhood": "La Quinta / Coachella Valley",
        "category": "hotels_stays",
        "status": "visited",
        "favorite": True,
        "lat": 33.6931,
        "lng": -116.3106,
        "hours": "Open 24 hours",
        "notes": "Iconic 1926 Spanish hacienda resort framed by citrus groves and the Santa Rosa Mountains. Legendary Hollywood hideaway featuring 41 secluded pools, historic whitewashed casitas, and championship tennis courts.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 5. Palm Springs: Coachella Festival
    {
        "id": "spot-palm-springs-coachella-festival",
        "name": "Coachella Festival (Empire Polo Club)",
        "city": "Palm Springs",
        "neighborhood": "Empire Polo Club / Indio",
        "category": "theater_cinema",
        "status": "visited",
        "favorite": False,
        "lat": 33.6803,
        "lng": -116.2369,
        "hours": "Annual spring festival",
        "notes": "World-renowned music and arts festival staged across the immaculate polo fields of Indio, famous for monumental interactive sculptural installations, twilight palm-tree panoramas, and iconic global headline stages.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 6. Grand Canyon: Grand Canyon National Park (South Rim)
    {
        "id": "spot-grand-canyon-south-rim",
        "name": "Grand Canyon National Park (South Rim)",
        "city": "Grand Canyon",
        "neighborhood": "South Rim / Grand Canyon Village",
        "category": "parks_nature",
        "status": "visited",
        "favorite": True,
        "lat": 36.0544,
        "lng": -112.1401,
        "hours": "Open 24 hours",
        "notes": "Monumental geological wonder carved by the Colorado River across billions of years of strata. Dramatic overlooks from Mather Point and Rim Trail, with historic architecture by Mary Colter.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 7. Phoenix: Sugar Bowl
    {
        "id": "spot-phoenix-sugar-bowl",
        "name": "Sugar Bowl",
        "city": "Phoenix",
        "neighborhood": "Old Town Scottsdale",
        "category": "sweets_bakery",
        "status": "visited",
        "favorite": False,
        "lat": 33.4938,
        "lng": -111.9261,
        "hours": "Daily 11:00 - 21:00",
        "notes": "Beloved retro pink soda fountain and ice cream parlor operating in Old Town Scottsdale since 1958. Famed for classic banana splits, floats, sundaes, and nostalgia illustrated in Bil Keane's Family Circus comics.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 8. Quebec City: Fairmont Le Château Frontenac
    {
        "id": "spot-quebec-city-chateau-frontenac",
        "name": "Fairmont Le Château Frontenac",
        "city": "Quebec City",
        "neighborhood": "Old Quebec (Vieux-Québec)",
        "category": "hotels_stays",
        "status": "visited",
        "favorite": True,
        "lat": 46.8120,
        "lng": -71.2050,
        "hours": "Open 24 hours",
        "notes": "The world's most photographed grand railway hotel, soaring majestically over the St. Lawrence River from Cap Diamant. An iconic turreted castle anchoring the historic UNESCO walled citadel of Old Quebec.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 9. Banff: Fairmont Banff Springs
    {
        "id": "spot-banff-fairmont-banff-springs",
        "name": "Fairmont Banff Springs",
        "city": "Banff",
        "neighborhood": "Banff National Park / Spray Valley",
        "category": "hotels_stays",
        "status": "visited",
        "favorite": True,
        "lat": 51.1643,
        "lng": -115.5619,
        "hours": "Open 24 hours",
        "notes": "Known as the 'Castle in the Rockies', this grand 1888 Scottish Baronial railway hotel sits amidst pine forests and glacial peaks in Banff National Park, featuring panoramic mountain terraces and mineral thermal springs.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 10. Monterey: Monterey Bay Aquarium
    {
        "id": "spot-monterey-aquarium",
        "name": "Monterey Bay Aquarium",
        "city": "Monterey",
        "neighborhood": "Cannery Row",
        "category": "museums_art",
        "status": "visited",
        "favorite": True,
        "lat": 36.6181,
        "lng": -121.9015,
        "hours": "Daily 10:00 - 17:00",
        "notes": "Pioneering non-profit public oceanarium on historic Cannery Row, celebrated for its soaring 28-foot living kelp forest canopy, hypnotic jellyfish galleries, and open-ocean tuna and sea turtle exhibits.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 11. Ojai: Bart's Books
    {
        "id": "spot-ojai-barts-books",
        "name": "Bart's Books",
        "city": "Ojai",
        "neighborhood": "Downtown Ojai",
        "category": "books",
        "status": "visited",
        "favorite": True,
        "lat": 34.4481,
        "lng": -119.2514,
        "hours": "Tue - Sun 10:00 - 18:00",
        "notes": "The world's largest outdoor independent bookstore, founded in 1964. Sun-drenched open-air book stalls, tranquil grapefruit courtyard patios, and an iconic street-side honor-system coin drop.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 12. Ojai: Rory's Place
    {
        "id": "spot-ojai-rorys-place",
        "name": "Rory's Place",
        "city": "Ojai",
        "neighborhood": "Downtown Ojai",
        "category": "wine_small_plates",
        "status": "visited",
        "favorite": False,
        "lat": 34.4480,
        "lng": -119.2447,
        "hours": "Wed - Sun 17:00 - 21:30",
        "notes": "Lively sister-owned Ojai bistro and natural wine bar centered around a live-wood hearth. Spotlighting freshly shucked Pacific oysters, hyper-seasonal Ventura County produce, and low-intervention natural wines.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 13. South Bay Area: Zareen's
    {
        "id": "spot-south-bay-zareens-palo-alto",
        "name": "Zareen's",
        "city": "South Bay Area",
        "neighborhood": "Palo Alto / California Ave",
        "category": "food_dining",
        "status": "visited",
        "favorite": False,
        "lat": 37.4262,
        "lng": -122.1437,
        "hours": "Daily 11:00 - 21:00",
        "notes": "Michelin Bib Gourmand casual Pakistani and Indian kitchen on California Avenue. Renowned for succulent Gola kabab burgers, chicken tikka masala, garlic naan fresh from the tandoor, and complimentary cardamom chai.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 14. South Bay Area: Filoli Historic House & Garden
    {
        "id": "spot-south-bay-filoli-gardens",
        "name": "Filoli Historic House & Garden",
        "city": "South Bay Area",
        "neighborhood": "Woodside",
        "category": "parks_nature",
        "status": "visited",
        "favorite": True,
        "lat": 37.4704,
        "lng": -122.3108,
        "hours": "Daily 10:00 - 17:00",
        "notes": "Exquisite 654-acre historic country estate nestled along the Santa Cruz Mountains. Features 16 acres of formal English Renaissance gardens, century-old fruit orchards, and a Georgian Revival manor.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 15. South Bay Area: Half Moon Bay Books
    {
        "id": "spot-south-bay-half-moon-bay-books",
        "name": "Half Moon Bay Books",
        "city": "South Bay Area",
        "neighborhood": "Half Moon Bay / Main Street",
        "category": "books",
        "status": "visited",
        "favorite": False,
        "lat": 37.4647,
        "lng": -122.4287,
        "hours": "Daily 10:00 - 18:00",
        "notes": "Charming independent coastal bookshop on historic Main Street with well-curated fiction, nature writing, local Pacific maritime history, and cozy reading corners.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 16. South Bay Area: Mountain View Farmers Market
    {
        "id": "spot-south-bay-mountain-view-farmers-market",
        "name": "Mountain View Farmers Market",
        "city": "South Bay Area",
        "neighborhood": "Mountain View / Caltrain Station",
        "category": "shops_retail",
        "status": "visited",
        "favorite": False,
        "lat": 37.3942,
        "lng": -122.0766,
        "hours": "Sun 09:00 - 13:00",
        "notes": "One of Northern California's premier Sunday certified farmers markets at the Caltrain depot, featuring 80+ organic Central Valley farms, seasonal stone fruit, artisan bread, and fresh street food stalls.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 17. South Bay Area: Half Moon Bay State Beach
    {
        "id": "spot-south-bay-half-moon-bay-beach",
        "name": "Half Moon Bay State Beach",
        "city": "South Bay Area",
        "neighborhood": "Half Moon Bay",
        "category": "parks_nature",
        "status": "visited",
        "favorite": False,
        "lat": 37.4673,
        "lng": -122.4468,
        "hours": "Daily 08:00 - Sunset",
        "notes": "Sweeping four-mile crescent of Pacific sandy beach backed by dramatic coastal bluffs. Ideal for breezy shoreline walks, coastal birdwatching, and sunset strolls along the Coastside Trail.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 18. Marin: Marin Country Mart
    {
        "id": "spot-marin-country-mart",
        "name": "Marin Country Mart",
        "city": "Marin",
        "neighborhood": "Larkspur Landing",
        "category": "shops_retail",
        "status": "visited",
        "favorite": False,
        "lat": 37.9450,
        "lng": -122.5085,
        "hours": "Daily 10:00 - 18:00",
        "notes": "Chic open-air village square across from the Larkspur Ferry Terminal, featuring curated indie boutiques, farm-to-table organic eateries, Saturday farmers markets, and alfresco firepit seating.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 19. Marin: Mill Valley Library
    {
        "id": "spot-marin-mill-valley-library",
        "name": "Mill Valley Public Library",
        "city": "Marin",
        "neighborhood": "Mill Valley / Old Mill Park",
        "category": "books",
        "status": "visited",
        "favorite": True,
        "lat": 37.9064,
        "lng": -122.5516,
        "hours": "Mon - Thu 10:00 - 21:00, Fri - Sat 10:00 - 17:00",
        "notes": "Architectural marvel immersed in a tranquil redwood forest next to Old Mill Creek. Boasting high open-timber ceiling trusses, stone fireplaces, and soaring glass walls overlooking ancient redwoods.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    # 20. Marin: Marin Civic Center
    {
        "id": "spot-marin-civic-center",
        "name": "Marin County Civic Center",
        "city": "Marin",
        "neighborhood": "San Rafael",
        "category": "museums_art",
        "status": "visited",
        "favorite": True,
        "lat": 37.9977,
        "lng": -122.5312,
        "hours": "Mon - Fri 08:00 - 17:00",
        "notes": "Frank Lloyd Wright's last and largest commissioned masterwork, spanning across low rolling hills with sky-blue barrel-vaulted roofs, sculpted golden spires, circular archways, and a sunlit 80-foot rotunda.",
        "visit_date": "2026-11-10",
        "photo_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

def sync_cities():
    print("Syncing new cities to Supabase...")
    city_rows = [{"name": c} for c in NEW_CITIES]
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/field_guide_cities",
        data=json.dumps(city_rows).encode("utf-8"),
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
            print("Cities sync status:", resp.status)
    except Exception as e:
        print("Failed to sync cities:", e)

def sync_spots():
    print(f"Syncing {len(NEW_SPOTS)} spots to Supabase...")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/spots",
        data=json.dumps(NEW_SPOTS).encode("utf-8"),
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
            print("Spots sync status:", resp.status)
    except Exception as e:
        print("Failed to sync spots:", e)

if __name__ == "__main__":
    sync_cities()
    sync_spots()
