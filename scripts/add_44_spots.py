import json
import urllib.request
import urllib.parse
import ssl
import os
import io
import time
from PIL import Image

ctx = ssl.create_default_context()
USER_AGENT = 'CoolPlanckTravelApp/1.0 (contact@example.com)'
HEADERS = {'User-Agent': USER_AGENT}

SUPABASE_URL = 'https://oaqzbymmhusbhvscfcrp.supabase.co'
SUPABASE_KEY = 'sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp'

SPOTS_DATA = [
    # --- ROME ---
    {
        'id': 'rome-vatican-museums',
        'name': 'Vatican Museums',
        'city': 'Rome',
        'neighborhood': 'Viale Vaticano',
        'category': 'museums_art',
        'lat': 41.906488,
        'lng': 12.453641,
        'daysOpen': 'Mon - Sat',
        'hours': 'Mon - Sat 08:00 - 19:00',
        'notes': 'The papal art collections spanning centuries of classical statuary and Renaissance masterpieces, featuring Bramante’s spiral staircase, Raphael’s Rooms, and the Gallery of Maps.',
        'wiki_query': 'Vatican Museums'
    },
    {
        'id': 'rome-sistine-chapel',
        'name': 'Sistine Chapel',
        'city': 'Rome',
        'neighborhood': 'Vatican City',
        'category': 'museums_art',
        'lat': 41.902947,
        'lng': 12.454483,
        'daysOpen': 'Mon - Sat',
        'hours': 'Mon - Sat 08:00 - 19:00',
        'notes': 'Michelangelo’s crowning Renaissance masterpiece within the Apostolic Palace, featuring The Creation of Adam on the vault ceiling and The Last Judgment across the altar wall.',
        'wiki_query': 'Sistine Chapel'
    },
    {
        'id': 'rome-trevi-fountain',
        'name': 'Trevi Fountain (Fontana di Trevi)',
        'city': 'Rome',
        'neighborhood': 'Piazza di Trevi',
        'category': 'parks_nature',
        'lat': 41.900932,
        'lng': 12.483313,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Nicola Salvi’s monumental Baroque fountain set against the Palazzo Poli, centered on Oceanus atop a triumphal chariot flanked by Tritons and cascading turquoise waters.',
        'wiki_query': 'Trevi Fountain'
    },
    {
        'id': 'rome-spanish-steps',
        'name': 'Spanish Steps (Scalinata di Trinità dei Monti)',
        'city': 'Rome',
        'neighborhood': 'Piazza di Spagna',
        'category': 'parks_nature',
        'lat': 41.905990,
        'lng': 12.482775,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'The sweeping 135-step Baroque stairway linking the Piazza di Spagna and Bernini’s Fontana della Barcaccia to the twin-towered Trinità dei Monti church above.',
        'wiki_query': 'Spanish Steps'
    },
    {
        'id': 'rome-roman-forum',
        'name': 'Roman Forum (Foro Romano)',
        'city': 'Rome',
        'neighborhood': 'Piazza Santa Maria Nova',
        'category': 'museums_art',
        'lat': 41.892462,
        'lng': 12.485325,
        'daysOpen': 'Daily',
        'hours': 'Daily 09:00 - 19:15',
        'notes': 'The civic, religious, and political nucleus of ancient Rome, featuring the surviving colonnades of the Temple of Saturn, the Arch of Septimius Severus, and the Curia Julia.',
        'wiki_query': 'Roman Forum'
    },

    # --- FLORENCE ---
    {
        'id': 'florence-palazzo-pitti',
        'name': 'Palazzo Pitti',
        'city': 'Florence',
        'neighborhood': 'Oltrarno',
        'category': 'museums_art',
        'lat': 43.765170,
        'lng': 11.250005,
        'daysOpen': 'Tue - Sun',
        'hours': 'Tue - Sun 08:15 - 18:30 (Closed Mon)',
        'notes': 'Vast Renaissance palace of the Medici grand dukes across the Arno, home to the Palatine Gallery with masterpieces by Raphael and Titian, and the grand Royal Apartments.',
        'wiki_query': 'Palazzo Pitti'
    },
    {
        'id': 'florence-duomo',
        'name': 'Cathedral of Santa Maria del Fiore (Il Duomo)',
        'city': 'Florence',
        'neighborhood': 'Piazza del Duomo',
        'category': 'museums_art',
        'lat': 43.773145,
        'lng': 11.255960,
        'daysOpen': 'Mon - Sat',
        'hours': 'Mon - Sat 10:15 - 16:45',
        'notes': 'Brunelleschi’s revolutionary 15th-century octagonal masonry dome rising above polychrome green, white, and pink Tuscan marble, with Giotto’s Campanile and the Baptistery.',
        'wiki_query': 'Florence Cathedral'
    },
    {
        'id': 'florence-piazza-della-signoria',
        'name': 'Piazza della Signoria',
        'city': 'Florence',
        'neighborhood': 'Centro Storico',
        'category': 'parks_nature',
        'lat': 43.769560,
        'lng': 11.255814,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Florence’s historical political heart, anchored by the fortress-like Palazzo Vecchio, the open-air sculpture terrace of Loggia dei Lanzi, and Ammannati’s Fountain of Neptune.',
        'wiki_query': 'Piazza della Signoria'
    },
    {
        'id': 'florence-museo-san-marco',
        'name': 'Museo di San Marco',
        'city': 'Florence',
        'neighborhood': 'Piazza San Marco',
        'category': 'museums_art',
        'lat': 43.778440,
        'lng': 11.258830,
        'daysOpen': 'Tue - Sun',
        'hours': 'Tue - Sat 08:15 - 13:50, Sun 08:15 - 17:30',
        'notes': '15th-century Dominican convent designed by Michelozzo, immortalized by Fra Angelico’s serene Annunciation and contemplative devotional frescoes in every friar’s cell.',
        'wiki_query': 'San Marco, Florence'
    },
    {
        'id': 'florence-galleria-accademia',
        'name': 'Galleria dell\'Accademia di Firenze',
        'city': 'Florence',
        'neighborhood': 'San Marco',
        'category': 'museums_art',
        'lat': 43.776944,
        'lng': 11.258611,
        'daysOpen': 'Tue - Sun',
        'hours': 'Tue - Sun 08:15 - 18:50 (Closed Mon)',
        'notes': 'World-famous museum centered beneath the sky-lit tribune housing Michelangelo’s colossal marble David (1504), alongside his powerful unfinished Slaves (Prigioni).',
        'wiki_query': 'Galleria dell\'Accademia'
    },

    # --- TUSCANY ---
    {
        'id': 'tuscany-siena-cathedral',
        'name': 'Siena Cathedral (Duomo di Santa Maria Assunta)',
        'city': 'Tuscany',
        'neighborhood': 'Piazza del Duomo, Siena',
        'category': 'museums_art',
        'lat': 43.317696,
        'lng': 11.328766,
        'daysOpen': 'Daily',
        'hours': 'Mon - Sat 10:30 - 18:00, Sun 13:30 - 18:00',
        'notes': 'Striking Gothic cathedral of black-and-white banded marble, famous for its intricate marble inlaid pavement, the Piccolomini Library with Pinturicchio frescoes, and Pisano’s pulpit.',
        'wiki_query': 'Siena Cathedral'
    },
    {
        'id': 'tuscany-palazzo-pubblico-siena',
        'name': 'Palazzo Pubblico & Piazza del Campo',
        'city': 'Tuscany',
        'neighborhood': 'Piazza del Campo, Siena',
        'category': 'museums_art',
        'lat': 43.318350,
        'lng': 11.331560,
        'daysOpen': 'Daily',
        'hours': 'Daily 10:00 - 19:00',
        'notes': '13th-century Sienese Gothic town hall presiding over the scallop-shaped Piazza del Campo, adorned with Ambrogio Lorenzetti’s Allegory of Good and Bad Government and the 88m Torre del Mangia.',
        'wiki_query': 'Palazzo Pubblico'
    },
    {
        'id': 'tuscany-guinigi-tower',
        'name': 'Guinigi Tower (Torre Guinigi)',
        'city': 'Tuscany',
        'neighborhood': 'Lucca',
        'category': 'museums_art',
        'lat': 43.843700,
        'lng': 10.506500,
        'daysOpen': 'Daily',
        'hours': 'Daily 09:30 - 18:30',
        'notes': 'Iconic 14th-century red-brick Romanesque-Gothic defense tower in Lucca, topped by a roof garden crowned with ancient holm oaks offering sweeping views across Tuscan rooftops and hills.',
        'wiki_query': 'Torre Guinigi'
    },
    {
        'id': 'tuscany-mura-di-lucca',
        'name': 'Mura di Lucca (Walls of Lucca)',
        'city': 'Tuscany',
        'neighborhood': 'Lucca',
        'category': 'parks_nature',
        'lat': 43.841500,
        'lng': 10.502000,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Spectacular 4.2-kilometer continuous Renaissance defensive ramparts, fully preserved and converted into a wide tree-lined elevated pedestrian and cycling promenade encircling the medieval town.',
        'wiki_query': 'Walls of Lucca'
    },

    # --- VENICE ---
    {
        'id': 'venice-doges-palace',
        'name': 'Doge\'s Palace (Palazzo Ducale)',
        'city': 'Venice',
        'neighborhood': 'Piazza San Marco',
        'category': 'museums_art',
        'lat': 45.433722,
        'lng': 12.340389,
        'daysOpen': 'Daily',
        'hours': 'Daily 09:00 - 19:00',
        'notes': 'Venetian Gothic landmark presiding over the lagoon and Piazza San Marco, featuring delicate marble arcades, Tintoretto’s monumental Paradise canvas, and the historic Bridge of Sighs.',
        'wiki_query': 'Doge\'s Palace'
    },
    {
        'id': 'venice-gallerie-accademia',
        'name': 'Gallerie dell\'Accademia',
        'city': 'Venice',
        'neighborhood': 'Dorsoduro',
        'category': 'museums_art',
        'lat': 45.431389,
        'lng': 12.328333,
        'daysOpen': 'Mon - Sun',
        'hours': 'Mon 08:15 - 14:00, Tue - Sun 08:15 - 19:15',
        'notes': 'The definitive museum of pre-19th-century Venetian painting on the Grand Canal, showcasing masterworks by Bellini, Giorgione, Titian, Veronese, Tintoretto, and Canaletto.',
        'wiki_query': 'Gallerie dell\'Accademia'
    },
    {
        'id': 'venice-hotel-danieli',
        'name': 'Hotel Danieli',
        'city': 'Venice',
        'neighborhood': 'Riva degli Schiavoni, San Marco',
        'category': 'hotels_stays',
        'lat': 45.434220,
        'lng': 12.342150,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Legendary Venetian luxury hotel set in the 14th-century Palazzo Dandolo overlooking the lagoon, renowned for its dramatic Gothic multi-tiered atrium, Murano chandeliers, and rooftop terrace.',
        'wiki_query': 'Hotel Danieli'
    },

    # --- ITALIAN RIVIERA ---
    {
        'id': 'italian-riviera-chiesa-san-giorgio',
        'name': 'Chiesa di San Giorgio',
        'city': 'Italian Riviera',
        'neighborhood': 'Salita San Giorgio, Portofino',
        'category': 'museums_art',
        'lat': 44.302170,
        'lng': 9.212350,
        'daysOpen': 'Daily',
        'hours': 'Daily 09:00 - 19:00',
        'notes': 'Historic church perched high on the Portofino isthmus promontory, dedicated to the town’s patron saint and offering legendary views over Portofino’s pastel harbor and the open Ligurian Sea.',
        'wiki_query': 'San Giorgio, Portofino'
    },
    {
        'id': 'italian-riviera-castello-brown',
        'name': 'Castello Brown',
        'city': 'Italian Riviera',
        'neighborhood': 'Via alla Penisola, Portofino',
        'category': 'museums_art',
        'lat': 44.301900,
        'lng': 9.215500,
        'daysOpen': 'Daily',
        'hours': 'Daily 10:00 - 18:00',
        'notes': '15th-century cliffside fortress castle set within Mediterranean pine gardens high above Portofino harbor, featuring ancient cannons, marble terraces, and wisteria-covered pergolas.',
        'wiki_query': 'Castello Brown'
    },
    {
        'id': 'italian-riviera-villa-durazzo',
        'name': 'Villa Durazzo',
        'city': 'Italian Riviera',
        'neighborhood': 'Santa Margherita Ligure',
        'category': 'parks_nature',
        'lat': 44.331500,
        'lng': 9.212800,
        'daysOpen': 'Daily',
        'hours': 'Daily 09:00 - 18:30',
        'notes': 'Magnificent 17th-century seaside estate with Genoese frescoed salons and a terraced Italianate park with ancient camellias, statues, cycads, and sweeping panoramic views across the Gulf of Tigullio.',
        'wiki_query': 'Villa Durazzo'
    },

    # --- PARIS / VERSAILLES ---
    {
        'id': 'paris-palace-of-versailles',
        'name': 'Palace of Versailles (Château de Versailles)',
        'city': 'Paris',
        'neighborhood': 'Versailles',
        'category': 'museums_art',
        'lat': 48.804865,
        'lng': 2.120355,
        'daysOpen': 'Tue - Sun',
        'hours': 'Tue - Sun 09:00 - 17:30 (Closed Mon)',
        'notes': 'Louis XIV’s opulent royal residence and symbol of French absolute monarchy, celebrated for the 73-meter Hall of Mirrors, the King\'s State Apartment, and André Le Nôtre’s vast formal gardens.',
        'wiki_query': 'Palace of Versailles'
    },
    {
        'id': 'paris-petit-trianon',
        'name': 'Petit Trianon & Queen\'s Hamlet',
        'city': 'Paris',
        'neighborhood': 'Versailles',
        'category': 'museums_art',
        'lat': 48.815200,
        'lng': 2.109800,
        'daysOpen': 'Tue - Sun',
        'hours': 'Tue - Sun 12:00 - 17:30 (Closed Mon)',
        'notes': 'Ange-Jacques Gabriel’s neoclassical jewel built for Madame de Pompadour and famously used by Queen Marie Antoinette as her private pastoral retreat and model rustic hamlet (Hameau de la Reine).',
        'wiki_query': 'Petit Trianon'
    },
    {
        'id': 'paris-airelles-versailles',
        'name': 'Airelles Château de Versailles, Le Grand Contrôle',
        'city': 'Paris',
        'neighborhood': '12 Rue de l\'Indépendance Américaine, Versailles',
        'category': 'hotels_stays',
        'lat': 48.802350,
        'lng': 2.122850,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Ultra-luxury 14-key hotel occupying Jules Hardouin-Mansart’s 1681 building within the gates of the Palace of Versailles, featuring Alain Ducasse dining and private after-hours palace access.',
        'wiki_query': 'Hôtel du Grand Contrôle'
    },
    {
        'id': 'paris-tuileries-garden',
        'name': 'Tuileries Garden (Jardin des Tuileries)',
        'city': 'Paris',
        'neighborhood': '1er Arrondissement',
        'category': 'parks_nature',
        'lat': 48.863700,
        'lng': 2.327500,
        'daysOpen': 'Daily',
        'hours': 'Daily 07:00 - 21:00',
        'notes': 'Iconic 16th-century formal public garden stretching between the Louvre Museum and Place de la Concorde, framed by gravel promenades, grand octagonal basins, and Maillol bronze sculptures.',
        'wiki_query': 'Tuileries Garden'
    },

    # --- FRENCH COUNTRYSIDE ---
    {
        'id': 'french-countryside-gordes',
        'name': 'Gordes Village & Viewpoint',
        'city': 'French Countryside',
        'neighborhood': 'Vaucluse, Provence',
        'category': 'parks_nature',
        'lat': 43.911400,
        'lng': 5.200300,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'One of France’s most celebrated hilltop villages, perched on a dramatic limestone escarpment in the Luberon with dry-stone terraced houses, a 16th-century Renaissance castle, and panoramic valley views.',
        'wiki_query': 'Gordes'
    },

    # --- LONDON ---
    {
        'id': 'london-hampton-court-palace',
        'name': 'Hampton Court Palace',
        'city': 'London',
        'neighborhood': 'East Molesey / Richmond',
        'category': 'museums_art',
        'lat': 51.403611,
        'lng': -0.337778,
        'daysOpen': 'Wed - Sun',
        'hours': 'Wed - Sun 10:00 - 16:00',
        'notes': 'King Henry VIII’s magnificent Tudor palace on the Thames, blended with Sir Christopher Wren’s Baroque palace facade, featuring Tudor kitchens, the Great Hall, and the famous hedge maze.',
        'wiki_query': 'Hampton Court Palace'
    },
    {
        'id': 'london-regents-park',
        'name': 'The Regent\'s Park',
        'city': 'London',
        'neighborhood': 'Marylebone / Camden',
        'category': 'parks_nature',
        'lat': 51.531111,
        'lng': -0.156944,
        'daysOpen': 'Daily',
        'hours': 'Daily 05:00 to dusk',
        'notes': 'John Nash’s grand Royal Park featuring Queen Mary’s Gardens with over 12,000 blooming roses, a boating lake, open-air theatre, and tree-lined avenues framed by neoclassical stucco terraces.',
        'wiki_query': 'Regent\'s Park'
    },

    # --- ENGLISH COUNTRYSIDE ---
    {
        'id': 'english-countryside-prior-park',
        'name': 'Prior Park Landscape Garden',
        'city': 'English Countryside',
        'neighborhood': 'Ralph Allen Drive, Bath, Somerset',
        'category': 'parks_nature',
        'lat': 51.367200,
        'lng': -2.348600,
        'daysOpen': 'Daily',
        'hours': 'Daily 10:00 - 17:00',
        'notes': 'Poetic 18th-century landscaped valley garden created by entrepreneur Ralph Allen with advice from Capability Brown, featuring one of only four surviving Palladian bridges in the world.',
        'wiki_query': 'Prior Park Landscape Garden'
    },
    {
        'id': 'english-countryside-pashley-manor',
        'name': 'Pashley Manor Gardens',
        'city': 'English Countryside',
        'neighborhood': 'Ticehurst, East Sussex',
        'category': 'parks_nature',
        'lat': 51.050600,
        'lng': 0.407800,
        'daysOpen': 'Tue - Sat',
        'hours': 'Tue - Sat 10:00 - 17:00',
        'notes': 'Romantic 11-acre country garden surrounding a timber-framed Tudor manor house with Queen Anne additions, celebrated for its legendary spring Tulip Festival and walled rose garden.',
        'wiki_query': 'Pashley Manor Gardens'
    },
    {
        'id': 'english-countryside-daffodil-hotel',
        'name': 'The Daffodil Hotel & Spa',
        'city': 'English Countryside',
        'neighborhood': 'Keswick Road, Grasmere, Lake District',
        'category': 'hotels_stays',
        'lat': 54.453300,
        'lng': -3.018500,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Contemporary luxury lakeside hotel situated directly on the tranquil shores of Grasmere in the Lake District, just steps from William Wordsworth’s Dove Cottage.',
        'wiki_query': 'Grasmere, Cumbria'
    },
    {
        'id': 'english-countryside-ashdown-park-hotel',
        'name': 'Ashdown Park Hotel & Country Club',
        'city': 'English Countryside',
        'neighborhood': 'Wych Cross, Forest Row, East Sussex',
        'category': 'hotels_stays',
        'lat': 51.082500,
        'lng': 0.041600,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Stately 186-acre country estate hotel nestled in the heart of Ashdown Forest, featuring a converted 19th-century Neo-Gothic chapel, manicured grounds, and roaming wild deer.',
        'wiki_query': 'Ashdown Park'
    },

    # --- IRISH COUNTRYSIDE ---
    {
        'id': 'irish-countryside-dingle-skellig',
        'name': 'Dingle Skellig Hotel',
        'city': 'Irish Countryside',
        'neighborhood': 'Eask, Dingle, County Kerry',
        'category': 'hotels_stays',
        'lat': 52.138800,
        'lng': -10.258900,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Premier waterfront retreat situated along Dingle Bay with panoramic coastal views, a luxury peninsula spa, and immediate access to the Slea Head Drive.',
        'wiki_query': 'Dingle'
    },

    # --- COPENHAGEN ---
    {
        'id': 'copenhagen-tivoli-gardens',
        'name': 'Tivoli Gardens',
        'city': 'Copenhagen',
        'neighborhood': 'Vesterbrogade, Downtown',
        'category': 'parks_nature',
        'lat': 55.673611,
        'lng': 12.568333,
        'daysOpen': 'Daily',
        'hours': 'Daily 11:00 - 23:00 (Seasonal)',
        'notes': 'Opened in 1843, Tivoli is one of the world’s oldest amusement parks and pleasure gardens, enchanted by Moorish palaces, open-air pantomime theatre, and illuminated historic pavilions.',
        'wiki_query': 'Tivoli Gardens'
    },

    # --- PORTO ---
    {
        'id': 'porto-chapel-of-souls',
        'name': 'Chapel of Souls (Capela das Almas)',
        'city': 'Porto',
        'neighborhood': 'Rua de Santa Catarina, Bolhão',
        'category': 'museums_art',
        'lat': 41.149500,
        'lng': -8.605600,
        'daysOpen': 'Daily',
        'hours': 'Mon - Fri 07:30 - 19:00, Sat - Sun 07:30 - 12:45, 18:00 - 19:00',
        'notes': 'Stunning 18th-century church whose exterior is entirely covered in nearly 16,000 blue-and-white glazed ceramic azulejo tiles depicting scenes from the lives of Saint Francis and Saint Catherine.',
        'wiki_query': 'Capela das Almas'
    },
    {
        'id': 'porto-jardins-palacio-de-cristal',
        'name': 'Jardins do Palácio de Cristal',
        'city': 'Porto',
        'neighborhood': 'Massarelos',
        'category': 'parks_nature',
        'lat': 41.148600,
        'lng': -8.625800,
        'daysOpen': 'Daily',
        'hours': 'Daily 08:00 - 19:00',
        'notes': 'Romantic 19th-century landscaped botanical gardens designed by Émile David, famous for peacocks roaming amongst chestnut trees, camellia alleys, and dramatic vistas over the Douro River.',
        'wiki_query': 'Crystal Palace (Porto)'
    },

    # --- ICELAND ---
    {
        'id': 'iceland-reykjanes-lighthouse',
        'name': 'Reykjanes Lighthouse (Reykjanesviti)',
        'city': 'Iceland',
        'neighborhood': 'Reykjanes Peninsula',
        'category': 'parks_nature',
        'lat': 63.815300,
        'lng': -22.705800,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Iceland’s oldest lighthouse, an elegant 31-meter white concrete tower built in 1929 atop the Bæjarfell volcanic hill amidst steaming thermal vents and rugged Atlantic cliffs.',
        'wiki_query': 'Reykjanesviti'
    },
    {
        'id': 'iceland-seljalandsfoss',
        'name': 'Seljalandsfoss Waterfall',
        'city': 'Iceland',
        'neighborhood': 'South Coast, Rangárþing eystra',
        'category': 'parks_nature',
        'lat': 63.615600,
        'lng': -19.988600,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Iconic 60-meter South Coast waterfall fed by Eyjafjallajökull glacier meltwater, uniquely famous for the recessed cavern path allowing visitors to walk entirely behind the roaring veil.',
        'wiki_query': 'Seljalandsfoss'
    },
    {
        'id': 'iceland-kvernufoss',
        'name': 'Kvernufoss Waterfall',
        'city': 'Iceland',
        'neighborhood': 'Skógar, South Coast',
        'category': 'parks_nature',
        'lat': 63.528300,
        'lng': -19.481100,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Secluded 30-meter waterfall tucked into a mossy, dramatic gorge behind the Skógar Folk Museum, offering a peaceful, less-crowded alternative with a trail behind the falls.',
        'wiki_query': 'Kvernufoss'
    },
    {
        'id': 'iceland-dyrholaey-lighthouse',
        'name': 'Dyrhólaey Lighthouse & Arch',
        'city': 'Iceland',
        'neighborhood': 'Vík í Mýrdal, South Coast',
        'category': 'parks_nature',
        'lat': 63.402200,
        'lng': -19.128900,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Castle-style 1927 lighthouse perched atop a 120-meter volcanic promontory overlooking a massive black lava sea arch, puffin nesting cliffs, and the endless black sand coast.',
        'wiki_query': 'Dyrhólaey'
    },
    {
        'id': 'iceland-stjornarfoss',
        'name': 'Stjórnarfoss Waterfall',
        'city': 'Iceland',
        'neighborhood': 'Kirkjubæjarklaustur, South Coast',
        'category': 'parks_nature',
        'lat': 63.799700,
        'lng': -18.058300,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Picturesque dome-shaped symmetrical waterfall cascading gracefully over mossy basalt columns into a calm pool near Kirkjubæjarklaustur, ideal for serene nature photography.',
        'wiki_query': 'Kirkjubæjarklaustur'
    },
    {
        'id': 'iceland-fjadrargljufur',
        'name': 'Fjaðrárgljúfur Canyon',
        'city': 'Iceland',
        'neighborhood': 'Kirkjubæjarklaustur, South Coast',
        'category': 'parks_nature',
        'lat': 63.771300,
        'lng': -18.171800,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Breathtaking 100-meter-deep, 2-kilometer-long serpentine river canyon carved out by glacial runoff at the end of the last Ice Age, flanked by sheer emerald-green mossy walls.',
        'wiki_query': 'Fjaðrárgljúfur'
    },
    {
        'id': 'iceland-solheimajokull',
        'name': 'Sólheimajökull Glacier Tongue',
        'city': 'Iceland',
        'neighborhood': 'Mýrdalsjökull, South Coast',
        'category': 'parks_nature',
        'lat': 63.530300,
        'lng': -19.370300,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Dramatic outlet glacier tongue extending from the massive Mýrdalsjökull ice cap, renowned for guided glacier walks showcasing vivid blue ice crevasses, sinkholes, and volcanic ash veins.',
        'wiki_query': 'Sólheimajökull'
    },
    {
        'id': 'iceland-ellidaardalur',
        'name': 'Elliðaárdalur Valley',
        'city': 'Iceland',
        'neighborhood': 'Reykjavík',
        'category': 'parks_nature',
        'lat': 64.120300,
        'lng': -21.841700,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Lush recreational river valley sanctuary in the heart of Reykjavík, featuring tranquil pine groves, walking paths, historic hydroelectric stations, and wild salmon leaping over waterfalls.',
        'wiki_query': 'Elliðaár'
    },
    {
        'id': 'iceland-raudholar',
        'name': 'Rauðhólar (Red Hills)',
        'city': 'Iceland',
        'neighborhood': 'Heiðmörk Nature Reserve, Reykjavík',
        'category': 'parks_nature',
        'lat': 64.095800,
        'lng': -21.758300,
        'daysOpen': 'Daily',
        'hours': '24 hours',
        'notes': 'Striking 5,200-year-old cluster of rusty red and black scoria pseudocraters located within the Heiðmörk nature reserve just outside Reykjavík, surrounded by dramatic hiking trails.',
        'wiki_query': 'Rauðhólar (Reykjavík)'
    }
]

