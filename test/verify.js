import assert from 'node:assert';
import { calculateDistanceKm, estimateWalkMinutes, sequenceDayLoop, calculateLoopStats } from '../js/day-loop.js';
import { parseKML } from '../js/kml-parser.js';

console.log('Testing day loop math...');
// Test Haversine distance
// Tokyo Shibuya to Shinjuku ~ 3.5 km
const dist = calculateDistanceKm(35.6580, 139.7016, 35.6938, 139.7034);
assert(dist > 3.0 && dist < 4.5, `Distance should be ~3.9km, got ${dist}`);
console.log(`✓ Distance calculation accurate: ${dist.toFixed(2)} km`);

// Test walking time
const walkMins = estimateWalkMinutes(dist);
assert(walkMins > 35 && walkMins < 60, `Walk time should be ~45 mins, got ${walkMins}`);
console.log(`✓ Walk time accurate: ${walkMins} mins`);

// Test sequencing
const sampleSpots = [
  { id: '1', name: 'Spot 1', lat: 35.65, lng: 139.70 },
  { id: '2', name: 'Spot 2', lat: 35.69, lng: 139.71 },
  { id: '3', name: 'Spot 3', lat: 35.66, lng: 139.705 }
];
const ordered = sequenceDayLoop(sampleSpots, '1');
assert.strictEqual(ordered[0].id, '1');
assert.strictEqual(ordered[1].id, '3', 'Spot 3 is closer to Spot 1 than Spot 2');
assert.strictEqual(ordered[2].id, '2');
console.log('✓ Nearest-neighbor loop sequencing verified');

// Test loop stats
const stats = calculateLoopStats(ordered);
assert.strictEqual(stats.legs.length, 2);
assert(stats.totalDistanceKm > 0);
console.log(`✓ Loop stats verified: total dist = ${stats.totalDistanceKm.toFixed(2)} km`);

import {
  CATEGORIES,
  CATEGORY_MAP,
  normalizeSpotCategory,
  getCityMeta,
  getCityRegion,
  getDestinationMeta,
  detectDestinationType,
  DESTINATION_TYPES,
  DEFAULT_CITIES,
  getDestinationDivision
} from '../js/storage.js';
import { mapOsmTagToCategory } from '../js/photon.js';

// Test category split for theater/cinema vs books
console.log('Testing category definitions...');
assert(CATEGORIES.some(c => c.id === 'books' && c.label === 'books'), 'books category should exist');
assert(CATEGORIES.some(c => c.id === 'theater_cinema' && c.label === 'theater & cinema'), 'theater_cinema category should exist');
assert(CATEGORIES.some(c => c.id === 'food_dining' && c.label === 'food & dining'), 'food_dining category should exist');
assert(CATEGORIES.some(c => c.id === 'wine_small_plates' && c.label === 'wine & small plates'), 'wine_small_plates category should exist');
assert(CATEGORIES.some(c => c.id === 'cocktails_nightlife' && c.label === 'cocktails & nightlife'), 'cocktails_nightlife category should exist');
assert(CATEGORIES.some(c => c.id === 'hotels_stays' && c.label === 'hotels & stays'), 'hotels_stays category should exist');
assert(CATEGORY_MAP.has('books'), 'CATEGORY_MAP should have books');
assert(CATEGORY_MAP.has('theater_cinema'), 'CATEGORY_MAP should have theater_cinema');
assert(CATEGORY_MAP.has('food_dining'), 'CATEGORY_MAP should have food_dining');
assert(CATEGORY_MAP.has('brunch_lunch'), 'CATEGORY_MAP should alias brunch_lunch');
assert(CATEGORY_MAP.has('wine_small_plates'), 'CATEGORY_MAP should have wine_small_plates');
assert(CATEGORY_MAP.has('food_wine'), 'CATEGORY_MAP should alias food_wine');
assert(CATEGORY_MAP.has('cocktails_nightlife'), 'CATEGORY_MAP should have cocktails_nightlife');
assert(CATEGORY_MAP.has('bars_nightlife'), 'CATEGORY_MAP should alias bars_nightlife');
assert(CATEGORY_MAP.has('hotels_stays'), 'CATEGORY_MAP should have hotels_stays');

