// Supabase Real-time Sync Client for Flâneur Field Guide

const SUPABASE_URL = 'https://oaqzbymmhusbhvscfcrp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Y8hY9if-e5PdwcmCKALzsQ_bzUpYVHp';

let supabaseClient = null;

export function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false }
      });
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
    }
  }
  return supabaseClient;
}

/**
 * Fetch all spots from remote Supabase table
 */
export async function fetchRemoteSpots() {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from('spots').select('*');
      if (error) throw error;
      return (data || []).map(mapRowToSpot);
    } catch (e) {
      console.warn('Supabase JS fetch failed, falling back to REST:', e);
    }
  }

  // REST fallback
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/spots?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return (data || []).map(mapRowToSpot);
  } catch (err) {
    console.warn('Remote fetch failed:', err);
    return null;
  }
}

/**
 * Upsert a spot to remote Supabase table
 */
export async function upsertRemoteSpot(spot) {
  const row = mapSpotToRow(spot);
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('spots').upsert(row);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsert failed, trying REST:', e);
    }
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/spots`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });
    return res.ok;
  } catch (e) {
    console.warn('Remote upsert failed:', e);
    return false;
  }
}

/**
 * Delete a spot from remote Supabase table
 */
export async function deleteRemoteSpot(id) {
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('spots').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase delete failed, trying REST:', e);
    }
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/spots?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    return res.ok;
  } catch (e) {
    console.warn('Remote delete failed:', e);
    return false;
  }
}

/**
 * Seed initial spots if remote table is empty
 */
export async function seedRemoteSpotsIfEmpty(localSpots) {
  try {
    const existing = await fetchRemoteSpots();
    if (existing && existing.length === 0 && localSpots && localSpots.length > 0) {
      console.log('Seeding Supabase spots table with initial curated spots...');
      const rows = localSpots.map(mapSpotToRow);
      const sb = getSupabase();
      if (sb) {
        await sb.from('spots').upsert(rows);
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/spots`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(rows)
        });
      }
      return true;
    }
  } catch (e) {
    console.warn('Failed to seed Supabase table:', e);
  }
  return false;
}

/**
 * Subscribe to realtime changes from other devices (laptop <-> phone)
 */
export function subscribeToRemoteChanges(callback) {
  const sb = getSupabase();
  if (!sb || !sb.channel) return null;

  try {
    const channel = sb.channel('public:spots')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'spots' }, (payload) => {
        if (callback) callback(payload);
      })
      .subscribe();
    return channel;
  } catch (e) {
    console.warn('Realtime subscription failed:', e);
    return null;
  }
}

/**
 * Push an array of spots to remote Supabase table (batch upsert)
 */
export async function pushSpotsToRemote(spotsArray) {
  if (!spotsArray || spotsArray.length === 0) return true;
  const rows = spotsArray.map(mapSpotToRow);

  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('spots').upsert(rows);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase JS batch upsert failed, trying REST:', e);
    }
  }

  // REST fallback
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/spots`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(rows)
    });
    return res.ok;
  } catch (err) {
    console.error('REST batch upsert failed:', err);
    return false;
  }
}

function mapSpotToRow(spot) {
  const lat = typeof spot.lat === 'number' ? spot.lat : parseFloat(spot.lat);
  const lng = typeof spot.lng === 'number' ? spot.lng : parseFloat(spot.lng);
  return {
    id: String(spot.id || ('spot-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7))),
    name: spot.name || 'Untitled Spot',
    city: spot.city || 'Tokyo',
    neighborhood: spot.neighborhood || null,
    category: spot.category || 'other',
    status: spot.status || 'wishlist',
    favorite: !!spot.favorite,
    lat: isNaN(lat) ? 0 : lat,
    lng: isNaN(lng) ? 0 : lng,
    hours: spot.hours || null,
    notes: spot.notes || null,
    visit_date: spot.visitDate || null,
    photo_url: spot.photoUrl || null,
    updated_at: new Date().toISOString()
  };
}

export function mapRowToSpot(row) {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    neighborhood: row.neighborhood || '',
    category: row.category,
    status: row.status || 'wishlist',
    favorite: !!row.favorite,
    lat: row.lat,
    lng: row.lng,
    hours: row.hours || '',
    notes: row.notes || '',
    visitDate: row.visit_date || '',
    photoUrl: row.photo_url || ''
  };
}
