import urllib.request
import json
import time
from datetime import datetime, timezone

SUPABASE_URL = "https://oaqzbymmhusbhvscfcrp.supabase.co"
SUPABASE_KEY = "sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

NEW_DESTINATIONS = [
    "Barcelona", "Seattle", "Portland", "Loire Valley", "English Countryside",
    "Scottish Countryside", "Santa Fe", "Phoenix", "Chicago", "Vancouver",
    "Quebec City", "Avignon", "Nice", "Giverny", "Rome", "Venice",
    "Florence", "Dublin", "Irish Countryside", "Iceland"
]

SPOTS = [
    # --- BARCELONA ---
    {
        "name": "Nomad Coffee Lab & Passatge",
        "city": "Barcelona",
        "neighborhood": "El Born",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.3883,
        "lng": 2.1786,
        "hours": "Mon-Fri 08:30 - 17:30",
        "notes": "Pioneering minimalist coffee laboratory hidden down Passatge Sert, celebrated for single-origin filter roasts, specialty espresso, and serene sun-dappled courtyard seating.",
        "photo_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Fundació Joan Miró",
        "city": "Barcelona",
        "neighborhood": "Montjuïc",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.3686,
        "lng": 2.1598,
        "hours": "Tue-Sun 10:00 - 18:00, Mon Closed",
        "notes": "Josep Lluís Sert's luminous white Mediterranean modernist pavilion nestled in Montjuïc park, showcasing Miró's vibrant primary-colored tapestries, sculptures, and sweeping city vistas.",
        "photo_url": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Laie Llibreria Cafè",
        "city": "Barcelona",
        "neighborhood": "Eixample",
        "category": "books",
        "status": "wishlist",
        "favorite": False,
        "lat": 41.3912,
        "lng": 2.1691,
        "hours": "Mon-Sat 09:00 - 21:00",
        "notes": "Cult literary bookstore on Pau Claris featuring curated art, philosophy, and poetry collections on the ground floor with an idyllic garden terrace bistro upstairs.",
        "photo_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Satan's Coffee Corner",
        "city": "Barcelona",
        "neighborhood": "Barri Gòtic",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": False,
        "lat": 41.3835,
        "lng": 2.1764,
        "hours": "Daily 08:00 - 18:00",
        "notes": "Rebellious specialty coffee pioneer in the Gothic Quarter, known for no-wifi policy, exceptional flat whites, cold brews, and Japanese-influenced breakfast plates.",
        "photo_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Park Güell & Escalinata del Drac",
        "city": "Barcelona",
        "neighborhood": "Gràcia",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.4145,
        "lng": 2.1527,
        "hours": "Daily 09:30 - 19:30",
        "notes": "Antoni Gaudí's fantastical utopian garden park perched above Gràcia, famous for undulating trencadís mosaic serpentine benches and panoramic views over the Mediterranean.",
        "photo_url": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1000&q=80"
    },

    # --- SEATTLE ---
    {
        "name": "Monorail Espresso",
        "city": "Seattle",
        "neighborhood": "Downtown",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 47.6105,
        "lng": -122.3353,
        "hours": "Mon-Fri 06:00 - 18:00, Sat-Sun 07:00 - 17:00",
        "notes": "America's original espresso cart founded in 1980 by Chuck Patton, serving perfectly pulled double shots and legendary housemade chunky sea salt chocolate cookies on Pike Street.",
        "photo_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Elliott Bay Book Company",
        "city": "Seattle",
        "neighborhood": "Capitol Hill",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 47.6149,
        "lng": -122.3195,
        "hours": "Daily 10:00 - 21:00",
        "notes": "Beloved independent literary institution boasting cedar timber ceilings, handwritten staff recommendation tags on over 150,000 titles, and an adjoining sunny cafe.",
        "photo_url": "https://images.unsplash.com/photo-1507842229450-790075c32877?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Olympic Sculpture Park & SAM",
        "city": "Seattle",
        "neighborhood": "Belltown / Waterfront",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 47.6166,
        "lng": -122.3553,
        "hours": "Daily 06:00 - 21:00",
        "notes": "Nine-acre open-air waterfront sculpture park designed by Weiss/Manfredi, integrating monumental Alexander Calder and Richard Serra works against Puget Sound and Olympic Mountain horizons.",
        "photo_url": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Saint Bread",
        "city": "Seattle",
        "neighborhood": "Portage Bay",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": False,
        "lat": 47.6521,
        "lng": -122.3198,
        "hours": "Wed-Sun 08:00 - 14:00, Mon-Tue Closed",
        "notes": "Waterfront bakery and community gathering spot in a historic marina boatyard, renowned for cardamom knots, sourdough toast, and Japanese melonpan.",
        "photo_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "The Walrus and the Carpenter",
        "city": "Seattle",
        "neighborhood": "Ballard",
        "category": "food_wine",
        "status": "wishlist",
        "favorite": False,
        "lat": 47.6687,
        "lng": -122.3855,
        "hours": "Daily 16:00 - 22:00",
        "notes": "Renee Erickson's lively French-leaning fishing pub celebrated for hyper-fresh Pacific Northwest tidal oysters, grilled sardines with walnut tarator, and crisp Muscadet under antique chandeliers.",
        "photo_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
    },

    # --- PORTLAND ---
    {
        "name": "Powell's City of Books",
        "city": "Portland",
        "neighborhood": "Pearl District",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 45.5230,
        "lng": -122.6815,
        "hours": "Daily 10:00 - 21:00",
        "notes": "The world's largest independent bookstore spanning an entire city block on Burnside. Nine color-coded multi-story rooms packed with millions of new, used, and rare antiquarian volumes.",
        "photo_url": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Coava Coffee Roasters",
        "city": "Portland",
        "neighborhood": "Central Eastside",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 45.5189,
        "lng": -122.6558,
        "hours": "Daily 07:00 - 17:00",
        "notes": "Stunning industrial roasting flagship in a soaring 1920s bamboo manufacturing warehouse, famous for custom cone-filtered single-origin pours and single-estate dark chocolate mochas.",
        "photo_url": "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Portland Japanese Garden",
        "city": "Portland",
        "neighborhood": "Washington Park",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 45.5186,
        "lng": -122.7077,
        "hours": "Wed-Mon 10:00 - 15:30, Tue Closed",
        "notes": "Acclaimed by the Japanese ambassador as the most authentic Japanese garden outside Japan. Features Kengo Kuma Cultural Village, tranquil koi ponds, and iconic stone lantern vistas framed by Mount Hood.",
        "photo_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Ken's Artisan Bakery",
        "city": "Portland",
        "neighborhood": "Northwest / Nob Hill",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": False,
        "lat": 45.5239,
        "lng": -122.6946,
        "hours": "Daily 08:00 - 17:00",
        "notes": "Ken Forkish's legendary wood-fired country sourdough shrine, beloved for rustic levain boules, goat cheese & leek croissants, and crisp seasonal fruit galettes.",
        "photo_url": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Proud Mary Cafe",
        "city": "Portland",
        "neighborhood": "Alberta Arts District",
        "category": "brunch_lunch",
        "status": "wishlist",
        "favorite": False,
        "lat": 45.5590,
        "lng": -122.6450,
        "hours": "Daily 08:00 - 16:00",
        "notes": "Melbourne-transplant café bringing meticulous Australian coffee culture, flat whites, and creative seasonal fare like ricotta hotcakes and potato hash cakes to Alberta Street.",
        "photo_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
    },

    # --- LOIRE VALLEY ---
    {
        "name": "Château de Chenonceau",
        "city": "Loire Valley",
        "neighborhood": "Chenonceaux",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 47.3249,
        "lng": 1.0703,
        "hours": "Daily 09:00 - 18:00",
        "notes": "The iconic 'Ladies' Château' gracefully arched across the Cher River. Exceptional French formal parterres planted by Diane de Poitiers and Catherine de' Medici, alongside magnificent Renaissance grand galleries.",
        "photo_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Château de Chambord",
        "city": "Loire Valley",
        "neighborhood": "Chambord",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 47.6161,
        "lng": 1.5172,
        "hours": "Daily 09:00 - 17:00",
        "notes": "Monumental French Renaissance hunting lodge built for Francis I with Leonardo da Vinci's famed central double-helix staircase, crowned by an intricate rooftop forest of lantern towers and chimneys.",
        "photo_url": "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Domaine de Chaumont-sur-Loire",
        "city": "Loire Valley",
        "neighborhood": "Chaumont-sur-Loire",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 47.4789,
        "lng": 1.1818,
        "hours": "Daily 10:00 - 19:00",
        "notes": "Historic cliffside fortress overlooking the Loire, world-famous for its annual International Garden Festival featuring avant-garde landscape architecture and contemporary botanical installations.",
        "photo_url": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Boulangerie Pâtisserie Bigot",
        "city": "Loire Valley",
        "neighborhood": "Amboise",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": False,
        "lat": 47.4135,
        "lng": 0.9832,
        "hours": "Tue-Sun 07:30 - 19:30, Mon Closed",
        "notes": "Beloved family-run tearoom and confectionery operating since 1913 at the foot of Château d'Amboise, legendary for artisanal macarons, nougat, tarte Tatin, and rich hot chocolate.",
        "photo_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=80"
    },

    # --- ENGLISH COUNTRYSIDE ---
    {
        "name": "Daylesford Organic Farm & Cafe",
        "city": "English Countryside",
        "neighborhood": "Kingham, Cotswolds",
        "category": "brunch_lunch",
        "status": "wishlist",
        "favorite": True,
        "lat": 51.9304,
        "lng": -1.6373,
        "hours": "Daily 08:00 - 17:00",
        "notes": "Pioneering sustainable organic farm estate nestled in the Gloucestershire hills, featuring a farmshop, creamery, Bamford wellness barn, and field-to-fork dining by open firepits.",
        "photo_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Hauser & Wirth Somerset",
        "city": "English Countryside",
        "neighborhood": "Bruton, Somerset",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 51.1118,
        "lng": -2.4419,
        "hours": "Tue-Sun 10:00 - 16:00, Mon Closed",
        "notes": "Sensational contemporary art center occupying a restored 18th-century Durslade Farmstead, complete with Piet Oudolf's transcendent perennial meadow garden and the Roth Bar & Grill.",
        "photo_url": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "The Newt in Somerset",
        "city": "English Countryside",
        "neighborhood": "Castle Cary, Somerset",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 51.0945,
        "lng": -2.5204,
        "hours": "Daily 09:00 - 17:00",
        "notes": "Magnificent Georgian estate with Parabola walled apple orchards, woodland deer trails, reconstructed Roman Villa, and world-class craft cyder press tastings.",
        "photo_url": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "The Wild Rabbit",
        "city": "English Countryside",
        "neighborhood": "Kingham, Cotswolds",
        "category": "food_wine",
        "status": "wishlist",
        "favorite": False,
        "lat": 51.9056,
        "lng": -1.6142,
        "hours": "Wed-Sun 12:00 - 22:00",
        "notes": "Classic honey-hued Cotswold stone coaching inn reimagined by Carole Bamford, serving modern British culinary creations from local daylesford estate harvests by limestone hearths.",
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80"
    },

    # --- SCOTTISH COUNTRYSIDE ---
    {
        "name": "The Fife Arms",
        "city": "Scottish Countryside",
        "neighborhood": "Braemar, Cairngorms",
        "category": "hotels_stays",
        "status": "wishlist",
        "favorite": True,
        "lat": 57.0055,
        "lng": -3.3986,
        "hours": "Daily 24/7",
        "notes": "Victorian coaching inn in the Cairngorms transformed by art dealers Hauser & Wirth into a breathtaking museum hotel featuring thousands of museum-grade artworks, bespoke tartans, and the Flying Stag pub.",
        "photo_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Eilean Donan Castle",
        "city": "Scottish Countryside",
        "neighborhood": "Dornie, Highlands",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 57.2740,
        "lng": -5.5161,
        "hours": "Daily 10:00 - 17:00",
        "notes": "Picturesque 13th-century tidal island fortress sitting at the meeting point of three majestic sea lochs (Loch Duich, Loch Long, and Loch Alsh), accessed via an ancient arched stone bridge.",
        "photo_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Glenfinnan Viaduct & Monument",
        "city": "Scottish Countryside",
        "neighborhood": "Lochaber, Highlands",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": False,
        "lat": 56.8763,
        "lng": -5.4316,
        "hours": "Daily 24/7",
        "notes": "Magnificent 21-arch mass-concrete railway viaduct curving dramatically 100 feet above the valley floor of Loch Shiel, renowned worldwide for Jacobite Steam Train crossings.",
        "photo_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Isle of Skye Baking Company",
        "city": "Scottish Countryside",
        "neighborhood": "Portree, Isle of Skye",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": False,
        "lat": 57.4124,
        "lng": -6.1960,
        "hours": "Daily 09:00 - 17:00",
        "notes": "Artisanal bakery and gallery cafe in Portree celebrated for all-butter Scottish shortbread, homemade oatcakes, sourdough rolls, and local island cheeses.",
        "photo_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    },

    # --- SANTA FE ---
    {
        "name": "Georgia O'Keeffe Museum",
        "city": "Santa Fe",
        "neighborhood": "Downtown Plaza",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 35.6892,
        "lng": -105.9405,
        "hours": "Thu-Mon 10:00 - 17:00, Tue-Wed Closed",
        "notes": "Intimate adobe museum dedicated to the Modernist matriarch of the American Southwest, housing key canvases of desert bleached bones, red hills, and dramatic canyon vistas.",
        "photo_url": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Collected Works Bookstore & Coffeehouse",
        "city": "Santa Fe",
        "neighborhood": "Historic Plaza",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 35.6865,
        "lng": -105.9388,
        "hours": "Daily 08:00 - 18:00",
        "notes": "Santa Fe's oldest independent bookstore operating since 1978. Handcrafted wooden shelves brimming with Southwest history, poetry, and fiction, with an attached fireplace cafe serving Iconik espresso.",
        "photo_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Iconik Coffee Roasters (Lena)",
        "city": "Santa Fe",
        "neighborhood": "Lena Street Lofts",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": False,
        "lat": 35.6668,
        "lng": -105.9625,
        "hours": "Daily 07:00 - 16:00",
        "notes": "Bohemian light-drenched specialty roaster tucked into the artist warehouses of Lena Street, serving artisan single-origin pour-overs, golden milk turmeric lattes, and housemade pastries.",
        "photo_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "The Shed",
        "city": "Santa Fe",
        "neighborhood": "Palace Avenue",
        "category": "food_wine",
        "status": "wishlist",
        "favorite": False,
        "lat": 35.6881,
        "lng": -105.9367,
        "hours": "Mon-Sat 11:00 - 20:30, Sun Closed",
        "notes": "James Beard Award-winning New Mexican adobe landmark operating since 1953, legendary for blue corn enchiladas smothered in smoky red chile, fresh-baked French rolls, and margaritas.",
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80"
    },

    # --- PHOENIX ---
    {
        "name": "Desert Botanical Garden",
        "city": "Phoenix",
        "neighborhood": "Papago Park",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 33.4627,
        "lng": -111.9446,
        "hours": "Daily 08:00 - 20:00",
        "notes": "World-class 140-acre desert botanical sanctuary showcasing over 50,000 desert succulents, towering saguaro forests, and blooming agave terraces set against red sandstone buttes.",
        "photo_url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Taliesin West (Frank Lloyd Wright)",
        "city": "Phoenix",
        "neighborhood": "Scottsdale Foothills",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 33.6064,
        "lng": -111.8452,
        "hours": "Thu-Mon 09:00 - 16:30, Tue-Wed Closed",
        "notes": "UNESCO World Heritage site and Frank Lloyd Wright's beloved winter home and architectural laboratory, built organically from Sonoran desert rocks and volcanic stone.",
        "photo_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Lux Central",
        "city": "Phoenix",
        "neighborhood": "Midtown",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": False,
        "lat": 33.4984,
        "lng": -112.0736,
        "hours": "Daily 06:00 - 00:00",
        "notes": "Iconic high-energy gathering hub combining small-batch coffee roasting, daily-changing bakery selections, creative craft cocktails, and eclectic midcentury seating.",
        "photo_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Pizzeria Bianco",
        "city": "Phoenix",
        "neighborhood": "Heritage Square",
        "category": "food_wine",
        "status": "wishlist",
        "favorite": True,
        "lat": 33.4501,
        "lng": -112.0655,
        "hours": "Tue-Sat 11:00 - 21:00, Sun-Mon Closed",
        "notes": "Chris Bianco's wood-fired temple credited with sparking the modern American artisanal pizza renaissance. Renowned for the Rosa (red onion, rosemary, local pistachios) and house-pulled mozzarella.",
        "photo_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"
    },

    # --- CHICAGO ---
    {
        "name": "The Art Institute of Chicago",
        "city": "Chicago",
        "neighborhood": "The Loop",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.8796,
        "lng": -87.6237,
        "hours": "Thu-Mon 11:00 - 17:00, Tue-Wed Closed",
        "notes": "One of the greatest art museums on earth, home to Renzo Piano's Modern Wing, Seurat's 'A Sunday on La Grande Jatte', Edward Hopper's 'Nighthawks', and Chagall's stained glass windows.",
        "photo_url": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Sawada Coffee",
        "city": "Chicago",
        "neighborhood": "West Loop",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.8841,
        "lng": -87.6508,
        "hours": "Daily 08:00 - 16:00",
        "notes": "World latte art champion Hiroshi Sawada's rustic West Loop cafe, world-famous for the Military Latte (ceremonial matcha, vanilla syrup, cocoa powder, and espresso).",
        "photo_url": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Garfield Park Conservatory",
        "city": "Chicago",
        "neighborhood": "Garfield Park",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.8863,
        "lng": -87.7171,
        "hours": "Wed 10:00 - 20:00, Thu-Sun 10:00 - 17:00",
        "notes": "Legendary 'landscape art under glass' designed by Jens Jensen in 1908. Two acres of public glasshouses featuring prehistoric fern rooms, desert cacti, and lush tropical palms.",
        "photo_url": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Publican Quality Bread",
        "city": "Chicago",
        "neighborhood": "West Town / Fulton Market",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": False,
        "lat": 41.8906,
        "lng": -87.6713,
        "hours": "Daily 07:00 - 18:00",
        "notes": "Greg Wade's James Beard Award-winning whole-grain sourdough bakery, crafting exceptional naturally fermented hearth loaves, morning buns, and artisan sandwiches.",
        "photo_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Myopic Books",
        "city": "Chicago",
        "neighborhood": "Wicker Park",
        "category": "books",
        "status": "wishlist",
        "favorite": False,
        "lat": 41.9099,
        "lng": -87.6775,
        "hours": "Daily 12:00 - 20:00",
        "notes": "Classic labyrinthean used bookstore on Milwaukee Avenue packed with more than 70,000 carefully curated titles across philosophy, poetry, design, and art history.",
        "photo_url": "https://images.unsplash.com/photo-1507842229450-790075c32877?auto=format&fit=crop&w=1000&q=80"
    },

    # --- VANCOUVER ---
    {
        "name": "Revolver Coffee",
        "city": "Vancouver",
        "neighborhood": "Gastown",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 49.2838,
        "lng": -123.1092,
        "hours": "Mon-Sat 08:00 - 17:00, Sun Closed",
        "notes": "Gastown's temple of specialty coffee rotating elite international guest roasters on a dedicated brew bar with brick walls, reclaimed wood, and world-map art.",
        "photo_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Stanley Park Seawall",
        "city": "Vancouver",
        "neighborhood": "Coal Harbour / West End",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 49.3017,
        "lng": -123.1444,
        "hours": "Daily 24/7",
        "notes": "Spectacular 9-kilometer paved walking and cycling pathway hugging the Pacific perimeter of Stanley Park, framed by ancient cedar forests, First Nations totem poles, and ocean mountain views.",
        "photo_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Beaucoup Bakery & Cafe",
        "city": "Vancouver",
        "neighborhood": "South Granville",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": False,
        "lat": 49.2625,
        "lng": -123.1412,
        "hours": "Daily 09:00 - 17:00",
        "notes": "French-inspired artisanal bakery celebrated for flaky double-baked almond croissants, seasonal fruit tartlets, and 49th Parallel espresso in a chic Parisian setting.",
        "photo_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Vancouver Art Gallery",
        "city": "Vancouver",
        "neighborhood": "Downtown",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": False,
        "lat": 49.2829,
        "lng": -123.1206,
        "hours": "Wed-Mon 10:00 - 17:00, Tue Closed",
        "notes": "Neoclassical former courthouse housing the definitive collection of Emily Carr's modernist Pacific Northwest landscapes, indigenous masterworks, and contemporary photography.",
        "photo_url": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80"
    },

    # --- QUEBEC CITY ---
    {
        "name": "Paillard Boulangerie & Cafe",
        "city": "Quebec City",
        "neighborhood": "Old Quebec / Saint-Jean",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": True,
        "lat": 46.8128,
        "lng": -71.2131,
        "hours": "Daily 07:30 - 18:00",
        "notes": "Sprawling traditional boulangerie on historic Rue Saint-Jean, famed for crusty artisanal baguettes, buttery pain au chocolat, delicate macarons, and housemade gelato.",
        "photo_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Musée National des Beaux-Arts du Québec",
        "city": "Quebec City",
        "neighborhood": "Plains of Abraham",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 46.8005,
        "lng": -71.2255,
        "hours": "Tue-Sun 10:00 - 17:00, Mon Closed",
        "notes": "Striking architectural campus on the Plains of Abraham featuring the glass-and-steel Pierre Lassonde pavilion designed by OMA, showcasing Quebecois fine art and Inuit sculpture.",
        "photo_url": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Terrasse Dufferin & Promenade des Gouverneurs",
        "city": "Quebec City",
        "neighborhood": "Old Quebec",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": False,
        "lat": 46.8115,
        "lng": -71.2052,
        "hours": "Daily 24/7",
        "notes": "Historic cliffside wooden boardwalk wrapping beneath Château Frontenac with sweeping vistas over the Saint Lawrence River and Cap Diamant.",
        "photo_url": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Librairie Pantoute",
        "city": "Quebec City",
        "neighborhood": "Saint-Jean-Baptiste",
        "category": "books",
        "status": "wishlist",
        "favorite": False,
        "lat": 46.8102,
        "lng": -71.2208,
        "hours": "Mon-Sat 10:00 - 18:00, Sun 11:00 - 17:00",
        "notes": "Premier independent French literary bookshop operating since 1972, celebrated for curated francophone fiction, humanities, and poetry collections.",
        "photo_url": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80"
    },

    # --- AVIGNON ---
    {
        "name": "Palais des Papes",
        "city": "Avignon",
        "neighborhood": "Centre Historique",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.9507,
        "lng": 4.8075,
        "hours": "Daily 09:00 - 19:00",
        "notes": "The largest Gothic palace in the world and seat of Western Christianity during the 14th century, featuring colossal stone halls, papal bedchambers, and Matteo Giovannetti's frescoes.",
        "photo_url": "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Collection Lambert",
        "city": "Avignon",
        "neighborhood": "Hôtel de Caumont",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.9442,
        "lng": 4.8051,
        "hours": "Tue-Sun 11:00 - 18:00, Mon Closed",
        "notes": "World-class contemporary art museum housed within two aristocratic 18th-century mansions, displaying works by Cy Twombly, Basquiat, Sol LeWitt, and Christian Boltanski.",
        "photo_url": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Café Tulipe Specialty Coffee",
        "city": "Avignon",
        "neighborhood": "Place du Change",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": False,
        "lat": 43.9482,
        "lng": 4.8066,
        "hours": "Wed-Sun 09:00 - 17:00",
        "notes": "Chic specialty coffee roaster and brunch haven tucked in the heart of the ramparts, serving precise flat whites, matcha, and seasonal tartines under stone arches.",
        "photo_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Pont Saint-Bénézet (Pont d'Avignon)",
        "city": "Avignon",
        "neighborhood": "Rhône Riverfront",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": False,
        "lat": 43.9538,
        "lng": 4.8048,
        "hours": "Daily 09:00 - 19:00",
        "notes": "Historic 12th-century medieval bridge projecting out halfway over the Rhône river toward Villeneuve-lès-Avignon, immortalized in the French nursery song.",
        "photo_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80"
    },

    # --- NICE ---
    {
        "name": "Musée Matisse",
        "city": "Nice",
        "neighborhood": "Cimiez",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.7194,
        "lng": 7.2764,
        "hours": "Wed-Mon 10:00 - 17:00, Tue Closed",
        "notes": "Genovese red-ochre villa set amid ancient Roman olive groves in Cimiez, tracing Henri Matisse's creative life from early Nice oils to radiant paper cut-outs.",
        "photo_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Promenade des Anglais & Colline du Château",
        "city": "Nice",
        "neighborhood": "Vieux Nice / Baie des Anges",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.6958,
        "lng": 7.2683,
        "hours": "Daily 24/7",
        "notes": "Legendary Mediterranean palm-lined seaside esplanade stretching around the azure Baie des Anges to Castle Hill's cascading waterfalls and panoramic views.",
        "photo_url": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Café Fino Specialty Coffee",
        "city": "Nice",
        "neighborhood": "Quartier des Musiciens",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": False,
        "lat": 43.6997,
        "lng": 7.2618,
        "hours": "Daily 08:30 - 17:30",
        "notes": "Aesthetic Scandinavian-minimalist café on Rue Gioffredo serving ceremonial matcha, seasonal single-origin filter brews, and avocado poached egg brioche.",
        "photo_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Chez René Socca",
        "city": "Nice",
        "neighborhood": "Vieux Nice",
        "category": "food_wine",
        "status": "wishlist",
        "favorite": False,
        "lat": 43.6983,
        "lng": 7.2778,
        "hours": "Tue-Sun 09:00 - 21:00, Mon Closed",
        "notes": "Quintessential Old Nice street counter serving piping hot chickpea-flour socca fresh from wood-burning copper pans alongside zucchini flower beignets and crisp Rosé.",
        "photo_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
    },

    # --- GIVERNY ---
    {
        "name": "Claude Monet's House & Water Lilies Gardens",
        "city": "Giverny",
        "neighborhood": "Giverny",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 49.0753,
        "lng": 1.5337,
        "hours": "Daily (Apr-Nov) 09:30 - 18:00",
        "notes": "Monet's radiant pink-stucco home and iconic Japanese water garden with the green arched bridge, weeping willows, and floating water lilies that inspired the Nymphéas masterpieces.",
        "photo_url": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Musée des Impressionnismes Giverny",
        "city": "Giverny",
        "neighborhood": "Rue Claude Monet",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 49.0763,
        "lng": 1.5312,
        "hours": "Daily 10:00 - 18:00",
        "notes": "Contemporary museum dedicated to the global history and evolution of Impressionism, surrounded by breathtaking garden terraces designed by Mark Rudkin.",
        "photo_url": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Hôtel Baudy (Historic Impressionist Inn)",
        "city": "Giverny",
        "neighborhood": "Giverny",
        "category": "food_wine",
        "status": "wishlist",
        "favorite": False,
        "lat": 49.0768,
        "lng": 1.5284,
        "hours": "Tue-Sun 10:00 - 21:00",
        "notes": "Historic gathering haunt for Cézanne, Rodin, and American Impressionists in the 1890s, retaining its original artist studio in the garden behind the terraced bistro.",
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80"
    },

    # --- ROME ---
    {
        "name": "Faro - Luminari del Caffè",
        "city": "Rome",
        "neighborhood": "Piazza Fiume / Salario",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.9099,
        "lng": 12.4988,
        "hours": "Daily 08:00 - 16:30",
        "notes": "Rome's preeminent specialty coffee pioneer, dedicated to light-roast single origins, natural Geishas, ceremonial matcha, and artisanal maritozzi pastries.",
        "photo_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Galleria Borghese & Villa Borghese Gardens",
        "city": "Rome",
        "neighborhood": "Pinciano",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.9142,
        "lng": 12.4922,
        "hours": "Tue-Sun 09:00 - 19:00, Mon Closed",
        "notes": "Cardinal Scipione Borghese's magnificent villa showcasing Bernini's marble masterpieces ('Apollo and Daphne', 'The Rape of Proserpina') and Caravaggio oils in gilded salons.",
        "photo_url": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Roscioli Forno e Panificio",
        "city": "Rome",
        "neighborhood": "Regola / Campo de' Fiori",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": True,
        "lat": 41.8943,
        "lng": 12.4735,
        "hours": "Mon-Sat 07:30 - 20:00, Sun 08:30 - 18:00",
        "notes": "Four-generation Roman baking dynasty on Via dei Chiavari, famed for the city's finest pizza bianca, pizza rossa, and warm morning cornetti.",
        "photo_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Otherwise Bookshop",
        "city": "Rome",
        "neighborhood": "Navona / Campo de' Fiori",
        "category": "books",
        "status": "wishlist",
        "favorite": False,
        "lat": 41.8972,
        "lng": 12.4721,
        "hours": "Daily 10:30 - 19:30",
        "notes": "Charming English-language independent bookshop tucked just off Piazza Navona on Via del Governo Vecchio, featuring literary fiction, classics, and philosophy.",
        "photo_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Doria Pamphilj Gallery",
        "city": "Rome",
        "neighborhood": "Trevi / Via del Corso",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": False,
        "lat": 41.8978,
        "lng": 12.4812,
        "hours": "Mon-Thu 09:00 - 19:00, Fri-Sun 10:00 - 20:00",
        "notes": "Opulent privately-owned Roman palazzo still occupied by the Pamphilj family, housing Velázquez's legendary portrait of Pope Innocent X and Caravaggio canvases in a glittering mirror hall.",
        "photo_url": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80"
    },

    # --- VENICE ---
    {
        "name": "Peggy Guggenheim Collection",
        "city": "Venice",
        "neighborhood": "Dorsoduro",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 45.4308,
        "lng": 12.3315,
        "hours": "Wed-Mon 10:00 - 18:00, Tue Closed",
        "notes": "Peggy Guggenheim's unfinished 18th-century Palazzo Venier dei Leoni directly on the Grand Canal, showcasing 20th-century Cubism, Surrealism, and abstract expressionism beside her tranquil sculpture garden.",
        "photo_url": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Libreria Acqua Alta",
        "city": "Venice",
        "neighborhood": "Castello",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 45.4379,
        "lng": 12.3423,
        "hours": "Daily 09:00 - 19:45",
        "notes": "Whimsical bookshop protecting thousands of volumes from seasonal canal floods inside full-sized gondolas, bathtubs, and canoes, featuring a staircase made entirely of vintage waterlogged books.",
        "photo_url": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Torrefazione Cannaregio",
        "city": "Venice",
        "neighborhood": "Cannaregio",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": False,
        "lat": 45.4448,
        "lng": 12.3275,
        "hours": "Mon-Sat 07:00 - 19:30, Sun 08:00 - 17:00",
        "notes": "The last remaining traditional wood-roasting coffee bar in historic Venice on the Cannaregio canal, roasting small-batch beans daily since 1930.",
        "photo_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Cantina Do Mori",
        "city": "Venice",
        "neighborhood": "San Polo",
        "category": "bars_nightlife",
        "status": "wishlist",
        "favorite": False,
        "lat": 45.4385,
        "lng": 12.3346,
        "hours": "Mon-Sat 08:00 - 19:30, Sun Closed",
        "notes": "Venice's oldest continuous bacàro founded in 1462, lined with antique copper pots hanging from dark wooden beams, serving classic ombra wine and traditional Venetian cicchetti.",
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80"
    },

    # --- FLORENCE ---
    {
        "name": "Ditta Artigianale",
        "city": "Florence",
        "neighborhood": "Oltrarno / Via dello Sprone",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.7681,
        "lng": 11.2497,
        "hours": "Daily 07:30 - 23:00",
        "notes": "Champion Italian barista Francesco Sanapo's flagship roastery in the Oltrarno, set in a multi-level 1950s modernist space serving exquisite single origins, flat whites, and Tuscan brunch.",
        "photo_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Boboli & Bardini Gardens",
        "city": "Florence",
        "neighborhood": "Oltrarno",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.7634,
        "lng": 11.2501,
        "hours": "Daily 09:00 - 18:30",
        "notes": "Medici grand ducal terraced gardens behind Pitti Palace, featuring Buontalenti's grotto, Renaissance marble statuary, and Bardini's famed wisteria pergola framing views of the Duomo.",
        "photo_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Todo Modo",
        "city": "Florence",
        "neighborhood": "Santa Maria Novella",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 43.7719,
        "lng": 11.2468,
        "hours": "Mon-Sat 10:00 - 20:00, Sun 11:00 - 19:00",
        "notes": "Inspiring indie bookstore, wine bar, and community salon on Via dei Fossi with over 15,000 titles, communal wooden reading tables, and natural wines by the glass.",
        "photo_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Galleria degli Uffizi",
        "city": "Florence",
        "neighborhood": "Centro Storico",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": False,
        "lat": 43.7678,
        "lng": 11.2553,
        "hours": "Tue-Sun 08:15 - 18:30, Mon Closed",
        "notes": "Giorgio Vasari's riverside palace housing the supreme treasures of the Italian Renaissance, including Botticelli's 'Birth of Venus', Leonardo's 'Annunciation', and Michelangelo's 'Doni Tondo'.",
        "photo_url": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80"
    },

    # --- DUBLIN ---
    {
        "name": "Kaph Specialty Coffee",
        "city": "Dublin",
        "neighborhood": "Drury Street / Creative Quarter",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 53.3423,
        "lng": -6.2625,
        "hours": "Mon-Fri 08:00 - 17:00, Sat 09:00 - 18:00, Sun 10:00 - 17:00",
        "notes": "Drury Street coffee pioneer renowned for meticulous oat flat whites, ceremonial Ippodo matcha, upstairs reading nook, and people-watching over the Creative Quarter.",
        "photo_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "The Library Project",
        "city": "Dublin",
        "neighborhood": "Temple Bar",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 53.3452,
        "lng": -6.2642,
        "hours": "Tue-Sat 11:00 - 18:00, Sun 12:00 - 18:00",
        "notes": "Celebrated photography bookshop, gallery, and photobook library in Temple Bar run by PhotoIreland, showcasing independent publishing, contemporary arts, and monographs.",
        "photo_url": "https://images.unsplash.com/photo-1507842229450-790075c32877?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Bread 41",
        "city": "Dublin",
        "neighborhood": "Pearse Street",
        "category": "pastry_bakery",
        "status": "wishlist",
        "favorite": False,
        "lat": 53.3444,
        "lng": -6.2520,
        "hours": "Mon-Fri 07:00 - 15:00, Sat-Sun 08:00 - 15:00",
        "notes": "Eoin Cluskey's wood-framed organic sourdough bakery celebrated for long-fermentation loaves, cruffins, morning buns, and zero-waste ethos near Trinity College.",
        "photo_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "National Gallery of Ireland",
        "city": "Dublin",
        "neighborhood": "Merrion Square",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": False,
        "lat": 53.3414,
        "lng": -6.2526,
        "hours": "Mon 11:00 - 17:30, Tue-Sat 09:45 - 17:30, Sun 11:30 - 17:30",
        "notes": "Gracious national museum housing Caravaggio's 'The Taking of Christ', Vermeer's 'Lady Writing a Letter', and extensive Yeats family archives off Georgian Merrion Square.",
        "photo_url": "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80"
    },

    # --- IRISH COUNTRYSIDE ---
    {
        "name": "Kylemore Abbey & Walled Victorian Garden",
        "city": "Irish Countryside",
        "neighborhood": "Connemara, County Galway",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 53.5617,
        "lng": -9.8893,
        "hours": "Daily 10:00 - 17:00",
        "notes": "Neo-Gothic castle monastery set on the reflective shores of Pollacappall Lough against the Connemara mountains, with a magnificent six-acre Victorian walled heritage garden.",
        "photo_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "The Dingle Bookshop",
        "city": "Irish Countryside",
        "neighborhood": "Dingle Peninsula, County Kerry",
        "category": "books",
        "status": "wishlist",
        "favorite": True,
        "lat": 52.1412,
        "lng": -10.2721,
        "hours": "Daily 10:00 - 18:00",
        "notes": "Charming independent bookstore on Green Street at the western edge of Europe, featuring Irish poetry, Gaelic folklore, maritime history, and coastal nature writing.",
        "photo_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Glendalough Monastic Site & Upper Lake",
        "city": "Irish Countryside",
        "neighborhood": "Wicklow Mountains",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": False,
        "lat": 53.0116,
        "lng": -6.3262,
        "hours": "Daily 24/7",
        "notes": "Early medieval 6th-century monastic settlement founded by St. Kevin in a glacial valley, featuring a 30-meter round tower, stone churches, and dark peat-stained mountain lakes.",
        "photo_url": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Out of the Blue",
        "city": "Irish Countryside",
        "neighborhood": "Dingle Harbour, County Kerry",
        "category": "food_wine",
        "status": "wishlist",
        "favorite": False,
        "lat": 52.1396,
        "lng": -10.2748,
        "hours": "Daily (Mar-Nov) 17:00 - 21:30",
        "notes": "Acclaimed harborfront seafood sanctuary with a strict motto: 'No chips, nothing frozen, if no fresh catch arrives, we don't open.' Renowned for Dingle Bay crab and turbot.",
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80"
    },

    # --- ICELAND ---
    {
        "name": "Reykjavik Roasters",
        "city": "Iceland",
        "neighborhood": "Kárastígur, Reykjavik",
        "category": "matcha_coffee",
        "status": "wishlist",
        "favorite": True,
        "lat": 64.1428,
        "lng": -21.9298,
        "hours": "Daily 08:00 - 17:30",
        "notes": "Pioneering Nordic specialty roastery steps from Hallgrímskirkja, featuring vintage vinyl turntables, light-roast Ethiopian pours, and fresh sourdough croissants.",
        "photo_url": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Harpa Concert Hall & Glass Facade",
        "city": "Iceland",
        "neighborhood": "Reykjavik Harbour",
        "category": "museums_art",
        "status": "wishlist",
        "favorite": True,
        "lat": 64.1504,
        "lng": -21.9329,
        "hours": "Daily 10:00 - 20:00",
        "notes": "Olafur Eliasson and Henning Larsen's crystalline harbor icon composed of geometric basalt-inspired glass prisms that capture shifting Arctic light, sea reflections, and auroras.",
        "photo_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Reynisfjara Black Sand Beach & Basalt Columns",
        "city": "Iceland",
        "neighborhood": "Vik, South Coast",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": True,
        "lat": 63.4045,
        "lng": -19.0494,
        "hours": "Daily 24/7",
        "notes": "World-famous volcanic black sand beach framed by dramatic hexagonal basalt column cliffs (Garðar) and soaring Reynisdrangar sea stacks emerging from crashing Atlantic surf.",
        "photo_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "The Retreat at Blue Lagoon",
        "city": "Iceland",
        "neighborhood": "Grindavík, Reykjanes",
        "category": "surf_movement",
        "status": "wishlist",
        "favorite": False,
        "lat": 63.8804,
        "lng": -22.4495,
        "hours": "Daily 08:00 - 21:00",
        "notes": "World-renowned geothermal retreat carved directly into an 800-year-old mossy volcanic lava field, filled with mineral-rich, opaque silica-blue healing waters.",
        "photo_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
    },
    {
        "name": "Skógafoss Waterfall",
        "city": "Iceland",
        "neighborhood": "Skógar, South Coast",
        "category": "parks_nature",
        "status": "wishlist",
        "favorite": False,
        "lat": 63.5321,
        "lng": -19.5112,
        "hours": "Daily 24/7",
        "notes": "Thunderous 60-meter waterfall plunging over former sea cliffs along the Skógá river, producing vibrant single and double rainbows on sunny Arctic afternoons.",
        "photo_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80"
    }
]

def add_cities():
    print("Checking and adding destinations to field_guide_cities...")
    # Fetch existing
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/field_guide_cities?select=name", headers=headers)
    with urllib.request.urlopen(req) as resp:
        existing = {r["name"].lower() for r in json.loads(resp.read().decode("utf-8"))}

    for city in NEW_DESTINATIONS:
        if city.lower() not in existing:
            try:
                body = json.dumps({"name": city}).encode("utf-8")
                ins_req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/field_guide_cities", data=body, method="POST", headers=headers)
                with urllib.request.urlopen(ins_req) as resp:
                    print(f"  + Added destination '{city}'")
            except Exception as e:
                print(f"  ! Error adding destination '{city}': {e}")
        else:
            print(f"  ✓ Destination '{city}' already in Atlas")

def add_spots():
    print("\nFetching existing spots from Supabase to avoid duplicates...")
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/spots?select=name,city", headers=headers)
    with urllib.request.urlopen(req) as resp:
        existing_spots = {(s.get("name", "").lower(), s.get("city", "").lower()) for s in json.loads(resp.read().decode("utf-8"))}

    now_iso = datetime.now(timezone.utc).isoformat()
    spots_to_insert = []
    for s in SPOTS:
        key = (s["name"].lower(), s["city"].lower())
        if key not in existing_spots:
            spot_id = f"spot-{int(time.time() * 1000)}-{hash(s['name']) % 100000:05d}"
            time.sleep(0.002) # ensure unique timestamp
            record = {
                "id": spot_id,
                "name": s["name"],
                "city": s["city"],
                "neighborhood": s.get("neighborhood", ""),
                "category": s.get("category", "other"),
                "status": s.get("status", "wishlist"),
                "favorite": s.get("favorite", False),
                "lat": s["lat"],
                "lng": s["lng"],
                "hours": s.get("hours", ""),
                "notes": s.get("notes", ""),
                "photo_url": s.get("photo_url", ""),
                "updated_at": now_iso
            }
            spots_to_insert.append(record)

    print(f"Inserting {len(spots_to_insert)} new curated spots...")
    # Insert in batches of 10
    batch_size = 10
    inserted = 0
    for i in range(0, len(spots_to_insert), batch_size):
        batch = spots_to_insert[i:i + batch_size]
        body = json.dumps(batch).encode("utf-8")
        ins_req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/spots", data=body, method="POST", headers=headers)
        try:
            with urllib.request.urlopen(ins_req) as resp:
                if resp.status in (200, 201, 204):
                    inserted += len(batch)
                    print(f"  ✓ Inserted batch {i//batch_size + 1} ({len(batch)} spots)")
                else:
                    print(f"  ! Batch failed status {resp.status}")
        except Exception as e:
            print(f"  ! Error inserting batch: {e}")

    print(f"\nCompleted: {inserted} spots successfully inserted into Supabase.")

if __name__ == "__main__":
    add_cities()
    add_spots()
