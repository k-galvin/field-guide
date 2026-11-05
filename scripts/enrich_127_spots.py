import json
import os
import sys

# Mapping spot_id -> {"notes": ..., "neighborhood": ... (optional)}
ENRICHMENTS = {
    # === SAN FRANCISCO ===
    "spot-1793846776856": { # The Mill
        "notes": "Josey Baker Bread and Four Barrel Coffee outpost serving famous thick-cut artisanal toast and pour-overs in a bright, wood-and-tile space."
    },
    "spot-1793846799523": { # Amélie
        "notes": "Chic Parisian wine bar with a glowing lacquered red counter, customizable wine flights, and convivial charcuterie boards."
    },
    "spot-1793846815923": { # San Tung
        "notes": "Bustling Inner Sunset institution world-renowned for its crispy, garlic-and-ginger glazed dry-fried chicken wings."
    },
    "spot-1793846706256": { # Hedge Coffee
        "notes": "Minimalist specialty coffee hub serving precision-pulled espresso, matcha tonics, and morning pastries in the Mission."
    },
    "spot-1793846719073": { # Bar Part Time
        "notes": "High-energy natural wine bar and vinyl music hideaway pouring low-intervention skin-contact pours under a spinning disco ball."
    },
    "spot-1793846730322": { # William Stout Architectural Books
        "notes": "Storied bookstore devoted to architecture, urban planning, landscape, and design monographs with an extraordinary archive of rare titles."
    },
    "spot-1793846832523": { # Philmore Creamery
        "notes": "Artisanal Italian gelato parlor crafting silky, small-batch traditional flavors ranging from roasted pistachio to dark chocolate."
    },
    "spot-1793846850175": { # San Francisco Botanical Garden
        "notes": "55 serene acres inside Golden Gate Park showcasing thousands of rare plants, ancient magnolias, and cool-fog Andean cloud forests."
    },
    "spot-1793846863240": { # Conservatory of Flowers
        "notes": "Historic 1879 Victorian wood-and-glass greenhouse harboring exotic tropical flora, giant water lilies, and rare carnivorous plants."
    },
    "spot-1793846875275": { # Devil's Teeth Baking Company
        "notes": "Ocean Beach staple famous for its legendary scrambled egg breakfast sandwiches on buttermilk biscuits and fresh cinnamon rolls."
    },

    # === LONDON ===
    "spot-1793846972077": { # Leigh's
        "notes": "Welcoming, independent East London neighborhood cafe serving specialty espresso, filter coffee, and homestyle morning bakes."
    },
    "spot-1793846983374": { # Victoria Park
        "notes": "Vibrant East London park featuring tranquil boating lakes, tree-shaded avenues, a historic Chinese pagoda, and bustling weekend markets."
    },
    "spot-1793846555889": { # V&A East Storehouse
        "notes": "Visionary open-access museum storehouse offering unprecedented public access behind the scenes of world-class design collections."
    },
    "spot-1793846895041": { # Jujuhome Cha
        "notes": "Tranquil modern tearoom pouring ceremonial Japanese matcha and loose-leaf teas paired with delicate Asian pastries."
    },
    "spot-1793846901709": { # Brick Lane Bookshop
        "notes": "Beloved independent East End bookshop curating contemporary fiction, London history, poetry, and thoughtful indie zines."
    },
    "spot-1793847029691": { # Paloma Wool
        "notes": "Playful and sculptural London flagship for the Barcelona label, featuring artistic silhouettes, tactile knitwear, and curated aesthetics."
    },
    "spot-1793847050708": { # Peachy Den
        "notes": "Charming Soho boutique for the cult London womenswear label, known for nostalgic cuts, velvet sets, and effortless street style."
    },

    # === LOS ANGELES ===
    "spot-1793846673689": { # BRAIN DEAD STUDIOS
        "neighborhood": "Fairfax District",
        "notes": "Repertory cinema, fashion outpost, and sunny backyard patio cafe nestled inside the historic Silent Movie Theater."
    },
    "spot-1793846693789": { # El Cid
        "notes": "Historic flamenco theater and Spanish tapas lounge featuring a leafy brick patio, cabaret shows, and late-night live music."
    },

    # === SANTA ANA ===
    "spot-1793848228195": { # The Frida Cinema
        "notes": "Orange County's non-profit art house cinema, screening cult favorites, classic retrospectives, and independent international films."
    },

    # === COSTA MESA ===
    "spot-1793848151378": { # Found Vintage
        "neighborhood": "Old Towne Orange",
        "notes": "Curated boutique studio offering distinctive vintage furniture rentals, architectural props, and eclectic home goods."
    },
    "spot-1793848417347": { # Nook Coffee Bar
        "neighborhood": "The LAB Anti-Mall",
        "notes": "Shipping-container espresso bar inside The LAB, pouring crafted lattes, iced matcha, and cold brew in an open-air art courtyard."
    },
    "spot-1793848447231": { # Work in Progress
        "neighborhood": "The CAMP",
        "notes": "Airy, green-filled coffee sanctuary serving precision pour-overs, botanical spritzers, and house pastries."
    },
    "spot-1793847977959": { # Birdies Bodega
        "neighborhood": "Eastside Costa Mesa",
        "notes": "Charming neighborhood corner bodega stocked with natural wines, artisanal pantry provisions, and fresh florals."
    },
    "spot-1793848265628": { # Mercado Mesa
        "neighborhood": "East 17th Street",
        "notes": "Artisan provisions market showcasing gourmet California cheeses, specialty pantry goods, and small-batch pantry staples."
    },
    "spot-1793848288014": { # Rye Goods
        "neighborhood": "East 17th Street",
        "notes": "Naturally leavened organic sourdough bakery and deli hand-crafting heirloom grain loaves, flaky croissants, and seasonal tarts."
    },
    "spot-1793848306295": { # SEED People’s Market
        "notes": "Eco-friendly retail collective offering sustainable outdoor apparel, recycled goods, local jewelry, and camp essentials."
    },
    "spot-1793848029910": { # Inretrospect
        "neighborhood": "West Costa Mesa",
        "notes": "Sprawling vintage collective featuring mid-century modern furnishings, retro vinyl, nostalgic decor, and antique collectibles."
    },
    "spot-1793848334762": { # Neat Coffee
        "neighborhood": "Westside Costa Mesa",
        "notes": "Community-forward coffee shop serving rotating guest roasters, scratch-made syrups, and wholesome morning baked treats."
    },
    "spot-1793847404039": { # Nudae Coffee
        "notes": "Warm and minimalist specialty coffee bar brewing clean espresso, iced matcha, and house breakfast burritos."
    },
    "spot-1793847539922": { # Bear Flag Fish Co.
        "notes": "Local seaside institution famed for fresh ahi poke, grilled seafood tacos, and clam chowder in a laid-back fish market setting."
    },
    "spot-1793847611024": { # Folks Pizzeria
        "notes": "Acclaimed craft pizzeria serving blistered sourdough pies, seasonal salads, and low-intervention natural wines at The CAMP."
    },
    "spot-1793847693440": { # Fill Up Buttercup
        "notes": "Zero-waste refillery and sustainable boutique stocked with organic bath products, eco cleaning supplies, and conscious wares."
    },
    "spot-1793847840642": { # Costa Mesa Ceramics
        "neighborhood": "Westside Costa Mesa",
        "notes": "Creative pottery studio offering wheel throwing workshops, memberships, and locally handmade stoneware ceramics."
    },
    "spot-1793847885410": { # Silver Wings Vintage
        "neighborhood": "East 17th Street",
        "notes": "Intimate vintage boutique specializing in worn denim, 70s rock tees, western leather belts, and coastal retro wares."
    },
    "spot-1793848172961": { # Endless Quest Coffee Roasters
        "notes": "Small-batch micro-roastery tucked in an industrial warehouse, pulling single-origin espressos and refreshing cold brews."
    },
    "spot-1793848376231": { # Vacancy Coffee
        "neighborhood": "West Newport",
        "notes": "Australian-inspired walk-up coffee bar turning out flat whites, espresso tonics, and hot toasted jaffles near the coast."
    },
    "spot-1793848505264": { # The Lab Anti-Mall
        "neighborhood": "Bristol Street",
        "notes": "Pioneering alternative retail campus showcasing independent boutiques, artistic installations, and casual open-air cafes."
    },
    "spot-1793848497298": { # The Camp
        "neighborhood": "Bristol Street",
        "notes": "Green, eco-conscious open-air retail village surrounded by desert flora, fire pits, outdoor gear outposts, and organic cafes."
    },
    "spot-1793848562882": { # Mod Ref
        "neighborhood": "The LAB Anti-Mall",
        "notes": "Contemporary womenswear boutique offering minimalist basics, clean lines, and timeless neutral wardrobe essentials."
    },

    # === NEWPORT BEACH ===
    "spot-1793848124627": { # Freelance
        "neighborhood": "Westcliff",
        "notes": "Sleek neighborhood coffee bar pouring expertly pulled espresso, vibrant matcha, and fresh morning pastries."
    },
    "spot-1793847552706": { # A Market
        "notes": "Gourmet culinary deli and neighborhood grocer serving freshly made breakfast sandwiches, bakery treats, and fine wines."
    },
    "spot-1793847564139": { # Bamboo Bistro
        "notes": "Intimate Vietnamese bistro in Corona del Mar crafting aromatic noodle soups, spring rolls, and fragrant lemongrass dishes."
    },
    "spot-1793847577756": { # Moulin
        "notes": "Bustling French cafe and épicerie serving buttery croissants, café au lait, croque monsieurs, and fresh baguettes."
    },
    "spot-1793847679191": { # Crystal Cove State Park
        "neighborhood": "Crystal Cove",
        "notes": "Iconic coastal park featuring pristine tidal coves, scenic bluff-top trails, and historic 1930s seaside cottages."
    },
    "spot-1793848069662": { # Newport Harbor Farmers Market
        "neighborhood": "Mariner's Mile",
        "notes": "Breezy waterfront farmers market offering organic local produce, fresh flowers, artisan bread, and specialty foods."
    },
    "spot-1793848093677": { # Daydream
        "neighborhood": "Westside",
        "notes": "Charming surf shop and specialty cafe pairing seasonal espresso and matcha with an artisanal surfboard lending library."
    },
    "spot-1793848492681": { # Stereoscope Coffee
        "neighborhood": "Newport Center",
        "notes": "Striking architectural coffee bar celebrated for its cathedral-style optical art ceiling and exceptional single-origin roasts."
    },
    "spot-1793848807317": { # Lido Isle
        "notes": "Picturesque residential island inside Newport Harbor, known for its Mediterranean architecture, private docks, and quiet walkways."
    },
    "spot-1793848819367": { # Balboa Island
        "neighborhood": "Balboa Island",
        "notes": "Historic harbor enclave reachable by ferry, celebrated for its perimeter boardwalk, boutique shops, and famous frozen bananas."
    },

    # === LAGUNA BEACH ===
    "spot-1793848217397": { # Play Coffee
        "neighborhood": "North Laguna",
        "notes": "Modern multi-roaster coffee outpost crafting seasonal lattes and specialty single-origin filter brews steps from the beach."
    },
    "spot-1793847585756": { # La Sirena Grill
        "notes": "Casual eco-conscious Mexican eatery preparing wild fresh fish tacos, house salsas, and organic burritos on Mermaid Street."
    },
    "spot-1793847602639": { # Nick's Laguna Beach
        "notes": "Polished American tavern on PCH serving prime steaks, Scottish salmon, fried chicken, and classic cocktails with warm hospitality."
    },
    "spot-1793848349080": { # Thousand Steps Beach
        "notes": "Dramatic secluded beach reached by a steep staircase, flanked by coastal cliffs, tidal pools, and ocean sea caves."
    },
    "spot-1793848580516": { # Victoria Beach
        "neighborhood": "South Laguna",
        "notes": "Picturesque sandy cove famous for its medieval-style stone Pirate Tower and circular ocean saltwater pool."
    },
    "spot-1793847796425": { # Truly Pizza
        "neighborhood": "North Laguna",
        "notes": "Charming garden restaurant serving airy wood-fired artisan pies, hearth-roasted vegetables, and wine on a sunlit patio."
    },
    "spot-1793848715982": { # West Street Beach
        "notes": "Relaxed and welcoming South Laguna beach cove known for clear waters, golden sand, bodysurfing, and friendly community vibes."
    },
    "spot-1793848740082": { # Treasure Island Beach
        "neighborhood": "South Laguna",
        "notes": "Pristine cove below the Montage resort with turquoise waters, landscaped cliffside walkways, and rocky tide pools."
    },
    "spot-1793848776299": { # AhbA
        "neighborhood": "South Laguna",
        "notes": "Intimate beach cottage and garden patio dishing out Mediterranean-inspired coastal plates, burger specials, and craft cocktails."
    },

    # === SAN DIEGO ===
    "spot-1793848925684": { # Yes Yes Collective
        "neighborhood": "Cedros Ave Design District",
        "notes": "Curated lifestyle boutique in Solana Beach showcasing artisan ceramics, intentional clothing, and mindful home decor."
    },
    "spot-1793848936801": { # SoLo
        "notes": "Expansive design collective housed in a converted warehouse, filled with art books, vintage accents, and stylish home furnishings."
    },
    "spot-1793848964936": { # Part Time Lover
        "notes": "Stunning Japanese-inspired listening bar with custom wood acoustic architecture, hi-fi sound, and craft highball cocktails."
    },
    "spot-1793848973802": { # Verbatim Books
        "notes": "Labyrinthine indie bookstore in North Park packed with rare secondhand volumes, local zines, and creative book sculptures."
    },
    "spot-1793849002170": { # Joon
        "neighborhood": "North Park",
        "notes": "Sister-owned lifestyle boutique and gift shop filled with design-led home goods, jewelry, stationery, and curated finds from independent makers."
    },
    "spot-1793849044852": { # Little While
        "neighborhood": "North Park",
        "notes": "Sun-drenched, tranquil neighborhood cafe pouring specialty espresso, iced hojicha, and seasonal drinks in an airy space."
    },
    "spot-1793849079170": { # Nomade
        "neighborhood": "North Park",
        "notes": "Intimate neighborhood wine bar pouring low-intervention natural wines accompanied by seasonal small plates and patio dining."
    },
    "spot-1793849113521": { # Timshel Shop
        "neighborhood": "University Heights",
        "notes": "Thoughtful neighborhood boutique offering sustainable womenswear, hand-poured apothecary items, and curated lifestyle accessories."
    },
    "spot-1793849125705": { # Claires on Cedros
        "notes": "Charming eco-friendly cottage cafe in Solana Beach serving lemon ricotta pancakes and farm-to-table breakfast plates."
    },
    "spot-1793849155137": { # An's Dry Cleaning
        "notes": "Whimsical gelato parlor disguised as a vintage dry cleaner, scooping innovative chef-crafted flavors named after fabrics."
    },
    "spot-1793849165972": { # Wayfarer Bread & Pastry
        "notes": "Acclaimed Bird Rock bakery crafting naturally leavened sourdough, flaky fruit pastries, and savory croissants."
    },
    "spot-1793849175937": { # Warwick's
        "notes": "Beloved family-run bookstore operating since 1896, featuring literature, luxury stationery, and regular author events."
    },
    "spot-1793849184403": { # Museum of Contemporary Art San Diego
        "notes": "Oceanfront contemporary art museum in La Jolla with dramatic gallery walls, outdoor sculptures, and sweeping Pacific vistas."
    },
    "spot-1793849222937": { # Immersion Coffee and Matcha
        "neighborhood": "La Jolla",
        "notes": "Minimalist coastal cafe serving premium ceremonial matcha, inventive iced foam drinks, and specialty espresso."
    },
    "spot-1793849235270": { # Il Giardino di Lilli
        "notes": "Romantic Italian garden cafe tucked under coastal trees, serving espresso, freshly baked pastries, and savory bites."
    },
    "spot-1793849265520": { # Home Ec
        "neighborhood": "Normal Heights",
        "notes": "Charming sewing supply boutique and workshop studio offering curated modern textiles, notions, and creative craft classes."
    },

    # === PRAGUE ===
    "spot-1793849315904": { # (A)void Cafe
        "notes": "Cult riverside cafe set inside the circular stone embankment vaults of Náplavka, hosting acoustic music and sunset drinks."
    },
    "spot-1793849329127": { # ô-mai coffee & brunch
        "notes": "Bustling Vinohrady cafe blending Vietnamese flavors with modern brunch, serving pandan waffles, bánh mì, and specialty espresso."
    },
    "spot-1793849339802": { # Charles Bridge
        "notes": "Iconic 14th-century Gothic stone bridge across the Vltava River, lined with Baroque statues and panoramic views of Prague Castle."
    },
    "spot-1793849351165": { # Saint Vitus Cathedral
        "notes": "Towering Gothic masterpiece within Prague Castle, featuring dramatic flying buttresses, royal tombs, and vivid Mucha stained glass."
    },
    "spot-1793849359564": { # Prague Castle
        "notes": "Sprawling historic fortress complex dating to the 9th century, featuring royal palaces, courtyards, and grand city ramparts."
    },
    "spot-1793849369196": { # Vojanovy sady
        "notes": "Peaceful historic garden in Malá Strana shaded by fruit orchards, home to free-roaming peacocks and a quiet ornamental pond."
    },
    "spot-1793849380812": { # BER.LIN BAR
        "notes": "Moody, Berlin-inspired industrial evening bar serving creative craft cocktails and cold beers in Vinohrady."
    },
    "spot-1793849423545": { # Shakespeare & Synové
        "notes": "Atmospheric English-language bookstore in Malá Strana packed with secondhand tomes, literature, and vaulted brick ceilings."
    },
    "spot-1793849438362": { # Perňíčkův sen
        "notes": "Charming traditional bakery in the Old Town hand-decorating spiced honey gingerbread cookies using heritage Czech recipes."
    },
    "spot-1793849466128": { # Naše maso
        "notes": "Renowned artisan butcher shop and counter serving dry-aged Czech beef carpaccio, legendary meatloaf, and fresh-grilled burgers."
    },
    "spot-1793849498495": { # Šodó
        "notes": "Stylish modern bistro famous for traditional sweet buchtičky buns with vanilla cream, sourdough, and seasonal dishes."
    },

    # === EDINBURGH ===
    "spot-1793849515845": { # Lannan Bakery
        "notes": "Sensational Stockbridge craft bakery producing pristine laminated croissants, cardamom buns, and seasonal savory hand pies."
    },
    "spot-1793849553528": { # Scottish National Portrait Gallery
        "notes": "Striking red sandstone neo-Gothic palace showcasing iconic portraits and murals depicting Scotland's rich history."
    },
    "spot-1793849526678": { # Calton Hill
        "neighborhood": "Calton Hill",
        "notes": "Prominent hilltop park offering panoramic views over Edinburgh, dotted with neoclassical monuments and historic observatories."
    },
    "spot-1793849574778": { # Armchair Books
        "notes": "Atmospheric secondhand bookshop near the Grassmarket with floor-to-ceiling volumes, Persian rugs, and literary charm."
    },
    "spot-1793849584830": { # Cairngorm
        "notes": "Specialty coffee roastery in Bruntsfield serving single-origin filter coffees, grilled cheese sandwiches, and lovely park views."
    },
    "spot-1793849594461": { # Katsute100
        "notes": "Tranquil Japanese tearoom in New Town pouring ceremonial matcha and loose-leaf teas with delicate matcha gateaux."
    },
    "spot-1793849602278": { # The Milkman
        "notes": "Cozy specialty coffee house set inside an old candy shop on Cockburn Street, serving artisanal coffees and fresh buns."
    },
    "spot-1793849608745": { # Hideout Cafe
        "notes": "Rustic Old Town coffee haven serving rich espresso, home-baked pastries, and hearty breakfast bagels."
    },
    "spot-1793849619144": { # Edinburgh Castle
        "notes": "Historic volcanic fortress dominating the Edinburgh skyline, home to Scotland's Crown Jewels and centuries of history."
    },
    "spot-1793849627144": { # Royal Botanic Garden Edinburgh
        "notes": "70 tranquil acres of world-class botanic gardens featuring historic Victorian glasshouses and rare worldwide flora."
    },

    # === BUDAPEST ===
    "spot-1793849667295": { # Buda Castle
        "notes": "Majestic palace complex overlooking the Danube, housing the Hungarian National Gallery and panoramic palace courtyards."
    },
    "spot-1793849687228": { # Fisherman's Bastion
        "notes": "Fairytale neo-Romanesque lookout with seven stone turrets framing panoramic views of the Danube and Parliament building."
    },
    "spot-1793849694995": { # St. Stephen's Basilica
        "notes": "Grand neoclassical basilica featuring a gold-adorned dome, historic relics, and a panoramic bell tower viewing deck."
    },
    "spot-1793849704013": { # Typo Showroom
        "notes": "Design concept boutique in Palotanegyed curating local Hungarian fashion designers, vintage pieces, and indie publications."
    },
    "spot-1793849717561": { # Portobello Coffee & Wine
        "notes": "Chic specialty cafe and natural wine bar serving thoughtful filter brews, brunch toasties, and low-intervention bottles."
    },
    "spot-1793849725461": { # Espresso Embassy
        "notes": "Pioneering specialty coffee bar brewing outstanding single-origin roasts under historic vaulted brick ceilings."
    },
    "spot-1793849736894": { # nor/ma
        "notes": "Nordic-inspired craft bakery in Pest famous for cardamom buns, sourdough loaves, and delicate laminated pastries."
    },

    # === STOCKHOLM ===
    "spot-1793849767363": { # Vasa Museum
        "notes": "Remarkable maritime museum housing the fully salvaged 17th-century warship Vasa, preserved in astonishing detail."
    },
    "spot-1793849786561": { # APLACE
        "notes": "Curated Södermalm concept store carrying premier Scandinavian streetwear, independent fashion labels, and lifestyle goods."
    },
    "spot-1793849796246": { # Rosendals Trädgårdskafé
        "notes": "Idyllic greenhouse cafe on Djurgården serving wood-fired sourdough, garden-grown salads, and classic Swedish fika."
    },
    "spot-1793849818128": { # Rosendals Trädgårds
        "notes": "Biodynamic garden sanctuary featuring lush orchards, rose nurseries, glasshouses, and peaceful walking trails."
    },
    "spot-1793849859245": { # Gast
        "notes": "Moody, contemporary Vasastan cafe serving specialty coffee, ricotta pancakes, and wholesome brunch bowls."
    },
    "spot-1793849881861": { # Stora Bageriet
        "notes": "Beloved neighborhood bakery turning out cardamom rolls, golden saffron buns, and artisan sourdough bread."
    },
    "spot-1793849928678": { # STHLM GRÖN
        "notes": "Curated vintage and secondhand clothing boutique by Mariatorget featuring handpicked European knitwear, denim, tailoring, and designer pieces."
    },

    # === VIENNA ===
    "spot-1793849977395": { # Votivkirche
        "notes": "Magnificent neo-Gothic church along the Ringstraße, celebrated for its filigree twin spires and luminous stained glass."
    },
    "spot-1793849986844": { # Saint Stephen's Cathedral
        "notes": "Vienna's Gothic centerpiece crowned with a colorful glazed tile roof and an imposing South Tower overlooking the city."
    },
    "spot-1793849995394": { # Hofburg Palace
        "notes": "Sprawling imperial residence of the Habsburg dynasty, home to royal state apartments, museums, and imperial courtyards."
    },
    "spot-1793850009245": { # Volksgarten
        "notes": "Elegant public rose garden inside the Ringstraße featuring neoclassical temples, shaded fountains, and thousands of roses."
    },
    "spot-1793850019511": { # Burggarten
        "notes": "Historic imperial garden featuring the famous Mozart monument, a regal palm glasshouse, and peaceful grassy lawns."
    },
    "spot-1793850029794": { # Bao Bar
        "notes": "Cozy Asian eatery serving steamed fluffy bao buns filled with crispy pork, panko tofu, and sweet potato fries."
    },
    "spot-1793850124783": { # Kunst-Cafe im Hundertwasserhaus
        "notes": "Surreal cafe designed by Friedensreich Hundertwasser, featuring whimsical wavy floors, colorful mosaics, and organic art."
    },
    "spot-1793850149361": { # Café Friedlich
        "notes": "Warm and tranquil neighborhood cafe serving wholesome breakfast bowls, specialty coffee, and homemade vegan treats."
    },

    # === JOSHUA TREE ===
    "spot-1793850195496": { # Red Dog Saloon
        "notes": "Revived 1940s western saloon on Mane Street in Pioneertown serving scratch tacos, mezcal cocktails, and cold beer."
    },
    "spot-1793850221111": { # Joshua Tree Coffee
        "notes": "Organic micro-roaster brewing smooth cold brews, pour overs, and iced lattes on a shaded eucalyptus tree patio."
    },
    "spot-1793850240978": { # Country Kitchen
        "notes": "Legendary roadside diner whipping up hearty pancake stacks, crispy bacon, and authentic Cambodian lunch specials."
    },
    "spot-1793850268278": { # JT Trading Post
        "notes": "Eclectic desert gift shop and outfitter stocking crystals, local artisan crafts, camp gear, and desert keepsakes."
    },
    "spot-1793850280395": { # Joshua Tree Saloon Bar & Grill
        "notes": "Lively Old West saloon with a roadhouse patio dishing out burgers, BBQ, local drafts, and evening entertainment."
    },
    "spot-1793850321978": { # Pappy & Harriet's
        "notes": "Famed Pioneertown desert roadhouse known for mesquite barbecue, craft drinks, and intimate live music performances."
    },
    "spot-1793850351995": { # Hey There Projects
        "neighborhood": "Downtown Joshua Tree",
        "notes": "Art gallery and curated community space showcasing original works, prints, ceramics, and desert publications."
    },
    "spot-1793850392327": { # The End
        "neighborhood": "Yucca Valley",
        "notes": "Vibrant desert boutique packed with curated vintage apparel, southwestern turquoise jewelry, and bohemian treasures."
    },
    "spot-1793850406311": { # Más O Menos
        "notes": "Welcoming desert hub serving artisanal morning coffee and transforming into a lively natural wine and mezcal bar by sunset."
    }
}

