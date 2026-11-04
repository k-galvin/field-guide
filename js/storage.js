// Storage management for Flâneur Field Guide

const STORAGE_KEY = 'flaneur_spots_v1';
const CITIES_KEY = 'flaneur_cities_v1';

export const DEFAULT_CITIES = ['Tokyo', 'Paris', 'Los Angeles', 'Copenhagen', 'New York'];

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
    id: 'food_wine',
    label: 'dining & wine',
    code: '03',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"></path><path d="M12 15v7"></path><path d="M12 15a5 5 0 0 0 5-5V3H7v7a5 5 0 0 0 5 5z"></path></svg>'
  },
  {
    id: 'shops_retail',
    label: 'shops & boutiques',
    code: '04',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>'
  },
  {
    id: 'museums_art',
    label: 'museums & galleries',
    code: '05',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="22" x2="22" y2="22"></line><line x1="4" y1="9" x2="4" y2="20"></line><line x1="9" y1="9" x2="9" y2="20"></line><line x1="15" y1="9" x2="15" y2="20"></line><line x1="20" y1="9" x2="20" y2="20"></line><polygon points="12 2 2 7 22 7"></polygon></svg>'
  },
  {
    id: 'concerts_music',
    label: 'concerts & music',
    code: '06',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
  },
  {
    id: 'ceramics_craft',
    label: 'ceramics & craft',
    code: '07',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"></path><path d="M9 3v2c0 1-2 2-3 4-1.5 3-1 6 1 8 1.5 1.5 2 2.5 2 4h6c0-1.5.5-2.5 2-4 2-2 2.5-5 1-8-1-2-3-3-3-4V3"></path><line x1="7" y1="21" x2="17" y2="21"></line></svg>'
  },
  {
    id: 'books_cinema',
    label: 'cinema & books',
    code: '08',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
  },
  {
    id: 'parks_nature',
    label: 'parks & gardens',
    code: '09',
    color: '#0047ab',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>'
  },
  {
    id: 'surf_movement',
    label: 'surf & movement',
    code: '10',
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

export function getStoredCities() {
  try {
    const raw = localStorage.getItem(CITIES_KEY);
    if (!raw) return DEFAULT_CITIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CITIES;
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
    return Array.isArray(parsed) ? parsed : null;
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
  a.download = `flaneur-fieldguide-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
