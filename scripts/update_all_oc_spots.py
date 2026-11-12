import urllib.request
import json
import ssl
from datetime import datetime, timezone

# 10 Improved Spots + 19 Newly Enriched Spots = 29 Spots in Orange County
spots_payload = [
    # --- 10 IMPROVED SPOTS (fixing user critiques) ---
    {
        "id": "spot-1794257886904",
        "name": "Balboa Island Ferry",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "surf_movement",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/0/08/Balboa_Island_Ferry_Boat.jpg",
        "notes": "Charming historic continuous ferry route operating three wooden-deck vessels across Newport Harbor between the Balboa Peninsula and Balboa Island since 1919.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794257047767",
        "name": "C'est Si Bon Bakery",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "pastry_bakery",
        "photo_url": "https://visitnewportbeach.com/wp-content/uploads/2018/04/cest-si-bonSlide-700x400.jpg",
        "notes": "Beloved Parisian-style neighborhood boulangerie and cafe operating since 1979, legendary for warm crusty baguettes, fresh turkey & brie sandwiches, flaky croissants, and imported French cheeses.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794252590723",
        "name": "Crystal Cove Shake Shack",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "food_dining",
        "photo_url": "https://static.wixstatic.com/media/b65c51_6ec7d52e379540eb8d785210dbe2d8da~mv2.jpg/v1/fill/w_1024,h_768,al_c,q_85/b65c51_6ec7d52e379540eb8d785210dbe2d8da~mv2.jpg",
        "notes": "Legendary 1940s clifftop roadside burger shack on Coast Highway, serving thick date shakes, crinkle-cut fries, and burgers with sweeping ocean views high above Crystal Cove State Beach.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794259806306",
        "name": "Escape Pilates",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "surf_movement",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/62b7e6d4cef97862d623a8ff/7cadda92-4ac3-4445-8d2b-21c350594cdb/Escapepilates-59.jpg?format=1000w",
        "notes": "Boutique classical and contemporary reformer Pilates studio focusing on precision alignment, low-impact athletic conditioning, and mindful core strength in a serene light-filled setting.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794252570067",
        "name": "Newport Beach Public Library",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "books",
        "photo_url": "https://www.bcj.com/wp-content/uploads/2016/12/Newport_NLehoux_Main.jpg",
        "notes": "Award-winning civic centerpiece designed by Bohlin Cywinski Jackson / Renzo Zecchetto, boasting light-flooded multi-story reading pavilions, civic sculpture gardens, and extensive literary collections near Newport Center.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794269912565",
        "name": "Roger's Gardens",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "parks_nature",
        "photo_url": "https://farmhouse.rogersgardens.com/wp-content/uploads/2016/04/Restaurant12.jpg",
        "notes": "Idyllic 7-acre horticultural destination and landmark outdoor nursery in Corona del Mar featuring lush landscaped gardens, creative home curation, seasonal botanicals, and the farm-to-table Farmhouse restaurant.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794257959886",
        "name": "Ruby's Diner",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "food_dining",
        "photo_url": "https://upload.wikimedia.org/wikipedia/en/7/70/Rubys1.jpg",
        "notes": "The original 1982 retro 1940s-style diner perched at the very tip of the historic Balboa Pier, iconic for ocean-breeze milkshakes, burgers, and 360-degree Pacific panorama views over the water.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794259854502",
        "name": "Semi Tropic Wines",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "food_wine",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/6998ec36453c476cc82b0319/da3f408c-4490-4446-99c8-841bc9df41d3/81382AEB-325C-4711-8DFC-55DBEF7BD936+2.JPG?format=1000w",
        "notes": "Curated natural and low-intervention bottle shop and relaxed tasting lounge spotlighting small-producer biodynamic vignerons, artisanal ciders, tinned fish, and pet-nats in a sunlit Westside space.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794284291060",
        "name": "South Coast Plaza",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "shops_retail",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/b/be/Southcoastpl-bridgeofgardens.jpg",
        "notes": "Premier luxury shopping destination renowned worldwide, featuring iconic fashion houses, Peter Walker's Bridge of Gardens landscape, and Isamu Noguchi's California Scenario sculpture garden next door.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794269959353",
        "name": "The Ecology Center",
        "city": "Orange County",
        "neighborhood": "San Juan Capistrano",
        "category": "shops_retail",
        "photo_url": "https://theecologycenter.org/wp-content/uploads/2021/01/2020.10.14.q4.katreynolds.tec-304795_websize-1024x683.jpg",
        "notes": "Non-profit 28-acre certified organic regenerative farm and community education eco-hub founded by Evan Marks, featuring a seasonal farmstand market, culinary workshops, and communal harvest dinners.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },

    # --- 19 NEWLY ENRICHED SPOTS ---
    {
        "id": "spot-1794286430071",
        "name": "Crystal Cove Historic District",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "museums_art",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Crystal_Cove_cottages.jpg",
        "notes": "Historic coastal preservation district of 46 rustic 1920s-1930s seaside cottages perched on the bluffs and sandy shores of Crystal Cove State Park, capturing early 20th-century California coastal heritage.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794286051779",
        "name": "Doheny State Beach",
        "city": "Orange County",
        "neighborhood": "Dana Point",
        "category": "surf_movement",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/9/96/Doheny_Beach_surfers.jpg",
        "notes": "California's first state beach and legendary surf haven immortalized by The Beach Boys, known for gentle rolling waves ideal for longboarding, beachfront campgrounds, and coastal tidepools.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794285628671",
        "name": "Anaheim Packing House",
        "city": "Orange County",
        "neighborhood": "Anaheim",
        "category": "food_dining",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/5/57/Anaheim_Packing_House_interior_-_December_2019.jpg",
        "notes": "Vibrant two-story food hall housed inside a restored 1919 Mission Revival citrus packing facility, featuring sunlit central atriums, live jazz, and diverse artisanal food vendors spanning Vietnamese street food to craft gelato.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794285179413",
        "name": "Nobu",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "food_dining",
        "photo_url": "https://media.opulist.app/venues/nobu-newport-beach/0.webp",
        "notes": "Glamorous waterfront Japanese fine dining destination on the Lido Marina boardwalk, renowned for Chef Nobu Matsuhisa's black cod miso, yellowtail jalapeño, and panoramic harbor patio seating.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794284665903",
        "name": "Kit Coffee",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "matcha_coffee",
        "photo_url": "https://media.opulist.app/venues/kit-coffee-newport-beach/0.webp",
        "notes": "Bright, design-forward specialty coffee shop and brunch destination on Westcliff Drive, renowned for house-baked sourdough toast, matcha lattes, and relaxed community atmosphere.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794284774001",
        "name": "Sidecar Doughnuts & Coffee",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "pastry_bakery",
        "photo_url": "https://sidecardoughnuts.com/wp-content/uploads/2020/07/Preparation-117-1500x1000.jpg",
        "notes": "Original flagship bakery on 17th Street famous for craft artisanal doughnuts fried fresh every hour, signature Huckleberry and Butter & Salt flavors, and precision espresso.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794286039679",
        "name": "Blackie's",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "surf_movement",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Surfer_Newport_Beach_California.jpg",
        "notes": "Legendary Newport Beach surf break stretching between Newport Pier and the 28th Street jetty, renowned for morning longboarding sessions and the iconic 1953 beachfront dive bar Blackie's By the Sea on the boardwalk.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794286000946",
        "name": "Boil & Bake",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "food_dining",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/624646e8cfaa392a71f7b1aa/f0c2a9f4-2dbd-42a9-ba10-b8c2b4f3465e/IMG_9397.jpg",
        "notes": "Artisanal bakery and cafe on Baker Street specializing in 72-hour naturally leavened sourdough bagels, house-cured salmon lox, open-faced bagel sandwiches, and local seasonal toppings.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794285580770",
        "name": "Mercado Gonzàlez Northgate Market",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "food_dining",
        "photo_url": "https://northgatemarket.com/wp-content/uploads/2023/11/DSC00831-1024x683.jpg",
        "notes": "Immersive 70,000-square-foot Mexican cultural marketplace and food hall featuring over 20 regional puestos (street tacos, birria, churros from Mexico City's El Moro), fresh tortillería, and carnicería.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794285504719",
        "name": "Alta Coffee",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "matcha_coffee",
        "photo_url": "https://static1.squarespace.com/static/56bce0b53c44d80c6246db89/t/570143a1c2ea5187753bc107/1459700647648/Alta+Front.jpg",
        "notes": "Historic bohemian coffee house and cafe operating since 1985 in Cannery Village, beloved for cinnamon-dusted honey lattes, fresh scones, and intimate courtyard patio seating.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794285321348",
        "name": "Milligram Coffee and Kitchen",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "food_dining",
        "photo_url": "https://media.opulist.app/venues/milligram-coffee-kitchen/0.jpg",
        "notes": "Modern, sun-drenched cafe and specialty coffee bar at Paseo 17 on East 17th Street, known for clean architectural aesthetics, specialty espresso, breakfast burritos, and seasonal toast.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794285261497",
        "name": "Sapori Ristorante",
        "city": "Orange County",
        "neighborhood": "Newport Beach",
        "category": "food_dining",
        "photo_url": "https://static.spotapps.co/website_images/ab_websites/16687_website/order_new.jpg",
        "notes": "Long-standing authentic Italian trattoria and pizzeria in Bayside Shopping Center, celebrated for homemade pastas, veal scaloppine, wood-fired pizzas, and warm Mediterranean ambiance.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794285242915",
        "name": "MADE Coffee",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "matcha_coffee",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/6786c37cd266ba12cb561119/1736885128368-ANSEV0P1VI2UPWLZVPW5/DSC07108.jpg",
        "notes": "Industrial-chic specialty coffee shop on Baker Street renowned for cold brew on tap, signature dirty horchata lattes, pistachio cold foam matcha, and modern espresso drinks.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794285070410",
        "name": "Bandera",
        "city": "Orange County",
        "neighborhood": "Corona del Mar",
        "category": "food_dining",
        "photo_url": "https://visitnewportbeach.com/wp-content/uploads/2018/04/10480110_669409639813023_7482833170217154136_o-700x400.jpg",
        "notes": "Iconic Hillstone destination in Corona del Mar famed for its open hardwood rotisserie chicken turning over wood flames, skillet cornbread with green chiles, ribs, and lively bar.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794284922376",
        "name": "Jasper Coffee",
        "city": "Orange County",
        "neighborhood": "Balboa Island",
        "category": "matcha_coffee",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/685d7a968f3e84759eced623/e606ee28-6275-4f25-b82d-03b911677e46/Screenshot+2025-07-09+at+3.39.49%E2%80%AFPM.png",
        "notes": "Charming independent specialty cafe tucked into Marine Avenue on Balboa Island, serving single-origin matcha, artisanal espresso, house-made syrups, and sunny patio seating.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794284842722",
        "name": "Harper Barbecue",
        "city": "Orange County",
        "neighborhood": "Costa Mesa",
        "category": "food_dining",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/5fd9307f0e1ad753c0e92900/7a47524e-706c-479b-808c-f97aa275aa42/DSCF4579.jpg",
        "notes": "Acclaimed Central Texas-style craft barbecue joint by pitmaster Drew Harper, revered for melt-in-your-mouth prime smoked brisket, spare ribs, and house-made sausages fresh from offset wood smokers.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794287591196",
        "name": "Phở 79",
        "city": "Orange County",
        "neighborhood": "Garden Grove",
        "category": "food_dining",
        "photo_url": "https://prod-pics.guide.michelin.com/api/public/content/f5a7de7192344c158245d47a554a89c5.jpg",
        "notes": "James Beard America's Classics award-winner and Michelin Bib Gourmand landmark in Little Saigon, celebrated since 1982 for legendary slow-simmered oxtail pho and aromatic beef noodle soups.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794287662631",
        "name": "Brodard Restaurant",
        "city": "Orange County",
        "neighborhood": "Fountain Valley",
        "category": "food_dining",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Brodard_-_Nem_nuong_cuon_and_chao_tom_cuon.jpg",
        "notes": "World-renowned Little Saigon institution legendary for its crispy grilled pork spring rolls (Nem Nướng Cuốn) served with warm secret family recipe orange dipping sauce.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794287977152",
        "name": "Rề Cà Phê",
        "city": "Orange County",
        "neighborhood": "Fountain Valley",
        "category": "matcha_coffee",
        "photo_url": "https://recaphe.com/uploads/b/186c8afa9ca9ba1a7ba73a069dbffda02fc8fa0405281960b0246c04ff08c358/VISA-132_1732132294.jpg",
        "notes": "Design-forward specialty Vietnamese coffee house featuring brushed concrete minimalist interiors, traditional Phin-drip brews, creamy egg coffee, and salted foam lattes.",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

if __name__ == '__main__':
    print(f"Upserting {len(spots_payload)} Orange County spots to Supabase...")

    # Upsert to Supabase
    req = urllib.request.Request(
        'https://oaqzbymmhusbhvscfcrp.supabase.co/rest/v1/spots',
        data=json.dumps(spots_payload).encode('utf-8'),
        headers={
            'apikey': 'sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp',
            'Authorization': 'Bearer sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp',
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        },
        method='POST'
    )

    with urllib.request.urlopen(req) as resp:
        print(f"Supabase upsert status: {resp.status} (OK)")

    print("\nVerifying all 29 spots in Supabase...")
    check_req = urllib.request.Request(
        'https://oaqzbymmhusbhvscfcrp.supabase.co/rest/v1/spots?city=eq.Orange%20County&select=id,name,neighborhood,photo_url,notes',
        headers={
            'apikey': 'sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp',
            'Authorization': 'Bearer sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp'
        }
    )
    with urllib.request.urlopen(check_req) as resp:
        oc_spots = json.loads(resp.read().decode())
        oc_map = {s['id']: s for s in oc_spots}
        missing = [s for s in oc_spots if not s.get('photo_url') or not s.get('notes')]
        print(f"Total OC spots in Supabase: {len(oc_spots)}")
        print(f"Total still missing photo or notes: {len(missing)}")
        if missing:
            for m in missing:
                print(f"  MISSING: {m['name']} ({m['id']})")
        else:
            print("ALL Orange County spots now have verified photos and field notes!")
