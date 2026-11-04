// Parser for Google MyMaps KML files

export function parseKML(kmlText, targetCity = '') {
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
