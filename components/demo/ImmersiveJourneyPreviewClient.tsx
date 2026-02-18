"use client";

import dynamic from "next/dynamic";

const ImmersiveJourneyPreview = dynamic(
  () =>
    import("./ImmersiveJourneyPreview").then((m) => m.ImmersiveJourneyPreview),
  { ssr: false },
);

type LatLng = { lat: number; lng: number };

interface Props {
  origin: LatLng;
  destination: LatLng;
  originAddress?: string;
  destinationAddress?: string;
}

export function ImmersiveJourneyPreviewClient(props: Props) {
  return <ImmersiveJourneyPreview {...props} />;
}