if __name__ == "__main__":
    with open("scripts/spots_to_enrich.json") as f:
        spots = json.load(f)
    
    spot_ids = {s["id"] for s in spots}
    enrich_ids = set(ENRICHMENTS.keys())

    missing_in_enrichments = spot_ids - enrich_ids
    extra_in_enrichments = enrich_ids - spot_ids

    print(f"Total spots in list: {len(spot_ids)}")
    print(f"Total spots in enrichments: {len(enrich_ids)}")
    print(f"Missing in enrichments: {len(missing_in_enrichments)}")
    print(f"Extra in enrichments: {len(extra_in_enrichments)}")

    if missing_in_enrichments:
        print("Missing IDs:", missing_in_enrichments)
    
    # Check that each has notes and check neighborhoods
    missing_notes = [sid for sid, d in ENRICHMENTS.items() if not d.get("notes")]
    print(f"Enrichments missing notes: {len(missing_notes)}")

    # Check 36 spots that had missing neighborhoods in spots
    missing_orig_neigh = {s["id"]: s for s in spots if not s.get("neighborhood")}
    print(f"Original spots missing neighborhood: {len(missing_orig_neigh)}")
    still_missing_neigh = []
    for sid, s in missing_orig_neigh.items():
        if sid not in ENRICHMENTS or "neighborhood" not in ENRICHMENTS[sid] or not ENRICHMENTS[sid]["neighborhood"]:
            still_missing_neigh.append((sid, s["name"]))
    print(f"Enrichments still missing neighborhood for those: {len(still_missing_neigh)}")
    if still_missing_neigh:
        print("Still missing:", still_missing_neigh)