def get_wiki_image_url(query):
    # 1. Try exact title
    url = f'https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(query)}&prop=pageimages&pithumbsize=1200&format=json'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                thumb = p.get('thumbnail', {}).get('source', '')
                if thumb and not thumb.endswith('.svg.png') and not thumb.endswith('.svg'):
                    return thumb
    except Exception:
        pass

    # 2. Try search generator
    url = f'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit=3&prop=pageimages&pithumbsize=1200&format=json'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in sorted(pages.items(), key=lambda x: x[1].get('index', 99)):
                thumb = p.get('thumbnail', {}).get('source', '')
                if thumb and not thumb.endswith('.svg.png') and not thumb.endswith('.svg'):
                    return thumb
    except Exception:
        pass
    return None

def download_and_optimize_image(img_url, dest_path):
    req = urllib.request.Request(img_url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20, context=ctx) as resp:
        content = resp.read()
        im = Image.open(io.BytesIO(content)).convert('RGB')
        im.thumbnail((1200, 800), Image.Resampling.LANCZOS)
        im.save(dest_path, 'JPEG', quality=83, optimize=True)

print("Starting photo download and optimization for all 44 spots...")
os.makedirs('images/spots', exist_ok=True)

for i, spot in enumerate(SPOTS_DATA, 1):
    dest_path = f"images/spots/{spot['id']}.jpg"
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 10000:
        print(f"[{i}/{len(SPOTS_DATA)}] Exists: {dest_path}")
        continue

    query = spot['wiki_query']
    img_url = get_wiki_image_url(query)
    if not img_url:
        # Fallback to spot name
        img_url = get_wiki_image_url(spot['name'])

    if img_url:
        try:
            download_and_optimize_image(img_url, dest_path)
            size_kb = os.path.getsize(dest_path) // 1024
            print(f"[{i}/{len(SPOTS_DATA)}] Saved {dest_path} ({size_kb} KB) from {query}")
        except Exception as e:
            print(f"[{i}/{len(SPOTS_DATA)}] FAILED to download for {spot['name']}: {e}")
    else:
        print(f"[{i}/{len(SPOTS_DATA)}] NO IMAGE FOUND for {spot['name']} ({query})")
    time.sleep(0.1)

print("All image processing complete.")