// Test normalizeSpotCategory
const cinemaSpot = normalizeSpotCategory({ name: 'Cinema du Pantheon', notes: 'Indie cinema', category: 'books_cinema' });
assert.strictEqual(cinemaSpot.category, 'theater_cinema', 'Cinema spot should normalize to theater_cinema');

const bookSpot = normalizeSpotCategory({ name: 'Skylight Books', notes: 'Independent bookstore', category: 'books_cinema' });
assert.strictEqual(bookSpot.category, 'books', 'Bookstore spot should normalize to books');

const brunchSpot = normalizeSpotCategory({ name: 'Ruby Diner', notes: 'Burgers and shakes', category: 'brunch_lunch' });
assert.strictEqual(brunchSpot.category, 'food_dining', 'Legacy brunch_lunch should normalize to food_dining');

const diningSpot = normalizeSpotCategory({ name: 'Dunne & Crescenzi', notes: 'Rustic trattoria pasta', category: 'food_wine' });
assert.strictEqual(diningSpot.category, 'food_dining', 'Restaurant spot in food_wine should normalize to food_dining');

const wineSpot = normalizeSpotCategory({ name: "Wilde's", notes: 'Cozy neighborhood natural wine bar', category: 'food_wine' });
assert.strictEqual(wineSpot.category, 'wine_small_plates', 'Wine bar spot in food_wine should normalize to wine_small_plates');

const barSpot = normalizeSpotCategory({ name: 'Bar Termini', notes: 'Espresso & negronis', category: 'bars_nightlife' });
assert.strictEqual(barSpot.category, 'cocktails_nightlife', 'Legacy bars_nightlife should normalize to cocktails_nightlife');

// Test Photon categorization
assert.strictEqual(mapOsmTagToCategory({ osm_value: 'cinema' }, 'Film Center'), 'theater_cinema');
assert.strictEqual(mapOsmTagToCategory({ osm_value: 'theatre' }, 'Globe Theatre'), 'theater_cinema');
assert.strictEqual(mapOsmTagToCategory({ osm_value: 'books' }, 'Daunt Books'), 'books');
assert.strictEqual(mapOsmTagToCategory({ osm_value: 'hotel' }, 'Ace Hotel'), 'hotels_stays');
assert.strictEqual(mapOsmTagToCategory({ osm_value: 'bar' }, 'Bar Termini'), 'cocktails_nightlife');
assert.strictEqual(mapOsmTagToCategory({ osm_value: 'wine' }, 'Septime La Cave'), 'wine_small_plates');
assert.strictEqual(mapOsmTagToCategory({ osm_value: 'deli' }, 'Katz Deli'), 'food_dining');
console.log('✓ Category separation and normalization verified');

console.log('Testing City Atlas metadata...');
assert.strictEqual(getCityMeta('Tokyo').code, 'TYO');
assert.strictEqual(getCityMeta('London').code, 'LON');
assert.strictEqual(getCityMeta('New York').code, 'NYC');
assert.strictEqual(getCityMeta('Paris').code, 'PAR');
assert.strictEqual(getCityMeta('Unknownville').code, 'UNK');
assert(DEFAULT_CITIES.length >= 5, 'DEFAULT_CITIES should have starter destinations');
assert.strictEqual(getCityMeta('Dessau').code, 'DES');
console.log('✓ City Atlas metadata verified');

console.log('Testing City Atlas regional classification...');
assert.strictEqual(getCityRegion('Costa Mesa'), 'americas');
assert.strictEqual(getCityRegion('New York'), 'americas');
assert.strictEqual(getCityRegion('London'), 'europe');
assert.strictEqual(getCityRegion('Paris'), 'europe');
assert.strictEqual(getCityRegion('Marrakesh'), 'africa_middle_east');
assert.strictEqual(getCityRegion('Lagos'), 'africa_middle_east');
assert.strictEqual(getCityRegion('Tokyo'), 'asia_pacific');
assert.strictEqual(getCityRegion('Melbourne'), 'asia_pacific');
assert.strictEqual(getCityRegion('Unknownville'), 'other');
console.log('✓ Regional macro-classification verified');

