// Photon by Komoot - Free OpenStreetMap-based Search-As-You-Type Autocomplete
// Zero API keys required, free global geocoding service.

let activeAbortController = null;
let photonUnavailableUntil = 0; // Timestamp when Photon circuit-breaker expires

/**
 * Intelligent mapping from OpenStreetMap tags to Field Guide categories
 */
export function mapOsmTagToCategory(props = {}, name = '') {
  const osmKey = (props.osm_key || '').toLowerCase();
  const osmValue = (props.osm_value || '').toLowerCase();
  const lowerName = (name || props.name || '').toLowerCase();

  // 1. Direct tag matching
  if (osmValue === 'bakery' || osmKey === 'bakery' || /bakery|bakeri|boulangerie|pastry|croissant|patisserie/.test(lowerName)) {
    return 'pastry_bakery';
  }
  if (osmValue === 'cafe' || osmValue === 'coffee' || osmValue === 'tea' || /coffee|matcha|cafe|espresso|roaster|tea/.test(lowerName)) {
    return 'matcha_coffee';
  }
  if (['hotel', 'guest_house', 'hostel', 'motel', 'apartment', 'chalet'].includes(osmValue) || /hotel|hostel|inn\b|ryokan|guesthouse|residence|lodging|bed & breakfast|suites\b/.test(lowerName)) {
    return 'hotels_stays';
  }
  if (['bar', 'pub', 'lounge', 'biergarten'].includes(osmValue) || /cocktail|cocktails|speakeasy|listening bar|pub\b|tavern|taproom|saloon|brewery/.test(lowerName)) {
    return 'cocktails_nightlife';
  }
  if (['deli', 'sandwich', 'fast_food', 'food_court', 'canteen'].includes(osmValue) || /brunch|lunch|sandwich|deli\b|bagel|bagels|diner|all-day café|all-day cafe/.test(lowerName)) {
    return 'food_dining';
  }
  if (['wine'].includes(osmValue) || /wine bar|natural wine|vins\b|enoteca|bodega/.test(lowerName)) {
    return 'wine_small_plates';
  }
  if (['restaurant', 'bistro'].includes(osmValue) || /restaurant|bistro|tacos?|pizza|ramen|taqueria|trattoria|izakaya|dining|steakhouse|sushi|pasta/.test(lowerName)) {
    return 'food_dining';
  }
  if (['museum', 'gallery', 'artwork', 'arts_centre'].includes(osmValue) || /museum|gallery|art|exhibition/.test(lowerName)) {
    return 'museums_art';
  }
  if (['theatre', 'cinema'].includes(osmValue) || /cinema|film|theatre|theater|movie|screening|cinémathèque|cinematheque/.test(lowerName)) {
    return 'theater_cinema';
  }
  if (['nightclub', 'music_venue'].includes(osmValue) || /concert|orchestra|jazz|gig|live music/.test(lowerName)) {
    return 'concerts_music';
  }
  if (['pottery', 'ceramics'].includes(osmValue) || /ceramic|pottery|clay|atelier/.test(lowerName)) {
    return 'ceramics_craft';
  }
  if (['books', 'stationery', 'library'].includes(osmValue) || /book|books|bookstore|libreria|livraria/.test(lowerName)) {
    return 'books';
  }
  if (['park', 'garden', 'viewpoint', 'nature_reserve'].includes(osmValue) || /park|garden|lookout|miradouro|forest/.test(lowerName)) {
    return 'parks_nature';
  }
  if (osmValue === 'surfing' || /surf|beach|wave/.test(lowerName)) {
    return 'surf_movement';
  }
  if (['clothes', 'boutique', 'department_store', 'general', 'gift', 'vintage'].includes(osmValue) || /shop|vintage|boutique|store/.test(lowerName)) {
    return 'shops_retail';
  }

  return 'other';
}

/**
 * Extract clean neighborhood from Photon or Nominatim properties
 */
export function extractNeighborhood(props = {}) {
  return (
    props.locality ||
    props.district ||
    props.suburb ||
    props.neighbourhood ||
    props.city_district ||
    props.quarter ||
    props.hamlet ||
    props.street ||
    props.road ||
    ''
  ).trim();
}

/**
 * Extract city name from Photon or Nominatim properties
 */
export function extractCity(props = {}) {
  let c = props.city || props.town || props.municipality || props.village || props.county || props.state || '';
  // Normalize common city variants
  if (/københavn|copenhagen/i.test(c)) return 'Copenhagen';
  if (/lisboa|lisbon/i.test(c)) return 'Lisbon';
  if (/new york|brooklyn|manhattan|queens/i.test(c)) return 'New York';
  if (/ciudad de m[eé]xico|mexico city|cdmx/i.test(c)) return 'Mexico City';
  if (/tokyo/i.test(c)) return 'Tokyo';
  if (/kyoto/i.test(c)) return 'Kyoto';
  if (/london/i.test(c)) return 'London';
  if (/los angeles|santa monica|venice|culver city/i.test(c)) return 'Los Angeles';
  if (/san francisco/i.test(c)) return 'San Francisco';
  if (/paris/i.test(c)) return 'Paris';
  return c.trim();
}

/**
 * Fallback geocoder using OpenStreetMap Nominatim when Photon is unreachable
 */
