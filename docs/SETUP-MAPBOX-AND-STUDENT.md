# Setup: Student volunteer flow and map (no credit card)

This guide lists what is already done and what you need to do so the student journey and map can be implemented.

---

## Part 1: What is already done

### Database and types

- **User model** (`lib/database/models/user.model.ts`): `userType` enum includes `"student"` (alongside `"donor"` and `"organisation"`).
- **StudentProfile model** (`lib/database/models/studentprofile.model.ts`): Schema for student volunteers with `clerkId`, `address` (required), phone, emergency contact, optional availability/preferences and stats. Journeys and to-dos live in separate collections.
- **Journey model** (`lib/database/models/journey.model.ts`): One document per pickup: `listingId`, `studentClerkId`, `status`, timestamps, optional lat/lng, `photoUrls`, panic fields, `volunteerNotes`. Indexes on `studentClerkId` and `listingId`.
- **StudentTodo model** (`lib/database/models/studenttodo.model.ts`): To-dos per student with type, optional related listing/journey, due date, completed, priority.
- **Global types** (`types/globals.d.ts`): `UserType` includes `"student"`; types for `StudentProfile`, `Journey`, `StudentTodo`, and their params.

### Map choice: free stack (no API key, no credit card)

We use **Leaflet + OpenStreetMap + OSRM** for the journey map:

- **Leaflet + OSM tiles**: Show the map; no API key, no signup.
- **OSRM public API**: Get route geometry between two points; no key, fair use.
- **Geocoding**: Address → coordinates via Nominatim (free, 1 req/sec; we cache). Optional: store lat/lng when user sets address.

So there is **nothing for you to set up** for the map: no Mapbox/Google account, no token, no credit card. Implementation will add npm packages (`leaflet`, `react-leaflet`) and use OSRM + OSM only.

### Not done yet (implementation only)

- Clerk onboarding third option “Student” and redirect to student profile.
- Student profile create/edit page and server actions.
- Journey assignment (how a listing gets a Journey and `studentClerkId`).
- Journey page with map (Leaflet + OSM + OSRM), buttons, and state.
- Student dashboard and nav.

---

## Part 2: What you need to do

### For the map: nothing

No API key, no new env vars, no credit card. The map will use Leaflet, OpenStreetMap, and OSRM as described in `docs/journey-map.md`.

### Existing env (Clerk, MongoDB, Cloudinary)

Ensure your `.env.local` already has what the rest of the app needs:

- **Clerk**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, sign-in/sign-up URLs.
- **MongoDB**: `MONGODB_URI`.
- **Cloudinary**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (for listing/journey photos).

No extra setup is required for the student journey map.

---

## Optional: If you later switch to Mapbox

If you decide to use Mapbox instead (e.g. for styling or higher quotas):

1. Create an account at [https://account.mapbox.com](https://account.mapbox.com).
2. Create a **public** access token (starts with `pk.`).
3. Add to `.env.local`: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxxx...`
4. Restart the dev server.

Implementation can then use Mapbox Directions and Mapbox GL instead of OSRM + Leaflet. The journey page design (markers, route, “Open in Google Maps” link) stays the same.
