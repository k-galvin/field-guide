// Leaflet Map Controller for Flâneur

import { CATEGORIES, CATEGORY_MAP, escapeHtml } from './storage.js';
import { generateSingleNavigationUrl } from './day-loop.js';

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

export const KNOWN_CITY_COORDS = {
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
export function centerCityOnMap(cityName, allSpots = []) {
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

export function setOnMapClickListener(cb) {
  onMapClickCallback = cb;
}

export function setOnSpotSelectListener(cb) {
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
export function renderMapSpots(spots, activeSpotId = null, shouldFitBounds = false) {
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