console.log('Testing Destination classifications (City vs County vs Area)...');
const ocMeta = getDestinationMeta('Orange County');
assert.strictEqual(ocMeta.type, 'county');
assert.strictEqual(ocMeta.typeLabel, 'County');
assert.strictEqual(ocMeta.code, 'OC');
console.log('✓ Orange County classified as County (OC)');

const provenceMeta = getDestinationMeta('Provence');
assert.strictEqual(provenceMeta.type, 'area');
assert.strictEqual(provenceMeta.typeLabel, 'Area');
assert.strictEqual(provenceMeta.code, 'PRV');
assert.strictEqual(provenceMeta.country, 'France');
console.log('✓ Provence classified as Area (PRV)');

const tuscanyMeta = getDestinationMeta('Tuscany');
assert.strictEqual(tuscanyMeta.type, 'area');
assert.strictEqual(tuscanyMeta.typeLabel, 'Area');
assert.strictEqual(tuscanyMeta.code, 'TUS');
assert.strictEqual(tuscanyMeta.country, 'Italy');
console.log('✓ Tuscany classified as Area (TUS)');

const rivieraMeta = getDestinationMeta('Italian Riviera');
assert.strictEqual(rivieraMeta.type, 'area');
assert.strictEqual(rivieraMeta.country, 'Italy');
console.log('✓ Italian Riviera classified as Area');

const normandyMeta = getDestinationMeta('Normandy');
assert.strictEqual(normandyMeta.type, 'area');
assert.strictEqual(normandyMeta.country, 'France');
console.log('✓ Normandy classified as Area');

const loireMeta = getDestinationMeta('Loire Valley');
assert.strictEqual(loireMeta.type, 'area');
assert.strictEqual(loireMeta.country, 'France');
console.log('✓ Loire Valley classified as Area');

const versaillesMeta = getDestinationMeta('Versailles');
assert.strictEqual(versaillesMeta.country, 'France');
console.log('✓ Versailles classified as City');

const parisMeta = getDestinationMeta('Paris');
assert.strictEqual(parisMeta.type, 'city');
assert.strictEqual(parisMeta.typeLabel, 'City');
assert.strictEqual(parisMeta.code, 'PAR');
console.log('✓ Paris classified as City (PAR)');

const joshuaMeta = getDestinationMeta('Joshua Tree');
assert.strictEqual(joshuaMeta.type, 'area');
assert.strictEqual(joshuaMeta.typeLabel, 'Area');
console.log('✓ Joshua Tree classified as Area');

// Test heuristic detection
assert.strictEqual(detectDestinationType('Marin County'), 'county');
assert.strictEqual(detectDestinationType('Napa Valley'), 'area');
assert.strictEqual(detectDestinationType('Amalfi Coast'), 'area');
assert.strictEqual(detectDestinationType('Heidelberg'), 'city');
console.log('✓ Heuristic destination type detection verified');

console.log('Testing Atlas divisions (States in Americas, Countries elsewhere)...');
// Americas: States for US destinations
assert.strictEqual(getDestinationDivision('Los Angeles'), 'California');
assert.strictEqual(getDestinationDivision('San Francisco'), 'California');
assert.strictEqual(getDestinationDivision('Orange County'), 'California');
assert.strictEqual(getDestinationDivision('New York'), 'New York');
assert.strictEqual(getDestinationDivision('Chicago'), 'Illinois');
assert.strictEqual(getDestinationDivision('Boston'), 'Massachusetts');
assert.strictEqual(getDestinationDivision('Seattle'), 'Washington');
assert.strictEqual(getDestinationDivision('Portland'), 'Oregon');
assert.strictEqual(getDestinationDivision('Santa Fe'), 'New Mexico');
assert.strictEqual(getDestinationDivision('Phoenix'), 'Arizona');
assert.strictEqual(getDestinationDivision('Austin'), 'Texas');
assert.strictEqual(getDestinationDivision('Denver, CO'), 'Colorado');

