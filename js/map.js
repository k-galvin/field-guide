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

/**
 * Initializes Leaflet map with CartoDB Positron tiles
 */
export function initMap(elementId, initialCenter = [35.6811, 139.8078], initialZoom = 13) {
  if (mapInstance) {
    mapInstance.remove();
  }

  // Base map container
  mapInstance = L.map(elementId, {
    zoomControl: false,
    attributionControl: false
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
      mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
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

export function invalidateMapSize() {
  if (mapInstance) {
    mapInstance.invalidateSize();
  }
}
