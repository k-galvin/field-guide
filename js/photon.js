// Photon by Komoot - Free OpenStreetMap-based Search-As-You-Type Autocomplete
// Zero API keys required, free global geocoding service.

let activeAbortController = null;

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
  if (['restaurant', 'bar', 'pub', 'bistro', 'fast_food', 'food_court', 'wine'].includes(osmValue) || /restaurant|bistro|wine|tacos|pizza|ramen|deli|taqueria/.test(lowerName)) {
    return 'food_wine';
  }
  if (['museum', 'gallery', 'artwork', 'arts_centre'].includes(osmValue) || /museum|gallery|art|exhibition/.test(lowerName)) {
    return 'museums_art';
  }
  if (['nightclub', 'music_venue', 'theatre', 'cinema'].includes(osmValue)) {
    if (osmValue === 'cinema' || /book|cinema|theatre|theater/.test(lowerName)) return 'books_cinema';
    return 'concerts_music';
  }
  if (['pottery', 'ceramics'].includes(osmValue) || /ceramic|pottery|clay|atelier/.test(lowerName)) {
    return 'ceramics_craft';
  }
  if (['books', 'stationery', 'library'].includes(osmValue) || /book|books|libreria|livraria/.test(lowerName)) {
    return 'books_cinema';
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
 * Extract clean neighborhood from Photon properties
 */
export function extractNeighborhood(props = {}) {
  return (
    props.locality ||
    props.district ||
    props.suburb ||
    props.neighbourhood ||
    props.quarter ||
    props.street ||
    ''
  ).trim();
}

/**
 * Extract city name from Photon properties
 */
export function extractCity(props = {}) {
  let c = props.city || props.town || props.municipality || props.county || props.state || '';
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
 * Query Photon Komoot API with optional location biasing
 */
export async function searchPhotonPlaces(query, biasCoords = null) {
  const trimmed = (query || '').trim();
  if (!trimmed || trimmed.length < 2) return [];

  // Cancel prior request if still in flight
  if (activeAbortController) {
    activeAbortController.abort();
  }
  activeAbortController = new AbortController();

  let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=6`;
  if (biasCoords && typeof biasCoords.lat === 'number' && typeof biasCoords.lng === 'number') {
    url += `&lat=${biasCoords.lat}&lon=${biasCoords.lng}`;
  }

  try {
    const res = await fetch(url, { signal: activeAbortController.signal });
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
    console.warn('Photon autocomplete failed:', err);
    return [];
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
