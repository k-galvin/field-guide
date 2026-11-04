import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import enrich_helper as h

NEW_SPOTS_METADATA = {
    # --- COPENHAGEN (28 spots) ---
    "King's Garden": {
        "category": "parks_nature",
        "neighborhood": "Indre By",
        "hours": "07:00 - 20:00",
        "notes": "Denmark's oldest royal garden, laid out in Renaissance style around Rosenborg Castle. Manicured rose avenues, herbaceous borders, and sunny lawns."
    },
    "Atelier September": {
        "category": "pastry_bakery",
        "neighborhood": "Indre By",
        "hours": "07:30 - 17:00",
        "notes": "Frederik Bille Brahe's iconic cafe on Kronprinsessegade. Citrus granola with zucchini jam, thin avocado rye toast, and natural wine in a calm light."
    },
    "Bottega Barlie": {
        "category": "food_wine",
        "neighborhood": "Indre By",
        "hours": "08:00 - 23:00",
        "notes": "Intimate all-day corner cafe and natural wine bar. Morning espresso and sourdough buns transition to Mediterranean-inspired small plates by candlelight."
    },
    "Lille Bakery": {
        "category": "pastry_bakery",
        "neighborhood": "Refshaleøen",
        "hours": "08:00 - 17:00",
        "notes": "Community craft bakery in an industrial former shipyard. Whole-grain sourdough loaves, berliner donuts, sausage rolls, and seasonal farm produce."
    },
    "Lido": {
        "category": "food_wine",
        "neighborhood": "Vesterbro",
        "hours": "08:00 - 22:00",
        "notes": "Relaxed waterside cafe and wine bar overlooking the lakes. Filter coffee, morning buns, natural low-intervention wines, and sunset outdoor seating."
    },
    "Sonny": {
        "category": "matcha_coffee",
        "neighborhood": "Indre By",
        "hours": "07:30 - 16:30",
        "notes": "Bright, design-led cafe on Rådhusstræde. Exceptional matcha lattes, seasonal lunch bowls, avocado tartines, and sunny courtyard seating."
    },
    "studio x kitchen": {
        "category": "matcha_coffee",
        "neighborhood": "Indre By",
        "hours": "08:30 - 16:00",
        "notes": "Culinary arm of the Studio X design agency. Minimalist Scandinavian interior, curated ceramic tableware, specialty coffee, and seasonal breakfast plates."
    },
    "designmuseum danmark": {
        "category": "museums_art",
        "neighborhood": "Bredgade",
        "hours": "10:00 - 18:00",
        "notes": "Housed in an 18th-century former royal hospital. Celebrates iconic Danish modern masters (Wegner, Jacobsen, Henningsen) and sustainable futures."
    },
    "SMK": {
        "category": "museums_art",
        "neighborhood": "Indre By",
        "hours": "10:00 - 18:00",
        "notes": "Statens Museum for Kunst, the National Gallery of Denmark. Expansive collection spanning Danish Golden Age paintings to modern international sculpture."
    },
    "Copenhagen Contemporary": {
        "category": "museums_art",
        "neighborhood": "Refshaleøen",
        "hours": "11:00 - 18:00",
        "notes": "International art center in a 7,000 m² former B&W welding hall, showcasing monumental installations, performance art, and light architecture."
    },
    "Palette26": {
        "category": "shops_retail",
        "neighborhood": "Indre By",
        "hours": "11:00 - 18:00",
        "notes": "Boutique design shop bursting with joyful pastel Danish glassware, handmade ceramic mugs, beeswax candles, and artisanal textiles."
    },
    "Magasin du Nord": {
        "category": "shops_retail",
        "neighborhood": "Kongens Nytorv",
        "hours": "10:00 - 20:00",
        "notes": "Historic 1868 department store on Kongens Nytorv. French Renaissance facade holding curated Scandinavian fashion, beauty, and gourmet food hall."
    },
    "ILLUM": {
        "category": "shops_retail",
        "neighborhood": "Strøget",
        "hours": "10:00 - 20:00",
        "notes": "Premier luxury lifestyle department store. Dedicated Nordic design and homeware floors, designer fashion, and top-floor rooftop dining terrace."
    },
    "A.Kjærbede": {
        "category": "shops_retail",
        "neighborhood": "Indre By",
        "hours": "10:30 - 18:00",
        "notes": "Copenhagen eyewear brand creating minimalist sunglasses rooted in clean Nordic simplicity, architectural lines, and accessible craftsmanship."
    },
    "dzidra": {
        "category": "food_wine",
        "neighborhood": "Nørrebro",
        "hours": "08:30 - 22:00",
        "notes": "Warm neighborhood corner bistro and cafe with great vinyl music, serving natural orange wines, seasonal shared plates, and specialty coffee."
    },
    "Riviera": {
        "category": "food_wine",
        "neighborhood": "Nørrebro",
        "hours": "08:00 - 23:00",
        "notes": "Sunny, laid-back neighborhood spot on the corner for morning espresso, sourdough, and evening natural wine drinking on the street benches."
    },
    "Doomsday Deli": {
        "category": "food_wine",
        "neighborhood": "Nørrebro",
        "hours": "11:30 - 20:00",
        "notes": "Cult sandwich shop known for monstrously delicious focaccia sandos, pastrami melts, crisp pickles, and natural sodas."
    },
    "Frederiksberg Have": {
        "category": "parks_nature",
        "neighborhood": "Frederiksberg",
        "hours": "07:00 - 21:00",
        "notes": "Romantic English-style landscape pleasure garden dating to 1703, with winding canals, weeping willows, a Chinese pavilion, and palace views."
    },
    "Gasoline Grill": {
        "category": "food_wine",
        "neighborhood": "Indre By",
        "hours": "11:00 - Sold Out",
        "notes": "World-famous smashburger counter operating out of an active 1960s petrol station on Borgergade. Freshly ground organic beef and potato rolls."
    },
    "Pluto": {
        "category": "food_wine",
        "neighborhood": "Indre By",
        "hours": "17:30 - 24:00",
        "notes": "Energetic New York-inspired bistro with an open kitchen. Raw bar oysters, wood-grilled sweetbreads, seasonal vegetables, and vibrant cocktail program."
    },
    "Hart Bageri": {
        "category": "pastry_bakery",
        "neighborhood": "Frederiksberg / Christianshavn",
        "hours": "07:30 - 18:00",
        "notes": "Founded by former Tartine head baker Richard Hart. Signature cardamom buns, sourdough City Loaf, sausage rolls, and seasonal Danish pastries."
    },
    "Kani": {
        "category": "pastry_bakery",
        "neighborhood": "Vesterbro",
        "hours": "08:00 - 16:00",
        "notes": "Japanese-Nordic bakery fusion. Fluffy shokupan milk bread, matcha croissants, melon pan, and savory katsu sandos."
    },
    "Juno the bakery": {
        "category": "pastry_bakery",
        "neighborhood": "Østerbro",
        "hours": "07:30 - 17:00",
        "notes": "Noma alumnus Emil Glaser's iconic neighborhood bakery. The cardamom bun (kardemommebolle) is legendary. Warm morning cinnamon rolls."
    },
    "Locale 21": {
        "category": "food_wine",
        "neighborhood": "Indre By",
        "hours": "17:30 - 23:00",
        "notes": "Intimate, candlelit Italian-Danish trattoria with counter seating, serving hand-rolled fresh pasta, crudo, and European low-intervention wines."
    },
    "Kismet": {
        "category": "matcha_coffee",
        "neighborhood": "Indre By",
        "hours": "08:00 - 17:00",
        "notes": "Cozy Scandinavian-Levantine cafe blending specialty coffee with savory sesame pastries, tahini cookies, and cardamom drinks."
    },
    "Louisiana Museum": {
        "category": "museums_art",
        "neighborhood": "Humlebæk",
        "hours": "11:00 - 22:00",
        "notes": "Idyllic seaside modern art sanctuary on the Øresund coast. World-class sculpture garden (Calder, Moore) integrated with Danish modernist glass pavilions."
    },
    "Lille Petra": {
        "category": "matcha_coffee",
        "neighborhood": "Indre By",
        "hours": "08:00 - 17:00",
        "notes": "Design cafe hidden inside the secluded courtyard of furniture maker &Tradition on Kronprinsessegade. Smørrebrød and espresso among designer chairs."
    },
    "Apotek 57": {
        "category": "pastry_bakery",
        "neighborhood": "Indre By",
        "hours": "08:00 - 16:00",
        "notes": "Studio cafe founded by chef Chiara Barla inside the Frama design showroom in a historic 1878 pharmacy. Seasonal breakfast buns, waffles, and sourdough."
    },

    # --- LISBON (15 spots) ---
    "botanical garden of lisbon": {
        "category": "parks_nature",
        "neighborhood": "Príncipe Real",
        "hours": "09:00 - 20:00",
        "notes": "Jardim Botânico da Universidade de Lisboa. 19th-century subtropical wonderland with towering ancient cycads, giant palms, and quiet shaded alleys."
    },
    "jeronimos monastery": {
        "category": "museums_art",
        "neighborhood": "Belém",
        "hours": "09:30 - 18:00",
        "notes": "Mosteiro dos Jerónimos, a UNESCO World Heritage triumph of Manueline Gothic stone architecture, maritime rope carvings, and tranquil cloisters."
    },
    "castelo de sao jorge": {
        "category": "museums_art",
        "neighborhood": "Alfama",
        "hours": "09:00 - 21:00",
        "notes": "Moorish hilltop fortress towering over the city. Walk along medieval defensive ramparts for 360-degree panoramic views of Lisbon, the Tagus, and terracotta roofs."
    },
    "museu nacional do azulejo": {
        "category": "museums_art",
        "neighborhood": "Xabregas",
        "hours": "10:00 - 18:00",
        "notes": "Housed in the breathtaking 16th-century Madre de Deus convent, showcasing five centuries of Portuguese decorative glazed ceramic tiles (azulejos)."
    },
    "LX Factory": {
        "category": "shops_retail",
        "neighborhood": "Alcântara",
        "hours": "10:30 - 23:00",
        "notes": "Revitalized 19th-century textile factory complex under the 25 de Abril Bridge, filled with design studios, street art murals, indie boutiques, and rooftop bars."
    },
    "Marquise da Mobler": {
        "category": "pastry_bakery",
        "neighborhood": "Príncipe Real",
        "hours": "09:00 - 18:00",
        "notes": "Enchanting bakery and vintage Scandinavian furniture showroom with a peaceful, sun-dappled hidden back garden. Organic sourdough and cinnamon buns."
    },
    "Hello Kristof": {
        "category": "matcha_coffee",
        "neighborhood": "Poço dos Negros",
        "hours": "09:00 - 17:00",
        "notes": "Specialty coffee shop and indie magazine parlour on Rua do Poço dos Negros. Minimalist blonde wood, excellent flat whites, and artisanal toasts."
    },
    "Comoba": {
        "category": "matcha_coffee",
        "neighborhood": "Cais do Sodré",
        "hours": "08:00 - 17:00",
        "notes": "Organic specialty coffee cafe in a restored historic tiled pharmacy. Matcha lattes with homemade almond milk, breakfast burritos, and golden turmeric milk."
    },
    "Ler Devagar": {
        "category": "books_cinema",
        "neighborhood": "Alcântara (LX Factory)",
        "hours": "10:00 - 21:00",
        "notes": "Monumental bookstore inside a former industrial printing warehouse, featuring floor-to-ceiling book stacks, historic printing presses, and a suspended flying bicycle."
    },
    "Livraria da Travessa": {
        "category": "books_cinema",
        "neighborhood": "Príncipe Real",
        "hours": "10:00 - 20:00",
        "notes": "Storied Brazilian bookstore's Lisbon flagship inside a renovated palace on Rua da Escola Politécnica. Exceptional literature, art, and philosophy sections."
    },
    "embaixada": {
        "category": "shops_retail",
        "neighborhood": "Príncipe Real",
        "hours": "12:00 - 20:00",
        "notes": "Palacete Ribeiro da Cunha, a spectacular 19th-century Neo-Moorish palace transformed into an architectural concept gallery for independent Portuguese designers."
    },
    "landeau chocolate": {
        "category": "pastry_bakery",
        "neighborhood": "Alcântara / Chiado",
        "hours": "11:00 - 19:00",
        "notes": "Sofia Landeau's singular dessert salon dedicated to what the New York Times called the world's best chocolate cake, dusted with bitter French cocoa."
    },
    "dramatico": {
        "category": "matcha_coffee",
        "neighborhood": "Príncipe Real",
        "hours": "09:00 - 16:30",
        "notes": "Intimate, jewel-box espresso bar pairing Japanese minimalism with precision filter brews, iced ceremonial matcha, and delicate pastries."
    },
    "good company books": {
        "category": "books_cinema",
        "neighborhood": "Avenidas Novas",
        "hours": "10:00 - 19:00",
        "notes": "Thoughtful independent English-language bookstore and salon, curating contemporary fiction, essay collections, poetry, and bookish gifts."
    },
    "Miradouro de Sao Pedro de Alcantara": {
        "category": "parks_nature",
        "neighborhood": "Bairro Alto",
        "hours": "Open 24 Hours",
        "notes": "Landscaped two-tiered garden lookout with neoclassical statues, fountain basins, and breathtaking panoramic views across Lisbon's red roofs to São Jorge Castle."
    },

    # --- NEW YORK (32 spots) ---
    "Gem Home": {
        "category": "shops_retail",
        "neighborhood": "Lower East Side",
        "hours": "11:00 - 19:00",
        "notes": "Chef Flynn McGarry's design and vintage boutique on Orchard Street, filled with vintage glassware, Japanese ceramics, linen napery, and tableware."
    },
    "Librae Bakery": {
        "category": "pastry_bakery",
        "neighborhood": "East Village",
        "hours": "07:30 - 16:30",
        "notes": "Third-culture bakery fusing Danish sourdough lamination with Middle Eastern flavors. Rose pistachio croissants, loomi babka, and fermented flatbreads."
    },
    "Café Sabarsky": {
        "category": "food_wine",
        "neighborhood": "Upper East Side",
        "hours": "09:00 - 21:00",
        "notes": "Viennese grand cafe inside the Neue Galerie, with Josef Hoffmann furniture and Adolf Loos lighting. Classic Sachertorte, apple strudel, and Wiener Melange."
    },
    "PARK at KIMS": {
        "category": "shops_retail",
        "neighborhood": "Lower East Side",
        "hours": "11:00 - 19:00",
        "notes": "Curated lifestyle and stationery boutique celebrating Korean design objects, ceramic teaware, incense, and minimal desk goods."
    },
    "Khata": {
        "category": "shops_retail",
        "neighborhood": "Lower East Side",
        "hours": "12:00 - 19:00",
        "notes": "Intimate artisanal boutique focusing on handcrafted Himalayan textiles, organic incense blends, hand-carved singing bowls, and folk crafts."
    },
    "Goods For The Study West Village": {
        "category": "shops_retail",
        "neighborhood": "West Village",
        "hours": "11:00 - 19:00",
        "notes": "McNally Jackson's sanctuary for desk culture on West 8th St. European fountain pens, brass pencil sharpeners, Japanese notebooks, and library lamps."
    },
    "Bedford Vintage": {
        "category": "shops_retail",
        "neighborhood": "West Village",
        "hours": "12:00 - 19:00",
        "notes": "Charming West Village vintage boutique featuring curated 1990s leather jackets, worn denim, classic wool trench coats, and vintage accessories."
    },
    "Rizzoli Bookstore": {
        "category": "books_cinema",
        "neighborhood": "NoMad",
        "hours": "11:00 - 20:00",
        "notes": "Iconic bookstore on Broadway with vaulted fresco ceilings, brass chandeliers, and wooden columns. Famed for art monographs, fashion, and foreign titles."
    },
    "The Locavore Variety Store": {
        "category": "shops_retail",
        "neighborhood": "Greenwich Village",
        "hours": "11:00 - 19:00",
        "notes": "Whimsical community shop dedicated exclusively to goods produced within 100 miles of New York City: beeswax candles, small-batch snacks, and crafts."
    },
    "Three Lives & Company": {
        "category": "books_cinema",
        "neighborhood": "West Village",
        "hours": "10:00 - 19:00",
        "notes": "The consummate neighborhood corner bookstore on Tenth and Waverly. Warm creaking wood floors, knowledgeable staff, and passionate literary curation."
    },
    "AIR MAIL": {
        "category": "books_cinema",
        "neighborhood": "West Village",
        "hours": "08:00 - 18:00",
        "notes": "Graydon Carter's digital weekly brought to life as an old-school European newsstand, stocking international newspapers, espresso, and luxury stationery."
    },
    "Printemps New York": {
        "category": "shops_retail",
        "neighborhood": "Financial District",
        "hours": "10:00 - 20:00",
        "notes": "Historic Parisian luxury department store outpost at One Wall Street, blending French high fashion, bespoke beauty salons, and curated gastronomy."
    },
    "Strand Book Store": {
        "category": "books_cinema",
        "neighborhood": "Greenwich Village",
        "hours": "10:00 - 20:00",
        "notes": "Landmark bookstore founded in 1927 boasting '18 Miles of Books' across three floors of new, used, and rare volumes on Broadway and 12th St."
    },
    "paloma wool": {
        "category": "shops_retail",
        "neighborhood": "SoHo",
        "hours": "11:00 - 19:00",
        "notes": "Barcelona-based brand's tactile flagship store featuring sculptural plaster architecture, artful knitwear, printed silks, and experimental apparel."
    },
    "BonBon - A Swedish Candy Co.": {
        "category": "shops_retail",
        "neighborhood": "Upper East Side",
        "hours": "11:00 - 22:00",
        "notes": "Authentic Swedish pick-and-mix candy emporium filled with jars of sour skulls, salted salmiak licorice, marshmallow berries, and chocolate crisps."
    },
    "Do Not Feed Alligators": {
        "category": "matcha_coffee",
        "neighborhood": "West Village",
        "hours": "08:00 - 18:00",
        "notes": "Serene bookstore, art exhibition space, and specialty coffee salon on Bleecker Street, serving clean filter brews and artisanal pastries."
    },
    "St Jardim": {
        "category": "food_wine",
        "neighborhood": "West Village",
        "hours": "08:00 - 23:00",
        "notes": "Sun-drenched corner cafe on West 10th St pouring morning espresso and natural wines by the glass with seasonal small plates by evening."
    },
    "Ichiran": {
        "category": "food_wine",
        "neighborhood": "Midtown",
        "hours": "11:00 - 23:00",
        "notes": "Individual flavor concentration dining cubicles designed for solitary ramen appreciation. Rich tonkotsu broth, dashi, and spicy original red sauce."
    },
    "Locanda Verde Hudson Yards": {
        "category": "food_wine",
        "neighborhood": "Hudson Yards",
        "hours": "11:30 - 22:00",
        "notes": "Chef Andrew Carmellini's bustling urban Italian taverna serving sheep's milk ricotta with sea salt and herbs, handmade pasta, and wood-fired meats."
    },
    "Smør": {
        "category": "food_wine",
        "neighborhood": "East Village",
        "hours": "08:00 - 22:00",
        "notes": "Scandinavian cafe and natural wine bar famous for open-faced smørrebrød on dense rye bread, Swedish cardamom buns, and Nordic brunch."
    },
    "The Frick Collection": {
        "category": "museums_art",
        "neighborhood": "Upper East Side",
        "hours": "10:00 - 18:00",
        "notes": "Gilded Age mansion museum housing one of the world's greatest collections of Western paintings (Vermeer, Rembrandt, Titian) in historic rooms."
    },
    "Neue Galerie New York": {
        "category": "museums_art",
        "neighborhood": "Upper East Side",
        "hours": "11:00 - 18:00",
        "notes": "Museum of early 20th-century German and Austrian art on Museum Mile. Home to Gustav Klimt's golden 'Woman in Gold' and Egon Schiele drawings."
    },
    "Cooper Hewitt, Smithsonian Design Museum": {
        "category": "museums_art",
        "neighborhood": "Upper East Side",
        "hours": "10:00 - 18:00",
        "notes": "The only US museum dedicated entirely to historic and contemporary design, housed inside Andrew Carnegie's Gilded Age mansion with garden."
    },
    "The High Line": {
        "category": "parks_nature",
        "neighborhood": "Chelsea / Meatpacking",
        "hours": "07:00 - 22:00",
        "notes": "1.45-mile elevated rail line turned public park landscaped by Piet Oudolf with wild grasses, Hudson River views, and rotating public art sculptures."
    },
    "Gagosian": {
        "category": "museums_art",
        "neighborhood": "Chelsea",
        "hours": "10:00 - 18:00",
        "notes": "Larry Gagosian's monumental West 24th Street gallery space presenting museum-scale solo exhibitions from leading contemporary artists."
    },
    "Pace Gallery": {
        "category": "museums_art",
        "neighborhood": "Chelsea",
        "hours": "10:00 - 18:00",
        "notes": "Eight-story architectural flagship on West 25th Street holding multiple gallery pavilions, outdoor sculpture terrace, and dedicated art research library."
    },
    "Central Park": {
        "category": "parks_nature",
        "neighborhood": "Manhattan",
        "hours": "06:00 - 01:00",
        "notes": "Frederick Law Olmsted and Calvert Vaux's 843-acre urban masterpiece: the Ramble, Bethesda Terrace, Sheep Meadow, and Jacqueline Kennedy Onassis Reservoir."
    },
    "Washington Square Park": {
        "category": "parks_nature",
        "neighborhood": "Greenwich Village",
        "hours": "06:00 - 24:00",
        "notes": "The vibrant cultural heart of Greenwich Village, framed by Stanford White's marble arch, lively fountain, chess tables, and street performers."
    },
    "Big Night": {
        "category": "shops_retail",
        "neighborhood": "West Village",
        "hours": "11:00 - 19:00",
        "notes": "Dinner party goods and hosting emporium stocking vibrant glassware, artisanal tinned fish, olive oils, colorful tapers, and cocktail ingredients."
    },
    "Cloak & Dagger": {
        "category": "shops_retail",
        "neighborhood": "East Village",
        "hours": "12:00 - 19:00",
        "notes": "Parisian-inspired independent boutique on First Ave featuring nostalgic, feminine dresses, knit sweaters, vintage accessories, and niche perfumes."
    },
    "niconeco zakkaya": {
        "category": "shops_retail",
        "neighborhood": "East Village",
        "hours": "12:00 - 19:00",
        "notes": "Enchanting Japanese zakka stationery shop on East 10th St. Rubber stamps, washi masking tapes, glass dip pens, handmade ceramics, and leather planners."
    },
    "Understudy": {
        "category": "books_cinema",
        "neighborhood": "Lower East Side",
        "hours": "12:00 - 19:00",
        "notes": "Cozy cinema and arts bookstore tucked into the Lower East Side, curating indie zines, script monographs, film photography books, and print ephemera."
    },

    # --- MEXICO CITY (9 spots) ---
    "bosque de chapultepec": {
        "category": "parks_nature",
        "neighborhood": "Miguel Hidalgo",
        "hours": "05:00 - 19:00",
        "notes": "One of the largest urban parks in the Americas, spanning 1,700 acres. Historic Chapultepec Castle, quiet ahuehuete tree paths, and botanical gardens."
    },
    "marne cafe": {
        "category": "pastry_bakery",
        "neighborhood": "San Miguel Chapultepec",
        "hours": "08:00 - 19:00",
        "notes": "Sun-dappled neighborhood bakery and cafe. Slow-fermented sourdough, flaky croissants, flat whites, and relaxed sidewalk seating."
    },
    "utilitario mexicano": {
        "category": "shops_retail",
        "neighborhood": "Juárez",
        "hours": "11:00 - 19:00",
        "notes": "Temple of functional, everyday Mexican design. Curated collection of utilitarian enamelware, hand-carved molinillos, glassware, and brushes."
    },
    "la miscelanea de lusso": {
        "category": "food_wine",
        "neighborhood": "Juárez",
        "hours": "09:00 - 20:00",
        "notes": "Artisanal deli and gourmet bodega offering small-batch Mexican cheeses, natural wines, olive oils, fresh sandwiches, and pantry staples."
    },
    "el comal y la olla": {
        "category": "food_wine",
        "neighborhood": "Juárez",
        "hours": "08:30 - 17:00",
        "notes": "Neighborhood fonda highlighting heritage nixtamalized corn tortillas puffed fresh on the comal, paired with traditional slow-simmered guisados."
    },
    "buna": {
        "category": "matcha_coffee",
        "neighborhood": "Roma Norte / Doctores",
        "hours": "08:00 - 19:00",
        "notes": "Specialty Mexican coffee roastery committed to environmental conservation. Complex pour-overs, cold brews, and single-origin chocolates."
    },
    "BAR mini": {
        "category": "food_wine",
        "neighborhood": "Doctores (La Laguna)",
        "hours": "17:00 - 24:00",
        "notes": "Intimate natural wine and vinyl listening enclave tucked inside the creative industrial compound of La Laguna. Low lights and organic pet nats."
    },
    "Amanda Manda": {
        "category": "shops_retail",
        "neighborhood": "Condesa",
        "hours": "11:00 - 19:00",
        "notes": "Charming boutique celebrating contemporary Mexican artisan fashion, hand-embroidered blouses, colorful linen garments, and jewelry."
    },
    "frida kahlo museum": {
        "category": "museums_art",
        "neighborhood": "Coyoacán",
        "hours": "10:00 - 18:00",
        "notes": "The iconic Casa Azul where Frida Kahlo was born and lived. Cobalt blue courtyard, lush cactus gardens, and her preserved studio and folk art."
    }
}

