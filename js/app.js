// Main Application Controller for Archival Field Guide

import {
  getStoredSpots,
  saveStoredSpots,
  getStoredCities,
  saveStoredCities,
  exportBackupJSON,
  CATEGORIES,
  CATEGORY_MAP,
  normalizeSpotCategory
} from './storage.js';
import { SAMPLE_SPOTS } from './sample-data.js';
import {
  initMap,
  renderMapSpots,
  focusSpot,
  setUserLocation,
  drawLoopPolyline,
  clearLoopPolyline,
  setOnMapClickListener,
  setOnSpotSelectListener,
  invalidateMapSize
} from './map.js';
import { parseKML } from './kml-parser.js';
import {
  calculateDistanceKm,
  formatDistanceAndWalk,
  sequenceDayLoop,
  calculateLoopStats,
  generateMultiWaypointUrl,
  generateSingleNavigationUrl
} from './day-loop.js';
import {
  fetchRemoteSpots,
  upsertRemoteSpot,
  deleteRemoteSpot,
  pushSpotsToRemote,
  seedRemoteSpotsIfEmpty,
  subscribeToRemoteChanges,
  mapRowToSpot
} from './supabase.js';
import {
  searchPhotonPlaces,
  parseGoogleMapsUrl,
  mapOsmTagToCategory,
  extractNeighborhood,
  extractCity
} from './photon.js';

// Application State
let spots = [];
let cities = [];
let activeCity = 'Tokyo';
let activeStatus = 'all';
let activeCategory = 'all';
let searchQuery = '';
let userCoords = null; // { lat, lng }
let isNearMeSorted = false;
let pendingKmlSpots = [];
let editingSpotId = null;

// DOM Elements
const citySelect = document.getElementById('city-select');
const searchInput = document.getElementById('search-input');
const statusTabs = document.querySelectorAll('.status-tab');
const spotsListContainer = document.getElementById('spots-list-container');
const spotsCountLabel = document.getElementById('spots-count-label');
const distanceSortIndicator = document.getElementById('distance-sort-indicator');

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
  cities = getStoredCities();
  const storedSpots = getStoredSpots();
  if (storedSpots && storedSpots.length > 0) {
    spots = storedSpots;
  } else {
    spots = [];
  }

  // Populate category chips with SVGs
  renderCategoryChips();

  // Populate category selector in modal
  renderCategoryDropdown();

  // Populate city selectors
  renderCityDropdowns();

  // Find center for initial city
  const citySpots = spots.filter(s => s.city.toLowerCase() === activeCity.toLowerCase());
  const initialCenter = citySpots.length > 0 ? [citySpots[0].lat, citySpots[0].lng] : [35.6811, 139.8078];

  // Initialize Map
  initMap('map', initialCenter, 13);

  // Set Map click handler to easily add spots
  setOnMapClickListener((lat, lng) => {
    openAddSpotModalWithCoords(lat, lng);
  });

  // Set Spot click handler from popup
  setOnSpotSelectListener((spot) => {
    openEditSpotModal(spot);
  });

  // Setup Event Listeners
  setupEventListeners();

  // Initial Render
  applyFiltersAndRender();

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
    spots = remote;
    saveStoredSpots(spots);

    // 4. Auto-discover any imported cities
    const storedCities = getStoredCities();
    const citySet = new Set(storedCities.map(c => c.toLowerCase()));
    let newCityAdded = false;
    spots.forEach(s => {
      if (s.city && !citySet.has(s.city.toLowerCase())) {
        storedCities.push(s.city);
        citySet.add(s.city.toLowerCase());
        newCityAdded = true;
      }
    });
    if (newCityAdded) {
      saveStoredCities(storedCities);
      cities = storedCities;
      renderCityDropdowns();
    }

    applyFiltersAndRender();
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
    activeCity = e.target.value;
    clearLoopPolyline();
    applyFiltersAndRender();
  });

  // Search Input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyFiltersAndRender();
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

  // Manage Cities
  btnManageCities.addEventListener('click', openCityManagerModal);

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
    setTimeout(invalidateMapSize, 150);
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
function applyFiltersAndRender() {
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
      const match = (s.name + ' ' + (s.neighborhood || '') + ' ' + (s.notes || '')).toLowerCase();
      if (!match.includes(searchQuery)) return false;
    }
    return true;
  });

  // Calculate distance if user location known
  if (userCoords) {
    filtered = filtered.map(s => {
      const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, s.lat, s.lng);
      return { ...s, distanceKm: dist };
    });

    if (isNearMeSorted) {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
      distanceSortIndicator.style.display = 'inline';
    } else {
      distanceSortIndicator.style.display = 'none';
    }
  } else {
    distanceSortIndicator.style.display = 'none';
  }

  // Update spot count label
  spotsCountLabel.textContent = `Showing ${filtered.length} of ${countAll} spots`;

  // Render cards
  renderSpotCards(filtered);

  // Render on Map
  renderMapSpots(filtered);
}

