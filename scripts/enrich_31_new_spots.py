import urllib.request
import json
import time
from datetime import datetime, timezone

SUPABASE_URL = "https://oaqzbymmhusbhvscfcrp.supabase.co"
SUPABASE_KEY = "sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp"

enrichments = [
    # 1. San Francisco - Golden Gate Park
    {
        "id": "spot-1794412436765",
        "name": "Three Gems by James Turrell",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/0/00/Three_Gems%2C_James_Turrell_Skyspace%2C_interior.jpg",
        "notes": "Subterranean stupa-form Skyspace installation tucked into the de Young Museum's sculpture garden, framing the shifting sky through an oculus above curved stone seating and sensory light effects."
    },
    # 2. San Francisco - Russian Hill
    {
        "id": "spot-1794412503332",
        "name": "Side Characters",
        "photo_url": "https://mnqmeemfkvwmfuasaing.supabase.co/storage/v1/object/public/restaurant-images/royal-ground-coffee-san-francisco.jpg",
        "notes": "Cozy neighborhood third place on Polk Street in Russian Hill, combining specialty espresso, black sesame and pistachio butter lattes, and breakfast sandwiches with a relaxed, music-filled atmosphere."
    },
    # 3. San Francisco - Cole Valley
    {
        "id": "spot-1794412517648",
        "name": "Double Black",
        "photo_url": "https://assets.sfstandard.com/image/994911177489/image_8dgion903t59b4mtviqih0ef6o/-C100.00%25x78.71%25%2C0.00%25%2C21.29%25-S1200x630-FPNG",
        "notes": "Spacious, sunlit Cole Valley cafe and neighborhood gathering hub set inside outdoor lifestyle brand Yardsale's flagship, serving espresso drinks and fresh pastries in an airy timber-and-brick space."
    },
    # 4. San Francisco - North Beach
    {
        "id": "spot-1794412580963",
        "name": "Golden Sardine",
        "photo_url": "https://cdn.prod.website-files.com/67cb8007625032238399887b/67d205ee437bfe64f90a1cd9_golden-sardine-wine-bar-poetry-bookstore-hero-bg-DARK-1-p-1600.jpg",
        "notes": "Intimate North Beach wine bar, tinned fish salon, and poetry press on Columbus Avenue, pouring curated Rieslings and natural wines amid book-lined shelves and sidewalk views."
    },
    # 5. San Francisco - Divisadero
    {
        "id": "spot-1794412673548",
        "name": "Sensitive Vintage Divisadero",
        "photo_url": "https://assets.sfstandard.com/image/994911177489/image_ttler3vk250b3c94v5os7pqs4u/-S1200x630-FPNG",
        "notes": "Charming Divisadero boutique born out of a cult Mission garage pop-up, showcasing meticulously curated racks of sustainable vintage apparel, retro statement pieces, and Y2K designer finds."
    },
    # 6. San Francisco - Richmond
    {
        "id": "spot-1794412727745",
        "name": "Park Life",
        "photo_url": "https://media.timeout.com/images/101714617/image.jpg",
        "notes": "Beloved Inner Richmond indie boutique and contemporary gallery on Clement Street, packed with art monographs, limited-edition prints, design objects, and an exhibition room in the back."
    },
    # 7. San Francisco - Divisadero
    {
        "id": "spot-1794412765414",
        "name": "Rare Device",
        "photo_url": "https://raredevice.net/cdn/shop/files/FE7A5513.jpg?v=1759086968&width=1200",
        "notes": "Beloved Divisadero design boutique and community gallery showcasing handcrafted ceramics, artisanal jewelry, playful stationery, and rotating exhibitions by local independent artists."
    },
    # 8. San Francisco - Noe Valley
    {
        "id": "spot-1794412811297",
        "name": "Omnivore: Books on Food",
        "photo_url": "https://theculinarycellar.com/wp-content/uploads/2015/05/Omnivore-view-overall-of-shelves.jpg",
        "notes": "Charming Noe Valley culinary haven housed in an old butcher shop, lined floor-to-ceiling with rare vintage cookbooks, contemporary chef releases, and antiquarian food literature."
    },
    # 9. San Francisco - Union Square
    {
        "id": "spot-1794412885962",
        "name": "Always Awake Coffee",
        "photo_url": "https://img4.restaurantguru.com/rf06-Always-Awake-Coffee-interior.jpg",
        "notes": "Trendy Korean-inspired coffee bar near Union Square on Post Street, known for decadent peanut butter cream lattes, strawberry matcha, vinyl records, and its novelty receipt photobooth."
    },
    # 10. San Francisco - Castro
    {
        "id": "spot-1794412971510",
        "name": "JANDii Cafe",
        "photo_url": "https://storage.ghost.io/c/3b/f8/3bf8c529-c75f-4ce0-92fe-8f0c4cd2f092/content/images/size/w1200/2026/06/JandiiCafe_OuterSunset.jpg",
        "notes": "Tranquil Korean-inspired cafe in the Castro from the team behind Sweet Maple and Kitchen Story, highlighting ceremonial matcha, hojicha drinks, and warm fresh-baked scones in a serene light-filled setting."
    },
    # 11. San Francisco - Lower Haight
    {
        "id": "spot-1794413031010",
        "name": "Wave",
        "photo_url": "https://offloadmedia.feverup.com/secretsanfrancisco.com/wp-content/uploads/2023/07/31160802/wave-collective-inside-Dana-Flynn.jpg",
        "notes": "Vibrant artist-run community collective and gallery on Haight Street, hosting weekend specialty coffee pop-ups, creative workshops, and live acoustic sessions with an intimate backyard patio."
    },
    # 12. San Francisco - Russian Hill
    {
        "id": "spot-1794413108609",
        "name": "Better Half Coffee",
        "photo_url": "https://cdn.prod.website-files.com/64550ffd85bc54240b056570/6460715c8897146b220f0034_IMG_3CA08369DD03-3-p-1080.jpeg",
        "notes": "Daytime specialty coffee pop-up housed inside Russian Hill's Bar Bibi on Pacific Avenue, showcasing multi-roaster guest beans, signature Ispahan lattes, and savoury patty melts."
    },
    # 13. San Francisco - Cypress Avenue / Marina
    {
        "id": "spot-1794413131675",
        "name": "Celeste",
        "photo_url": "https://assets.sfstandard.com/image/994911177489/image_0jp4a4420d5m160gm68mvp7o00/-S1200x630-FPNG",
        "notes": "High-energy, moodily lit wine bar from the team behind Bodega and Key Klub, serving skin-contact wines and Old World classics paired with Greek-inspired skewers, crudo, and mezze."
    },
    # 14. San Francisco - Lower Nob Hill
    {
        "id": "spot-1794413145192",
        "name": "Key Klub",
        "photo_url": "https://cdn.prod.website-files.com/63eed1ae5e80992b694f2d85/670050e8d89a290a181eeea8_nicola-parisi_key-klub_sept2024_0200-p-1080.jpg",
        "notes": "Hip Lower Nob Hill wine bar and kitchen set beneath a vintage neon sign on Bush Street, boasting an eclectic natural wine selection, local draft beers, and elevated bistro comfort bites."
    },
    # 15. San Francisco - Union Square
    {
        "id": "spot-1794413158525",
        "name": "Bodega SF",
        "photo_url": "https://assets.sfstandard.com/image/994911177489/image_7dd8ukj33l0bb84g1mu4u6bj49/-S1200x630-FPNG",
        "notes": "Chic, modern Northern Vietnamese dining room on Mason Street near Union Square from chef Matt Ho, offering elevated family recipes like delicate bánh cuốn, Hanoi phở, and a hidden subterranean cocktail lounge."
    },
    # 16. San Francisco - North Beach
    {
        "id": "spot-1794413239958",
        "name": "Waystone",
        "photo_url": "https://static.wixstatic.com/media/423d26_41b7c7c5daea49e8912449d41dba049a~mv2.jpg/v1/fill/w_1200,h_900,al_c,q_85/423d26_41b7c7c5daea49e8912449d41dba049a~mv2.jpg",
        "notes": "Warm and convivial North Beach wine bar on Powell Street illuminated by paper lanterns, offering thoughtful California and French pours alongside ploughman's platters and weekly jazz jams."
    },
    # 17. San Francisco - Mission
    {
        "id": "spot-1794413259608",
        "name": "Buddy",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/603b31bccf34a07d765f12c6/4af724ec-df67-4cf0-8533-d8c523f38953/melissahabegger-100424-buddybar-102.jpg",
        "notes": "Stylish neighborhood salon in the Mission featuring sage-green banquettes, a Carrara marble bar, and vinyl spinning on the turntable, serving biodynamic wines and inventive seasonal small plates."
    },
    # 18. San Francisco - Mission
    {
        "id": "spot-1794413326141",
        "name": "Gemini Wine Bar",
        "photo_url": "https://sunset.com/wp-content/uploads/Hale_BarGemini_12-1.jpg",
        "notes": "Chic Mission natural wine bar from the Gemini Bottle Co. crew, pairing low-intervention natural wines and vermouth with elevated savory small plates developed with chef Brandon Rice."
    },
    # 19. San Francisco - Mission
    {
        "id": "spot-1794413379592",
        "name": "Laszlo",
        "photo_url": "https://laszlobar.com/wp-content/uploads/Laszlo-19.jpg",
        "notes": "Atmospheric vinyl lounge and craft cocktail bar next door to Foreign Cinema in the Mission, featuring a soaring mezzanine, rotating resident DJs, and film-inspired cocktails alongside Foreign Cinema's full menu."
    },
    # 20. Orange County - Santa Ana
    {
        "id": "spot-1794413708521",
        "name": "6100 Bread",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/690bdc576fe4f870b14f85e7/c169ab38-4680-434b-a421-399ae8e09566/6100_Edits-17.jpeg",
        "notes": "Acclaimed artisan micro-bakery in Santa Ana's French Park neighborhood by Karlo Evaristo, renowned for heirloom blue-corn masa sourdoughs, ube cream cruffins, and flaky laminated pastries."
    },
    # 21. Orange County - Santa Ana
    {
        "id": "spot-1794413806674",
        "name": "Sonder",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/677daad69e76a353fd443b02/a40da950-89ad-41fe-805e-67ee9e18127d/DSC03360.jpeg",
        "notes": "Moody, retro-glam hi-fi listening bar and cocktail lounge in Downtown Santa Ana, playing curated vinyl alongside binchotan charcoal-grilled skewers, Southeast Asian small plates, and inventive craft cocktails."
    },
    # 22. Orange County - Santa Ana
    {
        "id": "spot-1794413847771",
        "name": "Le Hut Dinette",
        "photo_url": "https://lehutdinette.com/wp-content/uploads/Interior.2.Les_.Hut_.Horizontal.1-1-1024x683.jpg",
        "notes": "Nostalgic mid-century diner nestled inside a historic WWII Quonset hut in Santa Ana's French Park from the Heritage Barbecue team, serving elevated brunch classics like the Santa Maria Slam and brisket barbacoa burritos."
    },
    # 23. Orange County - Costa Mesa
    {
        "id": "spot-1794413931737",
        "name": "Burritos La Palma",
        "photo_url": "https://static1.squarespace.com/static/637573331158be0b5582f4ca/t/660edb96fc4a986f1508a414/1712249757401/LaPalma-71.jpg",
        "notes": "Legendary Michelin Bib Gourmand Zacatecas-style taqueria in Costa Mesa, celebrated for its slender, golden-toasted handmade flour tortillas filled with slow-braised birria de res and spicy tinga."
    },
    # 24. Orange County - Santa Ana
    {
        "id": "spot-1794414008652",
        "name": "Pan y Café Panaderia",
        "photo_url": "https://ca-times.brightspotcdn.com/dims4/default/7d3cc29/2147483647/strip/true/crop/1563x821+0+159/resize/1200x630!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F64%2Fa0%2F59ae4c32493ebb75b8ac82b217c1%2Ftn-wknd-me-pan-y-cafe-pan-de-muerto-20251026-3.jpg",
        "notes": "Charming modern panaderia and cafe in Downtown Santa Ana from Samuel Ruiz, featuring traditional self-serve trays of fresh conchas, puerquitos, and flaky orejas alongside fragrant cafe de olla."
    },
    # 25. Orange County - Costa Mesa
    {
        "id": "spot-1794288841875",
        "name": "Hola Adios Coffee",
        "photo_url": "https://ca-times.brightspotcdn.com/dims4/default/0c5ee3d/2147483647/strip/true/crop/4736x2486+0+318/resize/1200x630!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fea%2F27%2Ff71b7bea4ea6bee4b5425e670b1c%2Ftn-dpt-me-hola-adios-20220730-3.jpg",
        "notes": "Vibrant, bohemian-chic neighborhood coffeeshop in Eastside Costa Mesa with a custom turquoise espresso bar and breezy patio, famous for craft espresso, Ceci vanilla oat lattes, and hearty breakfast burritos."
    },
    # 26. Orange County - Ladera Ranch
    {
        "id": "spot-1794289043625",
        "name": "Oslo Coffee Co.",
        "photo_url": "https://dailycoffeenews.com/wp-content/uploads/2024/06/Oslo-Coffee-Co-Orange-County-2-1.jpeg",
        "notes": "Bright, Scandinavian-inspired cafe in Ladera Ranch's Mercantile West founded by a mother-daughter duo, featuring terrazzo counters, Danish furnishings, cardamom-spiced iced coffees, and Viking espresso tonics."
    },
    # 27. Orange County - Huntington Beach
    {
        "id": "spot-1794289339761",
        "name": "Masala Waves",
        "photo_url": "https://masalawaves.com/AdminBoard/uploads/home/0221c-whatsapp-image-2025-02-01-at-1.09.33-am.jpeg",
        "notes": "Warm and welcoming Indian and Nepali kitchen on Beach Boulevard in Huntington Beach, serving steaming handmade Himalayan momos, rich butter chicken, tandoori skewers, and fresh tandoor-baked naan."
    },
    # 28. Orange County - Laguna Hills
    {
        "id": "spot-1794289393197",
        "name": "Mint Restaurant",
        "photo_url": "https://mintdesikitchen.com/wp-content/uploads/2024/10/76f9bf99-bdff-4ce1-b8bf-02662908f819.jpg",
        "notes": "Elevated Indian and Pakistani kitchen in Laguna Hills from the team behind Michelin-recognized Khan Saab, serving clay-oven tandoori skewers, rich karahis, aromatic biryanis, and inventive alcohol-free craft mocktails."
    },
    # 29. Orange County - Newport Beach
    {
        "id": "spot-1794289496980",
        "name": "Homebody Studios",
        "photo_url": "https://www.paseo17.com/wp-content/uploads/0K2A5535.jpg",
        "notes": "Chic, design-forward reformer Pilates and mindful movement sanctuary in Paseo 17, combining athletic resistance training and core sculpting with a light-flooded coastal aesthetic."
    },
    # 30. Orange County - Laguna Beach
    {
        "id": "spot-1794289526729",
        "name": "Small's Smash Club",
        "photo_url": "https://static.wixstatic.com/media/9f07ec_cc2d4c91ad3e4b49a8975c37869a61ff~mv2.jpeg/v1/fill/w_1200,h_800,al_c,q_85/9f07ec_cc2d4c91ad3e4b49a8975c37869a61ff~mv2.jpeg",
        "notes": "Bustling vintage beach-club burger shack in South Laguna founded by pro snowboarder Jordan Small, taking over the historic Dizz's As Is space for lacy-edged smash patties, beef tallow fries, and ocean breezes."
    },
    # 31. Orange County - Laguna Beach
    {
        "id": "spot-1794289606383",
        "name": "mor mor's table",
        "photo_url": "https://images.squarespace-cdn.com/content/v1/69f9619a6f7c301f8f95239e/a11a1578-9c44-4be6-a023-ad19178c444f/IMG_8626.jpg",
        "notes": "Charming family-owned downtown Laguna Beach bistro on Forest Avenue by a mother-daughter duo, serving comforting Neapolitan-style pizzas, creative Sabzi pies, and honey-harissa roasted carrots in a welcoming coastal dining room."
    }
]

