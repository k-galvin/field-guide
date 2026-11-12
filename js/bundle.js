(function() {
"use strict";

// --- js/storage.js ---
// Storage management for Archival Field Guide

const STORAGE_KEY = 'flaneur_spots_v2';
const CITIES_KEY = 'flaneur_cities_v1';

const DEFAULT_CITIES = [
  'Amsterdam', 'Avignon', 'Barcelona', 'Berlin', 'Boston', 'Budapest',
  'Chicago', 'Copenhagen', 'Costa Mesa', 'Dublin', 'Edinburgh', 'Encinitas',
  'English Countryside', 'Florence', 'Giverny', 'Helsinki', 'Huntington Beach',
  'Iceland', 'Irish Countryside', 'Joshua Tree', 'Kyoto', 'Laguna Beach',
  'Lisbon', 'Loire Valley', 'London', 'Los Angeles', 'Melbourne', 'Mexico City',
  'Montreal', 'Newport Beach', 'New York', 'Nice', 'Orange', 'Orange County',
  'Oslo', 'Paris', 'Phoenix', 'Portland', 'Prague', 'Quebec City', 'Rome',
  'San Diego', 'San Francisco', 'Santa Ana', 'Santa Fe', 'Scottish Countryside',
  'Seattle', 'Stockholm', 'Sydney', 'Tokyo', 'Vancouver', 'Venice', 'Vienna'
];

const KNOWN_CITY_META = {
  'orange county': { code: 'OC', country: 'California, USA', region: 'americas', type: 'county' },
  'loire valley': { code: 'LOI', country: 'France', region: 'europe', type: 'area' },
  'english countryside': { code: 'ENG', country: 'United Kingdom', region: 'europe', type: 'area' },
  'scottish countryside': { code: 'SCO', country: 'Scotland, UK', region: 'europe', type: 'area' },
  'irish countryside': { code: 'IRE', country: 'Ireland', region: 'europe', type: 'area' },
  'iceland': { code: 'ICE', country: 'Iceland', region: 'europe', type: 'area' },
  'giverny': { code: 'GIV', country: 'France', region: 'europe', type: 'area' },
  'boston': { code: 'BOS', country: 'Massachusetts, USA', region: 'americas', type: 'city' },
  'barcelona': { code: 'BCN', country: 'Spain', region: 'europe', type: 'city' },
  'seattle': { code: 'SEA', country: 'Washington, USA', region: 'americas', type: 'city' },
  'portland': { code: 'PDX', country: 'Oregon, USA', region: 'americas', type: 'city' },
  'santa fe': { code: 'SAF', country: 'New Mexico, USA', region: 'americas', type: 'city' },
  'phoenix': { code: 'PHX', country: 'Arizona, USA', region: 'americas', type: 'city' },
  'chicago': { code: 'ORD', country: 'Illinois, USA', region: 'americas', type: 'city' },
  'vancouver': { code: 'YVR', country: 'Canada', region: 'americas', type: 'city' },
  'quebec city': { code: 'YQB', country: 'Canada', region: 'americas', type: 'city' },
  'avignon': { code: 'AVN', country: 'France', region: 'europe', type: 'city' },
  'nice': { code: 'NCE', country: 'France', region: 'europe', type: 'city' },
  'rome': { code: 'ROM', country: 'Italy', region: 'europe', type: 'city' },
  'venice': { code: 'VCE', country: 'Italy', region: 'europe', type: 'city' },
  'florence': { code: 'FLR', country: 'Italy', region: 'europe', type: 'city' },
  'dublin': { code: 'DUB', country: 'Ireland', region: 'europe', type: 'city' },
  'costa mesa': { code: 'SNA', country: 'California, USA', region: 'americas', type: 'city' },
  'newport beach': { code: 'NPB', country: 'California, USA', region: 'americas', type: 'city' },
  'laguna beach': { code: 'LGB', country: 'California, USA', region: 'americas', type: 'city' },
  'irvine': { code: 'IRV', country: 'California, USA', region: 'americas', type: 'city' },
  'anaheim': { code: 'ANA', country: 'California, USA', region: 'americas', type: 'city' },
  'garden grove': { code: 'GG', country: 'California, USA', region: 'americas', type: 'city' },
  'fountain valley': { code: 'FV', country: 'California, USA', region: 'americas', type: 'city' },
  'dana point': { code: 'DP', country: 'California, USA', region: 'americas', type: 'city' },
  'san diego': { code: 'SAN', country: 'California, USA', region: 'americas', type: 'city' },
  'joshua tree': { code: 'JTR', country: 'California, USA', region: 'americas', type: 'area' },
  'napa valley': { code: 'NAP', country: 'California, USA', region: 'americas', type: 'area' },
  'cotswolds': { code: 'COT', country: 'UK', region: 'europe', type: 'area' },
  'hudson valley': { code: 'HUD', country: 'New York, USA', region: 'americas', type: 'area' },
  'tuscany': { code: 'TUS', country: 'Italy', region: 'europe', type: 'area' },
  'budapest': { code: 'BUD', country: 'Hungary', region: 'europe' },
  'santa ana': { code: 'SNA', country: 'California, USA', region: 'americas' },
  'orange': { code: 'ORA', country: 'California, USA', region: 'americas' },
  'huntington beach': { code: 'HB', country: 'California, USA', region: 'americas' },
  'encinitas': { code: 'ENC', country: 'California, USA', region: 'americas' },
  'tokyo': { code: 'TYO', country: 'Japan', region: 'asia_pacific' },
  'paris': { code: 'PAR', country: 'France', region: 'europe' },
  'los angeles': { code: 'LAX', country: 'USA', region: 'americas' },
  'copenhagen': { code: 'CPH', country: 'Denmark', region: 'europe' },
  'new york': { code: 'NYC', country: 'USA', region: 'americas' },
  'london': { code: 'LON', country: 'UK', region: 'europe' },
  'lisbon': { code: 'LIS', country: 'Portugal', region: 'europe' },
  'san francisco': { code: 'SFO', country: 'USA', region: 'americas' },
  'kyoto': { code: 'KYO', country: 'Japan', region: 'asia_pacific' },
  'berlin': { code: 'BER', country: 'Germany', region: 'europe' },
  'rome': { code: 'ROM', country: 'Italy', region: 'europe' },
  'milan': { code: 'MIL', country: 'Italy', region: 'europe' },
  'venice': { code: 'VCE', country: 'Italy', region: 'europe' },
  'mexico city': { code: 'CDMX', country: 'Mexico', region: 'americas' },
  'seoul': { code: 'SEL', country: 'South Korea', region: 'asia_pacific' },
  'amsterdam': { code: 'AMS', country: 'Netherlands', region: 'europe' },
  'vienna': { code: 'VIE', country: 'Austria', region: 'europe' },
  'barcelona': { code: 'BCN', country: 'Spain', region: 'europe' },
  'madrid': { code: 'MAD', country: 'Spain', region: 'europe' },
  'stockholm': { code: 'ARN', country: 'Sweden', region: 'europe' },
  'oslo': { code: 'OSL', country: 'Norway', region: 'europe' },
  'helsinki': { code: 'HEL', country: 'Finland', region: 'europe' },
  'porto': { code: 'OPO', country: 'Portugal', region: 'europe' },
  'prague': { code: 'PRG', country: 'Czech Republic', region: 'europe' },
  'dublin': { code: 'DUB', country: 'Ireland', region: 'europe' },
  'edinburgh': { code: 'EDI', country: 'UK', region: 'europe' },
  'rotterdam': { code: 'RTM', country: 'Netherlands', region: 'europe' },
  'dessau': { code: 'DES', country: 'Germany', region: 'europe' },
  'kobe': { code: 'UKB', country: 'Japan', region: 'asia_pacific' },
  'vancouver': { code: 'YVR', country: 'Canada', region: 'americas' },
  'toronto': { code: 'YYZ', country: 'Canada', region: 'americas' },
  'montreal': { code: 'YUL', country: 'Canada', region: 'americas' },
  'são paulo': { code: 'GRU', country: 'Brazil', region: 'americas' },
  'sao paulo': { code: 'GRU', country: 'Brazil', region: 'americas' },
  'buenos aires': { code: 'EZE', country: 'Argentina', region: 'americas' },
  'austin': { code: 'AUS', country: 'USA', region: 'americas' },
  'seattle': { code: 'SEA', country: 'USA', region: 'americas' },
  'nashville': { code: 'BNA', country: 'USA', region: 'americas' },
  'new orleans': { code: 'MSY', country: 'USA', region: 'americas' },
  'detroit': { code: 'DTW', country: 'USA', region: 'americas' },
  'philadelphia': { code: 'PHL', country: 'USA', region: 'americas' },
  'chicago': { code: 'ORD', country: 'USA', region: 'americas' },
  'miami': { code: 'MIA', country: 'USA', region: 'americas' },
  'marrakesh': { code: 'RAK', country: 'Morocco', region: 'europe' },
  'istanbul': { code: 'IST', country: 'Turkey', region: 'europe' },
  'bangkok': { code: 'BKK', country: 'Thailand', region: 'asia_pacific' },
  'hong kong': { code: 'HKG', country: 'Hong Kong', region: 'asia_pacific' },
  'mumbai': { code: 'BOM', country: 'India', region: 'asia_pacific' },
  'munich': { code: 'MUC', country: 'Germany', region: 'europe' },
  'hanoi': { code: 'HAN', country: 'Vietnam', region: 'asia_pacific' },
  'auckland': { code: 'AKL', country: 'New Zealand', region: 'asia_pacific' },
  'florence': { code: 'FLR', country: 'Italy', region: 'europe' },
  'geneva': { code: 'GVA', country: 'Switzerland', region: 'europe' },
  'lyon': { code: 'LYS', country: 'France', region: 'europe' },
  'manchester': { code: 'MAN', country: 'UK', region: 'europe' },
  'portland': { code: 'PDX', country: 'USA', region: 'americas' },
  'düsseldorf': { code: 'DUS', country: 'Germany', region: 'europe' },
  'dusseldorf': { code: 'DUS', country: 'Germany', region: 'europe' },
  'leipzig': { code: 'LEJ', country: 'Germany', region: 'europe' },
  'ikast': { code: 'IKA', country: 'Denmark', region: 'europe' },
  'antwerp': { code: 'ANR', country: 'Belgium', region: 'europe' },
  'lagos': { code: 'LOS', country: 'Nigeria', region: 'europe' },
  'kyiv': { code: 'IEV', country: 'Ukraine', region: 'europe' },
  'oxford': { code: 'OXF', country: 'UK', region: 'europe' },
  'liverpool': { code: 'LPL', country: 'UK', region: 'europe' },
  'memphis': { code: 'MEM', country: 'USA', region: 'americas' },
  'melbourne': { code: 'MEL', country: 'Australia', region: 'asia_pacific' },
  'sydney': { code: 'SYD', country: 'Australia', region: 'asia_pacific' }
};

const DESTINATION_TYPES = {
  CITY: 'city',
  COUNTY: 'county',
  AREA: 'area'
};

const DESTINATION_TYPE_LABELS = {
  city: 'City',
  county: 'County',
  area: 'Area'
};

const DESTINATION_TYPES_KEY = 'flaneur_destination_types_v1';

function getCustomDestinationTypes() {
  try {
    const raw = localStorage.getItem(DESTINATION_TYPES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

function saveDestinationType(destinationName, type) {
  if (!destinationName || !type) return;
  try {
    const types = getCustomDestinationTypes();
    types[destinationName.toLowerCase().trim()] = type;
    localStorage.setItem(DESTINATION_TYPES_KEY, JSON.stringify(types));
  } catch (e) {
    console.error('Failed to save destination type', e);
  }
}

function detectDestinationType(name) {
  if (!name) return 'city';
  const lower = name.toLowerCase().trim();
  const customTypes = getCustomDestinationTypes();
  if (customTypes[lower]) {
    return customTypes[lower];
  }
  if (KNOWN_CITY_META[lower] && KNOWN_CITY_META[lower].type) {
    return KNOWN_CITY_META[lower].type;
  }
  if (/\bcounty\b/i.test(lower)) {
    return 'county';
  }
  if (/\b(valley|area|region|coast|desert|islands?|hills|district|cotswolds)\b/i.test(lower)) {
    return 'area';
  }
  return 'city';
}

function getDestinationMeta(cityName) {
  if (!cityName) {
    return {
      code: '---',
      country: 'Destination',
      region: 'other',
      type: 'city',
      typeLabel: 'City'
    };
  }
  const lower = cityName.toLowerCase().trim();
  const customTypes = getCustomDestinationTypes();
  const detectedType = customTypes[lower] || detectDestinationType(cityName);

  if (KNOWN_CITY_META[lower]) {
    const meta = KNOWN_CITY_META[lower];
    const type = customTypes[lower] || meta.type || detectedType;
    return {
      code: meta.code,
      country: meta.country,
      region: meta.region || 'other',
      type: type,
      typeLabel: DESTINATION_TYPE_LABELS[type] || 'Destination'
    };
  }

  const code = cityName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'DST';
  return {
    code,
    country: 'Destination',
    region: 'other',
    type: detectedType,
    typeLabel: DESTINATION_TYPE_LABELS[detectedType] || 'Destination'
  };
}

function getCityMeta(cityName) {
  return getDestinationMeta(cityName);
}

function getCityRegion(cityName) {
  const meta = getDestinationMeta(cityName);
  return meta.region || 'other';
}

const CATEGORIES = [
  {
    id: 'matcha_coffee',
    label: 'coffee & matcha',
    code: '01',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>'
  },
  {
    id: 'pastry_bakery',
    label: 'bakery & pastry',
    code: '02',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17c1-3 3-7 8-7s7 4 8 7"></path><path d="M3 13c1.5-4 5.5-8 9-8s7.5 4 9 8"></path><path d="M7 16a3 3 0 0 1 5-2 3 3 0 0 1 5 2"></path></svg>'
  },
  {
    id: 'brunch_lunch',
    label: 'brunch & lunch',
    code: '03',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"></path><path d="M15 2v19"></path><path d="M5 2v19"></path><path d="M2 2v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V2"></path></svg>'
  },
  {
    id: 'food_wine',
    label: 'dining & wine',
    code: '04',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"></path><path d="M12 15v7"></path><path d="M12 15a5 5 0 0 0 5-5V3H7v7a5 5 0 0 0 5 5z"></path></svg>'
  },
  {
    id: 'bars_nightlife',
    label: 'bars & nightlife',
    code: '05',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"></path><path d="M12 11v11"></path><path d="m19 3-7 8-7-8Z"></path></svg>'
  },
  {
    id: 'hotels_stays',
    label: 'hotels & stays',
    code: '06',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg>'
  },
  {
    id: 'shops_retail',
    label: 'shops & boutiques',
    code: '07',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>'
  },
  {
    id: 'museums_art',
    label: 'museums & galleries',
    code: '08',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="22" x2="22" y2="22"></line><line x1="4" y1="9" x2="4" y2="20"></line><line x1="9" y1="9" x2="9" y2="20"></line><line x1="15" y1="9" x2="15" y2="20"></line><line x1="20" y1="9" x2="20" y2="20"></line><polygon points="12 2 2 7 22 7"></polygon></svg>'
  },
  {
    id: 'concerts_music',
    label: 'concerts & music',
    code: '09',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
  },
  {
    id: 'ceramics_craft',
    label: 'ceramics & craft',
    code: '10',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"></path><path d="M9 3v2c0 1-2 2-3 4-1.5 3-1 6 1 8 1.5 1.5 2 2.5 2 4h6c0-1.5.5-2.5 2-4 2-2 2.5-5 1-8-1-2-3-3-3-4V3"></path><line x1="7" y1="21" x2="17" y2="21"></line></svg>'
  },
  {
    id: 'books',
    label: 'books',
    code: '11',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
  },
  {
    id: 'theater_cinema',
    label: 'theater & cinema',
    code: '12',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"></rect><line x1="7" x2="7" y1="2" y2="22"></line><line x1="17" x2="17" y1="2" y2="22"></line><line x1="2" x2="22" y1="12" y2="12"></line><line x1="2" x2="7" y1="7" y2="7"></line><line x1="2" x2="7" y1="17" y2="17"></line><line x1="17" x2="22" y1="17" y2="17"></line><line x1="17" x2="22" y1="7" y2="7"></line></svg>'
  },
  {
    id: 'parks_nature',
    label: 'parks & gardens',
    code: '13',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>'
  },
  {
    id: 'surf_movement',
    label: 'surf & movement',
    code: '14',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13c3-3 6-3 9 0s6 3 9 0"></path><path d="M2 17c3-3 6-3 9 0s6 3 9 0"></path><path d="M2 9c3-3 6-3 9 0s6 3 9 0"></path></svg>'
  },
  {
    id: 'other',
    label: 'other',
    code: '00',
    color: '#888888',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>'
  }
];

const CATEGORY_MAP = new Map(CATEGORIES.map(c => [c.id, c]));
// Alias books_cinema for seamless backwards compatibility
CATEGORY_MAP.set('books_cinema', CATEGORY_MAP.get('books'));

function normalizeSpotCategory(spot) {
  if (!spot) return spot;
  if (spot.category === 'books_cinema') {
    const text = `${spot.name || ''} ${spot.notes || ''}`.toLowerCase();
    if (/cinema|film|theatre|theater|repertory|movie|screening/.test(text)) {
      spot.category = 'theater_cinema';
    } else {
      spot.category = 'books';
    }
  }
  return spot;
}

function getStoredCities() {
  try {
    const raw = localStorage.getItem(CITIES_KEY);
    if (!raw) return DEFAULT_CITIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CITIES;
  } catch (e) {
    return DEFAULT_CITIES;
  }
}

function saveStoredCities(cities) {
  try {
    localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
  } catch (e) {
    console.error('Failed to save cities', e);
  }
}

function sortSpotsDeterministically(spotsList) {
  if (!Array.isArray(spotsList)) return [];
  return [...spotsList].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
  });
}

function getStoredSpots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const normalized = parsed.map(normalizeSpotCategory);
    return sortSpotsDeterministically(normalized);
  } catch (e) {
    console.error('Failed to parse stored spots', e);
    return null;
  }
}

let lastSavedSpotsLength = -1;
let lastSavedFirstId = '';

function saveStoredSpots(spots) {
  try {
    if (!Array.isArray(spots)) return;
    if (spots.length === lastSavedSpotsLength && spots.length > 0 && spots[0].id === lastSavedFirstId) {
      return; // Skip redundant serialization and localStorage write
    }
    const sorted = sortSpotsDeterministically(spots);
    // Sanitize any massive data URLs to safeguard localStorage quota
    const sanitized = sorted.map(s => {
      if (s.photoUrl && s.photoUrl.startsWith('data:image') && s.photoUrl.length > 5000) {
        const { photoUrl, ...rest } = s;
        return rest;
      }
      return s;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    lastSavedSpotsLength = sorted.length;
    lastSavedFirstId = sorted.length > 0 ? sorted[0].id : '';
  } catch (e) {
    console.error('Failed to save spots to localStorage', e);
  }
}

function exportBackupJSON(spots, cities) {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    cities: cities || getStoredCities(),
    spots: spots || getStoredSpots() || []
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `archival-field-guide-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


// --- js/sample-data.js ---
// Sample curated spots for initial load with verified editorial photography across all categories

const SAMPLE_SPOTS = [
  // --- TOKYO ---
  {
    id: 'tokyo-1',
    name: 'Koffee Mameya Kakeru',
    city: 'Tokyo',
    neighborhood: 'Kiyosumi Shirakawa',
    category: 'matcha_coffee',
    status: 'visited',
    favorite: true,
    lat: 35.6811,
    lng: 139.8078,
    daysOpen: 'Thu-Tue',
    hours: '11:00 - 19:00',
    notes: 'Incredible coffee omakase tasting menu. Quiet, meditative space designed with dark wood counters.',
    visitDate: '2025-04-12',
    photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-2',
    name: 'Satén Japanese Tea',
    city: 'Tokyo',
    neighborhood: 'Nishi-Ogikubo',
    category: 'matcha_coffee',
    status: 'visited',
    favorite: true,
    lat: 35.7032,
    lng: 139.5985,
    daysOpen: 'Tue-Sun',
    hours: '10:00 - 19:00',
    notes: 'The ceremonial matcha latte with layered milk is perfection. Sit near the wood window counter.',
    visitDate: '2025-04-14',
    photoUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-3',
    name: 'Meguro Pottery Studio & Gallery',
    city: 'Tokyo',
    neighborhood: 'Meguro',
    category: 'ceramics_craft',
    status: 'wishlist',
    favorite: false,
    lat: 35.6339,
    lng: 139.7158,
    daysOpen: 'Wed-Sun',
    hours: '12:00 - 18:00',
    notes: 'Handmade stoneware vessels by contemporary regional potters. Minimal raw wood display plinths.',
    visitDate: '',
    photoUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-4',
    name: 'Daikanyama T-Site (Tsutaya Books)',
    city: 'Tokyo',
    neighborhood: 'Daikanyama',
    category: 'books',
    status: 'visited',
    favorite: true,
    lat: 35.6492,
    lng: 139.6998,
    daysOpen: 'Daily',
    hours: '09:00 - 22:00',
    notes: 'Architectural masterpiece by Klein Dytham. Exceptional design, architecture, and film magazine archive.',
    visitDate: '2025-04-15',
    photoUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-5',
    name: 'Buvette Tokyo',
    city: 'Tokyo',
    neighborhood: 'Yurakucho',
    category: 'pastry_bakery',
    status: 'wishlist',
    favorite: false,
    lat: 35.6738,
    lng: 139.7594,
    daysOpen: 'Daily',
    hours: '11:00 - 21:00',
    notes: 'Steamed walnut bread and chocolate mousse; lovely spot to pause before an afternoon walk.',
    visitDate: '',
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-6',
    name: '21_21 Design Sight',
    city: 'Tokyo',
    neighborhood: 'Roppongi',
    category: 'museums_art',
    status: 'visited',
    favorite: true,
    lat: 35.6664,
    lng: 139.7303,
    daysOpen: 'Wed-Mon',
    hours: '10:00 - 19:00',
    notes: 'Subterranean design museum conceived by Issey Miyake and Tadao Ando. Clean concrete angles with thoughtful material exhibitions.',
    visitDate: '2025-04-13',
    photoUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-7',
    name: 'Dover Street Market Ginza',
    city: 'Tokyo',
    neighborhood: 'Ginza',
    category: 'shops_retail',
    status: 'visited',
    favorite: false,
    lat: 35.6702,
    lng: 139.7635,
    daysOpen: 'Daily',
    hours: '11:00 - 20:00',
    notes: 'Seven floors of avant-garde fashion installations, Comme des Garçons archives, and Rose Bakery on the top floor.',
    visitDate: '2025-04-16',
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-8',
    name: 'Blue Note Tokyo',
    city: 'Tokyo',
    neighborhood: 'Minami-Aoyama',
    category: 'concerts_music',
    status: 'wishlist',
    favorite: true,
    lat: 35.6617,
    lng: 139.7153,
    daysOpen: 'Daily',
    hours: '17:30 - 23:00',
    notes: 'Intimate live jazz hall with legendary acoustics, low mood lighting, and impeccable Japanese service.',
    visitDate: '',
    photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tokyo-9',
    name: 'Meiji Jingu Gyoen & Forest Walk',
    city: 'Tokyo',
    neighborhood: 'Shibuya',
    category: 'parks_nature',
    status: 'visited',
    favorite: true,
    lat: 35.6764,
    lng: 139.6993,
    daysOpen: 'Daily',
    hours: '06:00 - 18:00',
    notes: 'Towering cedar and cypress canopy, soft gravel pathways, and the secluded inner iris garden pond.',
    visitDate: '2025-04-11',
    photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
  },

  // --- PARIS ---
  {
    id: 'paris-1',
    name: 'Mokonuts',
    city: 'Paris',
    neighborhood: '11th Arr. (Voltaire)',
    category: 'pastry_bakery',
    status: 'visited',
    favorite: true,
    lat: 48.8524,
    lng: 2.3831,
    daysOpen: 'Mon-Fri',
    hours: '09:00 - 16:30',
    notes: 'Legendary rye miso chocolate chip cookies and seasonal savory lunch plates. Reservations essential.',
    visitDate: '2024-10-08',
    photoUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paris-2',
    name: 'Ten Belles Bread',
    city: 'Paris',
    neighborhood: '11th Arr. / Bastille',
    category: 'pastry_bakery',
    status: 'visited',
    favorite: false,
    lat: 48.8541,
    lng: 2.3789,
    daysOpen: 'Daily',
    hours: '08:30 - 18:00',
    notes: 'Crisp sourdough focaccia with sea salt and rosemary, plus great oat flat whites.',
    visitDate: '2024-10-09',
    photoUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paris-3',
    name: 'Atelier Céramique Marais',
    city: 'Paris',
    neighborhood: 'Le Marais',
    category: 'ceramics_craft',
    status: 'wishlist',
    favorite: true,
    lat: 48.8598,
    lng: 2.3621,
    daysOpen: 'Wed-Sat',
    hours: '11:00 - 19:00',
    notes: 'Delicate porcelain and textured stoneware cups by independent French ceramicists.',
    visitDate: '',
    photoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paris-4',
    name: 'Cinéma du Panthéon & Salon de Thé',
    city: 'Paris',
    neighborhood: '5th Arr. (Latin Quarter)',
    category: 'theater_cinema',
    status: 'wishlist',
    favorite: false,
    lat: 48.8471,
    lng: 2.3444,
    daysOpen: 'Daily',
    hours: '13:30 - 22:30',
    notes: 'One of the oldest functioning indie cinemas in Paris. The loft tea salon was designed by Catherine Deneuve.',
    visitDate: '',
    photoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paris-5',
    name: 'Dreamin Man Café',
    city: 'Paris',
    neighborhood: '11th Arr.',
    category: 'matcha_coffee',
    status: 'visited',
    favorite: true,
    lat: 48.8631,
    lng: 2.3705,
    daysOpen: 'Wed-Sun',
    hours: '09:00 - 17:00',
    notes: 'Cozy, rustic specialty coffee bar run by Yuichiro & Yui. Warm Japanese hospitality and fresh scones.',
    visitDate: '2024-10-10',
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paris-6',
    name: 'Bourse de Commerce (Pinault Collection)',
    city: 'Paris',
    neighborhood: '1st Arr. (Les Halles)',
    category: 'museums_art',
    status: 'visited',
    favorite: true,
    lat: 48.8628,
    lng: 2.3429,
    daysOpen: 'Wed-Mon',
    hours: '11:00 - 19:00',
    notes: '18th-century grain exchange transformed by Tadao Ando with a massive raw concrete cylinder under glass dome frescoes.',
    visitDate: '2024-10-07',
    photoUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paris-7',
    name: 'Merci Paris',
    city: 'Paris',
    neighborhood: 'Le Marais',
    category: 'shops_retail',
    status: 'visited',
    favorite: true,
    lat: 48.8604,
    lng: 2.3667,
    daysOpen: 'Mon-Sat',
    hours: '10:00 - 19:30',
    notes: 'Sunlit loft space with washed linen bedding, vintage homewares, indie garments, and the courtyard Fiat 500.',
    visitDate: '2024-10-09',
    photoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paris-8',
    name: 'Philharmonie de Paris',
    city: 'Paris',
    neighborhood: '19th Arr. (La Villette)',
    category: 'concerts_music',
    status: 'wishlist',
    favorite: false,
    lat: 48.8916,
    lng: 2.3942,
    daysOpen: 'Tue-Sun',
    hours: 'Times vary by show',
    notes: 'Jean Nouvel metallic folded-bird exterior with an organic vineyard-style auditorium delivering crisp acoustic immersion.',
    visitDate: '',
    photoUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paris-9',
    name: 'Jardin du Palais Royal',
    city: 'Paris',
    neighborhood: '1st Arr.',
    category: 'parks_nature',
    status: 'visited',
    favorite: true,
    lat: 48.8648,
    lng: 2.3372,
    daysOpen: 'Daily',
    hours: '08:00 - 20:30',
    notes: 'Striped Daniel Buren columns in the inner cour, shaded double rows of linden trees, and central fountain.',
    visitDate: '2024-10-08',
    photoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
  },

  // --- LOS ANGELES ---
  {
    id: 'la-1',
    name: 'Maru Coffee',
    city: 'Los Angeles',
    neighborhood: 'Los Feliz',
    category: 'matcha_coffee',
    status: 'visited',
    favorite: true,
    lat: 34.1018,
    lng: -118.2872,
    daysOpen: 'Daily',
    hours: '07:00 - 17:00',
    notes: 'Minimalist wood aesthetic, incredible Iced Long Black and signature Cream Top latte.',
    visitDate: '2025-08-20',
    photoUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la-2',
    name: 'Still Life Ceramics',
    city: 'Los Angeles',
    neighborhood: 'Row DTLA',
    category: 'ceramics_craft',
    status: 'visited',
    favorite: true,
    lat: 34.0326,
    lng: -118.2392,
    daysOpen: 'Daily',
    hours: '11:00 - 18:00',
    notes: 'Beautiful studio space with curated shelves of ceramics by local LA makers and glaze inspirations.',
    visitDate: '2025-08-22',
    photoUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la-3',
    name: 'Dayglow Coffee & Matcha',
    city: 'Los Angeles',
    neighborhood: 'Silver Lake',
    category: 'matcha_coffee',
    status: 'wishlist',
    favorite: false,
    lat: 34.0862,
    lng: -118.2731,
    daysOpen: 'Daily',
    hours: '07:00 - 16:00',
    notes: 'Pastel aesthetic, rotating international roasters, and inventive seasonal matcha concoctions.',
    visitDate: '',
    photoUrl: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la-4',
    name: 'Malibu First Point / Surfrider Beach',
    city: 'Los Angeles',
    neighborhood: 'Malibu',
    category: 'surf_movement',
    status: 'visited',
    favorite: true,
    lat: 34.0353,
    lng: -118.6775,
    daysOpen: 'Daily',
    hours: 'Dawn to Dusk',
    notes: 'Classic peeling right-hand point break. Best on S/SW swell at low to mid tide with a longboard.',
    visitDate: '2025-07-14',
    photoUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la-5',
    name: 'Skylight Books & Arts Annex',
    city: 'Los Angeles',
    neighborhood: 'Los Feliz',
    category: 'books',
    status: 'visited',
    favorite: false,
    lat: 34.1022,
    lng: -118.2879,
    daysOpen: 'Daily',
    hours: '10:00 - 22:00',
    notes: 'Iconic independent bookstore anchored around a ficus tree. Great film essays and literary fiction section.',
    visitDate: '2025-08-20',
    photoUrl: 'https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la-6',
    name: 'The Broad',
    city: 'Los Angeles',
    neighborhood: 'Downtown LA',
    category: 'museums_art',
    status: 'visited',
    favorite: true,
    lat: 34.0545,
    lng: -118.2505,
    daysOpen: 'Tue-Sun',
    hours: '11:00 - 17:00',
    notes: 'Honeycomb facade filtering diffused daylight across contemporary works by Barbara Kruger, Basquiat, and Kusama.',
    visitDate: '2025-08-19',
    photoUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la-7',
    name: 'Mohawk General Store',
    city: 'Los Angeles',
    neighborhood: 'Silver Lake',
    category: 'shops_retail',
    status: 'visited',
    favorite: false,
    lat: 34.0798,
    lng: -118.2612,
    daysOpen: 'Daily',
    hours: '11:00 - 19:00',
    notes: 'Curated menswear, womenswear, and bespoke homewares in the heart of Sunset Junction.',
    visitDate: '2025-08-21',
    photoUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la-8',
    name: 'Walt Disney Concert Hall',
    city: 'Los Angeles',
    neighborhood: 'Downtown LA',
    category: 'concerts_music',
    status: 'wishlist',
    favorite: true,
    lat: 34.0553,
    lng: -118.2498,
    daysOpen: 'Daily',
    hours: 'Times vary by show',
    notes: 'Sculptural stainless-steel curves by Frank Gehry with warmth-radiating Douglas fir auditorium interiors.',
    visitDate: '',
    photoUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la-9',
    name: 'The Huntington Japanese & Desert Gardens',
    city: 'Los Angeles',
    neighborhood: 'San Marino',
    category: 'parks_nature',
    status: 'visited',
    favorite: true,
    lat: 34.1293,
    lng: -118.1145,
    daysOpen: 'Wed-Mon',
    hours: '10:00 - 17:00',
    notes: 'Moon bridge, koi pond, tranquil bonsai court, and extraordinary collection of arid desert succulents.',
    visitDate: '2025-08-23',
    photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
  },
  // --- IRISH COUNTRYSIDE ---
  {
    id: 'irish-countryside-ballymaloe',
    name: 'Ballymaloe House Hotel',
    city: 'Irish Countryside',
    neighborhood: 'Shanagarry, Co. Cork',
    category: 'hotels_stays',
    status: 'wishlist',
    favorite: true,
    lat: 51.865236,
    lng: -8.074810,
    daysOpen: 'Daily',
    hours: 'Check-in 15:00 · Dinner 18:30 - 21:00',
    notes: 'Historic 17th-century country house hotel and birthplace of modern Irish farm-to-table cuisine founded by Myrtle Allen. Surrounded by rolling East Cork farmland, herb gardens, and walled orchards.',
    visitDate: '',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Ballymaloe_House.jpg'
  },
  {
    id: 'irish-countryside-dingle-fish',
    name: 'The Fish Box (Reel Dingle Fish)',
    city: 'Irish Countryside',
    neighborhood: 'Green Street, Dingle, Co. Kerry',
    category: 'food_wine',
    status: 'wishlist',
    favorite: true,
    lat: 52.139439,
    lng: -10.270988,
    daysOpen: 'Daily',
    hours: '12:00 - 20:30',
    notes: 'Legendary Dingle Peninsula seafood bar run by the Flannery fishing family. Haddock, monkfish, and prawns caught fresh on their own trawler Cú Na Mara, served with twice-cooked chips.',
    visitDate: '',
    photoUrl: 'https://images.squarespace-cdn.com/content/v1/5ec6700a8c6c3903c4ccdccb/ff734877-c2ea-4f66-a819-fd4b97e36303/DSC00169.jpg'
  },
  {
    id: 'irish-countryside-powerscourt',
    name: 'Powerscourt Estate & Gardens',
    city: 'Irish Countryside',
    neighborhood: 'Enniskerry, Co. Wicklow',
    category: 'parks_nature',
    status: 'wishlist',
    favorite: true,
    lat: 53.185102,
    lng: -6.187131,
    daysOpen: 'Daily',
    hours: '09:30 - 17:30',
    notes: 'Voted one of National Geographic top 3 gardens in the world. 47 acres of terraced Italian gardens, Japanese gardens, Triton Lake fountain, and breathtaking views of the Sugarloaf Mountain.',
    visitDate: '',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Enniskerry_-_Powerscourt_Estate_-_20130224152008.jpg/1280px-Enniskerry_-_Powerscourt_Estate_-_20130224152008.jpg'
  },
  // --- DUBLIN ---
  {
    id: 'dublin-dunne-crescenzi',
    name: 'Dunne & Crescenzi',
    city: 'Dublin',
    neighborhood: 'South Frederick Street, Dublin 2',
    category: 'food_wine',
    status: 'wishlist',
    favorite: true,
    lat: 53.342279,
    lng: -6.256654,
    daysOpen: 'Daily',
    hours: '12:00 - 22:00',
    notes: 'Beloved Dublin institution founded by Eileen Dunne and Stefano Crescenzi. Renowned for authentic rustic Italian trattoria dining, walls stacked with boutique Italian vintages, handmade pasta, and aged prosciutto.',
    visitDate: '',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Frederick_St%2C_South_-_geograph.org.uk_-_6411328.jpg'
  },
  // --- SCOTTISH COUNTRYSIDE ---
  {
    id: 'scottish-countryside-threave-garden',
    name: 'Threave Garden & Estate',
    city: 'Scottish Countryside',
    neighborhood: 'Castle Douglas, Dumfries & Galloway',
    category: 'parks_nature',
    status: 'wishlist',
    favorite: true,
    lat: 54.924836,
    lng: -3.948683,
    daysOpen: 'Daily',
    hours: '10:00 - 17:00',
    notes: 'National Trust for Scotland showcase estate and School of Heritage Gardening. Features sweeping landscaped grounds, rock garden with cascading water, walled garden, and tranquil views toward Threave Castle.',
    visitDate: '',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Threave_Estate_Garden_-_geograph.org.uk_-_5051691.jpg/1280px-Threave_Estate_Garden_-_geograph.org.uk_-_5051691.jpg'
  },
  // --- ENGLISH COUNTRYSIDE ---
  {
    id: 'english-countryside-hidcote-gardens',
    name: 'Hidcote Manor Garden',
    city: 'English Countryside',
    neighborhood: 'Chipping Campden, Cotswolds',
    category: 'parks_nature',
    status: 'wishlist',
    favorite: true,
    lat: 52.083622,
    lng: -1.745333,
    daysOpen: 'Daily',
    hours: '10:00 - 17:00',
    notes: 'Masterpiece Arts and Crafts garden created by Lawrence Johnston. Famed for its series of intimate outdoor garden rooms framed by hornbeam and yew hedges, rare exotic species, and sculpted topiary.',
    visitDate: '',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Hidcote_Manor_Garden_-_geograph.org.uk_-_4299001.jpg/1280px-Hidcote_Manor_Garden_-_geograph.org.uk_-_4299001.jpg'
  },
  {
    id: 'english-countryside-leeds-castle',
    name: 'Leeds Castle',
    city: 'English Countryside',
    neighborhood: 'Maidstone, Kent',
    category: 'museums_art',
    status: 'wishlist',
    favorite: true,
    lat: 51.248447,
    lng: 0.630023,
    daysOpen: 'Daily',
    hours: '10:00 - 17:00',
    notes: 'The loveliest castle in the world, rising on two islands in a magnificent lake. Former royal residence of six medieval queens of England and Henry VIII, surrounded by 500 acres of landscaped parkland.',
    visitDate: '',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Leeds_Castle%2C_Kent%2C_England_3_-_May_09.jpg/1280px-Leeds_Castle%2C_Kent%2C_England_3_-_May_09.jpg'
  },
  {
    id: 'english-countryside-hever-castle',
    name: 'Hever Castle',
    city: 'English Countryside',
    neighborhood: 'Edenbridge, Kent',
    category: 'museums_art',
    status: 'wishlist',
    favorite: true,
    lat: 51.186909,
    lng: 0.113735,
    daysOpen: 'Daily',
    hours: '10:30 - 18:00',
    notes: 'Romantic 13th-century double-moated castle and childhood home of Anne Boleyn. Houses Tudor portraits, tapestries, and award-winning Italianate gardens overlooking a 38-acre lake.',
    visitDate: '',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Hever_Castle_across_Church_Field_2.jpg/1280px-Hever_Castle_across_Church_Field_2.jpg'
  },
  {
    id: 'english-countryside-sissinghurst-gardens',
    name: 'Sissinghurst Castle Garden',
    city: 'English Countryside',
    neighborhood: 'Cranbrook, Kent',
    category: 'parks_nature',
    status: 'wishlist',
    favorite: true,
    lat: 51.115544,
    lng: 0.582345,
    daysOpen: 'Daily',
    hours: '10:00 - 17:00',
    notes: 'One of England most celebrated 20th-century gardens, created by poet Vita Sackville-West and Harold Nicolson. Famous for its monochromatic White Garden, Rose Garden, and historic Elizabethan tower.',
    visitDate: '',
    photoUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Statue_in_the_Gardens_at_Sissinghurst_Castle.jpg/1280px-Statue_in_the_Gardens_at_Sissinghurst_Castle.jpg'
  }
];


// --- js/day-loop.js ---
// Day Loop & Walking Distance Utilities (Pure client-side math, zero APIs)

// Earth's radius in kilometers
const R = 6371;

/**
 * Calculates Haversine distance between two [lat, lng] points in kilometers
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimates walking time in minutes based on average 4.8 km/h (12.5 min per km)
 */
function estimateWalkMinutes(distanceKm) {
  return Math.round(distanceKm * 12.5);
}

/**
 * Formats distance in readable string (e.g., "450 m · 6 min walk" or "2.3 km · 28 min walk")
 */
function formatDistanceAndWalk(distanceKm) {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    const mins = Math.max(1, estimateWalkMinutes(distanceKm));
    return `${meters} m · ${mins} min walk`;
  } else {
    const km = distanceKm.toFixed(1);
    const mins = estimateWalkMinutes(distanceKm);
    return `${km} km · ${mins} min walk`;
  }
}

/**
 * Generates an optimized sequence of spots (Nearest Neighbor TSP heuristic)
 */
function sequenceDayLoop(spots, startSpotId = null) {
  if (!spots || spots.length <= 1) return spots || [];

  const unvisited = [...spots];
  const ordered = [];

  // Determine starting spot
  let currentIndex = 0;
  if (startSpotId) {
    const foundIdx = unvisited.findIndex(s => s.id === startSpotId);
    if (foundIdx !== -1) currentIndex = foundIdx;
  }

  let current = unvisited.splice(currentIndex, 1)[0];
  ordered.push(current);

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistanceKm(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
      if (dist < shortestDist) {
        shortestDist = dist;
        nearestIdx = i;
      }
    }

    current = unvisited.splice(nearestIdx, 1)[0];
    ordered.push(current);
  }

  return ordered;
}

/**
 * Calculates total loop walk distance and time
 */
function calculateLoopStats(orderedSpots) {
  if (!orderedSpots || orderedSpots.length < 2) {
    return { totalDistanceKm: 0, totalMinutes: 0, legs: [] };
  }

  let totalDist = 0;
  const legs = [];

  for (let i = 0; i < orderedSpots.length - 1; i++) {
    const from = orderedSpots[i];
    const to = orderedSpots[i + 1];
    const legDist = calculateDistanceKm(from.lat, from.lng, to.lat, to.lng);
    totalDist += legDist;
    legs.push({
      fromName: from.name,
      toName: to.name,
      distanceKm: legDist,
      minutes: Math.max(1, estimateWalkMinutes(legDist))
    });
  }

  return {
    totalDistanceKm: totalDist,
    totalMinutes: estimateWalkMinutes(totalDist),
    legs
  };
}

/**
 * Generates universal multi-waypoint walking route link for phone navigation
 */
function generateMultiWaypointUrl(orderedSpots, preferApple = false) {
  if (!orderedSpots || orderedSpots.length === 0) return '#';

  if (orderedSpots.length === 1) {
    return generateSingleNavigationUrl(orderedSpots[0].lat, orderedSpots[0].lng, preferApple);
  }

  const start = orderedSpots[0];
  const end = orderedSpots[orderedSpots.length - 1];
  const waypoints = orderedSpots.slice(1, orderedSpots.length - 1);

  if (preferApple) {
    // Apple Maps route (start to end)
    return `https://maps.apple.com/?saddr=${start.lat},${start.lng}&daddr=${end.lat},${end.lng}&dirflg=w`;
  } else {
    // Google Maps multi-waypoint walking directions URL
    let url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=walking`;
    if (waypoints.length > 0) {
      const waypointsParam = waypoints.map(w => `${w.lat},${w.lng}`).join('|');
      url += `&waypoints=${encodeURIComponent(waypointsParam)}`;
    }
    return url;
  }
}

/**
 * Generates single-spot navigation link
 */
function generateSingleNavigationUrl(lat, lng, preferApple = false) {
  if (preferApple) {
    return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=w`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}


// --- js/kml-parser.js ---
// Parser for Google MyMaps KML files

function parseKML(kmlText, targetCity = '') {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
  
  // Check for parse errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid KML format: ' + parseError.textContent);
  }

  const placemarks = xmlDoc.querySelectorAll('Placemark');
  const extractedSpots = [];

  placemarks.forEach((pm, idx) => {
    const nameEl = pm.querySelector('name');
    const name = nameEl ? nameEl.textContent.trim() : `Imported Spot #${idx + 1}`;

    const descEl = pm.querySelector('description');
    let rawDesc = descEl ? descEl.textContent.trim() : '';

    // Extract photo URL if present in HTML description or extended data
    let photoUrl = '';
    const imgMatch = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch) {
      photoUrl = imgMatch[1];
    } else {
      const mediaEl = pm.querySelector('Data[name="gx_media_links"] value') ||
                      pm.querySelector('SimpleData[name="photo"]') ||
                      pm.querySelector('SimpleData[name="gx_media_links"]');
      if (mediaEl && mediaEl.textContent.trim().startsWith('http')) {
        photoUrl = mediaEl.textContent.trim();
      }
    }

    // Strip HTML tags from description if present
    const cleanDesc = rawDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Coordinates: lon,lat,alt
    const coordEl = pm.querySelector('Point > coordinates') || pm.querySelector('coordinates');
    if (!coordEl) return;

    const coordParts = coordEl.textContent.trim().split(/[\s,]+/);
    if (coordParts.length < 2) return;

    const lng = parseFloat(coordParts[0]);
    const lat = parseFloat(coordParts[1]);

    if (isNaN(lat) || isNaN(lng)) return;

    // Detect category from name or description keywords
    const lowerText = (name + ' ' + cleanDesc).toLowerCase();
    let category = 'other';

    if (/matcha|coffee|cafe|espresso|roaster|tea/.test(lowerText)) {
      category = 'matcha_coffee';
    } else if (/ceramic|pottery|clay|craft|atelier|vessel/.test(lowerText)) {
      category = 'ceramics_craft';
    } else if (/bakery|pastry|croissant|bread|boulangerie|cake|patisserie/.test(lowerText)) {
      category = 'pastry_bakery';
    } else if (/museum|gallery|exhibition|art|sculpture|palais|bourse|foundation|fondation/.test(lowerText)) {
      category = 'museums_art';
    } else if (/concert|venue|music|orchestra|jazz|live|gig|ballroom|auditorium|listening/.test(lowerText)) {
      category = 'concerts_music';
    } else if (/vintage|shop|boutique|clothing|apparel|store|goods|market|flea/.test(lowerText)) {
      category = 'shops_retail';
    } else if (/cinema|film|theatre|theater|repertory|movie|screening|cinémathèque|cinematheque/.test(lowerText)) {
      category = 'theater_cinema';
    } else if (/book|bookstore|library|monograph|zines|press|livraria|libreria/.test(lowerText)) {
      category = 'books';
    } else if (/hotel|hostel|inn\b|ryokan|guesthouse|residence|lodging|suites\b/.test(lowerText)) {
      category = 'hotels_stays';
    } else if (/cocktail|cocktails|speakeasy|listening bar|pub\b|tavern|taproom|saloon|bar\b/.test(lowerText)) {
      category = 'bars_nightlife';
    } else if (/brunch|lunch|sandwich|deli\b|bagel|bagels|diner/.test(lowerText)) {
      category = 'brunch_lunch';
    } else if (/restaurant|bistro|wine|dining|dinner|tapas|ramen|trattoria|izakaya/.test(lowerText)) {
      category = 'food_wine';
    } else if (/park|garden|botanical|square|walk|trail|forest|nature|jardin/.test(lowerText)) {
      category = 'parks_nature';
    } else if (/surf|beach|wave|pilates|yoga|movement/.test(lowerText)) {
      category = 'surf_movement';
    }

    extractedSpots.push({
      id: 'kml-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      name: name,
      city: targetCity || 'Imported Trip',
      neighborhood: '',
      category: category,
      status: 'wishlist',
      favorite: false,
      lat: lat,
      lng: lng,
      daysOpen: '',
      hours: '',
      notes: cleanDesc,
      visitDate: '',
      photoUrl: photoUrl
    });
  });

  return extractedSpots;
}


// --- js/map.js ---
// Leaflet Map Controller for Flâneur




let mapInstance = null;
let markersLayer = null;
let userLocationMarker = null;
let loopPolyline = null;
let onMapClickCallback = null;
let onSpotSelectCallback = null;
let currentMapRenderToken = 0;
let allSpotsCache = [];
let activeSpotIdCache = null;
let mapMoveDebounceTimer = null;

/**
 * Creates custom styled HTML marker for Leaflet with category icons
 */
function createMarkerIcon(category, isFavorite, isVisited) {
  const cat = CATEGORY_MAP.get(category) || { code: '·', color: '#0047ab' };
  const badgeClass = isVisited ? 'pin-visited' : 'pin-wishlist';
  const favDot = isFavorite ? '<span class="pin-star" title="starred"></span>' : '';
  const iconHtml = cat.iconSvg ? `<span class="pin-icon">${cat.iconSvg}</span>` : `<span class="pin-glyph">${cat.code || '·'}</span>`;

  return L.divIcon({
    className: 'custom-flaneur-marker',
    html: `
      <div class="pin-container ${badgeClass}" data-cat="${category}">
        ${iconHtml}
        ${favDot}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
}

const KNOWN_CITY_COORDS = {
  'orange county': [33.7175, -117.8311],
  'loire valley': [47.3941, 0.6848],
  'english countryside': [51.9294, -1.8236],
  'scottish countryside': [57.1497, -4.6780],
  'irish countryside': [53.4862, -9.6644],
  'iceland': [64.1466, -21.9426],
  'giverny': [49.0760, 1.5303],
  'boston': [42.3601, -71.0589],
  'barcelona': [41.3879, 2.1699],
  'seattle': [47.6062, -122.3321],
  'portland': [45.5152, -122.6784],
  'santa fe': [35.6870, -105.9378],
  'phoenix': [33.4484, -112.0740],
  'chicago': [41.8781, -87.6298],
  'vancouver': [49.2827, -123.1207],
  'quebec city': [46.8139, -71.2080],
  'avignon': [43.9493, 4.8055],
  'nice': [43.7102, 7.2620],
  'rome': [41.9028, 12.4964],
  'venice': [45.4408, 12.3155],
  'florence': [43.7696, 11.2558],
  'dublin': [53.3498, -6.2603],
  'costa mesa': [33.6411, -117.9187],
  'newport beach': [33.6189, -117.9289],
  'laguna beach': [33.5427, -117.7854],
  'san diego': [32.7157, -117.1611],
  'joshua tree': [34.1347, -116.3131],
  'san francisco': [37.7749, -122.4194],
  'london': [51.5074, -0.1278],
  'copenhagen': [55.6761, 12.5683],
  'lisbon': [38.7223, -9.1393],
  'prague': [50.0755, 14.4378],
  'edinburgh': [55.9533, -3.1883],
  'vienna': [48.2082, 16.3738],
  'budapest': [47.4979, 19.0402],
  'stockholm': [59.3293, 18.0686],
  'mexico city': [19.4326, -99.1332],
  'los angeles': [34.0522, -118.2437],
  'santa ana': [33.7455, -117.8677],
  'orange': [33.7879, -117.8531],
  'huntington beach': [33.6595, -117.9988],
  'helsinki': [60.1699, 24.9384],
  'encinitas': [33.0370, -117.2920],
  'new york': [40.7128, -74.0060],
  'paris': [48.8566, 2.3522],
  'amsterdam': [52.3676, 4.9041],
  'montreal': [45.5017, -73.5673],
  'oslo': [59.9139, 10.7522],
  'melbourne': [-37.8136, 144.9631],
  'sydney': [-33.8688, 151.2093],
  'kyoto': [35.0116, 135.7681],
  'tokyo': [35.6762, 139.6503]
};

/**
 * Centers the map on a given city and fits all its spots smoothly
 */
function centerCityOnMap(cityName, allSpots = []) {
  if (!mapInstance) return;

  if (!cityName || cityName === 'all') {
    // Instant global overview with zero animated fitBounds thrash on 900+ points
    mapInstance.setView([28, 0], 2, { animate: false });
    return;
  }

  // Find spots in this city
  const citySpots = (allSpots || []).filter(s =>
    s.city && s.city.trim().toLowerCase() === cityName.trim().toLowerCase() &&
    typeof s.lat === 'number' && typeof s.lng === 'number'
  );

  if (citySpots.length === 1) {
    mapInstance.setView([citySpots[0].lat, citySpots[0].lng], 13, { animate: true });
    return;
  }

  if (citySpots.length > 1) {
    try {
      const lats = citySpots.map(s => s.lat);
      const lngs = citySpots.map(s => s.lng);
      const latSpan = Math.max(...lats) - Math.min(...lats);
      const lngSpan = Math.max(...lngs) - Math.min(...lngs);

      // Prevent over-zooming on tightly clustered spots (Item 4)
      let targetMaxZoom = 13;
      if (latSpan > 0.35 || lngSpan > 0.35) {
        targetMaxZoom = 11;
      } else if (latSpan > 0.15 || lngSpan > 0.15) {
        targetMaxZoom = 12;
      }

      const bounds = citySpots.map(s => [s.lat, s.lng]);
      mapInstance.fitBounds(bounds, { padding: [48, 48], maxZoom: targetMaxZoom, animate: true });
      return;
    } catch (e) {
      // ignore
    }
  }

  // Fallback to known city center coordinates if 0 spots yet
  const lower = cityName.trim().toLowerCase();
  if (KNOWN_CITY_COORDS[lower]) {
    mapInstance.setView(KNOWN_CITY_COORDS[lower], 13, { animate: true });
  }
}

/**
 * Initializes Leaflet map with CartoDB Positron tiles, world copy jump, and bounded polar constraints
 */
function initMap(elementId, initialCenter = [33.6411, -117.9187], initialZoom = 13) {
  if (mapInstance) {
    mapInstance.remove();
  }

  // Base map container with worldCopyJump (Item 5) & polar constraints (Item 6)
  mapInstance = L.map(elementId, {
    zoomControl: false,
    attributionControl: false,
    worldCopyJump: true,
    minZoom: 2,
    maxBounds: [[-82, -Infinity], [84, Infinity]],
    maxBoundsViscosity: 1.0
  }).setView(initialCenter, initialZoom);

  // Add custom zoom control in bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  // OpenStreetMap standard tiles: 100% free, zero API key, zero watermark
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);

  // Viewport-based marker virtualization when panning or zooming on large collections
  mapInstance.on('moveend', () => {
    if (allSpotsCache && allSpotsCache.length > 80) {
      clearTimeout(mapMoveDebounceTimer);
      mapMoveDebounceTimer = setTimeout(updateVisibleMarkers, 80);
    }
  });

  // Map click for dropping pins
  mapInstance.on('click', (e) => {
    if (onMapClickCallback) {
      onMapClickCallback(e.latlng.lat, e.latlng.lng);
    }
  });

  return mapInstance;
}

function setOnMapClickListener(cb) {
  onMapClickCallback = cb;
}

function setOnSpotSelectListener(cb) {
  onSpotSelectCallback = cb;
}

/**
 * Renders spots on the map
 */
/**
 * Generates spot popup DOM on-demand (lazy allocation to avoid locking the thread on 900+ spots)
 */
function createSpotPopupElement(spot) {
  const cat = CATEGORY_MAP.get(spot.category) || { label: 'Spot', code: '·' };
  const navUrl = generateSingleNavigationUrl(spot.lat, spot.lng);
  const popupContent = document.createElement('div');
  popupContent.className = 'flaneur-popup';
  popupContent.innerHTML = `
    ${spot.photoUrl ? `
      <div class="popup-photo-wrap">
        <img src="${escapeHtml(spot.photoUrl)}" alt="${escapeHtml(spot.name)}" class="popup-photo" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.style.display='none';">
      </div>
    ` : ''}
    <div class="popup-body">
      <div class="popup-header">
        <span class="popup-category">${cat.iconSvg ? `<span class="popup-cat-icon">${cat.iconSvg}</span>` : ''}${escapeHtml(cat.label.toLowerCase())}</span>
        <span class="popup-status ${spot.status}">${spot.status === 'visited' ? 'visited' : 'wishlist'}</span>
      </div>
      <h3 class="popup-title">${escapeHtml(spot.name.toLowerCase())}</h3>
      ${spot.neighborhood ? `<div class="popup-neighborhood">${escapeHtml(spot.neighborhood.toLowerCase())}</div>` : ''}
      ${spot.notes ? `<p class="popup-notes">${escapeHtml(spot.notes)}</p>` : ''}
      <div class="popup-actions">
        <a href="${navUrl}" target="_blank" rel="noopener noreferrer" class="popup-btn-nav">
          directions ↗
        </a>
        <button type="button" class="popup-btn-detail" data-id="${spot.id}">
          edit
        </button>
      </div>
    </div>
  `;

  const detailBtn = popupContent.querySelector('.popup-btn-detail');
  if (detailBtn) {
    detailBtn.addEventListener('click', () => {
      if (onSpotSelectCallback) {
        onSpotSelectCallback(spot);
      }
    });
  }
  return popupContent;
}

function createSingleMarker(spot, activeSpotId) {
  if (typeof spot.lat !== 'number' || typeof spot.lng !== 'number') return null;

  const marker = L.marker([spot.lat, spot.lng], {
    icon: createMarkerIcon(spot.category, spot.favorite, spot.status === 'visited')
  });

  // Lazy popup creation: DOM node is only constructed when the marker is clicked
  marker.bindPopup(() => createSpotPopupElement(spot), { maxWidth: 280, minWidth: 220 });

  if (activeSpotId && spot.id === activeSpotId) {
    setTimeout(() => marker.openPopup(), 100);
  }

  return marker;
}

/**
 * Updates visible map markers based on viewport and zoom level (eliminates freezes on 900+ spots)
 */
function updateVisibleMarkers() {
  if (!mapInstance || !markersLayer) return;

  currentMapRenderToken++;
  const thisToken = currentMapRenderToken;

  markersLayer.clearLayers();

  if (!allSpotsCache || allSpotsCache.length === 0) return;

  const validSpots = allSpotsCache.filter(s => typeof s.lat === 'number' && typeof s.lng === 'number');
  if (validSpots.length === 0) return;

  let spotsToDisplay;
  if (validSpots.length <= 80) {
    // Single destination (e.g. Orange County, Paris, London): render all directly in 1 frame
    spotsToDisplay = validSpots;
  } else {
    // Large global set (e.g. All Destinations with 900+ spots):
    const zoom = mapInstance.getZoom();
    const currentBounds = mapInstance.getBounds().pad(0.35); // 35% margin for smooth panning

    if (zoom <= 3) {
      // At world zoom, rendering hundreds of overlapping pins creates an unreadable blob and lags Safari.
      // Show prioritized starred/featured spots (max 65 pins) for crystal-clear 60fps performance.
      const starred = validSpots.filter(s => s.favorite);
      const remaining = validSpots.filter(s => !s.favorite);
      spotsToDisplay = starred.slice(0, 45).concat(remaining.slice(0, 20));
    } else {
      // When zoomed into a continent, country or city: strictly render markers within the viewport
      spotsToDisplay = validSpots.filter(s => currentBounds.contains([s.lat, s.lng]));
      // Ensure the actively selected spot's pin is always present
      if (activeSpotIdCache) {
        const activeSpot = validSpots.find(s => s.id === activeSpotIdCache);
        if (activeSpot && !spotsToDisplay.includes(activeSpot)) {
          spotsToDisplay.push(activeSpot);
        }
      }
    }
  }

  // Render visible markers (typically 15-50 markers max)
  spotsToDisplay.forEach(s => {
    if (thisToken !== currentMapRenderToken) return;
    const marker = createSingleMarker(s, activeSpotIdCache);
    if (marker) marker.addTo(markersLayer);
  });
}

/**
 * Renders spots on the map with viewport virtualization and lazy popups
 */
function renderMapSpots(spots, activeSpotId = null, shouldFitBounds = false) {
  allSpotsCache = spots || [];
  activeSpotIdCache = activeSpotId;

  if (mapInstance && shouldFitBounds && !activeSpotId) {
    const validSpots = allSpotsCache.filter(s => typeof s.lat === 'number' && typeof s.lng === 'number');
    if (validSpots.length > 0 && validSpots.length <= 80) {
      try {
        const bounds = validSpots.map(s => [s.lat, s.lng]);
        mapInstance.fitBounds(bounds, { padding: [48, 48], maxZoom: 13, animate: true });
      } catch (e) {
        // ignore
      }
    }
  }

  updateVisibleMarkers();
}

/**
 * Highlights and centers a specific spot on the map
 */
function focusSpot(spot) {
  if (!mapInstance || !spot) return;
  mapInstance.setView([spot.lat, spot.lng], 16, { animate: true });
}

/**
 * Shows user's live position with a pulsing blue dot
 */
function setUserLocation(lat, lng) {
  if (!mapInstance) return;

  if (userLocationMarker) {
    userLocationMarker.setLatLng([lat, lng]);
  } else {
    const userIcon = L.divIcon({
      className: 'user-pulse-marker',
      html: `
        <div class="user-pulse-outer">
          <div class="user-pulse-inner"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    userLocationMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(mapInstance);
    userLocationMarker.bindTooltip('You are here', { permanent: false, direction: 'top' });
  }

  mapInstance.setView([lat, lng], 15, { animate: true });
}

/**
 * Draws or clears the Day Loop walking path polyline
 */
function drawLoopPolyline(orderedSpots) {
  if (!mapInstance) return;

  if (loopPolyline) {
    mapInstance.removeLayer(loopPolyline);
    loopPolyline = null;
  }

  if (!orderedSpots || orderedSpots.length < 2) return;

  const latlngs = orderedSpots.map(s => [s.lat, s.lng]);

  loopPolyline = L.polyline(latlngs, {
    color: '#0047ab',
    weight: 2,
    opacity: 0.9,
    dashArray: '6, 6',
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(mapInstance);

  try {
    mapInstance.fitBounds(loopPolyline.getBounds(), { padding: [60, 60] });
  } catch (e) {
    // ignore
  }
}

function clearLoopPolyline() {
  if (mapInstance && loopPolyline) {
    mapInstance.removeLayer(loopPolyline);
    loopPolyline = null;
  }
}

function invalidateMapSize(delay = 0) {
  if (!mapInstance) return;
  if (delay > 0) {
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, delay);
  } else {
    requestAnimationFrame(() => {
      if (mapInstance) mapInstance.invalidateSize();
    });
  }
}


// --- js/supabase.js ---
// Supabase Real-time Sync Client for Archival Field Guide

const SUPABASE_URL = 'https://oaqzbymmhusbhvscfcrp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp';
const SPOTS_TABLE = 'spots';
const CITIES_TABLE = 'field_guide_cities';

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false }
      });
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
    }
  }
  return supabaseClient;
}

