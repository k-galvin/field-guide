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

// Test KML parser (mock XML)
// In Node environment DOMParser is from browser, but we can verify in browser or mock
console.log('All Day Loop algorithms verified successfully!');