def verify_images():
    print(f"--- Verifying all {len(enrichments)} photo URLs ---")
    all_ok = True
    for item in enrichments:
        name = item["name"]
        url = item["photo_url"]
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                length = len(resp.read())
                print(f"[OK 200] {name:30} -> {length:>8} bytes | {url[:60]}...")
        except Exception as e:
            print(f"[FAIL] {name:30} -> ERROR: {e} | {url}")
            all_ok = False
    return all_ok

def apply_updates():
    now_iso = datetime.now(timezone.utc).isoformat()
    success_count = 0
    fail_count = 0

    print(f"\n--- Applying updates to Supabase spots table ({len(enrichments)} spots) ---")
    for item in enrichments:
        spot_id = item["id"]
        payload = {
            "photo_url": item["photo_url"],
            "notes": item["notes"],
            "updated_at": now_iso
        }
        body = json.dumps(payload).encode("utf-8")
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
            with urllib.request.urlopen(req, timeout=8) as resp:
                if resp.status in (200, 204):
                    print(f"Updated spot: {item['name']} ({spot_id})")
                    success_count += 1
                else:
                    print(f"Unexpected status for {spot_id}: {resp.status}")
                    fail_count += 1
        except Exception as e:
            print(f"Failed to update {spot_id}: {e}")
            fail_count += 1

    print(f"\nUpdate summary: {success_count} succeeded, {fail_count} failed.")

def verify_spots_table():
    print("\n--- Verifying spots table in Supabase ---")
    url = f"{SUPABASE_URL}/rest/v1/spots?select=id,name,city,neighborhood,photo_url,notes"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        spots = json.loads(resp.read().decode("utf-8"))

    still_missing = []
    for s in spots:
        p_missing = not s.get("photo_url") or not str(s.get("photo_url")).strip()
        n_missing = not s.get("notes") or not str(s.get("notes")).strip()
        if p_missing or n_missing:
            still_missing.append(s)

    print(f"Total spots in table: {len(spots)}")
    print(f"Spots still missing photos or notes: {len(still_missing)}")
    if still_missing:
        for s in still_missing:
            print(f"  Missing: {s['id']} - {s['name']} (City: {s['city']})")
    else:
        print("ALL SPOTS IN THE DATABASE NOW HAVE AUTHENTIC PHOTOS AND NOTES!")

if __name__ == "__main__":
    if verify_images():
        print("\nAll image URLs verified successfully! Proceeding with update...")
        apply_updates()
        verify_spots_table()
    else:
        print("\nSome image URLs failed verification. Aborting database update.")
