# Archival Field Guide — Day Loops & Personal City Index

A zero-API, minimalist personal field guide designed to consolidate the travel workflow across:
1. **Google MyMaps** (pre-trip research)
2. **Google Maps Saved Lists** (in-city live proximity)
3. **Step App** (post-trip permanent city guides & archives)

Built with an editorial aesthetic for specialty coffee/matcha, independent ceramics studios, bakeries, literature, cinema, and seaside strolls.

---

## The 3-State Lifecycle

Rather than maintaining three separate apps, every spot transitions seamlessly through one lifecycle:

```
[Wishlist] ──(In City: Near Me)──▶ [Visited] ──(Archived Guide)──▶ [Day Loops]
(Pre-Trip)                          (Post-Trip)                     (Sequenced Strolls)
```

1. **Pre-Trip (Google MyMaps Replacement):**
   - Drag & drop your exported Google MyMaps `.kml` files directly into Field Guide.
   - Automatically extracts coordinates, names, notes, and auto-tags categories (Matcha, Ceramics, Pastry, Cinema, Wine, Surf).
2. **On the Ground (Google Maps Lists Replacement):**
   - Tap **"Near Me"** to trigger native browser geolocation (`navigator.geolocation`).
   - Spots dynamically calculate real-time walking distance and sort nearest-to-farthest without paying for Google Distance Matrix APIs.
   - Tap **"↗ Directions"** on any spot to open it in your native Apple Maps or Google Maps app for free walking directions.
3. **Post-Visit (Step App Replacement):**
   - Tap **"Mark Visited"** to save your personal field notes, favorites star, and visit date.
   - Switch between **Wishlist** and **Visited** tabs to curate your permanent city guides for Tokyo, Paris, Los Angeles, Copenhagen, etc.
4. **Day Loop Walking Sequencer:**
   - Tap **"Day Loop"** and pick a morning starting spot (e.g. your favorite matcha bar).
   - Field Guide runs a client-side Nearest Neighbor algorithm to sequence an optimized 3–5 stop walking arc without zig-zagging.
   - 1-tap **"Open in Maps App"** multi-waypoint walking link.

---

## 100% Free & Zero-API Stack

- **Map Rendering:** Leaflet.js with Carto Positron tiles (warm, editorial, ad-free, open-source).
- **Geocoding:** OpenStreetMap Nominatim (free public endpoint with zero API keys) or direct tap-on-map coordinate dropping.
- **Distance & Routing Math:** Pure client-side Haversine & TSP heuristic in vanilla JavaScript.
- **Navigation:** Native URL schemes (`maps.apple.com` and `google.com/maps/dir`).
- **Data Persistence:** Local browser storage (`localStorage` / `IndexedDB`) with 1-click JSON backup export/import.

---

## Quickstart

Run locally using Python's built-in server:

```bash
# Start local server
npm start
# or: python3 -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run verification tests:
```bash
npm test
```
