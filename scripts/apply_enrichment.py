import time
import os
import sys

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import enrich_helper as h
from data_sf_mx_japan import DATA_SF_MX_JAPAN
from data_london import DATA_LONDON
from data_la import DATA_LA

combined = {}
combined.update(DATA_SF_MX_JAPAN)
combined.update(DATA_LONDON)
combined.update(DATA_LA)

# Build case-insensitive lookup
lookup = {k.lower(): (k, v) for k, v in combined.items()}

def main():
    spots = h.get_spots()
    print(f"Total spots fetched from Supabase: {len(spots)}")

    updated_count = 0
    skipped_count = 0
    error_count = 0

    for idx, spot in enumerate(spots, 1):
        name = spot.get('name', '').strip()
        name_lower = name.lower()

        meta = None
        if name in combined:
            meta = combined[name]
        elif name_lower in lookup:
            meta = lookup[name_lower][1]

        if not meta:
            skipped_count += 1
            continue

        # Check if update is needed
        needs_update = False
        patch_data = {}

        if spot.get('category') != meta['category']:
            patch_data['category'] = meta['category']
            needs_update = True

        if not spot.get('neighborhood') or spot.get('neighborhood') != meta['neighborhood']:
            patch_data['neighborhood'] = meta['neighborhood']
            needs_update = True

        if not spot.get('hours') or spot.get('hours') != meta['hours']:
            patch_data['hours'] = meta['hours']
            needs_update = True

        if not spot.get('notes') or spot.get('notes') != meta['notes']:
            patch_data['notes'] = meta['notes']
            needs_update = True

        if needs_update:
            patch_data['updated_at'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            success = h.update_spot(spot['id'], patch_data)
            if success:
                updated_count += 1
                if updated_count % 25 == 0 or updated_count == 1:
                    print(f"[{idx}/{len(spots)}] Updated '{name}' ({spot.get('city')}) -> {meta['category']}")
            else:
                error_count += 1
                print(f"Failed to update '{name}' [{spot['id']}]")
            # Gentle rate limiting for PostgREST
            time.sleep(0.04)
        else:
            skipped_count += 1

    print("\n=== Enrichment Complete ===")
    print(f"Updated: {updated_count}")
    print(f"Skipped (already up-to-date): {skipped_count}")
    print(f"Errors: {error_count}")

if __name__ == '__main__':
    main()