/**
 * Fetch all spots from remote Supabase table
 */
async function fetchRemoteSpots() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from(SPOTS_TABLE).select('*').order('name', { ascending: true }).limit(1000);
      if (error) throw error;
      return (data || []).map(mapRowToSpot);
    } catch (e) {
      console.warn('Supabase JS fetch failed, falling back to REST:', e);
    }
  }

  // REST fallback
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SPOTS_TABLE}?select=*&order=name.asc&limit=1000`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data || []).map(mapRowToSpot);
  } catch (err) {
    console.warn('Remote fetch failed:', err);
    return null;
  }
}

/**
 * Fetch dedicated cities list from remote Supabase table
 */
async function fetchRemoteCities() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from(CITIES_TABLE).select('name').order('name');
      if (error) throw error;
      if (Array.isArray(data) && data.length > 0) {
        return data.map(r => r.name);
      }
    } catch (e) {
      console.warn('Supabase JS fetchRemoteCities failed, falling back to REST:', e);
    }
  }

  // REST fallback
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${CITIES_TABLE}?select=name&order=name.asc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      return (data || []).map(r => r.name);
    }
  } catch (err) {
    console.warn('REST fetchRemoteCities failed:', err);
  }
  return null;
}

/**
 * Upsert a city into dedicated field_guide_cities table
 */
async function upsertRemoteCity(cityName) {
  if (!cityName) return false;
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from(CITIES_TABLE).upsert({ name: cityName });
      return true;
    } catch (e) {}
  }
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${CITIES_TABLE}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ name: cityName })
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Delete a city from dedicated field_guide_cities table
 */
async function deleteRemoteCity(cityName) {
  if (!cityName) return false;
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.from(CITIES_TABLE).delete().eq('name', cityName);
      return true;
    } catch (e) {}
  }
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${CITIES_TABLE}?name=eq.${encodeURIComponent(cityName)}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Upsert a spot to remote Supabase table
 */
async function upsertRemoteSpot(spot) {
  const row = mapSpotToRow(spot);
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from(SPOTS_TABLE).upsert(row);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsert failed, trying REST:', e);
    }
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SPOTS_TABLE}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });
    return res.ok;
  } catch (e) {
    console.warn('Remote upsert failed:', e);
    return false;
  }
}

/**
 * Delete a spot from remote Supabase table
 */
async function deleteRemoteSpot(id) {
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from(SPOTS_TABLE).delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase delete failed, trying REST:', e);
    }
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SPOTS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    return res.ok;
  } catch (e) {
    console.warn('Remote delete failed:', e);
    return false;
  }
}

/**
 * Seed initial spots if remote table is empty
 */
async function seedRemoteSpotsIfEmpty(localSpots) {
  try {
    const existing = await fetchRemoteSpots();
    if (existing && existing.length === 0 && localSpots && localSpots.length > 0) {
      console.log('Seeding Supabase spots table with initial curated spots...');
      const rows = localSpots.map(mapSpotToRow);
      const sb = getSupabase();
      if (sb) {
        await sb.from(SPOTS_TABLE).upsert(rows);
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/${SPOTS_TABLE}`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(rows)
        });
      }
      return true;
    }
  } catch (e) {
    console.warn('Failed to seed Supabase table:', e);
  }
  return false;
}

