import urllib.request
import json
from datetime import datetime, timezone

updates = [
    {
        "id": "spot-1793848151378",
        "name": "Found Vintage",
        "city": "Orange",
        "neighborhood": "Old Towne Orange",
        "category": "shops_retail",
        "status": "visited",
        "favorite": False,
        "lat": 33.787163,
        "lng": -117.853189,
        "hours": None,
        "notes": "Curated showroom and design studio founded by Jeni Maus, showcasing an eclectic collection of vintage architectural props, mid-century seating, reclaimed tables, and European antiques.",
        "visit_date": "2026-11-05",
        "photo_url": "https://annesage.com/wp-content/uploads/2017/08/JEM_1133.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794121077850",
        "name": "Musée d'Orsay",
        "city": "Paris",
        "neighborhood": "Saint-Germain-des-Prés / 7th",
        "category": "museums_art",
        "status": "visited",
        "favorite": False,
        "lat": 48.860589,
        "lng": 2.32591,
        "hours": None,
        "notes": "Grand 19th-century Beaux-Arts railway station transformed into a premier national museum housing the world's most extensive collection of Impressionist and Post-Impressionist masterpieces, from Monet and Degas to Van Gogh.",
        "visit_date": "2026-11-08",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Paris-Orsay-museum-inside-overview.jpeg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794121091216",
        "name": "Louvre Museum",
        "city": "Paris",
        "neighborhood": "Palais-Royal / 1st",
        "category": "museums_art",
        "status": "visited",
        "favorite": False,
        "lat": 48.861147,
        "lng": 2.338028,
        "hours": None,
        "notes": "Historic royal palace on the Right Bank and the world's largest art museum, famed for I.M. Pei's crystalline glass pyramid, the Mona Lisa, and monumental galleries spanning antiquity to the 19th century.",
        "visit_date": "2026-11-08",
        "photo_url": "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794121118799",
        "name": "Le Bon Marché",
        "city": "Paris",
        "neighborhood": "Sèvres-Babylone / 7th",
        "category": "shops_retail",
        "status": "visited",
        "favorite": False,
        "lat": 48.851183,
        "lng": 2.324394,
        "hours": None,
        "notes": "The world's first modern department store, founded in 1838 with an iconic glass-canopied interior engineered by Gustave Eiffel. An elegant temple of curated fashion, design, and Parisian luxury.",
        "visit_date": "2026-11-08",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Interior_of_Le_Bon_March%C3%A9%2C_July_2022.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794121174183",
        "name": "La Grande Épicerie de Paris",
        "city": "Paris",
        "neighborhood": "Sèvres-Babylone / 7th",
        "category": "shops_retail",
        "status": "visited",
        "favorite": False,
        "lat": 48.850004,
        "lng": 2.323282,
        "hours": None,
        "notes": "Celebrated gourmet emporium adjacent to Le Bon Marché, offering an extraordinary showcase of artisanal cheeses, French charcuterie, fresh patisserie, rare teas, and global culinary treasures.",
        "visit_date": "2026-11-08",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/7/7c/La_Grande_%C3%89picerie.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794121215700",
        "name": "Rodin Museum",
        "city": "Paris",
        "neighborhood": "Invalides / 7th",
        "category": "museums_art",
        "status": "visited",
        "favorite": False,
        "lat": 48.854747,
        "lng": 2.315867,
        "hours": None,
        "notes": "Auguste Rodin's former residence in the 18th-century Hôtel Biron, featuring The Thinker, The Gates of Hell, and luminous marble sculptures nestled within manicured rose gardens and historic salon suites.",
        "visit_date": "2026-11-08",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/d/da/Mus%C3%A9e_Rodin_and_garden%2C_Paris_21_April_2010.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794121318150",
        "name": "Cathedral of Notre Dame",
        "city": "Paris",
        "neighborhood": "Île de la Cité / 4th",
        "category": "museums_art",
        "status": "visited",
        "favorite": False,
        "lat": 48.852937,
        "lng": 2.35005,
        "hours": None,
        "notes": "Masterpiece of French Gothic architecture anchoring the historic heart of Paris on Île de la Cité, renowned for its flying buttresses, majestic twin towers, and intricate rose windows.",
        "visit_date": "2026-11-08",
        "photo_url": "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1200&q=85",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794121358706",
        "name": "Royal Palace Garden",
        "city": "Paris",
        "neighborhood": "Palais-Royal / 1st",
        "category": "parks_nature",
        "status": "visited",
        "favorite": False,
        "lat": 48.864908,
        "lng": 2.337759,
        "hours": None,
        "notes": "Serene neoclassical courtyard framed by 18th-century arcades, double rows of clipped linden trees, a central fountain, and Daniel Buren's striped marble columns (Les Deux Plateaux).",
        "visit_date": "2026-11-08",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Jardin_du_Palais-Royal%2C_Paris.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "spot-1794121411184",
        "name": "Galeries Lafayette",
        "city": "Paris",
        "neighborhood": "Opéra / 9th",
        "category": "shops_retail",
        "status": "visited",
        "favorite": False,
        "lat": 48.873646,
        "lng": 2.332127,
        "hours": None,
        "notes": "Flagship boulevard Haussmann department store crowned by a soaring 1912 Neo-Byzantine stained-glass cupola, offering sweeping rooftop vistas of the Paris skyline and Palais Garnier.",
        "visit_date": "2026-11-08",
        "photo_url": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Paris%2C_Galeries_Lafayette_Haussmann%2C_Coupole.jpg",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

req = urllib.request.Request(
    'https://oaqzbymmhusbhvscfcrp.supabase.co/rest/v1/spots',
    data=json.dumps(updates).encode('utf-8'),
    headers={
        'apikey': 'sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp',
        'Authorization': 'Bearer sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    },
    method='POST'
)

with urllib.request.urlopen(req) as resp:
    print('Supabase update status:', resp.status)