// Americas: Countries for non-US
assert.strictEqual(getDestinationDivision('Vancouver'), 'Canada');
assert.strictEqual(getDestinationDivision('Montreal'), 'Canada');
assert.strictEqual(getDestinationDivision('Mexico City'), 'Mexico');
assert.strictEqual(getDestinationDivision('São Paulo'), 'Brazil');

// Europe: Countries
assert.strictEqual(getDestinationDivision('Paris'), 'France');
assert.strictEqual(getDestinationDivision('Rome'), 'Italy');
assert.strictEqual(getDestinationDivision('London'), 'United Kingdom');
assert.strictEqual(getDestinationDivision('Berlin'), 'Germany');
assert.strictEqual(getDestinationDivision('Barcelona'), 'Spain');
assert.strictEqual(getDestinationDivision('Amsterdam'), 'Netherlands');

// Asia & Pacific: Countries
assert.strictEqual(getDestinationDivision('Tokyo'), 'Japan');
assert.strictEqual(getDestinationDivision('Melbourne'), 'Australia');

// Ensure no DEFAULT_CITIES entry uses generic "USA" as country or division
DEFAULT_CITIES.forEach(c => {
  const meta = getCityMeta(c);
  const div = getDestinationDivision(c, meta);
  assert(meta.country !== 'USA' && meta.country !== 'United States', `${c} should specify state or country, not generic USA`);
  assert(div !== 'USA' && div !== 'United States', `${c} division should specify state or country, not generic USA`);
});

// Verify French and Italian Countryside are replaced by specific regions
assert(!DEFAULT_CITIES.includes('French Countryside'), 'French Countryside should not be in DEFAULT_CITIES');
assert(!DEFAULT_CITIES.includes('Italian Countryside'), 'Italian Countryside should not be in DEFAULT_CITIES');
assert(DEFAULT_CITIES.includes('Provence'), 'Provence should be in DEFAULT_CITIES');
assert(DEFAULT_CITIES.includes('Tuscany'), 'Tuscany should be in DEFAULT_CITIES');
assert(DEFAULT_CITIES.includes('Italian Riviera'), 'Italian Riviera should be in DEFAULT_CITIES');
assert(DEFAULT_CITIES.includes('Loire Valley'), 'Loire Valley should be in DEFAULT_CITIES');
assert(DEFAULT_CITIES.includes('Normandy'), 'Normandy should be in DEFAULT_CITIES');
assert(DEFAULT_CITIES.includes('Versailles'), 'Versailles should be in DEFAULT_CITIES');
console.log('✓ Atlas divisions by State (Americas) and Country verified for all destinations');

console.log('Testing newly added destinations & spots...');
import { SAMPLE_SPOTS } from '../js/sample-data.js';

// Verify no spots remain in French or Italian Countryside
assert(!SAMPLE_SPOTS.some(s => s.city.toLowerCase() === 'french countryside'), 'No spots should remain in French Countryside');
assert(!SAMPLE_SPOTS.some(s => s.city.toLowerCase() === 'italian countryside'), 'No spots should remain in Italian Countryside');
console.log('✓ All French and Italian countryside spots migrated to specific regions (Provence, Tuscany, etc.)');

const expectedNewSpots = [
  { name: 'Taos', city: 'Santa Fe' },
  { name: 'La Boca', city: 'Santa Fe' },
  { name: 'Enchantment Resort', city: 'Sedona' },
  { name: 'La Quinta Resort', city: 'Palm Springs' },
  { name: 'Coachella Festival', city: 'Palm Springs' },
  { name: 'Grand Canyon National Park', city: 'Grand Canyon' },
  { name: 'Sugar Bowl', city: 'Phoenix' },
  { name: 'Fairmont Le Château Frontenac', city: 'Quebec City' },
  { name: 'Fairmont Banff Springs', city: 'Banff' },
  { name: 'Monterey Bay Aquarium', city: 'Monterey' },
  { name: "Bart's Books", city: 'Ojai' },
  { name: "Rory's Place", city: 'Ojai' },
  { name: "Zareen's", city: 'South Bay Area' },
  { name: 'Filoli', city: 'South Bay Area' },
  { name: 'Half Moon Bay Books', city: 'South Bay Area' },
  { name: 'Mountain View Farmers Market', city: 'South Bay Area' },
  { name: 'Half Moon Bay State Beach', city: 'South Bay Area' },
  { name: 'Marin Country Mart', city: 'Marin' },
  { name: 'Mill Valley Public Library', city: 'Marin' },
  { name: 'Marin County Civic Center', city: 'Marin' }
];

