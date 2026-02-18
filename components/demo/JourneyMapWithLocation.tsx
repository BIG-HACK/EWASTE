"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

type LatLng = { lat: number; lng: number };

function FitBoundsToRoute({ routePoints }: { routePoints: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (routePoints.length < 2) return;
    const bounds = L.latLngBounds(routePoints.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [map, routePoints]);
  return null;
}

export type JourneyPhase = "outbound" | "return";

interface JourneyMapWithLocationProps {
  origin: LatLng;
  destination: LatLng;
  phase: JourneyPhase;
  userLocation: LatLng | null;
  originLabel?: string;
  destinationLabel?: string;
  className?: string;
  showOpenInMaps?: boolean;
}

export function JourneyMapWithLocation({
  origin,
  destination,
  phase,
  userLocation,
  originLabel = "Start (your home)",
  destinationLabel = "Donor",
  className = "h-[50vh] w-full min-h-[300px]",
  showOpenInMaps = true,
}: JourneyMapWithLocationProps) {
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const from = phase === "outbound" ? origin : destination;
  const to = phase === "outbound" ? destination : origin;
  const routePoints = [from, to];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = `${OSRM_BASE}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.code !== "Ok" || !data.routes?.[0]?.geometry?.coordinates) {
          setError("Could not load route");
          setRoute(null);
          return;
        }
        const coords = data.routes[0].geometry.coordinates as [
          number,
          number,
        ][];
        setRoute(coords.map(([lng, lat]) => [lat, lng]));
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to fetch route");
          setRoute(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from.lat, from.lng, to.lat, to.lng]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-2 h-full min-h-0">
      {showOpenInMaps && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openInGoogleMaps}
            className="text-sm text-primary hover:underline"
          >
            Open in Google Maps for turn-by-turn
          </button>
        </div>
      )}
      <div className="relative overflow-hidden flex-1 min-h-[200px] rounded-lg border bg-muted/30">
        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80 rounded-lg">
            <span className="text-sm">Loading route…</span>
          </div>
        )}
        {error && (
          <div className="absolute top-2 left-2 z-[1000] rounded bg-destructive/90 text-destructive-foreground px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <MapContainer
          center={[from.lat, from.lng]}
          zoom={12}
          className={className}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBoundsToRoute routePoints={routePoints} />
          <Marker position={[from.lat, from.lng]}>
            <Popup>{originLabel}</Popup>
          </Marker>
          <Marker position={[to.lat, to.lng]}>
            <Popup>{destinationLabel}</Popup>
          </Marker>
          {userLocation && (
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={12}
              pathOptions={{
                fillColor: "#2563eb",
                color: "#1d4ed8",
                weight: 2,
                fillOpacity: 0.9,
              }}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}
          {route && route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{
                color: "rgb(16, 185, 129)",
                weight: 5,
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
