// Day Loop & Walking Distance Utilities (Pure client-side math, zero APIs)

// Earth's radius in kilometers
const R = 6371;

/**
 * Calculates Haversine distance between two [lat, lng] points in kilometers
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimates walking time in minutes based on average 4.8 km/h (12.5 min per km)
 */
export function estimateWalkMinutes(distanceKm) {
  return Math.round(distanceKm * 12.5);
}

/**
 * Formats distance in readable string (e.g., "450 m · 6 min walk" or "2.3 km · 28 min walk")
 */
export function formatDistanceAndWalk(distanceKm) {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    const mins = Math.max(1, estimateWalkMinutes(distanceKm));
    return `${meters} m · ${mins} min walk`;
  } else {
    const km = distanceKm.toFixed(1);
    const mins = estimateWalkMinutes(distanceKm);
    return `${km} km · ${mins} min walk`;
  }
}

/**
 * Generates an optimized sequence of spots (Nearest Neighbor TSP heuristic)
 */
export function sequenceDayLoop(spots, startSpotId = null) {
  if (!spots || spots.length <= 1) return spots || [];

  const unvisited = [...spots];
  const ordered = [];

  // Determine starting spot
  let currentIndex = 0;
  if (startSpotId) {
    const foundIdx = unvisited.findIndex(s => s.id === startSpotId);
    if (foundIdx !== -1) currentIndex = foundIdx;
  }

  let current = unvisited.splice(currentIndex, 1)[0];
  ordered.push(current);

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistanceKm(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
      if (dist < shortestDist) {
        shortestDist = dist;
        nearestIdx = i;
      }
    }

    current = unvisited.splice(nearestIdx, 1)[0];
    ordered.push(current);
  }

  return ordered;
}

/**
 * Calculates total loop walk distance and time
 */
export function calculateLoopStats(orderedSpots) {
  if (!orderedSpots || orderedSpots.length < 2) {
    return { totalDistanceKm: 0, totalMinutes: 0, legs: [] };
  }

  let totalDist = 0;
  const legs = [];

  for (let i = 0; i < orderedSpots.length - 1; i++) {
    const from = orderedSpots[i];
    const to = orderedSpots[i + 1];
    const legDist = calculateDistanceKm(from.lat, from.lng, to.lat, to.lng);
    totalDist += legDist;
    legs.push({
      fromName: from.name,
      toName: to.name,
      distanceKm: legDist,
      minutes: Math.max(1, estimateWalkMinutes(legDist))
    });
  }

  return {
    totalDistanceKm: totalDist,
    totalMinutes: estimateWalkMinutes(totalDist),
    legs
  };
}

/**
 * Generates universal multi-waypoint walking route link for phone navigation
 */
export function generateMultiWaypointUrl(orderedSpots, preferApple = false) {
  if (!orderedSpots || orderedSpots.length === 0) return '#';

  if (orderedSpots.length === 1) {
    return generateSingleNavigationUrl(orderedSpots[0].lat, orderedSpots[0].lng, preferApple);
  }

  const start = orderedSpots[0];
  const end = orderedSpots[orderedSpots.length - 1];
  const waypoints = orderedSpots.slice(1, orderedSpots.length - 1);

  if (preferApple) {
    // Apple Maps route (start to end)
    return `https://maps.apple.com/?saddr=${start.lat},${start.lng}&daddr=${end.lat},${end.lng}&dirflg=w`;
  } else {
    // Google Maps multi-waypoint walking directions URL
    let url = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=walking`;
    if (waypoints.length > 0) {
      const waypointsParam = waypoints.map(w => `${w.lat},${w.lng}`).join('|');
      url += `&waypoints=${encodeURIComponent(waypointsParam)}`;
    }
    return url;
  }
}

/**
 * Generates single-spot navigation link
 */
export function generateSingleNavigationUrl(lat, lng, preferApple = false) {
  if (preferApple) {
    return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=w`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}
