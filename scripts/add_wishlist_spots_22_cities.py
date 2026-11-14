import urllib.request
import json
import gzip
from datetime import datetime, timezone

SUPABASE_URL = "https://oaqzbymmhusbhvscfcrp.supabase.co"
SUPABASE_KEY = "sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp"

CITIES = [
    "Marrakesh",
    "Istanbul",
    "Granada",
    "Sevilla",
    "Madrid",
    "Biarritz",
    "Cordoba",
    "Salerno",
    "Monte Carlo",
    "Zurich",
    "Munich",
    "Berlin",
    "Geneva",
    "Austin",
    "Toronto",
    "Denver",
    "New Orleans",
    "Charleston",
    "Portland, Maine",
    "Oaxaca",
    "Osaka",
    "Seoul"
]

WISHLIST_SPOTS = [
    {
        "id": "spot-marrakesh-dar-el-bacha",
        "name": "Bacha Coffee (Dar el Bacha)",
        "city": "Marrakesh",
        "neighborhood": "Medina / Mouassine",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 31.6318,
        "lng": -7.9934,
        "hours": "10:00 - 18:00 (Closed Mon)",
        "notes": "Housed within the 1910 palace of the Pasha of Marrakech. Soaring carved cedar ceilings, geometric zellij tilework, and over 200 rare 100% Arabica origins poured from gooseneck pots with fresh vanilla bean grinders and chantilly cream.",
        "visit_date": None,
        "photo_url": "images/spots/spot-marrakesh-dar-el-bacha.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-istanbul-museum-of-innocence",
        "name": "The Museum of Innocence (Masumiyet Müzesi)",
        "city": "Istanbul",
        "neighborhood": "Çukurcuma / Beyoğlu",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.0310,
        "lng": 28.9796,
        "hours": "10:00 - 18:00 (Closed Mon)",
        "notes": "Nobel laureate Orhan Pamuk's physical novel-museum nestled in the cobblestone lanes of Çukurcuma. An obsessive, poetic archive of 1970s Istanbul life preserved across backlit wooden vitrines of vintage ephemera, cinema tickets, and porcelain teacups.",
        "visit_date": None,
        "photo_url": "images/spots/spot-istanbul-museum-of-innocence.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-granada-carmen-de-los-martires",
        "name": "Carmen de los Mártires",
        "city": "Granada",
        "neighborhood": "Alhambra / Realejo",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 37.1725,
        "lng": -3.5861,
        "hours": "Daily 10:00 - 18:00",
        "notes": "Secluded 19th-century romantic estate perched on the south slope of the Mauror hill beside the Alhambra. Peacocks wandering through baroque fountains, shaded cedar and myrtle groves, tranquil stone aqueducts, and panoramic vistas over the Vega and Sierra Nevada.",
        "visit_date": None,
        "photo_url": "images/spots/spot-granada-carmen-de-los-martires.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-sevilla-palacio-de-las-duenas",
        "name": "Palacio de las Dueñas",
        "city": "Sevilla",
        "neighborhood": "San Julián / Centro",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 37.3949,
        "lng": -5.9902,
        "hours": "Daily 10:00 - 18:00",
        "notes": "Poetic 15th-century residence where poet Antonio Machado spent his childhood. Sun-drenched courtyards draped in climbing bougainvillea, fragrant Seville bitter-orange groves, Mudejar plasterwork, Gothic arcades, and an exquisite private library archive.",
        "visit_date": None,
        "photo_url": "images/spots/spot-sevilla-palacio-de-las-duenas.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-madrid-cine-dore",
        "name": "Cine Doré (Filmoteca Española)",
        "city": "Madrid",
        "neighborhood": "Lavapiés / Antón Martín",
        "category": "theater_cinema",
        "status": "wishlist",
        "favorite": True,
        "lat": 40.4124,
        "lng": -3.6991,
        "hours": "Tue - Sun 16:30 - 22:30 (Closed Mon)",
        "notes": "Historic 1923 modernist picture house with an iconic salmon-and-cream stucco facade and curved art deco balcony. Home to the Spanish Film Archive, projecting 35mm classics beneath gilded plaster ceilings, with an intimate sunlit lobby cafe and film bookshop.",
        "visit_date": None,
        "photo_url": "images/spots/spot-madrid-cine-dore.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-biarritz-cote-des-basques",
        "name": "Plage de la Côte des Basques",
        "city": "Biarritz",
        "neighborhood": "Côte des Basques",
        "category": "surf_movement",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.4795,
        "lng": -1.5679,
        "hours": "Open 24 hours",
        "notes": "The legendary birthplace of European surfing in 1957, framed by dramatic sandstone sea cliffs and the medieval turrets of Villa Belza. A sweeping Atlantic promenade perfect for golden hour sunset walks when the low tide reveals expansive wet sands and rolling longboard waves.",
        "visit_date": None,
        "photo_url": "images/spots/spot-biarritz-cote-des-basques.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-cordoba-palacio-de-viana",
        "name": "Palacio de Viana",
        "city": "Cordoba",
        "neighborhood": "Santa Marina",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 37.8897,
        "lng": -4.7745,
        "hours": "Tue - Sun 10:00 - 19:00 (Closed Mon)",
        "notes": "Renaissance palace renowned as the Museum of Patios, interconnecting 12 whitewashed Andalusian courtyards spanning five centuries of garden architecture. Filled with vibrant indigo flowerpots, blooming star jasmine, gurgling stone fountains, and ancient citrus trees.",
        "visit_date": None,
        "photo_url": "images/spots/spot-cordoba-palacio-de-viana.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-salerno-giardino-della-minerva",
        "name": "Giardino della Minerva",
        "city": "Salerno",
        "neighborhood": "Centro Storico",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 40.6806,
        "lng": 14.7558,
        "hours": "Tue - Sun 09:30 - 17:00 (Closed Mon)",
        "notes": "First recorded botanical garden in Europe, terraced on the steep medieval slopes above Salerno by the 14th-century physician Matthaeus Platearius. Tiered irrigation waterways, aromatic medicinal herbs, lime trees, and an open-air tisana tea room with panoramic vistas across the Gulf of Salerno.",
        "visit_date": None,
        "photo_url": "images/spots/spot-salerno-giardino-della-minerva.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-monte-carlo-villa-paloma",
        "name": "Villa Paloma (Nouveau Musée National de Monaco)",
        "city": "Monte Carlo",
        "neighborhood": "Jardin Exotique",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.7314,
        "lng": 7.4147,
        "hours": "Daily 10:00 - 18:00",
        "notes": "Immaculately restored Belle Époque patrician villa overlooking the Mediterranean, housing thought-provoking contemporary art and architectural exhibitions. Peaceful terraced Italianate gardens shaded by olive and cypress trees high above the harbor.",
        "visit_date": None,
        "photo_url": "images/spots/spot-monte-carlo-villa-paloma.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-zurich-cafe-schober",
        "name": "Café Schober",
        "city": "Zurich",
        "neighborhood": "Niederdorf / Altstadt",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": True,
        "lat": 47.3712,
        "lng": 8.5445,
        "hours": "Daily 08:00 - 19:00",
        "notes": "Enchanting 19th-century salon de thé on cobblestoned Napfgasse, famous for baroque red-velvet banquettes, gilded moldings, and handcrafted Swiss patisserie. Order their legendary thick artisanal hot chocolate topped with freshly whipped double cream.",
        "visit_date": None,
        "photo_url": "images/spots/spot-zurich-cafe-schober.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-munich-museum-brandhorst",
        "name": "Museum Brandhorst",
        "city": "Munich",
        "neighborhood": "Maxvorstadt / Kunstareal",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 48.1498,
        "lng": 11.5742,
        "hours": "Tue - Sun 10:00 - 18:00 (Closed Mon)",
        "notes": "Architectural gem by Sauerbruch Hutton clad in 36,000 multi-colored glazed ceramic louvers. Bathed in diffused natural daylight, housing the largest Cy Twombly collection outside the US—including the monumental 12-canvas Lepanto cycle—and postwar art monographs.",
        "visit_date": None,
        "photo_url": "images/spots/spot-munich-museum-brandhorst.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-berlin-do-you-read-me",
        "name": "Do You Read Me?!",
        "city": "Berlin",
        "neighborhood": "Mitte / Auguststraße",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 52.5276,
        "lng": 13.3962,
        "hours": "Mon - Sat 11:00 - 19:00 (Closed Sun)",
        "notes": "The gold standard for contemporary print culture on gallery-lined Auguststraße. A sleek black-and-wood storefront curating rare international architecture journals, photography monographs, indie zines, and literary quarterlies from Tokyo, London, and New York.",
        "visit_date": None,
        "photo_url": "images/spots/spot-berlin-do-you-read-me.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-geneva-bains-des-paquis",
        "name": "Bains des Pâquis",
        "city": "Geneva",
        "neighborhood": "Pâquis / Lake Geneva",
        "category": "surf_movement",
        "status": "wishlist",
        "favorite": True,
        "lat": 46.2105,
        "lng": 6.1558,
        "hours": "Daily 07:00 - 23:00",
        "notes": "Beloved 1930s open-air bathhouse stretching out on a yellow jetty into Lake Geneva. The quintessential local ritual for morning lake swims with unobstructed views of the Jet d'Eau, followed by warm spiced mint tea, artisanal muesli, and sunset Gruyère fondue on wooden boardwalks.",
        "visit_date": None,
        "photo_url": "images/spots/spot-geneva-bains-des-paquis.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-austin-barton-springs",
        "name": "Barton Springs Pool",
        "city": "Austin",
        "neighborhood": "Zilker / South Congress",
        "category": "surf_movement",
        "status": "wishlist",
        "favorite": True,
        "lat": 30.2638,
        "lng": -97.7711,
        "hours": "Fri - Wed 05:00 - 22:00 (Closed Thu)",
        "notes": "Natural three-acre limestone swimming pool fed by underground artesian springs, maintaining a refreshing 68°F year-round. Flanked by grassy shaded pecan slopes, where swimmers gather for meditative early morning laps and twilight stargazing swims.",
        "visit_date": None,
        "photo_url": "images/spots/spot-austin-barton-springs.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-toronto-distillery-soma",
        "name": "Soma Chocolatemaker & Distillery Historic District",
        "city": "Toronto",
        "neighborhood": "Distillery District",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.6502,
        "lng": -79.3592,
        "hours": "Daily 10:00 - 19:00",
        "notes": "Pioneering small-batch bean-to-bar chocolate atelier and espresso bar housed in a 19th-century Victorian brick-and-beam whiskey distillery. Sip thick spicy Mayan hot chocolates and single-origin cortados while watching micro-batch cacao winnowing in their open glass laboratory.",
        "visit_date": None,
        "photo_url": "images/spots/spot-toronto-distillery-soma.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-denver-larimer-crema",
        "name": "Larimer Square & Crema Micro-Roasters",
        "city": "Denver",
        "neighborhood": "RiNo Art District / LoDo",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 39.7538,
        "lng": -104.9982,
        "hours": "Daily 07:00 - 17:00",
        "notes": "Exposed red-brick specialty espresso sanctuary nestled amongst the murals of Denver's creative core. Pulling rotating single-origin roasts from North American micro-roasters, paired with house-made cardamom sweet potato waffles and cold-pressed botanical tonics.",
        "visit_date": None,
        "photo_url": "images/spots/spot-denver-larimer-crema.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-new-orleans-faulkner-house",
        "name": "Faulkner House Books",
        "city": "New Orleans",
        "neighborhood": "French Quarter / Pirate's Alley",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 29.9576,
        "lng": -90.0637,
        "hours": "Daily 10:00 - 17:00",
        "notes": "The sanctum where William Faulkner rented rooms in 1925 to write his first novel, Soldier's Pay. Tucked down shaded stone-paved Pirate's Alley behind St. Louis Cathedral, with floor-to-ceiling dark walnut bookcases stocked with rare first editions, Southern literature, and poetry.",
        "visit_date": None,
        "photo_url": "images/spots/spot-new-orleans-faulkner-house.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-charleston-harken-french-quarter",
        "name": "Harken Café & Bakery (French Quarter)",
        "city": "Charleston",
        "neighborhood": "French Quarter / Queen St",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": True,
        "lat": 32.7774,
        "lng": -79.9298,
        "hours": "Wed - Mon 07:00 - 15:00 (Closed Tue)",
        "notes": "Intimate hearth bakery tucked into an 18th-century storefront on historic Queen Street. Weathered heart-pine floors, antique botanical presses, and marble pastry counters laden with sourdough hand-pies, seasonal lavender honey tarts, and velvet pour-over coffees.",
        "visit_date": None,
        "photo_url": "images/spots/spot-charleston-harken-french-quarter.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-portland-maine-tandem-old-port",
        "name": "Tandem Coffee & Bakery (Old Port & West End)",
        "city": "Portland, Maine",
        "neighborhood": "West End / Congress St",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.6521,
        "lng": -70.2748,
        "hours": "Thu - Mon 08:00 - 14:00 (Closed Tue - Wed)",
        "notes": "Beloved 1960s mid-century converted service station in Portland's tree-lined West End. Renowned for James Beard-nominated baker Briana Holt's legendary loaded sea-salt butter biscuits, miso sourdough cookies, and immaculately balanced seasonal light-roast espresso.",
        "visit_date": None,
        "photo_url": "images/spots/spot-portland-maine-tandem-old-port.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-oaxaca-jardin-etnobotanico",
        "name": "Jardín Etnobotánico de Oaxaca",
        "city": "Oaxaca",
        "neighborhood": "Centro Histórico",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 17.0664,
        "lng": -96.7226,
        "hours": "Mon - Sat 10:00 - 17:00 (Closed Sun)",
        "notes": "Sculptural living museum designed by master artist Francisco Toledo inside the former 16th-century monastery grounds of Santo Domingo. Features towering organ-pipe cacti, endemic agaves, and geometric limestone water mirrors reflecting Oaxaca's golden highland light.",
        "visit_date": None,
        "photo_url": "images/spots/spot-oaxaca-jardin-etnobotanico.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-osaka-nakanoshima-wad",
        "name": "Nakanoshima Museum of Art & Wad Ceramic Cafe",
        "city": "Osaka",
        "neighborhood": "Nakanoshima / Chuo-ku",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 34.6926,
        "lng": 135.4912,
        "hours": "Tue - Sun 10:00 - 17:00 (Closed Mon)",
        "notes": "Striking black-clad minimalist cube on Nakanoshima island surrounded by riverside promenades. Showcases modern Kansai painting, gutai movement masters, and Japanese industrial design; pairs effortlessly with an afternoon ceremonial matcha whisked in handmade kintsugi ceramic bowls.",
        "visit_date": None,
        "photo_url": "images/spots/spot-osaka-nakanoshima-wad.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-seoul-onion-bukchon",
        "name": "Onion Anguk & Bukchon Hanok Craft Village",
        "city": "Seoul",
        "neighborhood": "Jongno-gu / Bukchon",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": True,
        "lat": 37.5794,
        "lng": 126.9866,
        "hours": "Daily 07:00 - 22:00",
        "notes": "Restored traditional Korean hanok featuring exposed timber rafters, paper screens, and a gravel courtyard. Guests sit on floor cushions overlooking stone tile eaves while savoring Pandoro iced with powdered sugar, injeolmi pastries, and single-origin pour overs.",
        "visit_date": None,
        "photo_url": "images/spots/spot-seoul-onion-bukchon.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

def sync():
    print(f"Syncing {len(CITIES)} cities to Supabase...")
    city_rows = [{"name": c} for c in CITIES]
    req_cities = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/field_guide_cities",
        data=json.dumps(city_rows).encode("utf-8"),
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
            "Accept-Encoding": "identity"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req_cities) as resp:
            print("Cities sync response:", resp.status)
    except Exception as e:
        print("Error syncing cities:", e)

    print(f"Syncing {len(WISHLIST_SPOTS)} wishlist spots to Supabase...")
    req_spots = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/spots",
        data=json.dumps(WISHLIST_SPOTS).encode("utf-8"),
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
            "Accept-Encoding": "identity"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req_spots) as resp:
            print("Spots sync response:", resp.status)
    except Exception as e:
        print("Error syncing spots:", e)

if __name__ == "__main__":
    sync()