/**
 * Render Spot Cards in Feed
 */
function renderSpotCards(spotsToRender) {
  spotsListContainer.innerHTML = '';

  if (spotsToRender.length === 0) {
    spotsListContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--ink-muted);">
        <p style="font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 6px;">No spots found</p>
        <p style="font-size: 0.8rem;">Try clearing your filters or add a new spot using the button above.</p>
      </div>
    `;
    return;
  }

  spotsToRender.forEach(spot => {
    const card = document.createElement('article');
    card.className = 'spot-card';
    card.dataset.id = spot.id;

    const cat = CATEGORY_MAP.get(spot.category) || { label: 'spot', code: '·', iconSvg: '' };
    const navUrl = generateSingleNavigationUrl(spot.lat, spot.lng);
    const distBadge = spot.distanceKm !== undefined
      ? `<span class="badge badge-distance">${formatDistanceAndWalk(spot.distanceKm)}</span>`
      : '';

    const mediaHtml = spot.photoUrl ? `
      <div class="card-media">
        <img src="${escapeHtml(spot.photoUrl)}" alt="${escapeHtml(spot.name)}" class="card-photo" loading="lazy" onerror="this.parentElement.style.display='none';">
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
            <span class="card-neighborhood">${escapeHtml(spot.neighborhood || spot.city)}</span>
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
            <button type="button" class="btn-toggle-status" data-action="toggle-status">
              ${spot.status === 'visited' ? 'to wishlist' : 'mark visited'}
            </button>
            <button type="button" class="btn-toggle-status" data-action="edit">
              edit
            </button>
            <button type="button" class="btn-toggle-status btn-spot-delete" data-action="delete" title="Delete spot">
              delete
            </button>
          </div>
          <a href="${navUrl}" target="_blank" rel="noopener noreferrer" class="card-nav-link">
            directions ↗
          </a>
        </div>
      </div>
    `;

    // Click on card body to focus map
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      document.querySelectorAll('.spot-card').forEach(c => c.classList.remove('active-spot'));
      card.classList.add('active-spot');
      focusSpot(spot);
      renderMapSpots(spotsToRender, spot.id);

      // On mobile screens, automatically switch to map view when a card is selected
      if (window.innerWidth <= 820) {
        mobileToggleMap.click();
      }
    });

    // Toggle favorite
    const favBtn = card.querySelector('.card-fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(spot.id);
    });

    // Toggle Status button
    const toggleStatusBtn = card.querySelector('[data-action="toggle-status"]');
    toggleStatusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSpotStatus(spot.id);
    });

    // Edit button
    const editBtn = card.querySelector('[data-action="edit"]');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditSpotModal(spot);
    });

    // Delete button
    const deleteBtn = card.querySelector('[data-action="delete"]');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSpot(spot.id);
    });

    spotsListContainer.appendChild(card);
  });
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
  applyFiltersAndRender();
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
 * City Management
 */
function renderCityDropdowns() {
  // Main city selector
  citySelect.innerHTML = `
    <option value="all">All Cities</option>
    ${cities.map(c => `<option value="${c}" ${c.toLowerCase() === activeCity.toLowerCase() ? 'selected' : ''}>${c}</option>`).join('')}
  `;

  // Spot modal city select
  spotCitySelect.innerHTML = cities.map(c => `<option value="${c}">${c}</option>`).join('');

  // KML target city select
  kmlTargetCity.innerHTML = cities.map(c => `<option value="${c}">${c}</option>`).join('');
}

function openCityManagerModal() {
  renderCityManagerList();
  openModal(modalCities);
}

function renderCityManagerList() {
  const listEl = document.getElementById('cities-list-manage');
  listEl.innerHTML = cities.map(c => {
    const count = spots.filter(s => s.city.toLowerCase() === c.toLowerCase()).length;
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-subtle); border-radius: 6px;">
        <span style="font-weight: 500;">${c} <span style="font-size: 0.75rem; color: var(--ink-muted);">(${count} spots)</span></span>
        <button type="button" class="btn" data-delete-city="${c}" style="padding: 2px 8px; font-size: 0.7rem; color: #a64b4b;">Remove</button>
      </div>
    `;
  }).join('');

  listEl.querySelectorAll('[data-delete-city]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cityToRemove = btn.getAttribute('data-delete-city');
      if (confirm(`Remove ${cityToRemove} from city list? Spots assigned to it will remain preserved.`)) {
        cities = cities.filter(c => c !== cityToRemove);
        saveStoredCities(cities);
        renderCityDropdowns();
        renderCityManagerList();
      }
    });
  });
}

function handleAddNewCity() {
  const input = document.getElementById('new-city-input');
  const newCity = input.value.trim();
  if (!newCity) return;

  if (!cities.some(c => c.toLowerCase() === newCity.toLowerCase())) {
    cities.push(newCity);
    saveStoredCities(cities);
    renderCityDropdowns();
    renderCityManagerList();
    input.value = '';
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Kickoff
window.addEventListener('DOMContentLoaded', init);