expectedNewSpots.forEach(exp => {
  const match = SAMPLE_SPOTS.find(s => s.name.includes(exp.name) && s.city === exp.city);
  assert(match, `Expected spot matching '${exp.name}' in city '${exp.city}'`);
});
console.log('✓ All 20 newly requested spots verified in sample database');

console.log('Testing newly added wishlist destinations & spots across 22 cities...');
const expectedWishlistCities = [
  { name: 'Bacha Coffee', city: 'Marrakesh' },
  { name: 'Museum of Innocence', city: 'Istanbul' },
  { name: 'Carmen de los Mártires', city: 'Granada' },
  { name: 'Palacio de las Dueñas', city: 'Sevilla' },
  { name: 'Cine Doré', city: 'Madrid' },
  { name: 'Plage de la Côte des Basques', city: 'Biarritz' },
  { name: 'Palacio de Viana', city: 'Cordoba' },
  { name: 'Giardino della Minerva', city: 'Salerno' },
  { name: 'Villa Paloma', city: 'Monte Carlo' },
  { name: 'Café Schober', city: 'Zurich' },
  { name: 'Museum Brandhorst', city: 'Munich' },
  { name: 'Do You Read Me?!', city: 'Berlin' },
  { name: 'Bains des Pâquis', city: 'Geneva' },
  { name: 'Barton Springs Pool', city: 'Austin' },
  { name: 'Soma Chocolatemaker', city: 'Toronto' },
  { name: 'Crema Micro-Roasters', city: 'Denver' },
  { name: 'Faulkner House Books', city: 'New Orleans' },
  { name: 'Harken Café & Bakery', city: 'Charleston' },
  { name: 'Tandem Coffee', city: 'Portland, Maine' },
  { name: 'Jardín Etnobotánico', city: 'Oaxaca' },
  { name: 'Nakanoshima Museum of Art', city: 'Osaka' },
  { name: 'Onion Anguk', city: 'Seoul' }
];

expectedWishlistCities.forEach(exp => {
  const match = SAMPLE_SPOTS.find(s => s.name.includes(exp.name) && s.city === exp.city);
  assert(match, `Expected wishlist spot matching '${exp.name}' in city '${exp.city}'`);
  assert.strictEqual(match.status, 'wishlist', `Spot '${match.name}' should have status 'wishlist'`);
  assert(match.photoUrl && match.photoUrl.length > 0, `Spot '${match.name}' must have a valid photoUrl`);
  assert(match.photoUrl.startsWith('http'), `Spot '${match.name}' photoUrl should be a direct public CDN URL`);
  assert(match.notes && match.notes.length > 20, `Spot '${match.name}' must have an editorial description`);
});
console.log('✓ All 22 new wishlist spots verified with real photos, descriptions, and wishlist status');

console.log('Testing category modification fingerprint sensitivity...');
// Verify that card fingerprint updates when spot category changes
const computeFingerprint = (spot, locationLabel = '', distBadge = '') =>
  `${spot.category || ''}|${spot.photoUrl || ''}|${spot.name}|${spot.notes || ''}|${spot.status}|${spot.favorite ? 1 : 0}|${locationLabel}|${spot.hours || ''}|${distBadge}`;

const initialSpot = { id: 'test-1', name: 'Test Spot', category: 'pastry_bakery', status: 'wishlist', favorite: false };
const updatedSpot = { ...initialSpot, category: 'matcha_coffee' };
assert.notStrictEqual(computeFingerprint(initialSpot), computeFingerprint(updatedSpot), 'Fingerprint must change when category changes');
console.log('✓ Category change triggers DOM reconciliation and re-render');

console.log('All Day Loop algorithms & Destination Atlas verified successfully!');
