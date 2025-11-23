"use client";

import { useState } from "react";
import { dummyMatches } from "@/constants";
import { ListingItem } from "@/components/listing/listingItem";
import { LayoutGrid, Package } from "lucide-react";

export function OrganisationMatches() {
    // In a real app, we would fetch matches for the logged-in organisation
    // For demo, we just use the dummy matches with local state
    const [matches, setMatches] = useState<Listing[]>(dummyMatches);

    const handleToggleStatus = (listingId: string) => {
        setMatches(prevMatches =>
            prevMatches.map(match =>
                match._id === listingId
                    ? { ...match, resolved: !match.resolved }
                    : match
            )
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                    <LayoutGrid className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Matched Donations</h1>
                    <p className="text-gray-500">Review items donated to your organisation</p>
                </div>
            </div>

            {matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((match) => (
                        <ListingItem
                            key={match._id}
                            listing={match}
                            onCardClick={() => handleToggleStatus(match._id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">No Matches Yet</h3>
                    <p className="text-gray-500 mt-2">
                        Items matched with your organisation will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}

