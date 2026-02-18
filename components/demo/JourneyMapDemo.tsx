"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// fix default marker icons in Leaflet with Next.js
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

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);
  return null;
}

interface JourneyMapDemoProps {
  origin: LatLng;
  destination: LatLng;
  originLabel?: string;
  destinationLabel?: string;
}

export function JourneyMapDemo({
  origin,
  destination,
  originLabel = "Start (student home)",
  destinationLabel = "Donor",
}: JourneyMapDemoProps) {
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${OSRM_BASE}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
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
      } catch {
        setError("Failed to fetch route");
        setRoute(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [origin.lat, origin.lng, destination.lat, destination.lng]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`;
    window.open(url, "_blank");
  };

  const points = [origin, destination];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          Outbound: {originLabel} → {destinationLabel}. Route from OSRM; tiles
          from OpenStreetMap.
        </p>
        <Button variant="outline" size="sm" onClick={openInGoogleMaps}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Google Maps
        </Button>
      </div>
      <div
        className="relative rounded-lg overflow-hidden border bg-muted/30"
        style={{ minHeight: "400px" }}
      >
        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80">
            <span className="text-sm">Loading route…</span>
          </div>
        )}
        {error && (
          <div className="absolute top-2 left-2 z-[1000] rounded bg-destructive/90 text-destructive-foreground px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <MapContainer
          center={[origin.lat, origin.lng]}
          zoom={12}
          className="h-[400px] w-full z-0"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds points={points} />
          <Marker position={[origin.lat, origin.lng]}>
            <Popup>{originLabel}</Popup>
          </Marker>
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>{destinationLabel}</Popup>
          </Marker>
          {route && route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{ color: "rgb(16, 185, 129)", weight: 5 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