/**
 * Subscribe to realtime changes from other devices (laptop <-> phone)
 */
function subscribeToRemoteChanges(callback) {
  const sb = getSupabase();
  if (!sb || !sb.channel) return null;

  try {
    const channel = sb.channel(`public:${SPOTS_TABLE}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: SPOTS_TABLE }, (payload) => {
        if (callback) callback(payload);
      })
      .subscribe();
    return channel;
  } catch (e) {
    console.warn('Realtime subscription failed:', e);
    return null;
  }
}

/**
 * Push an array of spots to remote Supabase table (batch upsert)
 */
async function pushSpotsToRemote(spotsArray) {
  if (!spotsArray || spotsArray.length === 0) return true;
  const rows = spotsArray.map(mapSpotToRow);

  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from(SPOTS_TABLE).upsert(rows);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase JS batch upsert failed, trying REST:', e);
    }
  }

  // REST fallback
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SPOTS_TABLE}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(rows)
    });
    return res.ok;
  } catch (err) {
    console.error('REST batch upsert failed:', err);
    return false;
  }
}

function mapSpotToRow(spot) {
  const lat = typeof spot.lat === 'number' ? spot.lat : parseFloat(spot.lat);
  const lng = typeof spot.lng === 'number' ? spot.lng : parseFloat(spot.lng);
  return {
    id: String(spot.id || ('spot-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7))),
    name: spot.name || 'Untitled Spot',
    city: spot.city || 'Tokyo',
    neighborhood: spot.neighborhood || null,
    category: spot.category || 'other',
    status: spot.status || 'wishlist',
    favorite: !!spot.favorite,
    lat: isNaN(lat) ? 0 : lat,
    lng: isNaN(lng) ? 0 : lng,
    hours: spot.hours || null,
    notes: spot.notes || null,
    visit_date: spot.visitDate || null,
    photo_url: spot.photoUrl || null,
    updated_at: new Date().toISOString()
  };
}

function mapRowToSpot(row) {
  let category = row.category;
  if (category === 'books_cinema') {
    const text = `${row.name || ''} ${row.notes || ''}`.toLowerCase();
    category = /cinema|film|theatre|theater|repertory|movie|screening/.test(text) ? 'theater_cinema' : 'books';
  }
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    neighborhood: row.neighborhood || '',
    category: category,
    status: row.status || 'wishlist',
    favorite: !!row.favorite,
    lat: row.lat,
    lng: row.lng,
    hours: row.hours || '',
    notes: row.notes || '',
    visitDate: row.visit_date || '',
    photoUrl: row.photo_url || ''
  };
}


// --- js/photon.js ---
// Photon by Komoot - Free OpenStreetMap-based Search-As-You-Type Autocomplete
// Zero API keys required, free global geocoding service.

let activeAbortController = null;
let photonUnavailableUntil = 0; // Timestamp when Photon circuit-breaker expires

/**
 * Intelligent mapping from OpenStreetMap tags to Field Guide categories
 */
function mapOsmTagToCategory(props = {}, name = '') {
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
    return 'bars_nightlife';
  }
  if (['deli', 'sandwich', 'fast_food', 'food_court', 'canteen'].includes(osmValue) || /brunch|lunch|sandwich|deli\b|bagel|bagels|diner|all-day café|all-day cafe/.test(lowerName)) {
    return 'brunch_lunch';
  }
  if (['restaurant', 'bistro', 'wine'].includes(osmValue) || /restaurant|bistro|wine|tacos|pizza|ramen|taqueria|trattoria|izakaya/.test(lowerName)) {
    return 'food_wine';
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
function extractNeighborhood(props = {}) {
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
function extractCity(props = {}) {
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
async function searchPhotonPlaces(query, biasCoords = null) {
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
function parseGoogleMapsUrl(input = '') {
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


// --- js/app.js ---
// Main Application Controller for Archival Field Guide









// Application State
let spots = [];
let cities = [];
let activeCity = 'Costa Mesa';
let activeStatus = 'all';
let activeCategory = 'all';
let searchQuery = '';
let userCoords = null; // { lat, lng }
let isNearMeSorted = false;
let pendingKmlSpots = [];
let editingSpotId = null;
let atlasActiveTab = 'active'; // 'active' (with spots) | 'all'
let atlasActiveRegion = 'overview'; // 'overview' | 'americas' | 'europe' | 'asia_pacific' | 'all'
let atlasActiveType = 'all'; // 'all' | 'city' | 'county' | 'area'
let atlasViewMode = localStorage.getItem('flaneur_atlas_view') || 'compact'; // 'compact' | 'cards'
let atlasSearchQuery = '';
let isReadOnlyGuide = false;

// Progressive Loading & Feed Pagination (prevents UI freeze on large collections like All Destinations)
const SPOTS_PAGE_SIZE = 30;
let currentVisibleSpotsCount = SPOTS_PAGE_SIZE;
let currentFilteredSpotsCache = [];
let spotsIntersectionObserver = null;
let searchDebounceTimer = null;

const REGION_DEFINITIONS = [
  {
    id: 'americas',
    name: 'Americas',
    code: 'AME',
    description: 'North, Central & South America'
  },
  {
    id: 'europe',
    name: 'Europe',
    code: 'EUR',
    description: 'Western, Southern & Northern Europe'
  },
  {
    id: 'asia_pacific',
    name: 'Asia & Pacific',
    code: 'APAC',
    description: 'East Asia, Southeast Asia & Oceania'
  }
];

// DOM Elements
const btnCityAtlasTrigger = document.getElementById('btn-city-atlas-trigger');
const citySelect = document.getElementById('city-select');
const searchInput = document.getElementById('search-input');
const statusTabs = document.querySelectorAll('.status-tab');
const spotsListContainer = document.getElementById('spots-list-container');
const spotsCountLabel = document.getElementById('spots-count-label');
const distanceSortIndicator = document.getElementById('distance-sort-indicator');

// Atlas Controls
const atlasSearchInput = document.getElementById('atlas-search-input');
const atlasTabActive = document.getElementById('atlas-tab-active');
const atlasTabAll = document.getElementById('atlas-tab-all');
const atlasActiveCountEl = document.getElementById('atlas-active-count');
const atlasAllCountEl = document.getElementById('atlas-all-count');
const atlasQuickStrip = document.getElementById('atlas-quick-strip');
const atlasRegionPills = document.querySelectorAll('.atlas-pill');
const atlasViewCompact = document.getElementById('atlas-view-compact');
const atlasViewCards = document.getElementById('atlas-view-cards');

// Read-Only Banner & Share Guide
const readonlyGuideBanner = document.getElementById('readonly-guide-banner');
const readonlyCityName = document.getElementById('readonly-city-name');
const btnShareGuide = document.getElementById('btn-share-guide');
const modalShare = document.getElementById('modal-share');
const shareUrlInput = document.getElementById('share-url-input');
const btnCopyShareUrl = document.getElementById('btn-copy-share-url');
const shareLinkToast = document.getElementById('share-link-toast');
const shareTextPreview = document.getElementById('share-text-preview');
const btnCopyShareText = document.getElementById('btn-copy-share-text');
const shareTextToast = document.getElementById('share-text-toast');

// View Mode and Photos
const viewModeVisual = document.getElementById('view-mode-visual');
const viewModeCompact = document.getElementById('view-mode-compact');
const spotPhotoUrlInput = document.getElementById('spot-photo-url');
const spotPhotoFileInput = document.getElementById('spot-photo-file');
const photoPreviewWrap = document.getElementById('photo-preview-wrap');
const photoPreviewImg = document.getElementById('photo-preview-img');
const btnRemovePhoto = document.getElementById('btn-remove-photo');
let currentViewMode = localStorage.getItem('flaneur_view_mode') || 'visual';

// Counts
const countAllEl = document.getElementById('count-all');
const countWishlistEl = document.getElementById('count-wishlist');
const countVisitedEl = document.getElementById('count-visited');

// Buttons
const btnNearMe = document.getElementById('btn-near-me');
const btnDayLoop = document.getElementById('btn-day-loop');
const btnImportKml = document.getElementById('btn-import-kml');
const btnAddSpot = document.getElementById('btn-add-spot');
const btnDeleteSpot = document.getElementById('btn-delete-spot');
const btnExportBackup = document.getElementById('btn-export-backup');
const btnManageCities = document.getElementById('btn-manage-cities');

// Modals
const modalSpot = document.getElementById('modal-spot');
const modalKml = document.getElementById('modal-kml');
const modalLoop = document.getElementById('modal-loop');
const modalCities = document.getElementById('modal-cities');

// Forms & Inputs
const formSpot = document.getElementById('form-spot');
const spotIdInput = document.getElementById('spot-id');
const spotNameInput = document.getElementById('spot-name');
const spotCitySelect = document.getElementById('spot-city');
const spotNeighborhoodInput = document.getElementById('spot-neighborhood');
const spotCategorySelect = document.getElementById('spot-category');
const spotStatusSelect = document.getElementById('spot-status');
const spotLatInput = document.getElementById('spot-lat');
const spotLngInput = document.getElementById('spot-lng');
const spotHoursInput = document.getElementById('spot-hours');
const spotFavoriteCheckbox = document.getElementById('spot-favorite');
const spotNotesInput = document.getElementById('spot-notes');
const spotSearchAddr = document.getElementById('spot-search-addr');
const btnGeocodeSearch = document.getElementById('btn-geocode-search');
const geocodeStatus = document.getElementById('geocode-status');
const spotAutocompleteInput = document.getElementById('spot-autocomplete-input');
const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
const autocompleteSpinner = document.getElementById('autocomplete-spinner');
const advancedCoordsDetails = document.getElementById('advanced-coords-details');

// KML Elements
const kmlDropzone = document.getElementById('kml-dropzone');
const kmlFileInput = document.getElementById('kml-file-input');
const kmlTargetCity = document.getElementById('kml-target-city');
const kmlPreview = document.getElementById('kml-preview');
const kmlPreviewCount = document.getElementById('kml-preview-count');
const kmlPreviewList = document.getElementById('kml-preview-list');
const btnConfirmKmlImport = document.getElementById('btn-confirm-kml-import');

// Loop Elements
const loopStartSpot = document.getElementById('loop-start-spot');
const loopMaxStops = document.getElementById('loop-max-stops');
const loopTotalDist = document.getElementById('loop-total-dist');
const loopTotalTime = document.getElementById('loop-total-time');
const loopStopCount = document.getElementById('loop-stop-count');
const loopTimeline = document.getElementById('loop-timeline');
const btnDrawLoopMap = document.getElementById('btn-draw-loop-map');
const btnLaunchNavLoop = document.getElementById('btn-launch-nav-loop');

// Mobile View Toggles
const appContainer = document.getElementById('app-container');
const mobileToggleList = document.getElementById('mobile-toggle-list');
const mobileToggleMap = document.getElementById('mobile-toggle-map');

/**
 * Initialization
 */
function init() {
  // Load stored data or default
  const storedCities = getStoredCities();
  const storedSpots = getStoredSpots();
  if (storedSpots && storedSpots.length > 0) {
    spots = storedSpots;
  } else {
    // If local storage is empty, preload SAMPLE_SPOTS so the app is never empty while awaiting cloud sync
    spots = [...SAMPLE_SPOTS];
  }

  // Sanitize stored cities: only keep cities that are in DEFAULT_CITIES or currently have spots
  const validDefaultSet = new Set(DEFAULT_CITIES.map(c => c.toLowerCase()));
  const spotCitySet = new Set(spots.map(s => (s.city || '').toLowerCase()).filter(Boolean));
  cities = storedCities.filter(c => {
    const l = c.toLowerCase();
    return validDefaultSet.has(l) || spotCitySet.has(l);
  });
  if (cities.length === 0) {
    cities = [...DEFAULT_CITIES];
  }

  // Restore active city preference if available and valid in Field Guide
  let savedActiveCity = localStorage.getItem('flaneur_active_city');
  // Auto-migrate legacy 'Costa Mesa' selection to 'Orange County'
  if (savedActiveCity && savedActiveCity.toLowerCase() === 'costa mesa') {
    savedActiveCity = 'Orange County';
    localStorage.setItem('flaneur_active_city', 'Orange County');
  }

  if (savedActiveCity && (savedActiveCity === 'all' || cities.some(c => c.toLowerCase() === savedActiveCity.toLowerCase()))) {
    activeCity = savedActiveCity;
  } else if (cities.some(c => c.toLowerCase() === 'orange county')) {
    activeCity = 'Orange County';
  } else if (spots.length > 0 && spots[0].city) {
    activeCity = spots[0].city;
  } else if (cities.length > 0) {
    activeCity = cities[0];
  } else {
    activeCity = 'Orange County';
  }

  // Check URL parameters for shareable read-only guide mode
  const urlParams = new URLSearchParams(window.location.search);
  const sharedCity = urlParams.get('guide') || urlParams.get('city') || urlParams.get('share');
  if (sharedCity && sharedCity !== '1' && sharedCity !== 'true') {
    const decoded = decodeURIComponent(sharedCity).trim();
    activeCity = decoded;
    isReadOnlyGuide = true;
  } else if (urlParams.get('share') === '1' && urlParams.get('city')) {
    const decoded = decodeURIComponent(urlParams.get('city')).trim();
    activeCity = decoded;
    isReadOnlyGuide = true;
  }

  if (isReadOnlyGuide) {
    document.body.classList.add('readonly-mode');
    if (readonlyGuideBanner && readonlyCityName) {
      readonlyGuideBanner.style.display = 'flex';
      readonlyCityName.textContent = activeCity === 'all' ? 'All Destinations' : activeCity;
    }
  }

  // Populate category chips with SVGs
  renderCategoryChips();

  // Populate category selector in modal
  renderCategoryDropdown();

  // Populate city selectors & trigger label
  renderCityDropdowns();

  // Find center for initial city
  const citySpots = spots.filter(s => s.city && s.city.trim().toLowerCase() === activeCity.trim().toLowerCase());
  const initialCenter = citySpots.length > 0
    ? [citySpots[0].lat, citySpots[0].lng]
    : (KNOWN_CITY_COORDS[activeCity.toLowerCase()] || [33.6411, -117.9187]);

  // Initialize Map
  initMap('map', initialCenter, 13);
  centerCityOnMap(activeCity, spots);

  // Set Map click handler to easily add spots (if not read-only)
  setOnMapClickListener((lat, lng) => {
    if (!isReadOnlyGuide) {
      openAddSpotModalWithCoords(lat, lng);
    }
  });

  // Set Spot click handler from popup
  setOnSpotSelectListener((spot) => {
    if (!isReadOnlyGuide) {
      openEditSpotModal(spot);
    }
  });

  // Setup Event Listeners
  setupEventListeners();

  // Initial Render
  applyFiltersAndRender();

  // Ensure map layout is accurately calculated after initial viewport render
  invalidateMapSize(250);

  // Initialize Supabase Cloud Sync (Phone <-> Laptop)
  initCloudSync();
}

/**
 * Supabase Two-Way Cloud Sync Engine
 */
function updateSyncStatus(state, text) {
  const syncStatusEl = document.getElementById('sync-status');
  const syncTextEl = document.getElementById('sync-status-text');
  if (syncStatusEl) {
    syncStatusEl.className = 'sync-indicator ' + (state || '');
  }
  if (syncTextEl) {
    syncTextEl.textContent = text || 'synced';
  }
}

async function syncWithSupabase(manual = false) {
  updateSyncStatus('syncing', manual ? 'syncing...' : 'syncing...');

  try {
    // 1. Fetch current remote spots from Supabase
    const remote = await fetchRemoteSpots();

    if (remote === null) {
      updateSyncStatus('offline', 'offline');
      if (manual) alert('Could not reach Supabase. Operating in local offline mode.');
      return;
    }

    // 2. Push any newly created local spots (e.g. created offline via + Add Spot)
    const remoteMap = new Map(remote.map(r => [r.id, r]));
    const localNewSpots = spots.filter(s => !remoteMap.has(s.id) && String(s.id).startsWith('spot-'));

    if (localNewSpots.length > 0) {
      console.log(`Pushing ${localNewSpots.length} newly added local spots to Supabase...`);
      updateSyncStatus('syncing', `uploading ${localNewSpots.length}...`);
      await pushSpotsToRemote(localNewSpots);
      remote.push(...localNewSpots);
    }

    // Remote Supabase is source of truth
    const isDataDifferent = (spots.length !== remote.length) || (localNewSpots.length > 0);
    const prevActiveCity = activeCity;

    spots = remote;
    if (isDataDifferent) {
      saveStoredSpots(spots);
    }

    // 4. Synchronize cities strictly from dedicated field_guide_cities and spots
    const remoteCities = await fetchRemoteCities();
    const spotCityNames = [...new Set(spots.map(s => s.city).filter(Boolean))];

    let combinedCities = (Array.isArray(remoteCities) && remoteCities.length > 0)
      ? remoteCities
      : [...DEFAULT_CITIES];

    // Ensure any city present in spots is represented
    const citySet = new Set(combinedCities.map(c => c.toLowerCase()));
    spotCityNames.forEach(c => {
      if (!citySet.has(c.toLowerCase())) {
        citySet.add(c.toLowerCase());
        combinedCities.push(c);
      }
    });

    combinedCities.sort((a, b) => a.localeCompare(b));
    cities = combinedCities;
    saveStoredCities(cities);
    renderCityDropdowns();

    // If in read-only guide mode, keep the shared city and match its canonical casing
    if (isReadOnlyGuide) {
      const match = cities.find(c => c.toLowerCase() === activeCity.toLowerCase()) ||
                    (spots.find(s => s.city && s.city.toLowerCase() === activeCity.toLowerCase()) || {}).city;
      if (match) {
        activeCity = match;
      }
      if (readonlyCityName) {
        readonlyCityName.textContent = activeCity === 'all' ? 'All Destinations' : activeCity;
      }
    } else if (activeCity.toLowerCase() === 'costa mesa') {
      activeCity = 'Orange County';
      localStorage.setItem('flaneur_active_city', activeCity);
    } else if (activeCity !== 'all' && !cities.some(c => c.toLowerCase() === activeCity.toLowerCase())) {
      // If activeCity is no longer in Field Guide's cities list, fallback safely to Orange County
      activeCity = cities.find(c => c.toLowerCase() === 'orange county') || cities[0] || 'Orange County';
      localStorage.setItem('flaneur_active_city', activeCity);
    }

    updateCityTriggerButton();

    // Only trigger re-render if data actually changed or active city switched!
    if (isDataDifferent || activeCity !== prevActiveCity) {
      if (activeCity !== prevActiveCity) {
        centerCityOnMap(activeCity, spots);
      }
      applyFiltersAndRender(false);
    }

    updateSyncStatus('synced', `synced (${spots.length})`);

    if (manual) {
      alert(`Sync complete! ${spots.length} total spots synced across cloud and device.`);
    }
  } catch (err) {
    console.error('Supabase sync error:', err);
    updateSyncStatus('offline', 'offline');
    if (manual) alert('Sync error: ' + err.message);
  }
}

async function initCloudSync() {
  await syncWithSupabase(false);

  // Realtime WebSocket listener for changes from other devices (e.g. phone <-> laptop)
  subscribeToRemoteChanges((payload) => {
    console.log('Realtime change from Supabase:', payload);
    updateSyncStatus('syncing', 'syncing...');
    const { eventType, new: newRow, old: oldRow } = payload;

    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      const updated = mapRowToSpot(newRow);
      const idx = spots.findIndex(s => s.id === updated.id);
      if (idx !== -1) {
        spots[idx] = updated;
      } else {
        spots.unshift(updated);
      }
    } else if (eventType === 'DELETE') {
      spots = spots.filter(s => s.id !== oldRow.id);
    }

    saveStoredSpots(spots);
    applyFiltersAndRender();
    setTimeout(() => updateSyncStatus('synced', `synced (${spots.length})`), 400);
  });
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  // City Select Change
  citySelect.addEventListener('change', (e) => {
    setActiveCity(e.target.value);
  });

  // Search Input (debounced to avoid freeze while typing)
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFiltersAndRender(true);
    }, 120);
  });

  // Status Tabs
  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeStatus = tab.dataset.status;
      applyFiltersAndRender();
    });
  });

  // Near Me Toggle
  btnNearMe.addEventListener('click', handleNearMeToggle);

  // Day Loop Button
  btnDayLoop.addEventListener('click', openDayLoopModal);

  // Import KML Button
  btnImportKml.addEventListener('click', () => openModal(modalKml));

  // Add Spot Button
  btnAddSpot.addEventListener('click', () => openAddSpotModal());

  // Delete Spot in Modal Button
  if (btnDeleteSpot) {
    btnDeleteSpot.addEventListener('click', () => {
      if (editingSpotId) {
        deleteSpot(editingSpotId);
      }
    });
  }

  // Sync Status Click Trigger
  const syncStatusEl = document.getElementById('sync-status');
  if (syncStatusEl) {
    syncStatusEl.addEventListener('click', () => {
      syncWithSupabase(true);
    });
  }

  // Export Backup
  btnExportBackup.addEventListener('click', () => exportBackupJSON(spots, cities));

  // Manage Cities & City Atlas
  if (btnManageCities) btnManageCities.addEventListener('click', openCityManagerModal);
  if (btnCityAtlasTrigger) btnCityAtlasTrigger.addEventListener('click', openCityManagerModal);

  // Atlas Controls
  if (atlasSearchInput) {
    atlasSearchInput.addEventListener('input', (e) => {
      atlasSearchQuery = e.target.value.toLowerCase().trim();
      renderCityManagerList();
    });
  }

  if (atlasTabActive && atlasTabAll) {
    atlasTabActive.addEventListener('click', () => {
      atlasActiveTab = 'active';
      atlasTabActive.classList.add('active');
      atlasTabAll.classList.remove('active');
      renderCityManagerList();
    });
    atlasTabAll.addEventListener('click', () => {
      atlasActiveTab = 'all';
      atlasTabAll.classList.add('active');
      atlasTabActive.classList.remove('active');
      renderCityManagerList();
    });
  }

  // Atlas View Mode Toggle (Luggage Tag Compact vs Cards)
  if (atlasViewCompact && atlasViewCards) {
    if (atlasViewMode === 'compact') {
      atlasViewCompact.classList.add('active');
      atlasViewCards.classList.remove('active');
    } else {
      atlasViewCards.classList.add('active');
      atlasViewCompact.classList.remove('active');
    }

    atlasViewCompact.addEventListener('click', () => {
      atlasViewMode = 'compact';
      localStorage.setItem('flaneur_atlas_view', 'compact');
      atlasViewCompact.classList.add('active');
      atlasViewCards.classList.remove('active');
      renderCityManagerList();
    });

    atlasViewCards.addEventListener('click', () => {
      atlasViewMode = 'cards';
      localStorage.setItem('flaneur_atlas_view', 'cards');
      atlasViewCards.classList.add('active');
      atlasViewCompact.classList.remove('active');
      renderCityManagerList();
    });
  }

  // Atlas Regional Macro Filter Pills
  if (atlasRegionPills && atlasRegionPills.length > 0) {
    atlasRegionPills.forEach(pill => {
      pill.addEventListener('click', () => {
        atlasActiveRegion = pill.getAttribute('data-region') || 'overview';
        atlasRegionPills.forEach(p => p.classList.toggle('active', p === pill));
        renderCityManagerList();
      });
    });
  }

  // Atlas Destination Type Filter Pills (All Types | Cities | Counties | Areas)
  const atlasTypePills = document.querySelectorAll('.atlas-type-pill');
  if (atlasTypePills && atlasTypePills.length > 0) {
    atlasTypePills.forEach(pill => {
      pill.addEventListener('click', () => {
        atlasActiveType = pill.getAttribute('data-type') || 'all';
        atlasTypePills.forEach(p => p.classList.toggle('active', p === pill));
        renderCityManagerList();
      });
    });
  }

  // Share Guide Actions
  if (btnShareGuide) {
    btnShareGuide.addEventListener('click', openShareGuideModal);
  }
  if (btnCopyShareUrl) {
    btnCopyShareUrl.addEventListener('click', () => {
      if (shareUrlInput) {
        shareUrlInput.select();
        navigator.clipboard.writeText(shareUrlInput.value).then(() => {
          if (shareLinkToast) {
            shareLinkToast.style.display = 'block';
            setTimeout(() => { if (shareLinkToast) shareLinkToast.style.display = 'none'; }, 3000);
          }
        }).catch(() => {
          document.execCommand('copy');
          if (shareLinkToast) {
            shareLinkToast.style.display = 'block';
            setTimeout(() => { if (shareLinkToast) shareLinkToast.style.display = 'none'; }, 3000);
          }
        });
      }
    });
  }
  if (btnCopyShareText) {
    btnCopyShareText.addEventListener('click', () => {
      if (shareTextPreview) {
        shareTextPreview.select();
        navigator.clipboard.writeText(shareTextPreview.value).then(() => {
          if (shareTextToast) {
            shareTextToast.style.display = 'block';
            setTimeout(() => { if (shareTextToast) shareTextToast.style.display = 'none'; }, 3000);
          }
        }).catch(() => {
          document.execCommand('copy');
          if (shareTextToast) {
            shareTextToast.style.display = 'block';
            setTimeout(() => { if (shareTextToast) shareTextToast.style.display = 'none'; }, 3000);
          }
        });
      }
    });
  }

  const newCityInput = document.getElementById('new-city-input');
  if (newCityInput) {
    newCityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddNewCity();
      }
    });
  }

  // Modal Closers
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(document.getElementById(modalId));
    });
  });

  // Spot Form Submission
  formSpot.addEventListener('submit', handleSpotFormSubmit);

  // Geocoding Search via OpenStreetMap
  btnGeocodeSearch.addEventListener('click', handleGeocodeSearch);

  // Photon Autocomplete Events
  if (spotAutocompleteInput) {
    spotAutocompleteInput.addEventListener('input', handleAutocompleteInput);
    spotAutocompleteInput.addEventListener('keydown', (e) => {
      if (!currentAutocompleteResults.length || autocompleteDropdown.style.display === 'none') return;
      const items = autocompleteDropdown.querySelectorAll('.autocomplete-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedAutocompleteIndex = (selectedAutocompleteIndex + 1) % items.length;
        items.forEach((it, i) => it.classList.toggle('selected', i === selectedAutocompleteIndex));
        if (items[selectedAutocompleteIndex]) items[selectedAutocompleteIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedAutocompleteIndex = (selectedAutocompleteIndex - 1 + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle('selected', i === selectedAutocompleteIndex));
        if (items[selectedAutocompleteIndex]) items[selectedAutocompleteIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        if (selectedAutocompleteIndex >= 0 && currentAutocompleteResults[selectedAutocompleteIndex]) {
          e.preventDefault();
          selectAutocompletePlace(currentAutocompleteResults[selectedAutocompleteIndex]);
        }
      } else if (e.key === 'Escape') {
        hideAutocompleteDropdown();
      }
    });
  }

  // Dismiss dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (autocompleteDropdown && !e.target.closest('#autocomplete-group')) {
      hideAutocompleteDropdown();
    }
  });

  // KML Dropzone & File Input
  kmlDropzone.addEventListener('click', () => kmlFileInput.click());
  kmlFileInput.addEventListener('change', handleKmlFileSelected);
  kmlDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    kmlDropzone.classList.add('dragover');
  });
  kmlDropzone.addEventListener('dragleave', () => kmlDropzone.classList.remove('dragover'));
  kmlDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    kmlDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processKmlFile(e.dataTransfer.files[0]);
    }
  });
  btnConfirmKmlImport.addEventListener('click', handleConfirmKmlImport);

  // Loop Modal changes
  loopStartSpot.addEventListener('change', updateLoopPreview);
  loopMaxStops.addEventListener('change', updateLoopPreview);
  btnDrawLoopMap.addEventListener('click', () => {
    closeModal(modalLoop);
    executeDrawLoopOnMap();
  });

  // Add New City in Manager
  document.getElementById('btn-add-new-city').addEventListener('click', handleAddNewCity);

  // Prune Empty Cities in Manager
  const btnPruneEmpty = document.getElementById('btn-prune-empty-cities');
  if (btnPruneEmpty) {
    btnPruneEmpty.addEventListener('click', () => {
      const emptyCities = cities.filter(c => !spots.some(s => s.city.toLowerCase() === c.toLowerCase()));
      if (emptyCities.length === 0) {
        alert('All destinations currently have spots. No empty cities to prune.');
        return;
      }
      if (confirm(`Remove all ${emptyCities.length} empty destinations (with 0 spots) from your list?`)) {
        emptyCities.forEach(c => deleteRemoteCity(c));
        cities = cities.filter(c => spots.some(s => s.city.toLowerCase() === c.toLowerCase()));
        if (cities.length === 0) cities = ['Costa Mesa'];
        saveStoredCities(cities);
        if (!cities.some(c => c.toLowerCase() === activeCity.toLowerCase())) {
          setActiveCity(cities[0] || 'all');
        } else {
          renderCityDropdowns();
          renderCityManagerList();
          applyFiltersAndRender();
        }
      }
    });
  }

  // Mobile View Toggles
  mobileToggleList.addEventListener('click', () => {
    mobileToggleList.classList.add('active');
    mobileToggleMap.classList.remove('active');
    appContainer.classList.remove('show-map');
  });

  mobileToggleMap.addEventListener('click', () => {
    mobileToggleMap.classList.add('active');
    mobileToggleList.classList.remove('active');
    appContainer.classList.add('show-map');
    setTimeout(() => {
      invalidateMapSize();
      centerCityOnMap(activeCity, spots);
    }, 120);
  });

  // View Mode Switcher (Visual Step Photo Cards vs Compact List)
  if (viewModeVisual && viewModeCompact) {
    const setViewMode = (mode) => {
      currentViewMode = mode;
      localStorage.setItem('flaneur_view_mode', mode);
      if (mode === 'compact') {
        viewModeCompact.classList.add('active');
        viewModeVisual.classList.remove('active');
        spotsListContainer.classList.remove('visual-mode');
        spotsListContainer.classList.add('compact-mode');
      } else {
        viewModeVisual.classList.add('active');
        viewModeCompact.classList.remove('active');
        spotsListContainer.classList.remove('compact-mode');
        spotsListContainer.classList.add('visual-mode');
      }
    };

    setViewMode(currentViewMode);

    viewModeVisual.addEventListener('click', () => setViewMode('visual'));
    viewModeCompact.addEventListener('click', () => setViewMode('compact'));
  }

  // Spot Photo Input & Preview Listeners
  if (spotPhotoUrlInput) {
    spotPhotoUrlInput.addEventListener('input', () => {
      const val = spotPhotoUrlInput.value.trim();
      if (val) {
        photoPreviewImg.src = val;
        photoPreviewWrap.style.display = 'block';
      } else {
        photoPreviewWrap.style.display = 'none';
      }
    });
  }

  if (spotPhotoFileInput) {
    spotPhotoFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const dataUrl = loadEvt.target.result;
        spotPhotoUrlInput.value = dataUrl;
        photoPreviewImg.src = dataUrl;
        photoPreviewWrap.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', () => {
      spotPhotoUrlInput.value = '';
      if (spotPhotoFileInput) spotPhotoFileInput.value = '';
      photoPreviewImg.src = '';
      photoPreviewWrap.style.display = 'none';
    });
  }
}

/**
 * Render Category Filter Chips with inline SVG icons
 */
function renderCategoryChips() {
  const container = document.getElementById('category-chips');
  if (!container) return;
  container.innerHTML = `
    <button class="chip ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">all</button>
    ${CATEGORIES.map(c => `
      <button class="chip ${activeCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
        ${c.iconSvg ? `<span class="chip-icon">${c.iconSvg}</span>` : ''}
        ${c.label}
      </button>
    `).join('')}
  `;

  container.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.cat;
      applyFiltersAndRender();
    });
  });
}

/**
 * Populate Category Dropdown inside modal
 */
function renderCategoryDropdown() {
  if (!spotCategorySelect) return;
  const currentVal = spotCategorySelect.value;
  spotCategorySelect.innerHTML = CATEGORIES.map(c => `
    <option value="${c.id}">${escapeHtml(c.label)}</option>
  `).join('');
  if (currentVal && CATEGORIES.some(c => c.id === currentVal)) {
    spotCategorySelect.value = currentVal;
  }
}

/**
 * Filter & Render Pipeline
 */
/**
 * Filter & Render Pipeline (with progressive loading to prevent freeze on All Destinations)
 */
function applyFiltersAndRender(resetPagination = true) {
  // Update counts across active city
  const cityFiltered = spots.filter(s => {
    if (activeCity === 'all') return true;
    return s.city.toLowerCase() === activeCity.toLowerCase();
  });

  const countAll = cityFiltered.length;
  const countWishlist = cityFiltered.filter(s => s.status === 'wishlist').length;
  const countVisited = cityFiltered.filter(s => s.status === 'visited').length;

  countAllEl.textContent = countAll;
  countWishlistEl.textContent = countWishlist;
  countVisitedEl.textContent = countVisited;

  // Filter spots
  let filtered = cityFiltered.filter(s => {
    // Status filter
    if (activeStatus !== 'all' && s.status !== activeStatus) return false;
    // Category filter
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    // Search query
    if (searchQuery) {
      const match = (s.name + ' ' + (s.neighborhood || '') + ' ' + (s.notes || '') + ' ' + (s.city || '')).toLowerCase();
      if (!match.includes(searchQuery)) return false;
    }
    return true;
  });

  // Deterministic sorting
  if (userCoords && isNearMeSorted) {
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    distanceSortIndicator.style.display = 'inline';
  } else {
    distanceSortIndicator.style.display = 'none';
    filtered.sort((a, b) => {
      // Starred / Priority spots first
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      // Then alphabetical by name
      return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
    });
  }

  currentFilteredSpotsCache = filtered;

  if (resetPagination) {
    currentVisibleSpotsCount = SPOTS_PAGE_SIZE;
  }

  // Update spot count label
  const visibleCount = Math.min(currentVisibleSpotsCount, filtered.length);
  if (visibleCount < filtered.length) {
    spotsCountLabel.textContent = `Showing ${visibleCount} of ${filtered.length} spots`;
  } else {
    spotsCountLabel.textContent = `Showing ${filtered.length} of ${countAll} spots`;
  }

  // Render cards progressively
  renderSpotCards(filtered, currentVisibleSpotsCount);

  // Render on Map with progressive streaming & lazy popups
  renderMapSpots(filtered);
}

/**
 * Render Spot Cards in Feed (with progressive pagination to keep mobile main thread fast)
 */
function renderSpotCards(allSpots, maxVisibleCount = SPOTS_PAGE_SIZE) {
  if (allSpots.length === 0) {
    if (spotsIntersectionObserver) spotsIntersectionObserver.disconnect();
    spotsListContainer.innerHTML = `
      <div class="empty-spots-notice" style="text-align: center; padding: 40px 20px; color: var(--ink-muted);">
        <p style="font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 6px;">No spots found</p>
        <p style="font-size: 0.8rem;">Try clearing your filters or add a new spot using the button above.</p>
      </div>
    `;
    return;
  }

  const spotsToRender = allSpots.slice(0, maxVisibleCount);
  const remainingCount = allSpots.length - spotsToRender.length;

  // Remove empty-state notice if present
  const emptyNotice = spotsListContainer.querySelector('.empty-spots-notice');
  if (emptyNotice) emptyNotice.remove();

  // Index existing cards in DOM by their data-id
  const existingCards = new Map();
  spotsListContainer.querySelectorAll('.spot-card').forEach(card => {
    if (card.dataset.id) {
      existingCards.set(card.dataset.id, card);
    }
  });

  const nextIds = new Set(spotsToRender.map(s => s.id));

  // Remove cards that are no longer in spotsToRender
  existingCards.forEach((card, id) => {
    if (!nextIds.has(id)) {
      card.remove();
      existingCards.delete(id);
    }
  });

  // Reconcile and append cards in deterministic order
  spotsToRender.forEach(spot => {
    const cat = CATEGORY_MAP.get(spot.category) || { label: 'spot', code: '·', iconSvg: '' };
    const navUrl = generateSingleNavigationUrl(spot.lat, spot.lng);
    const distBadge = spot.distanceKm !== undefined
      ? `<span class="badge badge-distance">${formatDistanceAndWalk(spot.distanceKm)}</span>`
      : '';

    const locationLabel = spot.neighborhood
      ? `${escapeHtml(spot.neighborhood)} · ${escapeHtml(spot.city)}`
      : escapeHtml(spot.city);

    // Fingerprint of all visual content to prevent unnecessary re-renders
    const fingerprint = `${spot.photoUrl || ''}|${spot.name}|${spot.notes || ''}|${spot.status}|${spot.favorite ? 1 : 0}|${locationLabel}|${spot.hours || ''}|${distBadge}`;

    let card = existingCards.get(spot.id);

    if (card && card.dataset.fingerprint === fingerprint) {
      // Content has not changed at all — just maintain sequence in DOM without resetting images or layout
      spotsListContainer.appendChild(card);
      return;
    }

    if (!card) {
      card = document.createElement('article');
      card.className = 'spot-card';
      card.dataset.id = spot.id;
    }

    card.dataset.fingerprint = fingerprint;

    const mediaHtml = spot.photoUrl ? `
      <div class="card-media">
        <img src="${escapeHtml(spot.photoUrl)}" alt="${escapeHtml(spot.name)}" class="card-photo" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.style.display='none';">
        <span class="card-media-cat-badge">
          ${cat.iconSvg ? `<span class="badge-icon">${cat.iconSvg}</span>` : ''}
          ${escapeHtml(cat.label.toLowerCase())}
        </span>
      </div>
    ` : '';

    card.innerHTML = `
      ${mediaHtml}
      <div class="card-content">
        <div class="card-top">
          <div class="card-title-group">
            <span class="card-neighborhood">${locationLabel}</span>
            <h2 class="card-name">${escapeHtml(spot.name.toLowerCase())}</h2>
          </div>
          <button type="button" class="card-fav-btn ${spot.favorite ? 'is-favorite' : ''}" title="Starred / Priority spot" aria-label="Starred / Priority spot">
            ${spot.favorite ? 'starred' : 'star'}
          </button>
        </div>

        ${spot.notes ? `<p class="card-notes">${escapeHtml(spot.notes)}</p>` : ''}

        <div class="card-badges">
          <span class="badge badge-category">
            ${cat.iconSvg ? `<span class="badge-icon" style="display:inline-flex; vertical-align:middle; margin-right:3px; width:10px; height:10px;">${cat.iconSvg}</span>` : ''}
            ${cat.label.toLowerCase()}
          </span>
          <span class="badge badge-status-${spot.status}">
            ${spot.status === 'visited' ? 'visited' : 'wishlist'}
          </span>
          ${distBadge}
          ${spot.hours ? `<span class="card-hours">· ${escapeHtml(spot.hours)}</span>` : ''}
        </div>

        <div class="card-footer">
          <div class="card-actions-left">
            ${!isReadOnlyGuide ? `
              <button type="button" class="btn-toggle-status" data-action="toggle-status">
                ${spot.status === 'visited' ? 'to wishlist' : 'mark visited'}
              </button>
              <button type="button" class="btn-toggle-status" data-action="edit">
                edit
              </button>
              <button type="button" class="btn-toggle-status btn-spot-delete" data-action="delete" title="Delete spot">
                delete
              </button>
            ` : ''}
          </div>
          <a href="${navUrl}" target="_blank" rel="noopener noreferrer" class="card-nav-link">
            directions ↗
          </a>
        </div>
      </div>
    `;

    // Click on card body to focus map
    card.onclick = (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      document.querySelectorAll('.spot-card').forEach(c => c.classList.remove('active-spot'));
      card.classList.add('active-spot');
      focusSpot(spot);
      renderMapSpots(allSpots, spot.id);

      // On mobile screens, automatically switch to map view when a card is selected
      if (window.innerWidth <= 820 && mobileToggleMap) {
        mobileToggleMap.click();
      }
    };

    // Toggle favorite (disabled in read-only mode)
    const favBtn = card.querySelector('.card-fav-btn');
    if (favBtn) {
      if (isReadOnlyGuide) {
        favBtn.style.pointerEvents = 'none';
        favBtn.style.cursor = 'default';
      } else {
        favBtn.onclick = (e) => {
          e.stopPropagation();
          toggleFavorite(spot.id);
        };
      }
    }

    if (!isReadOnlyGuide) {
      // Toggle Status button
      const toggleStatusBtn = card.querySelector('[data-action="toggle-status"]');
      if (toggleStatusBtn) {
        toggleStatusBtn.onclick = (e) => {
          e.stopPropagation();
          toggleSpotStatus(spot.id);
        };
      }

      // Edit button
      const editBtn = card.querySelector('[data-action="edit"]');
      if (editBtn) {
        editBtn.onclick = (e) => {
          e.stopPropagation();
          openEditSpotModal(spot);
        };
      }

      // Delete button
      const deleteBtn = card.querySelector('[data-action="delete"]');
      if (deleteBtn) {
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          deleteSpot(spot.id);
        };
      }
    }

    spotsListContainer.appendChild(card);
  });

  // Remove existing loader or end indicator
  const existingLoader = spotsListContainer.querySelector('.spots-progressive-loader');
  if (existingLoader) existingLoader.remove();
  const existingEnd = spotsListContainer.querySelector('.spots-end-indicator');
  if (existingEnd) existingEnd.remove();

  if (remainingCount > 0) {
    const loaderEl = document.createElement('div');
    loaderEl.className = 'spots-progressive-loader';
    loaderEl.innerHTML = `
      <button type="button" class="btn-load-more" id="btn-load-more-spots">
        Load More Spots (${remainingCount} remaining) ↓
      </button>
      <span class="progressive-scroll-hint">or scroll down</span>
    `;
    spotsListContainer.appendChild(loaderEl);

    // Button click handler
    const btn = loaderEl.querySelector('#btn-load-more-spots');
    if (btn) {
      btn.addEventListener('click', () => {
        loadNextSpotsBatch();
      });
    }

    // IntersectionObserver for auto-loading as user reaches bottom
    setupProgressiveIntersectionObserver(loaderEl);
  } else if (allSpots.length > SPOTS_PAGE_SIZE) {
    const endEl = document.createElement('div');
    endEl.className = 'spots-end-indicator';
    endEl.textContent = `All ${allSpots.length} spots loaded · Archival Field Guide`;
    spotsListContainer.appendChild(endEl);
    if (spotsIntersectionObserver) spotsIntersectionObserver.disconnect();
  } else {
    if (spotsIntersectionObserver) spotsIntersectionObserver.disconnect();
  }
}

/**
 * Loads next batch of spots smoothly
 */
function loadNextSpotsBatch() {
  if (currentVisibleSpotsCount >= currentFilteredSpotsCache.length) return;
  currentVisibleSpotsCount += SPOTS_PAGE_SIZE;
  applyFiltersAndRender(false);
}

/**
 * Sets up IntersectionObserver for seamless infinite scrolling
 */
function setupProgressiveIntersectionObserver(sentinelEl) {
  if (spotsIntersectionObserver) {
    spotsIntersectionObserver.disconnect();
  }
  if (!window.IntersectionObserver) return;

  spotsIntersectionObserver = new IntersectionObserver((entries) => {
    if (entries[0] && entries[0].isIntersecting) {
      loadNextSpotsBatch();
    }
  }, {
    rootMargin: '300px'
  });

  spotsIntersectionObserver.observe(sentinelEl);
}

/**
 * Toggle Spot Status (Wishlist <-> Visited)
 */
function toggleSpotStatus(id) {
  const target = spots.find(s => s.id === id);
  if (!target) return;
  target.status = target.status === 'visited' ? 'wishlist' : 'visited';
  if (target.status === 'visited' && !target.visitDate) {
    target.visitDate = new Date().toISOString().slice(0, 10);
  }
  saveStoredSpots(spots);
  applyFiltersAndRender();
  updateSyncStatus('syncing', 'syncing...');
  upsertRemoteSpot(target).then(() => updateSyncStatus('synced', 'synced'));
}

/**
 * Toggle Favorite
 */
function toggleFavorite(id) {
  const target = spots.find(s => s.id === id);
  if (!target) return;
  target.favorite = !target.favorite;
  saveStoredSpots(spots);
  applyFiltersAndRender();
  updateSyncStatus('syncing', 'syncing...');
  upsertRemoteSpot(target).then(() => updateSyncStatus('synced', 'synced'));
}

/**
 * Remove / Delete Spot
 */
function deleteSpot(id) {
  const target = spots.find(s => s.id === id);
  if (!target) return;
  const ok = window.confirm(`Remove "${target.name.toLowerCase()}" from your guide?`);
  if (!ok) return;

  spots = spots.filter(s => s.id !== id);
  saveStoredSpots(spots);

  if (editingSpotId === id) {
    closeModal(modalSpot);
    editingSpotId = null;
  }

  applyFiltersAndRender();
  updateSyncStatus('syncing', 'syncing...');
  deleteRemoteSpot(id).then(() => updateSyncStatus('synced', 'synced'));
}

/**
 * Handle Near Me (Geolocation)
 */
function handleNearMeToggle() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  if (isNearMeSorted) {
    // Turn off
    isNearMeSorted = false;
    btnNearMe.classList.remove('btn-active');
    btnNearMe.textContent = 'near me';
    applyFiltersAndRender();
    return;
  }

  btnNearMe.textContent = 'locating...';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      isNearMeSorted = true;
      btnNearMe.classList.add('btn-active');
      btnNearMe.textContent = 'near me · active';
      setUserLocation(userCoords.lat, userCoords.lng);
      applyFiltersAndRender();
    },
    (err) => {
      btnNearMe.textContent = 'near me';
      alert('Could not retrieve your location: ' + err.message);
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

/**
 * Open Add Spot Modal
 */
function openAddSpotModal() {
  editingSpotId = null;
  document.getElementById('modal-spot-title').textContent = 'Add New Spot';
  formSpot.reset();
  renderCategoryDropdown();
  spotIdInput.value = '';
  spotCitySelect.value = activeCity !== 'all' ? activeCity : (cities[0] || 'Tokyo');
  geocodeStatus.textContent = 'Or tap on the map to drop coordinates automatically.';
  if (spotPhotoUrlInput) spotPhotoUrlInput.value = '';
  if (spotPhotoFileInput) spotPhotoFileInput.value = '';
  if (photoPreviewImg) photoPreviewImg.src = '';
  if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
  if (btnDeleteSpot) btnDeleteSpot.style.display = 'none';
  if (spotAutocompleteInput) spotAutocompleteInput.value = '';
  const autocompleteGroup = document.getElementById('autocomplete-group');
  if (autocompleteGroup) autocompleteGroup.style.display = 'block';
  hideAutocompleteDropdown();
  if (advancedCoordsDetails) advancedCoordsDetails.open = false;
  openModal(modalSpot);
  setTimeout(() => {
    if (spotAutocompleteInput) spotAutocompleteInput.focus();
  }, 120);
}

function openAddSpotModalWithCoords(lat, lng) {
  openAddSpotModal();
  spotLatInput.value = lat.toFixed(6);
  spotLngInput.value = lng.toFixed(6);
  geocodeStatus.textContent = `Coordinates set from map: [${lat.toFixed(4)}, ${lng.toFixed(4)}]`;
  reverseGeocodeCoords(lat, lng);
}

function openEditSpotModal(spot) {
  if (spot) normalizeSpotCategory(spot);
  editingSpotId = spot.id;
  document.getElementById('modal-spot-title').textContent = 'Edit Spot';
  renderCategoryDropdown();
  spotIdInput.value = spot.id;
  spotNameInput.value = spot.name;
  spotCitySelect.value = spot.city;
  spotNeighborhoodInput.value = spot.neighborhood || '';
  spotCategorySelect.value = spot.category;
  spotStatusSelect.value = spot.status;
  spotLatInput.value = spot.lat;
  spotLngInput.value = spot.lng;
  spotHoursInput.value = spot.hours || '';
  spotFavoriteCheckbox.checked = !!spot.favorite;
  spotNotesInput.value = spot.notes || '';
  const autocompleteGroup = document.getElementById('autocomplete-group');
  if (autocompleteGroup) autocompleteGroup.style.display = 'none';
  hideAutocompleteDropdown();
  if (advancedCoordsDetails) advancedCoordsDetails.open = true;
  if (spotPhotoUrlInput) spotPhotoUrlInput.value = spot.photoUrl || '';
  if (spotPhotoFileInput) spotPhotoFileInput.value = '';
  if (spot.photoUrl) {
    if (photoPreviewImg) photoPreviewImg.src = spot.photoUrl;
    if (photoPreviewWrap) photoPreviewWrap.style.display = 'block';
  } else {
    if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
  }
  geocodeStatus.textContent = 'Coordinates pre-filled.';
  if (btnDeleteSpot) btnDeleteSpot.style.display = 'inline-flex';
  openModal(modalSpot);
}

/**
 * Handle Spot Form Submit
 */
function handleSpotFormSubmit(e) {
  e.preventDefault();

  const name = spotNameInput.value.trim();
  const city = spotCitySelect.value;
  const neighborhood = spotNeighborhoodInput.value.trim();
  const category = spotCategorySelect.value;
  const status = spotStatusSelect.value;
  const lat = parseFloat(spotLatInput.value);
  const lng = parseFloat(spotLngInput.value);
  const hours = spotHoursInput.value.trim();
  const favorite = spotFavoriteCheckbox.checked;
  const notes = spotNotesInput.value.trim();
  const photoUrl = spotPhotoUrlInput ? spotPhotoUrlInput.value.trim() : '';

  if (!name || isNaN(lat) || isNaN(lng)) {
    alert('Please provide a valid spot name and coordinates.');
    return;
  }

  if (editingSpotId) {
    const idx = spots.findIndex(s => s.id === editingSpotId);
    if (idx !== -1) {
      spots[idx] = {
        ...spots[idx],
        name,
        city,
        neighborhood,
        category,
        status,
        lat,
        lng,
        hours,
        favorite,
        notes,
        photoUrl
      };
    }
  } else {
    const newSpot = {
      id: 'spot-' + Date.now(),
      name,
      city,
      neighborhood,
      category,
      status,
      lat,
      lng,
      hours,
      favorite,
      notes,
      photoUrl,
      visitDate: status === 'visited' ? new Date().toISOString().slice(0, 10) : ''
    };
    spots.unshift(newSpot);
  }

  const spotToSync = editingSpotId ? spots.find(s => s.id === editingSpotId) : spots[0];
  saveStoredSpots(spots);
  closeModal(modalSpot);

  // If new spot was added to a different city than currently viewing, switch to that city
  if (city && activeCity !== 'all' && activeCity.toLowerCase() !== city.toLowerCase()) {
    setActiveCity(city);
  } else {
    centerCityOnMap(activeCity, spots);
    applyFiltersAndRender();
  }

  if (spotToSync) {
    updateSyncStatus('syncing', 'syncing...');
    upsertRemoteSpot(spotToSync).then(() => updateSyncStatus('synced', 'synced'));
  }
}

/**
 * Photon Live Search-As-You-Type Autocomplete & Link Extractor
 */
let autocompleteTimer = null;
let currentAutocompleteResults = [];
let selectedAutocompleteIndex = -1;

function getCurrentCityBias() {
  const currentCitySpots = spots.filter(s => s.city.toLowerCase() === activeCity.toLowerCase());
  if (currentCitySpots.length > 0) {
    return { lat: currentCitySpots[0].lat, lng: currentCitySpots[0].lng };
  }
  return userCoords || null;
}

async function handleAutocompleteInput(e) {
  const val = e.target.value.trim();

  // 1. Check if user pasted a Google Maps URL
  const parsedUrl = parseGoogleMapsUrl(val);
  if (parsedUrl) {
    if (parsedUrl.name) spotNameInput.value = parsedUrl.name;
    spotLatInput.value = parsedUrl.lat.toFixed(6);
    spotLngInput.value = parsedUrl.lng.toFixed(6);
    geocodeStatus.textContent = `Coordinates extracted from Google Maps link: [${parsedUrl.lat.toFixed(4)}, ${parsedUrl.lng.toFixed(4)}]`;
    
    // Auto-reverse geocode the coordinates to get city and neighborhood
    reverseGeocodeCoords(parsedUrl.lat, parsedUrl.lng);
    hideAutocompleteDropdown();
    return;
  }

  // 2. Clear debounce timer
  clearTimeout(autocompleteTimer);
  if (val.length < 2) {
    hideAutocompleteDropdown();
    return;
  }

  autocompleteTimer = setTimeout(async () => {
    if (autocompleteSpinner) autocompleteSpinner.style.display = 'inline-block';
    const bias = getCurrentCityBias();
    const results = await searchPhotonPlaces(val, bias);
    if (autocompleteSpinner) autocompleteSpinner.style.display = 'none';

    renderAutocompleteDropdown(results);
  }, 200);
}

function renderAutocompleteDropdown(results) {
  if (!autocompleteDropdown) return;
  currentAutocompleteResults = results || [];
  selectedAutocompleteIndex = -1;

  if (currentAutocompleteResults.length === 0) {
    autocompleteDropdown.innerHTML = '<div style="padding: 0.65rem 0.85rem; font-family: var(--font-mono); font-size: 11px; color: var(--ink-secondary);">No places found. Continue typing or tap map to drop coordinates.</div>';
    autocompleteDropdown.style.display = 'block';
    return;
  }

  const CATEGORY_LABEL_MAP = {
    matcha_coffee: 'coffee & matcha',
    pastry_bakery: 'pastry & bakery',
    brunch_lunch: 'brunch & lunch',
    food_wine: 'dining & wine',
    bars_nightlife: 'bars & nightlife',
    hotels_stays: 'hotels & stays',
    shops_retail: 'shops & retail',
    museums_art: 'museums & art',
    concerts_music: 'concerts & music',
    ceramics_craft: 'ceramics & craft',
    books: 'books',
    theater_cinema: 'theater & cinema',
    books_cinema: 'books',
    parks_nature: 'parks & nature',
    surf_movement: 'surf & movement',
    other: 'place'
  };

  autocompleteDropdown.innerHTML = currentAutocompleteResults.map((r, idx) => `
    <div class="autocomplete-item" data-index="${idx}">
      <div class="autocomplete-name-row">
        <span class="autocomplete-item-name">${escapeHtml(r.name)}</span>
        <span class="autocomplete-item-badge">${CATEGORY_LABEL_MAP[r.category] || r.osmType}</span>
      </div>
      <div class="autocomplete-item-addr">${escapeHtml(r.formattedAddress || r.city || '')}</div>
    </div>
  `).join('');

  autocompleteDropdown.style.display = 'block';

  // Attach click events
  autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-index'), 10);
      if (!isNaN(idx) && currentAutocompleteResults[idx]) {
        selectAutocompletePlace(currentAutocompleteResults[idx]);
      }
    });
  });
}

function selectAutocompletePlace(place) {
  spotNameInput.value = place.name;
  spotLatInput.value = place.lat.toFixed(6);
  spotLngInput.value = place.lng.toFixed(6);

  if (place.neighborhood) {
    spotNeighborhoodInput.value = place.neighborhood;
  }

  if (place.category && place.category !== 'other') {
    spotCategorySelect.value = place.category;
  }

  // Handle City matching or adding
  if (place.city) {
    let matchedCity = cities.find(c => c.toLowerCase() === place.city.toLowerCase());
    if (!matchedCity) {
      cities.push(place.city);
      saveStoredCities(cities);
      renderCityDropdowns();
      matchedCity = place.city;
    }
    spotCitySelect.value = matchedCity;
  }

  geocodeStatus.textContent = `Location set: ${place.formattedAddress || place.name}`;
  spotAutocompleteInput.value = place.name;
  hideAutocompleteDropdown();
}

function hideAutocompleteDropdown() {
  if (autocompleteDropdown) autocompleteDropdown.style.display = 'none';
  if (autocompleteSpinner) autocompleteSpinner.style.display = 'none';
}

async function reverseGeocodeCoords(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ArchivalFieldGuide/1.0' } });
    const data = await res.json();
    if (data && data.address) {
      const a = data.address;
      const hood = a.suburb || a.neighbourhood || a.district || a.road || '';
      const c = a.city || a.town || a.municipality || a.county || '';
      if (hood && !spotNeighborhoodInput.value) spotNeighborhoodInput.value = hood;
      if (c && !spotCitySelect.value) {
        let matchedCity = cities.find(ct => ct.toLowerCase() === c.toLowerCase());
        if (!matchedCity) {
          cities.push(c);
          saveStoredCities(cities);
          renderCityDropdowns();
          matchedCity = c;
        }
        spotCitySelect.value = matchedCity;
      }
    }
  } catch (e) {
    console.warn('Reverse geocoding failed:', e);
  }
}

/**
 * Free Nominatim Geocoding
 */
async function handleGeocodeSearch() {
  const query = spotSearchAddr.value.trim();
  if (!query) return;

  geocodeStatus.textContent = 'Searching OpenStreetMap...';

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ArchivalFieldGuide/1.0' } });
    const data = await res.json();

    if (data && data.length > 0) {
      const match = data[0];
      spotLatInput.value = parseFloat(match.lat).toFixed(6);
      spotLngInput.value = parseFloat(match.lon).toFixed(6);
      geocodeStatus.textContent = `Found: ${match.display_name.slice(0, 50)}...`;
    } else {
      geocodeStatus.textContent = 'No results found. Try adding city name or tap directly on the map.';
    }
  } catch (err) {
    geocodeStatus.textContent = 'Lookup failed (network). You can tap on the map to set coordinates.';
  }
}

/**
 * KML File Processing
 */
function handleKmlFileSelected(e) {
  if (e.target.files && e.target.files.length > 0) {
    processKmlFile(e.target.files[0]);
  }
}

function processKmlFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const targetCity = kmlTargetCity.value;

      // Check if file is a JSON backup
      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(content);
        if (parsed.spots && Array.isArray(parsed.spots)) {
          pendingKmlSpots = parsed.spots;
          if (parsed.cities && Array.isArray(parsed.cities)) {
            parsed.cities.forEach(c => {
              if (!cities.some(ci => ci.toLowerCase() === c.toLowerCase())) {
                cities.push(c);
              }
            });
            saveStoredCities(cities);
            renderCityDropdowns();
          }
          kmlPreview.style.display = 'block';
          kmlPreviewCount.textContent = `Found ${pendingKmlSpots.length} spots in backup:`;
          kmlPreviewList.innerHTML = pendingKmlSpots.slice(0, 8).map(s => `<div>• ${escapeHtml(s.name)} (${s.category || 'spot'})</div>`).join('');
          if (pendingKmlSpots.length > 8) {
            kmlPreviewList.innerHTML += `<div style="font-style: italic; margin-top: 4px;">...and ${pendingKmlSpots.length - 8} more</div>`;
          }
          btnConfirmKmlImport.disabled = false;
          return;
        }
      }

      pendingKmlSpots = parseKML(content, targetCity);

      if (pendingKmlSpots.length === 0) {
        alert('No placemarks found in this KML file.');
        return;
      }

      kmlPreview.style.display = 'block';
      kmlPreviewCount.textContent = `Found ${pendingKmlSpots.length} spots in file:`;
      kmlPreviewList.innerHTML = pendingKmlSpots.slice(0, 8).map(s => `<div>• ${escapeHtml(s.name)} (${s.category})</div>`).join('');
      if (pendingKmlSpots.length > 8) {
        kmlPreviewList.innerHTML += `<div style="font-style: italic; margin-top: 4px;">...and ${pendingKmlSpots.length - 8} more</div>`;
      }
      btnConfirmKmlImport.disabled = false;
    } catch (err) {
      alert('Error reading KML file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function handleConfirmKmlImport() {
  if (pendingKmlSpots.length === 0) return;

  const targetCity = kmlTargetCity.value;
  const count = pendingKmlSpots.length;
  const toImport = pendingKmlSpots.map(s => ({ ...s, city: targetCity }));

  spots = [...toImport, ...spots];
  saveStoredSpots(spots);

  // Sync imported spots to Supabase via batch push
  updateSyncStatus('syncing', `uploading ${count}...`);
  pushSpotsToRemote(toImport).then(() => {
    updateSyncStatus('synced', `synced (${spots.length})`);
  }).catch(err => {
    console.warn('Batch upload failed:', err);
  });

  // Ensure target city is in stored cities list
  const storedCities = getStoredCities();
  if (!storedCities.some(c => c.toLowerCase() === targetCity.toLowerCase())) {
    storedCities.push(targetCity);
    saveStoredCities(storedCities);
    cities = storedCities;
    renderCityDropdowns();
  }

  // Switch to this city
  activeCity = targetCity;
  citySelect.value = targetCity;

  closeModal(modalKml);
  pendingKmlSpots = [];
  kmlPreview.style.display = 'none';
  btnConfirmKmlImport.disabled = true;

  applyFiltersAndRender();
  alert(`Successfully imported ${count} spots into ${targetCity}! Syncing to Supabase cloud.`);
}

/**
 * Day Loop Planner
 */
function openDayLoopModal() {
  const currentCitySpots = spots.filter(s => s.city.toLowerCase() === activeCity.toLowerCase());
  if (currentCitySpots.length < 2) {
    alert(`You need at least 2 spots in ${activeCity} to sequence a day loop.`);
    return;
  }

  // Populate start spot dropdown
  loopStartSpot.innerHTML = currentCitySpots.map(s => `
    <option value="${s.id}">${escapeHtml(s.name)} (${s.neighborhood || s.category})</option>
  `).join('');

  updateLoopPreview();
  openModal(modalLoop);
}

function updateLoopPreview() {
  const currentCitySpots = spots.filter(s => s.city.toLowerCase() === activeCity.toLowerCase());
  const startId = loopStartSpot.value;
  const maxStops = parseInt(loopMaxStops.value, 10);

  // Take subset of spots around start spot
  const sequenced = sequenceDayLoop(currentCitySpots, startId).slice(0, maxStops);
  const stats = calculateLoopStats(sequenced);

  loopTotalDist.textContent = `${stats.totalDistanceKm.toFixed(1)} km`;
  loopTotalTime.textContent = `${stats.totalMinutes} min`;
  loopStopCount.textContent = sequenced.length;

  loopTimeline.innerHTML = sequenced.map((spot, idx) => {
    const cat = CATEGORY_MAP.get(spot.category) || { label: 'Spot', code: '·' };
    const legInfo = idx < sequenced.length - 1 && stats.legs[idx]
      ? `<div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); padding: 4px 0 4px 34px;">
           ↓ ${stats.legs[idx].minutes} min walk (${(stats.legs[idx].distanceKm * 1000).toFixed(0)} m)
         </div>`
      : '';

    return `
      <div class="loop-step-card">
        <div class="loop-step-number">${idx + 1}</div>
        <div class="loop-step-info">
          <div class="loop-step-name">${escapeHtml(spot.name)}</div>
          <div class="loop-step-meta">${cat.label} · ${escapeHtml(spot.neighborhood || spot.city)} · ${spot.hours || 'Hours flexible'}</div>
        </div>
      </div>
      ${legInfo}
    `;
  }).join('');

  // Update navigation button link
  const navUrl = generateMultiWaypointUrl(sequenced);
  btnLaunchNavLoop.href = navUrl;
}

function executeDrawLoopOnMap() {
  const currentCitySpots = spots.filter(s => s.city.toLowerCase() === activeCity.toLowerCase());
  const startId = loopStartSpot.value;
  const maxStops = parseInt(loopMaxStops.value, 10);
  const sequenced = sequenceDayLoop(currentCitySpots, startId).slice(0, maxStops);

  drawLoopPolyline(sequenced);

  // Switch to map view on mobile if needed
  if (window.innerWidth <= 820) {
    mobileToggleMap.click();
  }
}

/**
 * City Management & City Atlas (Concept 2: Typographic Cards Grid)
 */
function setActiveCity(cityName) {
  activeCity = cityName;
  localStorage.setItem('flaneur_active_city', cityName);
  if (citySelect) citySelect.value = cityName;
  updateCityTriggerButton();
  clearLoopPolyline();
  centerCityOnMap(activeCity, spots);
  applyFiltersAndRender();
}

function updateCityTriggerButton() {
  const triggerCode = document.getElementById('active-city-code');
  const triggerName = document.getElementById('active-city-name');
  const triggerCount = document.getElementById('active-city-count');
  if (!triggerName) return;

  if (activeCity === 'all') {
    if (triggerCode) triggerCode.textContent = 'ALL';
    triggerName.textContent = 'All Destinations';
    if (triggerCount) triggerCount.textContent = `${spots.length} spots`;
  } else {
    const meta = getCityMeta(activeCity);
    if (triggerCode) triggerCode.textContent = meta.code;
    triggerName.textContent = activeCity;
    const citySpotsCount = spots.filter(s => s.city.toLowerCase() === activeCity.toLowerCase()).length;
    if (triggerCount) triggerCount.textContent = `${citySpotsCount} ${citySpotsCount === 1 ? 'spot' : 'spots'}`;
  }
}

function renderCityDropdowns() {
  // Main city selector (kept in DOM for script compat)
  if (citySelect) {
    citySelect.innerHTML = `
      <option value="all">All Destinations</option>
      ${cities.map(c => {
        const meta = getCityMeta(c);
        const typeNote = meta.type !== 'city' ? ` (${meta.typeLabel})` : '';
        return `<option value="${c}" ${c.toLowerCase() === activeCity.toLowerCase() ? 'selected' : ''}>${c}${typeNote}</option>`;
      }).join('')}
    `;
  }

  // Update trigger button
  updateCityTriggerButton();

  // Spot modal destination select
  spotCitySelect.innerHTML = cities.map(c => {
    const meta = getCityMeta(c);
    const typeNote = meta.type !== 'city' ? ` (${meta.typeLabel})` : '';
    return `<option value="${c}">${c}${typeNote}</option>`;
  }).join('');

  // KML target destination select
  kmlTargetCity.innerHTML = cities.map(c => {
    const meta = getCityMeta(c);
    const typeNote = meta.type !== 'city' ? ` (${meta.typeLabel})` : '';
    return `<option value="${c}">${c}${typeNote}</option>`;
  }).join('');
}

function openCityManagerModal() {
  atlasSearchQuery = '';
  if (atlasSearchInput) atlasSearchInput.value = '';
  atlasActiveRegion = 'overview';
  renderCityManagerList();
  openModal(modalCities);
  if (window.innerWidth > 768 && atlasSearchInput) {
    setTimeout(() => {
      atlasSearchInput.focus();
    }, 100);
  }
}

function renderCityManagerList() {
  const listEl = document.getElementById('cities-list-manage');
  if (!listEl) return;

  // Build city statistics
  const cityStats = cities.map(cityName => {
    const citySpots = spots.filter(s => s.city.toLowerCase() === cityName.toLowerCase());
    const visitedCount = citySpots.filter(s => s.status === 'visited').length;
    const meta = getCityMeta(cityName);
    return {
      name: cityName,
      code: meta.code,
      country: meta.country,
      region: getCityRegion(cityName),
      type: meta.type || 'city',
      typeLabel: meta.typeLabel || 'City',
      totalSpots: citySpots.length,
      visitedCount: visitedCount,
      visitedPercent: citySpots.length > 0 ? Math.round((visitedCount / citySpots.length) * 100) : 0,
      isActive: activeCity.toLowerCase() === cityName.toLowerCase()
    };
  });

  // Calculate tab badge counts
  const activeCitiesCount = cityStats.filter(c => c.totalSpots > 0 || c.isActive).length;
  if (atlasActiveCountEl) atlasActiveCountEl.textContent = activeCitiesCount;
  if (atlasAllCountEl) atlasAllCountEl.textContent = cities.length;

  // Determine if we should show regional overview or destination list
  const isOverview = (atlasActiveRegion === 'overview' && !atlasSearchQuery);

  // Sync Regional Pills UI
  if (atlasRegionPills && atlasRegionPills.length > 0) {
    atlasRegionPills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-region') === atlasActiveRegion);
    });
  }

  // Toggle auxiliary controls visibility
  const typePillsWrap = document.getElementById('atlas-type-pills');
  const subToolbarWrap = document.querySelector('.atlas-sub-toolbar');
  const footerHintEl = document.querySelector('.atlas-footer-hint');

  if (typePillsWrap) {
    typePillsWrap.style.display = isOverview ? 'none' : 'flex';
  }
  if (subToolbarWrap) {
    subToolbarWrap.style.display = isOverview ? 'none' : 'flex';
  }
  if (footerHintEl) {
    footerHintEl.textContent = isOverview
      ? 'Select a region above to explore its destinations, or search directly.'
      : 'Tap any destination to switch guide & center map.';
  }

  // --- Regional Overview View ---
  if (isOverview) {
    listEl.classList.remove('compact-view');
    listEl.classList.add('overview-view');

    // Render cards for each defined region
    const regionCardsHtml = REGION_DEFINITIONS.map(reg => {
      const regionCities = cityStats.filter(c => c.region === reg.id);
      const totalSpots = regionCities.reduce((sum, c) => sum + c.totalSpots, 0);
      const visitedCount = regionCities.reduce((sum, c) => sum + c.visitedCount, 0);
      const visitedPercent = totalSpots > 0 ? Math.round((visitedCount / totalSpots) * 100) : 0;
      const hasActive = regionCities.some(c => c.isActive);
      const activeCityInRegion = regionCities.find(c => c.isActive);

      // Sort previews: active first, then most spots
      const sortedPreviews = [...regionCities].sort((a, b) => {
        if (a.isActive) return -1;
        if (b.isActive) return 1;
        return b.totalSpots - a.totalSpots;
      });
      const previewCities = sortedPreviews.slice(0, 6);
      const remainingCount = sortedPreviews.length - previewCities.length;

      return `
        <div class="atlas-region-card ${hasActive ? 'has-active' : ''}" data-open-region="${reg.id}">
          <div class="atlas-region-card-header">
            <span class="atlas-region-code-badge">[ ${reg.code} ]</span>
            ${hasActive ? `<span class="atlas-active-badge">CURRENT: ${escapeHtml(activeCityInRegion.name.toUpperCase())}</span>` : ''}
          </div>
          <div class="atlas-region-card-body">
            <h3 class="atlas-region-card-title">${reg.name}</h3>
            <div class="atlas-region-card-desc">${reg.description}</div>
            <div class="atlas-region-preview-tags">
              ${previewCities.map(c => `
                <span class="atlas-region-preview-tag ${c.isActive ? 'is-active-city' : ''}">
                  ${escapeHtml(c.name)}${c.totalSpots > 0 ? ` (${c.totalSpots})` : ''}
                </span>
              `).join('')}
              ${remainingCount > 0 ? `<span class="atlas-region-preview-tag" style="opacity: 0.7;">+${remainingCount} more</span>` : ''}
            </div>
          </div>
          <div class="atlas-region-card-footer">
            <div class="atlas-region-stats">
              <strong>${regionCities.length}</strong> destinations · <strong>${totalSpots}</strong> spots · ${visitedPercent}% visited
            </div>
            <span class="atlas-region-cta">Explore Region →</span>
          </div>
        </div>
      `;
    }).join('');

    // Global All Destinations Overview Card
    const totalGlobalSpots = spots.length;
    const totalGlobalVisited = spots.filter(s => s.status === 'visited').length;
    const globalPercent = totalGlobalSpots > 0 ? Math.round((totalGlobalVisited / totalGlobalSpots) * 100) : 0;
    const globalCardHtml = `
      <div class="atlas-region-card ${activeCity === 'all' ? 'has-active' : ''}" data-open-region="all">
        <div class="atlas-region-card-header">
          <span class="atlas-region-code-badge">[ ALL ]</span>
          ${activeCity === 'all' ? '<span class="atlas-active-badge">CURRENT: GLOBAL</span>' : ''}
        </div>
        <div class="atlas-region-card-body">
          <h3 class="atlas-region-card-title">All Destinations</h3>
          <div class="atlas-region-card-desc">Browse complete archival index of all world destinations</div>
          <div class="atlas-region-preview-tags">
            <span class="atlas-region-preview-tag">Worldwide</span>
            <span class="atlas-region-preview-tag">${cities.length} Curated Guides</span>
            <span class="atlas-region-preview-tag">${spots.length} Total Spots</span>
          </div>
        </div>
        <div class="atlas-region-card-footer">
          <div class="atlas-region-stats">
            <strong>${cities.length}</strong> destinations · <strong>${spots.length}</strong> spots · ${globalPercent}% visited
          </div>
          <span class="atlas-region-cta">View All Destinations →</span>
        </div>
      </div>
    `;

    listEl.innerHTML = regionCardsHtml + globalCardHtml;

    // Attach click listeners to region cards
    listEl.querySelectorAll('[data-open-region]').forEach(card => {
      card.addEventListener('click', () => {
        const targetRegion = card.getAttribute('data-open-region');
        atlasActiveRegion = targetRegion;
        renderCityManagerList();
      });
    });

    return;
  }

  // --- Destination Drill-down View (or Search Results View) ---
  listEl.classList.remove('overview-view');
  listEl.classList.toggle('compact-view', atlasViewMode === 'compact');

  // Filter by tab
  let displayCities = cityStats;
  if (atlasActiveTab === 'active' && !atlasSearchQuery) {
    displayCities = displayCities.filter(c => c.totalSpots > 0 || c.isActive);
  }

  // Filter by region macro tab
  if (atlasActiveRegion !== 'all' && atlasActiveRegion !== 'overview') {
    displayCities = displayCities.filter(c => c.region === atlasActiveRegion);
  }

  // Filter by destination type (all | city | county | area)
  if (atlasActiveType !== 'all') {
    displayCities = displayCities.filter(c => c.type === atlasActiveType);
  }

  // Filter by search query
  if (atlasSearchQuery) {
    displayCities = displayCities.filter(c => {
      return (
        c.name.toLowerCase().includes(atlasSearchQuery) ||
        c.country.toLowerCase().includes(atlasSearchQuery) ||
        c.code.toLowerCase().includes(atlasSearchQuery) ||
        c.typeLabel.toLowerCase().includes(atlasSearchQuery) ||
        c.region.toLowerCase().includes(atlasSearchQuery)
      );
    });
  }

  // Sort: active city first, then by spots count descending, then alphabetical
  displayCities.sort((a, b) => {
    if (a.isActive) return -1;
    if (b.isActive) return 1;
    if (b.totalSpots !== a.totalSpots) return b.totalSpots - a.totalSpots;
    return a.name.localeCompare(b.name);
  });

  // Breadcrumb bar HTML (when viewing a specific region or all without search)
  let breadcrumbHtml = '';
  if (!atlasSearchQuery) {
    const currentRegionDef = REGION_DEFINITIONS.find(r => r.id === atlasActiveRegion);
    const regionName = currentRegionDef ? currentRegionDef.name : (atlasActiveRegion === 'all' ? 'All Destinations' : atlasActiveRegion);
    const regionSpotsTotal = displayCities.reduce((sum, c) => sum + c.totalSpots, 0);

    breadcrumbHtml = `
      <div class="atlas-region-breadcrumb-bar">
        <button type="button" class="atlas-back-btn" data-back-to-overview>
          ← All Regions
        </button>
        <div class="atlas-breadcrumb-title">
          <strong>${escapeHtml(regionName)}</strong> · ${displayCities.length} ${displayCities.length === 1 ? 'Destination' : 'Destinations'} · ${regionSpotsTotal} Spots
        </div>
      </div>
    `;
  }

  if (displayCities.length === 0) {
    listEl.innerHTML = `
      ${breadcrumbHtml}
      <div style="grid-column: 1 / -1; padding: 2.5rem 1rem; text-align: center; color: var(--ink-secondary); font-family: var(--font-mono); font-size: 13px;">
        No destinations found matching your filters.
        <div style="margin-top: 8px; color: var(--ink-muted);">Try selecting another category, clearing your search, or returning to regions overview.</div>
        <div style="margin-top: 14px;">
          <button type="button" class="atlas-back-btn" data-back-to-overview>← Back to Regions Overview</button>
        </div>
      </div>
    `;
    listEl.querySelectorAll('[data-back-to-overview]').forEach(btn => {
      btn.addEventListener('click', () => {
        atlasActiveRegion = 'overview';
        renderCityManagerList();
      });
    });
    return;
  }

  if (atlasViewMode === 'compact') {
    // Luggage Tag Compact Grid
    listEl.innerHTML = `
      ${breadcrumbHtml}

      ${(!atlasSearchQuery && atlasActiveRegion === 'all' && atlasActiveType === 'all') ? `
        <div class="atlas-luggage-tag ${activeCity === 'all' ? 'active' : ''}" data-select-city="all">
          <div class="tag-code-block">
            <span class="tag-code-text">ALL</span>
            <span class="tag-type-pill tag-type-city">GLOBAL</span>
          </div>
          <div class="tag-body-block">
            <div class="tag-city-title">All Destinations</div>
            <div class="tag-country-subtitle">Global Field Guide</div>
          </div>
          <div class="tag-badge-block">
            <span class="tag-count-pill">${spots.length} spots</span>
          </div>
        </div>
      ` : ''}

      ${displayCities.map(c => `
        <div class="atlas-luggage-tag ${c.isActive ? 'active' : ''} ${c.totalSpots === 0 ? 'empty-city' : ''}" data-select-city="${escapeHtml(c.name)}">
          <div class="tag-code-block">
            <span class="tag-code-text">${c.code}</span>
            <span class="tag-type-pill tag-type-${c.type}">${c.type.toUpperCase()}</span>
          </div>
          <div class="tag-body-block">
            <div class="tag-city-title">${escapeHtml(c.name)}</div>
            <div class="tag-country-subtitle">${escapeHtml(c.country)} · ${escapeHtml(c.typeLabel)}${atlasSearchQuery ? ` · ${c.region.toUpperCase()}` : ''}</div>
          </div>
          <div class="tag-badge-block">
            <span class="tag-count-pill">${c.totalSpots} ${c.totalSpots === 1 ? 'spot' : 'spots'}</span>
          </div>
          ${(!c.isActive || displayCities.length > 1) && !isReadOnlyGuide ? `
            <button type="button" class="atlas-btn-remove" data-delete-city="${escapeHtml(c.name)}" data-spot-count="${c.totalSpots}" title="Remove ${c.typeLabel.toLowerCase()}">×</button>
          ` : ''}
        </div>
      `).join('')}
    `;
  } else {
    // Detailed Cards View
    listEl.innerHTML = `
      ${breadcrumbHtml}

      <!-- "All Destinations" Card -->
      ${(!atlasSearchQuery && atlasActiveRegion === 'all' && atlasActiveType === 'all') ? `
        <div class="atlas-card ${activeCity === 'all' ? 'active' : ''}" data-select-city="all">
          <div class="atlas-card-header">
            <div class="atlas-code-type-wrap">
              <span class="atlas-card-code">[ ALL ]</span>
              <span class="tag-type-pill tag-type-city">GLOBAL</span>
            </div>
            ${activeCity === 'all' ? '<span class="atlas-active-badge">ACTIVE</span>' : ''}
          </div>
          <div class="atlas-card-body">
            <h3 class="atlas-card-title">All Destinations</h3>
            <span class="atlas-card-country">Global Field Guide</span>
          </div>
          <div class="atlas-card-footer">
            <div class="atlas-card-stats">
              <span class="atlas-spot-count"><strong>${spots.length}</strong> spots</span>
              <span class="atlas-visited-count">${spots.filter(s => s.status === 'visited').length} visited</span>
            </div>
            <div class="atlas-progress-bar">
              <div class="atlas-progress-fill" style="width: ${spots.length > 0 ? Math.round((spots.filter(s => s.status === 'visited').length / spots.length) * 100) : 0}%"></div>
            </div>
          </div>
        </div>
      ` : ''}

      ${displayCities.map(c => `
        <div class="atlas-card ${c.isActive ? 'active' : ''} ${c.totalSpots === 0 ? 'empty-city' : ''}" data-select-city="${escapeHtml(c.name)}">
          <div class="atlas-card-header">
            <div class="atlas-code-type-wrap">
              <span class="atlas-card-code">[ ${c.code} ]</span>
              <span class="tag-type-pill tag-type-${c.type}">${c.type.toUpperCase()}</span>
            </div>
            <div class="atlas-card-badges">
              ${c.isActive ? '<span class="atlas-active-badge">ACTIVE</span>' : ''}
              ${(!c.isActive || displayCities.length > 1) && !isReadOnlyGuide ? `
                <button type="button" class="atlas-btn-remove" data-delete-city="${escapeHtml(c.name)}" data-spot-count="${c.totalSpots}" title="${c.totalSpots > 0 ? `Delete ${c.typeLabel.toLowerCase()} and its ${c.totalSpots} spots` : `Remove ${c.typeLabel.toLowerCase()}`}">×</button>
              ` : ''}
            </div>
          </div>
          <div class="atlas-card-body">
            <h3 class="atlas-card-title">${escapeHtml(c.name)}</h3>
            <span class="atlas-card-country">${escapeHtml(c.country)} · ${escapeHtml(c.typeLabel)}${atlasSearchQuery ? ` · ${c.region.toUpperCase()}` : ''}</span>
          </div>
          <div class="atlas-card-footer">
            ${c.totalSpots > 0 ? `
              <div class="atlas-card-stats">
                <span class="atlas-spot-count"><strong>${c.totalSpots}</strong> ${c.totalSpots === 1 ? 'spot' : 'spots'}</span>
                <span class="atlas-visited-count">${c.visitedCount} visited</span>
              </div>
              <div class="atlas-progress-bar">
                <div class="atlas-progress-fill" style="width: ${c.visitedPercent}%"></div>
              </div>
            ` : `
              <span class="atlas-empty-label">0 spots · wishlist index</span>
            `}
          </div>
        </div>
      `).join('')}
    `;
  }

  // Attach back to overview handlers
  listEl.querySelectorAll('[data-back-to-overview]').forEach(btn => {
    btn.addEventListener('click', () => {
      atlasActiveRegion = 'overview';
      renderCityManagerList();
    });
  });

  // Attach card click handlers to select destination
  listEl.querySelectorAll('[data-select-city]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-delete-city]')) return;
      const targetCity = card.getAttribute('data-select-city');
      setActiveCity(targetCity);
      closeModal(modalCities);
    });
  });

  // Attach remove city handlers
  listEl.querySelectorAll('[data-delete-city]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const cityToRemove = btn.getAttribute('data-delete-city');
      const spotCount = parseInt(btn.getAttribute('data-spot-count') || '0', 10);
      const confirmMsg = spotCount > 0
        ? `Delete ${cityToRemove} and all ${spotCount} spots inside it?`
        : `Remove ${cityToRemove} from destinations list?`;

      if (confirm(confirmMsg)) {
        if (spotCount > 0) {
          const spotsToDelete = spots.filter(s => s.city.toLowerCase() === cityToRemove.toLowerCase());
          for (const s of spotsToDelete) {
            deleteRemoteSpot(s.id);
          }
          spots = spots.filter(s => s.city.toLowerCase() !== cityToRemove.toLowerCase());
          saveStoredSpots(spots);
        }
        cities = cities.filter(c => c.toLowerCase() !== cityToRemove.toLowerCase());
        saveStoredCities(cities);
        deleteRemoteCity(cityToRemove);
        if (activeCity.toLowerCase() === cityToRemove.toLowerCase()) {
          setActiveCity(cities[0] || 'all');
        } else {
          renderCityDropdowns();
          renderCityManagerList();
          applyFiltersAndRender();
        }
      }
    });
  });
}

function openShareGuideModal() {
  const shareCity = activeCity === 'all' ? 'All Destinations' : activeCity;
  const origin = window.location.origin + window.location.pathname;
  const shareParam = activeCity === 'all' ? 'all' : encodeURIComponent(activeCity);
  const shareUrl = `${origin}?guide=${shareParam}`;

  if (shareUrlInput) {
    shareUrlInput.value = shareUrl;
  }

  const meta = getCityMeta(activeCity);
  const typeDescriptor = activeCity === 'all' ? '' : ` (${meta.typeLabel} Itinerary)`;

  const modalTitle = document.getElementById('modal-share-title');
  if (modalTitle) {
    modalTitle.textContent = `Share ${shareCity} ${meta.typeLabel || 'Field'} Guide`;
  }

  // Generate formatted text itinerary
  const citySpots = activeCity === 'all'
    ? spots
    : spots.filter(s => s.city.toLowerCase() === activeCity.toLowerCase());

  let textSummary = `ARCHIVAL FIELD GUIDE — ${shareCity.toUpperCase()}${typeDescriptor.toUpperCase()}\n`;
  textSummary += `${citySpots.length} Curated Spots · View Online: ${shareUrl}\n\n`;

  // Group spots by category
  const grouped = new Map();
  citySpots.forEach(s => {
    const cat = CATEGORY_MAP.get(s.category) || { label: 'spot' };
    const label = cat.label.toUpperCase();
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push(s);
  });

  grouped.forEach((groupSpots, catTitle) => {
    textSummary += `[ ${catTitle} ]\n`;
    groupSpots.forEach(s => {
      textSummary += `• ${s.name}`;
      if (s.neighborhood) textSummary += ` — ${s.neighborhood}`;
      textSummary += `\n`;
      if (s.notes) textSummary += `  Notes: ${s.notes}\n`;
      if (s.hours) textSummary += `  Hours: ${s.hours}\n`;
      textSummary += `  Directions: ${generateSingleNavigationUrl(s.lat, s.lng)}\n\n`;
    });
  });

  if (shareTextPreview) {
    shareTextPreview.value = textSummary.trim();
  }

  if (shareLinkToast) shareLinkToast.style.display = 'none';
  if (shareTextToast) shareTextToast.style.display = 'none';

  openModal(modalShare);
}

function handleAddNewCity() {
  const input = document.getElementById('new-city-input');
  const typeSelect = document.getElementById('new-city-type');
  const newCity = input.value.trim();
  if (!newCity) return;

  const chosenType = typeSelect ? typeSelect.value : 'auto';
  if (chosenType && chosenType !== 'auto') {
    saveDestinationType(newCity, chosenType);
  }

  if (!cities.some(c => c.toLowerCase() === newCity.toLowerCase())) {
    cities.push(newCity);
    cities.sort((a, b) => a.localeCompare(b));
    saveStoredCities(cities);
    upsertRemoteCity(newCity);
    renderCityDropdowns();
    renderCityManagerList();
    input.value = '';
    // Automatically switch to the newly created destination
    setActiveCity(newCity);
    closeModal(modalCities);
  } else {
    setActiveCity(newCity);
    closeModal(modalCities);
  }
}

/**
 * Modal Open / Close Helpers
 */
function openModal(modalEl) {
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
}

// Kickoff
window.addEventListener('DOMContentLoaded', init);


})();
