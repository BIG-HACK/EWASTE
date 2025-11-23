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
import { MapPin, Calendar, Wrench, CheckCircle, Clock, Handshake } from "lucide-react";
import { dummyOrganisations } from "@/constants";
import { cn } from "@/lib/utils";

interface ListingItemProps {
    listing: Listing;
    onCardClick?: (listing: Listing) => void;
}

export function ListingItem({ listing, onCardClick }: ListingItemProps) {
    const formattedDate = new Date(listing.createdAt || "").toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const matchedOrg = dummyOrganisations.find(org => org._id === listing.matchedOrganisationId || org.clerkId === listing.matchedOrganisationId);

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        if (onCardClick) {
            return <div onClick={() => onCardClick(listing)}>{children}</div>;
        }
        return <Link href={`/dashboard/listing/${listing._id}`}>{children}</Link>;
    };

    return (
        <Wrapper>
            <Card className={cn(
                "overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full relative group",
                listing.resolved && "bg-emerald-50/40 border-emerald-200 shadow-emerald-100"
            )}>
                {/* Resolved Overlay */}
                {listing.resolved && (
                    <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none z-10" />
                )}

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
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl">{listing.title}</CardTitle>
                        <div className="flex flex-col gap-2 items-end">
                            {/* Matched Status Badge */}
                            {matchedOrg && (
                                <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1">
                                    <Handshake className="h-3 w-3" />
                                    Matched: {matchedOrg.name}
                                </Badge>
                            )}

                            {/* Status Badge */}
                            {listing.resolved ? (
                                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Resolved
                                </Badge>
                            ) : (
                                <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Active
                                </Badge>
                            )}

                            {/* Condition Badge */}
                            {listing.needsRepair ? (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                    <Wrench className="h-3 w-3" />
                                    Needs Repair
                                </Badge>
                            ) : (
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                    Working
                                </Badge>
                            )}
                        </div>
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
        </Wrapper>
    );
}

