import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Wrench } from "lucide-react";

interface ListingItemProps {
    listing: Listing;
}

export function ListingItem({ listing }: ListingItemProps) {
    const formattedDate = new Date(listing.createdAt || "").toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <Link href={`/dashboard/listing/${listing._id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                {/* Image */}
                <div className="relative h-48 w-full bg-gray-200">
                    <Image
                        src={listing.photo}
                        alt={listing.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{listing.title}</CardTitle>
                        {listing.needsRepair && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                                <Wrench className="h-3 w-3" />
                                Needs Repair
                            </Badge>
                        )}
                        {!listing.needsRepair && (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                Working
                            </Badge>
                        )}
                    </div>
                    <CardDescription className="line-clamp-2">
                        {listing.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Address */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.address}</span>
                    </div>

                    {/* Tags */}
                    {listing.tags && listing.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {listing.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Notes */}
                    {listing.notes && (
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                            <p className="font-semibold text-xs text-gray-500 uppercase mb-1">
                                Notes
                            </p>
                            <p>{listing.notes}</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Listed on {formattedDate}
                </CardFooter>
            </Card>
        </Link>
    );
}

