# Journey page: map integration

When a student volunteer starts a journey, the web app needs to show a map with:

- **Outbound**: route from student's address (A) to donor's address (B)
- **Return**: route from donor's address (A) to student's address (B)
- Optional: volunteer's current location (browser geolocation)
- Markers for start and end; "Open in Google Maps" / "Open in Maps" link for turn-by-turn on their phone

---

## Recommended: Leaflet + OpenStreetMap + OSRM (no API key, no credit card)

This stack is **fully free**: no signup, no API key, no billing account, no credit card.

| Piece         | What we use                      | Why free                                                               |
| ------------- | -------------------------------- | ---------------------------------------------------------------------- |
| **Map**       | Leaflet + OSM tiles              | Open-source; tile servers are free to use, no key                      |
| **Route**     | OSRM public API                  | Returns route geometry (polyline) between two points; no key, fair use |
| **Geocoding** | Nominatim (OSM) or cached coords | Converts address → lat/lng; 1 req/sec, we cache results                |

**Flow:**

1. We have **addresses** (student profile address, listing donor address). If we don’t have coordinates yet, we **geocode** once (e.g. server-side with Nominatim) and can cache lat/lng in the DB or in memory.
2. **Map**: Leaflet with OpenStreetMap tiles shows the area. Two markers: start (student) and end (donor).
3. **Route line**: We call OSRM’s public demo API:  
   `https://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson`  
   It returns a GeoJSON line; we draw it on the map.
4. **“Open in Google Maps”**: We build a URL with origin and destination (address or lat,lng). Opens in the user’s phone for real turn-by-turn. No Google API key needed for that link.

**Tradeoffs:**

- Map style is OpenStreetMap (clean, familiar), not Mapbox/Google custom styling.
- OSRM public server is fair-use; for a hackathon or small app, usage is fine. For heavy production you could self-host OSRM or use a paid routing API later.
- Nominatim: 1 request per second; we geocode when needed and cache so we don’t hit the limit.

**Packages:** `leaflet`, `react-leaflet`, `@types/leaflet` (dev). No env vars for the map or route.

---

## Alternative: Mapbox (requires account; free tier may require card)

- Mapbox has a free tier; some regions/accounts require a credit card for verification.
- If you already have a Mapbox token and prefer its styling: use `react-map-gl` + `mapbox-gl` and Mapbox Directions API. Env: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`.

See `docs/SETUP-MAPBOX-AND-STUDENT.md` only if you choose Mapbox.

---

## Journey UI (map area)

- One map component that accepts: **origin** and **destination** (address or lat/lng), optional **currentLocation** (lat/lng).
- Draw a route line between origin and destination (OSRM or Mapbox Directions).
- Show markers: “Start (your home)”, “Donor”, “End (your home)” for return leg.
- Side panel or bottom sheet: Panic, “Did you pick up?”, “Take photo”, “Start return”, “End journey”.
- Link: “Open in Google Maps” using  
  `https://www.google.com/maps/dir/?api=1&origin=...&destination=...`  
  so the student can navigate on their phone (no Google API key needed for this URL).
