// Leaflet Map Controller for Flâneur

import { CATEGORIES, CATEGORY_MAP } from './storage.js';
import { generateSingleNavigationUrl } from './day-loop.js';

let mapInstance = null;
let markersLayer = null;
let userLocationMarker = null;
let loopPolyline = null;
let onMapClickCallback = null;
let onSpotSelectCallback = null;

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

export const KNOWN_CITY_COORDS = {
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
export function centerCityOnMap(cityName, allSpots = []) {
  if (!mapInstance) return;

  if (!cityName || cityName === 'all') {
    const validSpots = (allSpots || []).filter(s => typeof s.lat === 'number' && typeof s.lng === 'number');
    if (validSpots.length > 0) {
      try {
        const bounds = validSpots.map(s => [s.lat, s.lng]);
        mapInstance.fitBounds(bounds, { padding: [48, 48], maxZoom: 12, animate: true });
        return;
      } catch (e) {
        // ignore
      }
    }
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
export function initMap(elementId, initialCenter = [33.6411, -117.9187], initialZoom = 13) {
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

  // Map click for dropping pins
  mapInstance.on('click', (e) => {
    if (onMapClickCallback) {
      onMapClickCallback(e.latlng.lat, e.latlng.lng);
    }
  });

  return mapInstance;
}

export function setOnMapClickListener(cb) {
  onMapClickCallback = cb;
}

export function setOnSpotSelectListener(cb) {
  onSpotSelectCallback = cb;
}

/**
 * Renders spots on the map
 */
export function renderMapSpots(spots, activeSpotId = null) {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();

  if (!spots || spots.length === 0) return;

  const bounds = [];

  spots.forEach(spot => {
    if (typeof spot.lat !== 'number' || typeof spot.lng !== 'number') return;

    const marker = L.marker([spot.lat, spot.lng], {
      icon: createMarkerIcon(spot.category, spot.favorite, spot.status === 'visited')
    });

    const cat = CATEGORY_MAP.get(spot.category) || { label: 'Spot', code: '·' };
    const navUrl = generateSingleNavigationUrl(spot.lat, spot.lng);

    const popupContent = document.createElement('div');
    popupContent.className = 'flaneur-popup';
    popupContent.innerHTML = `
      ${spot.photoUrl ? `
        <div class="popup-photo-wrap">
          <img src="${spot.photoUrl}" alt="${spot.name}" class="popup-photo" loading="lazy" onerror="this.parentElement.style.display='none';">
        </div>
      ` : ''}
      <div class="popup-body">
        <div class="popup-header">
          <span class="popup-category">${cat.iconSvg ? `<span class="popup-cat-icon">${cat.iconSvg}</span>` : ''}${cat.label.toLowerCase()}</span>
          <span class="popup-status ${spot.status}">${spot.status === 'visited' ? 'visited' : 'wishlist'}</span>
        </div>
        <h3 class="popup-title">${spot.name.toLowerCase()}</h3>
        ${spot.neighborhood ? `<div class="popup-neighborhood">${spot.neighborhood.toLowerCase()}</div>` : ''}
        ${spot.notes ? `<p class="popup-notes">${spot.notes}</p>` : ''}
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

    popupContent.querySelector('.popup-btn-detail').addEventListener('click', () => {
      if (onSpotSelectCallback) {
        onSpotSelectCallback(spot);
      }
    });

    marker.bindPopup(popupContent, { maxWidth: 280, minWidth: 220 });
    marker.addTo(markersLayer);

    bounds.push([spot.lat, spot.lng]);

    if (activeSpotId && spot.id === activeSpotId) {
      setTimeout(() => marker.openPopup(), 100);
    }
  });

  if (bounds.length > 0 && !activeSpotId) {
    try {
      const lats = bounds.map(b => b[0]);
      const lngs = bounds.map(b => b[1]);
      const latSpan = Math.max(...lats) - Math.min(...lats);
      const lngSpan = Math.max(...lngs) - Math.min(...lngs);

      let targetMaxZoom = 13;
      if (latSpan > 0.35 || lngSpan > 0.35) {
        targetMaxZoom = 11;
      } else if (latSpan > 0.15 || lngSpan > 0.15) {
        targetMaxZoom = 12;
      }

      mapInstance.fitBounds(bounds, { padding: [48, 48], maxZoom: targetMaxZoom });
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Highlights and centers a specific spot on the map
 */
export function focusSpot(spot) {
  if (!mapInstance || !spot) return;
  mapInstance.setView([spot.lat, spot.lng], 16, { animate: true });
}

/**
 * Shows user's live position with a pulsing blue dot
 */
export function setUserLocation(lat, lng) {
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
export function drawLoopPolyline(orderedSpots) {
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

export function clearLoopPolyline() {
  if (mapInstance && loopPolyline) {
    mapInstance.removeLayer(loopPolyline);
    loopPolyline = null;
  }
}

export function invalidateMapSize(delay = 0) {
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
