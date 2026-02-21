"use client";

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
import { Button } from "@/components/ui/button";
import { MapPin, Package, Clock, ArrowRight } from "lucide-react";

type AssignmentWithListing = VolunteerAssignment & { listing: Listing | null };

interface VolunteerAssignmentCardProps {
    assignment: AssignmentWithListing;
}

export function VolunteerAssignmentCard({ assignment }: VolunteerAssignmentCardProps) {
    const listing = assignment.listing;
    if (!listing) return null;

    const formattedDate = new Date(assignment.assignedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-44 w-full bg-muted">
                <Image
                    src={listing.photo}
                    alt={listing.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute right-2 top-2">
                    <Badge
                        variant={assignment.status === "in_progress" ? "default" : "secondary"}
                    >
                        {assignment.status === "pending" ? "Pending" : "In progress"}
                    </Badge>
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Assigned {formattedDate}
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/volunteer/assignment/${assignment._id}`}>
                        View details & log journey
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
