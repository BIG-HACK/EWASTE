"use client";

import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Wrench, Package } from "lucide-react";

interface PublicListingDetailProps {
    listing: Listing;
}

export function PublicListingDetail({ listing }: PublicListingDetailProps) {
    const formattedDate = listing.createdAt
        ? new Date(listing.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "";

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden">
                <div className="relative h-80 w-full bg-muted">
                    <Image
                        src={listing.photo}
                        alt={listing.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute right-3 top-3">
                        {listing.needsRepair ? (
                            <Badge variant="destructive" className="text-sm">
                                <Wrench className="mr-1 h-4 w-4" />
                                Needs repair
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="text-sm">
                                Working
                            </Badge>
                        )}
                    </div>
                </div>
                <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-2xl">{listing.title}</CardTitle>
                    </div>
                    {listing.category && (
                        <Badge variant="outline">{listing.category}</Badge>
                    )}
                    {listing.yearsUsed != null && (
                        <p className="text-sm text-muted-foreground">
                            Used approximately {listing.yearsUsed} year
                            {listing.yearsUsed !== 1 ? "s" : ""}
                        </p>
                    )}
                    <CardDescription className="text-base pt-2">
                        {listing.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                        <span>{listing.address}</span>
                    </div>
                    {listing.tags && listing.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {listing.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    {listing.notes && (
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                Notes
                            </p>
                            <p>{listing.notes}</p>
                        </div>
                    )}
                    {formattedDate && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Listed on {formattedDate}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
