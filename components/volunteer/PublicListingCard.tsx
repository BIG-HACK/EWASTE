"use client";

import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Wrench } from "lucide-react";
import { claimListing } from "@/lib/actions/volunteer.actions";
import { useState } from "react";

interface PublicListingCardProps {
    listing: Listing;
}

export function PublicListingCard({ listing }: PublicListingCardProps) {
    const [loading, setLoading] = useState(false);

    const handleClaim = async () => {
        setLoading(true);
        try {
            await claimListing(listing._id);
            window.location.reload();
        } catch (e) {
            alert(e instanceof Error ? e.message : "Failed to claim listing");
        } finally {
            setLoading(false);
        }
    };

    const formattedDate = listing.createdAt
        ? new Date(listing.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "";

    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-44 w-full bg-muted">
                <Image src={listing.photo} alt={listing.title} fill className="object-cover" />
                <div className="absolute right-2 top-2">
                    {listing.needsRepair ? (
                        <Badge variant="destructive">
                            <Wrench className="mr-1 h-3 w-3" />
                            Needs repair
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Working</Badge>
                    )}
                </div>
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    {listing.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{listing.address}</span>
                </div>
                {listing.tags && listing.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {listing.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                {formattedDate && (
                    <p className="text-xs text-muted-foreground">Listed {formattedDate}</p>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    size="sm"
                    onClick={handleClaim}
                    disabled={loading}
                >
                    {loading ? "Claiming…" : "I’ll pick this up"}
                </Button>
            </CardFooter>
        </Card>
    );
}
