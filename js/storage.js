// Storage management for Archival Field Guide

const STORAGE_KEY = 'flaneur_spots_v2';
const CITIES_KEY = 'flaneur_cities_v1';

export const DEFAULT_CITIES = [
  'Amsterdam', 'Budapest', 'Copenhagen', 'Costa Mesa', 'Edinburgh',
  'Encinitas', 'Helsinki', 'Huntington Beach', 'Joshua Tree', 'Kyoto',
  'Laguna Beach', 'Lisbon', 'London', 'Los Angeles', 'Melbourne',
  'Mexico City', 'Montreal', 'Newport Beach', 'New York', 'Orange',
  'Oslo', 'Paris', 'Prague', 'San Diego', 'San Francisco',
  'Santa Ana', 'Stockholm', 'Sydney', 'Tokyo', 'Vienna'
];

export const KNOWN_CITY_META = {
  'costa mesa': { code: 'SNA', country: 'California, USA', region: 'americas' },
  'newport beach': { code: 'NPB', country: 'California, USA', region: 'americas' },
  'laguna beach': { code: 'LGB', country: 'California, USA', region: 'americas' },
  'san diego': { code: 'SAN', country: 'California, USA', region: 'americas' },
  'joshua tree': { code: 'JTR', country: 'California, USA', region: 'americas' },
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

export function getCityMeta(cityName) {
  if (!cityName) return { code: '---', country: 'Destination', region: 'other' };
  const lower = cityName.toLowerCase().trim();
  if (KNOWN_CITY_META[lower]) {
    return KNOWN_CITY_META[lower];
  }
  const code = cityName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'DST';
  return { code, country: 'Destination', region: 'other' };
}

export function getCityRegion(cityName) {
  const meta = getCityMeta(cityName);
  return meta.region || 'other';
}

export const CATEGORIES = [
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

export const CATEGORY_MAP = new Map(CATEGORIES.map(c => [c.id, c]));
// Alias books_cinema for seamless backwards compatibility
CATEGORY_MAP.set('books_cinema', CATEGORY_MAP.get('books'));

export function normalizeSpotCategory(spot) {
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

export function getStoredCities() {
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

export function saveStoredCities(cities) {
  try {
    localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
  } catch (e) {
    console.error('Failed to save cities', e);
  }
}

export function getStoredSpots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeSpotCategory) : null;
  } catch (e) {
    console.error('Failed to parse stored spots', e);
    return null;
  }
}

export function saveStoredSpots(spots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
  } catch (e) {
    console.error('Failed to save spots to localStorage', e);
  }
}

export function exportBackupJSON(spots, cities) {
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
