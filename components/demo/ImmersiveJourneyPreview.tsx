"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Home,
  MapPin,
  Phone,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import {
  JourneyMapWithLocation,
  type JourneyPhase,
} from "./JourneyMapWithLocation";

type LatLng = { lat: number; lng: number };

function getLocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'Location permission denied. Click "Try again" and choose Allow when the browser asks, or enable location for this site in your browser settings.';
    case 2:
      return "Position unavailable. Use the site over https or localhost and ensure device location is on. On a laptop, try a phone or enable location in system settings.";
    case 3:
      return "Location timed out. Allow the site to use location, then click Try again. On desktop, use a phone or enable location services for better results.";
    default:
      return "Could not get your location. Try again or use http://localhost:3000.";
  }
}

// Options that favour a quick fix (network/cached) so we don't timeout on desktop or indoors
const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false, // avoid waiting for GPS; use network/cell/WiFi
  maximumAge: 60000,         // accept a position up to 1 min old
  timeout: 25000,
};

type JourneyPhaseState =
  | "not_started"
  | "outbound"
  | "at_donor"
  | "return"
  | "completed";

interface ImmersiveJourneyPreviewProps {
  origin: LatLng;
  destination: LatLng;
  originAddress?: string;
  destinationAddress?: string;
}

export function ImmersiveJourneyPreview({
  origin,
  destination,
  originAddress = "Your home (student)",
  destinationAddress = "Donor pickup address",
}: ImmersiveJourneyPreviewProps) {
  const [phase, setPhase] = useState<JourneyPhaseState>("not_started");
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [panicSent, setPanicSent] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [locationRequesting, setLocationRequesting] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // keep watching position once journey has started (prompt was already shown on Start click)
  useEffect(() => {
    if (phase === "not_started" || phase === "completed") return;
    if (!navigator.geolocation) return;

    const onPosition = (pos: GeolocationPosition) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setLocationError(null);
    };
    const onError = (err: GeolocationPositionError) => {
      setLocationError(getLocationErrorMessage(err.code));
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      onPosition,
      onError,
      { enableHighAccuracy: false, maximumAge: 10000, timeout: 20000 },
    );

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [phase]);

  const handleStartJourney = () => {
    setStartTime(Date.now());
    setLocationError(null);
    setLocationRequesting(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setPhase("outbound");
      setLocationRequesting(false);
      return;
    }

    // request permission and first position on the user's click (browsers only show prompt for user gestures)
    // use GEO_OPTIONS so we get a quick network/cached fix instead of waiting for GPS (which often times out on desktop)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationError(null);
        setPhase("outbound");
        setLocationRequesting(false);
      },
      (err) => {
        setLocationError(getLocationErrorMessage(err.code));
        setPhase("outbound"); // still show map so they can use the demo
        setLocationRequesting(false);
      },
      GEO_OPTIONS,
    );
  };

  const handleRetryLocation = () => {
    setLocationError(null);
    setLocationRequesting(true);
    if (!navigator.geolocation) {
      setLocationRequesting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationError(null);
        setLocationRequesting(false);
      },
      (err) => {
        setLocationError(getLocationErrorMessage(err.code));
        setLocationRequesting(false);
      },
      GEO_OPTIONS,
    );
  };

  const handleDidYouPickUp = () => setPhase("at_donor");
  const handleTakePhoto = () => photoInputRef.current?.click();
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoUrl(URL.createObjectURL(file));
    e.target.value = "";
  };
  const handleStartReturn = () => setPhase("return");
  const handleEndJourney = () => {
    setEndTime(Date.now());
    setPhase("completed");
  };

  const handlePanic = () => {
    setPanicSent(true);
    // In production: call API to notify emergency contact / org
    setTimeout(() => setPanicSent(false), 5000);
  };

  const duration =
    startTime && endTime ? Math.round((endTime - startTime) / 1000 / 60) : 0;

  // Not started: show addresses and Start button
  if (phase === "not_started") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/demo/journey-map">
              <span className="mr-2">←</span> Back
            </Link>
          </Button>
        </div>
        <div className="rounded-xl border bg-card p-6 space-y-6">
          <h2 className="text-xl font-semibold">Pickup ready</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-lg bg-muted/50 p-4">
              <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Your home (start & end)
                </p>
                <p className="font-medium">{originAddress}</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg bg-muted/50 p-4">
              <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Donor
                </p>
                <p className="font-medium">{destinationAddress}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            When you start, we&apos;ll track your location on the map so you can
            see your progress. Allow location when prompted.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
            onClick={handleStartJourney}
            disabled={locationRequesting}
          >
            <Play className="h-5 w-5 mr-2" />
            {locationRequesting ? "Requesting location…" : "Start journey"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Your browser will ask for location when you click Start. We use
            network/cached location so it works on laptops; for best accuracy
            use a phone. Use <strong>http://localhost:3000</strong> if the
            prompt does not appear.
          </p>
        </div>
      </div>
    );
  }

  // Completed: summary
  if (phase === "completed") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6 text-center space-y-4">
          <div className="inline-flex rounded-full bg-emerald-100 p-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-semibold">Journey complete</h2>
          <p className="text-muted-foreground">
            You completed the round trip in about {duration} minute
            {duration !== 1 ? "s" : ""}.
          </p>
          {photoUrl && (
            <p className="text-sm text-muted-foreground">
              Pickup photo recorded.
            </p>
          )}
          <Button asChild>
            <Link href="/demo/journey-map">
              <Home className="h-4 w-4 mr-2" />
              Back to demo
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Map phases: full-screen journey (outbound, at_donor, return) — no header, map only
  const mapPhase: JourneyPhase = phase === "return" ? "return" : "outbound";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Top bar: back + phase label + open in maps */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b shrink-0 bg-background">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/demo/journey-map">← Exit</Link>
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {phase === "outbound" && "Going to donor"}
          {phase === "at_donor" && "At donor — confirm pickup"}
          {phase === "return" && "Returning home"}
        </span>
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline whitespace-nowrap"
        >
          Open in Maps
        </a>
      </div>

      {locationError && (
        <div className="mx-3 mt-2 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-200 px-4 py-2 text-sm flex items-center justify-between gap-2 shrink-0">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {locationError}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetryLocation}
            disabled={locationRequesting}
          >
            {locationRequesting ? "…" : "Try again"}
          </Button>
        </div>
      )}

      {/* Map fills remaining space */}
      <div className="flex-1 min-h-0 w-full">
        <JourneyMapWithLocation
          origin={origin}
          destination={destination}
          phase={mapPhase}
          userLocation={userLocation}
          originLabel="Your home"
          destinationLabel="Donor"
          className="h-full min-h-[240px]"
          showOpenInMaps={false}
        />
      </div>

      {/* Action buttons fixed at bottom */}
      <div className="flex flex-col gap-3 p-4 border-t bg-background shrink-0">
        {phase === "outbound" && (
          <>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="destructive"
                className="flex-1 min-w-[140px]"
                onClick={handlePanic}
                disabled={panicSent}
              >
                <Phone className="h-4 w-4 mr-2" />
                {panicSent ? "Help requested" : "Panic"}
              </Button>
              <Button
                className="flex-1 min-w-[140px] bg-emerald-600 hover:bg-emerald-700"
                onClick={handleDidYouPickUp}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Did you pick up?
              </Button>
            </div>
            {panicSent && (
              <p className="text-sm text-muted-foreground">
                In production we would notify your emergency contact and the
                organisation.
              </p>
            )}
          </>
        )}

        {phase === "at_donor" && (
          <>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                className="flex-1 min-w-[140px]"
                onClick={handleTakePhoto}
              >
                <Camera className="h-4 w-4 mr-2" />
                {photoUrl ? "Retake photo" : "Take photo"}
              </Button>
              <Button
                className="flex-1 min-w-[160px] bg-emerald-600 hover:bg-emerald-700"
                onClick={handleStartReturn}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Start return journey
              </Button>
            </div>
            {photoUrl && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img
                  src={photoUrl}
                  alt="Pickup"
                  className="h-12 w-12 rounded object-cover border"
                />
                <span>Pickup photo added</span>
              </div>
            )}
          </>
        )}

        {phase === "return" && (
          <Button
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={handleEndJourney}
          >
            <Square className="h-4 w-4 mr-2" />
            End journey
          </Button>
        )}
      </div>
    </div>
  );
}
