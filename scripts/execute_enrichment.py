import json
import time
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import enrich_helper as h
from enrich_127_spots import ENRICHMENTS

def run_enrichment():
    with open("scripts/spots_to_enrich.json") as f:
        spots = json.load(f)

    total = len(spots)
    print(f"Starting update of {total} spots...")

    success_count = 0
    fail_count = 0

    for i, spot in enumerate(spots, 1):
        spot_id = spot["id"]
        spot_name = spot["name"]
        city = spot.get("city", "")

        if spot_id not in ENRICHMENTS:
            print(f"[{i}/{total}] WARNING: No enrichment found for {spot_id} ({spot_name})")
            continue

        updates = {}
        data = ENRICHMENTS[spot_id]
        if "notes" in data and data["notes"]:
            updates["notes"] = data["notes"]
        if "neighborhood" in data and data["neighborhood"]:
            updates["neighborhood"] = data["neighborhood"]

        if not updates:
            print(f"[{i}/{total}] SKIP: No updates for {spot_name}")
            continue

        ok = False
        for attempt in range(3):
            if h.update_spot(spot_id, updates):
                ok = True
                break
            time.sleep(1)

        if ok:
            success_count += 1
            neigh_info = f" (neighborhood -> {updates['neighborhood']})" if "neighborhood" in updates else ""
            print(f"[{i}/{total}] OK: {spot_name} ({city}){neigh_info}")
        else:
            fail_count += 1
            print(f"[{i}/{total}] FAILED: {spot_name} ({spot_id})")

        # Brief delay to respect rate limits
        time.sleep(0.08)

    print("\n--- Summary ---")
    print(f"Successfully updated: {success_count}/{total}")
    print(f"Failed: {fail_count}/{total}")

if __name__ == "__main__":
    run_enrichment()
