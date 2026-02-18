"use client";

import dynamic from "next/dynamic";

const JourneyMapDemo = dynamic(
  () => import("./JourneyMapDemo").then((m) => m.JourneyMapDemo),
  { ssr: false },
);

type LatLng = { lat: number; lng: number };

interface Props {
  origin: LatLng;
  destination: LatLng;
  originLabel?: string;
  destinationLabel?: string;
}

export function JourneyMapDemoClient(props: Props) {
  return <JourneyMapDemo {...props} />;
}
