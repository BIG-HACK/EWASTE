import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ImmersiveJourneyPreviewClient } from "@/components/demo/ImmersiveJourneyPreviewClient";

// Demo addresses (Singapore) – coordinates match the strings for immersion
const DEMO_ORIGIN = { lat: 1.3521, lng: 103.8198 };
const DEMO_DESTINATION = { lat: 1.2932, lng: 103.7763 };
const DEMO_ORIGIN_ADDRESS = "Block 123, Clementi Ave 4, Singapore 129801";
const DEMO_DESTINATION_ADDRESS = "Block 456, Tampines St 42, Singapore 529201";

export default function DemoJourneyMapPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Student volunteer journey</CardTitle>
          <CardDescription>
            Full preview: start the journey, allow location to see yourself on
            the map, then walk through pickup and return.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImmersiveJourneyPreviewClient
            origin={DEMO_ORIGIN}
            destination={DEMO_DESTINATION}
            originAddress={DEMO_ORIGIN_ADDRESS}
            destinationAddress={DEMO_DESTINATION_ADDRESS}
          />
        </CardContent>
      </Card>
    </div>
  );
}