def main():
    spots = h.get_spots()
    print(f"Total spots in Supabase: {len(spots)}")

    # Build case-insensitive lookup
    lookup = {k.lower(): v for k, v in NEW_SPOTS_METADATA.items()}

    updated_count = 0
    errors = 0

    for s in spots:
        name = s.get('name', '').strip()
        name_lower = name.lower()

        meta = None
        if name in NEW_SPOTS_METADATA:
            meta = NEW_SPOTS_METADATA[name]
        elif name_lower in lookup:
            meta = lookup[name_lower]

        if not meta:
            continue

        # Check if update is needed
        patch_data = {}
        if not s.get('notes') or s.get('notes') == 'None' or len(s.get('notes', '')) < 5:
            patch_data['notes'] = meta['notes']
        if not s.get('hours') or s.get('hours') == 'None':
            patch_data['hours'] = meta['hours']
        if not s.get('neighborhood') or s.get('neighborhood') == 'None':
            patch_data['neighborhood'] = meta['neighborhood']
        if s.get('category') == 'other' or s.get('category') != meta['category']:
            patch_data['category'] = meta['category']

        if patch_data:
            patch_data['updated_at'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            success = h.update_spot(s['id'], patch_data)
            if success:
                updated_count += 1
                print(f"[{updated_count}] Updated '{name}' ({s.get('city')}) -> {meta['category']}")
            else:
                errors += 1
                print(f"Failed to update '{name}' [{s['id']}]")
            time.sleep(0.04)

    print(f"\nFinished! Updated: {updated_count}, Errors: {errors}")

if __name__ == '__main__':
    main()
