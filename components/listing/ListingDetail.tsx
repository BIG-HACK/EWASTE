"use client";

import { useState } from "react";
import { ListingItem } from "./listingItem";
import { EditListingForm } from "./EditListingForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ListingDetailProps {
    listing: Listing;
    isOwner: boolean;
}

export function ListingDetail({ listing, isOwner }: ListingDetailProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                    >
                        ← Cancel
                    </Button>
                </div>
                <EditListingForm listing={listing} onSuccess={() => setIsEditing(false)} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/dashboard">
                    <Button variant="ghost">← Back to Dashboard</Button>
                </Link>

                {isOwner && (
                    <Button onClick={() => setIsEditing(true)}>
                        Edit Listing
                    </Button>
                )}
            </div>

            <div className="max-w-2xl mx-auto">
                <ListingItem listing={listing} />
            </div>
        </div>
    );
}