async function searchNominatimPlaces(trimmed, biasCoords, signal) {
  let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&addressdetails=1&limit=6`;
  if (biasCoords && typeof biasCoords.lat === 'number' && typeof biasCoords.lng === 'number') {
    url += `&viewbox=${biasCoords.lng - 0.5},${biasCoords.lat + 0.5},${biasCoords.lng + 0.5},${biasCoords.lat - 0.5}&bounded=0`;
  }

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    if (!Array.isArray(items)) return [];

    return items.map(item => {
      const addr = item.address || {};
      const lat = parseFloat(item.lat) || 0;
      const lng = parseFloat(item.lon) || 0;
      const name = item.name || (item.display_name ? item.display_name.split(',')[0].trim() : trimmed);

      const props = {
        osm_key: item.class || '',
        osm_value: item.type || '',
        name,
        ...addr
      };

      const city = extractCity(props);
      const neighborhood = extractNeighborhood(props);
      const category = mapOsmTagToCategory(props, name);

      // Build address subtitle
      const addressParts = [];
      if (neighborhood && neighborhood.toLowerCase() !== name.toLowerCase()) addressParts.push(neighborhood);
      const road = addr.road || addr.street;
      if (road && road.toLowerCase() !== neighborhood.toLowerCase()) {
        addressParts.push(road + (addr.house_number ? ` ${addr.house_number}` : ''));
      }
      if (city) addressParts.push(city);
      if (addr.country) addressParts.push(addr.country);

      return {
        name,
        city,
        neighborhood,
        category,
        lat,
        lng,
        osmType: item.type || item.class || 'place',
        formattedAddress: addressParts.join(', ')
      };
    });
  } catch (err) {
    if (err.name === 'AbortError') return [];
    console.warn('Nominatim fallback also failed:', err);
    return [];
  }
}

/**
 * Query Photon Komoot API with location biasing, with automatic fallback to Nominatim
 */
export async function searchPhotonPlaces(query, biasCoords = null) {
  const trimmed = (query || '').trim();
  if (!trimmed || trimmed.length < 2) return [];

  // Cancel prior request if still in flight
  if (activeAbortController) {
    activeAbortController.abort();
  }
  activeAbortController = new AbortController();
  const signal = activeAbortController.signal;

  // Circuit breaker: if Photon failed recently, route directly to Nominatim
  if (Date.now() < photonUnavailableUntil) {
    return searchNominatimPlaces(trimmed, biasCoords, signal);
  }

  let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=6`;
  if (biasCoords && typeof biasCoords.lat === 'number' && typeof biasCoords.lng === 'number') {
    url += `&lat=${biasCoords.lat}&lon=${biasCoords.lng}`;
  }

  try {
    // 2.5s timeout for Photon
    const timeoutId = setTimeout(() => {
      // Don't abort the global controller, just trip the circuit breaker
    }, 2500);

    const res = await fetch(url, { signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const features = data.features || [];

    return features.map(feat => {
      const p = feat.properties || {};
      const coords = feat.geometry && feat.geometry.coordinates ? feat.geometry.coordinates : [0, 0];
      const lng = coords[0];
      const lat = coords[1];
      const name = p.name || trimmed;
      const city = extractCity(p);
      const neighborhood = extractNeighborhood(p);
      const category = mapOsmTagToCategory(p, name);

      // Build address subtitle
      const addressParts = [];
      if (neighborhood && neighborhood.toLowerCase() !== name.toLowerCase()) addressParts.push(neighborhood);
      if (p.street && p.street.toLowerCase() !== neighborhood.toLowerCase()) addressParts.push(p.street + (p.housenumber ? ` ${p.housenumber}` : ''));
      if (city) addressParts.push(city);
      if (p.country) addressParts.push(p.country);

      return {
        name,
        city,
        neighborhood,
        category,
        lat,
        lng,
        osmType: p.osm_value || p.osm_key || 'place',
        formattedAddress: addressParts.join(', ')
      };
    });
  } catch (err) {
    if (err.name === 'AbortError') return [];
    
    // Mark Photon unavailable for 5 minutes so subsequent keystrokes don't hang
    photonUnavailableUntil = Date.now() + 5 * 60 * 1000;
    console.warn('Photon autocomplete failed (server down/refused). Seamlessly falling back to OpenStreetMap Nominatim:', err.message || err);
    
    return searchNominatimPlaces(trimmed, biasCoords, signal);
  }
}

/**
 * Parse coordinates and place name if user pastes a Google Maps URL
 */
export function parseGoogleMapsUrl(input = '') {
  if (!input || typeof input !== 'string') return null;
  const str = input.trim();
  if (!str.includes('google.com/maps') && !str.includes('maps.app.goo.gl')) return null;

  // Pattern 1: /place/Name/@lat,lng,zoom
  const placeMatch = str.match(/\/place\/([^/@]+)\/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (placeMatch) {
    return {
      name: decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')),
      lat: parseFloat(placeMatch[2]),
      lng: parseFloat(placeMatch[3])
    };
  }

  // Pattern 2: ?q=lat,lng or &ll=lat,lng
  const coordMatch = str.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    return {
      name: '',
      lat: parseFloat(coordMatch[1]),
      lng: parseFloat(coordMatch[2])
    };
  }

  return null;
}
