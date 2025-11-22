"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getListingsForUser } from "@/lib/actions/listing.actions";
import { ListingItem } from "@/components/listing/listingItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UserListings() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchListings() {
            if (isLoaded && isSignedIn && user) {
                try {
                    setIsLoading(true);
                    const userListings = await getListingsForUser(user.id);
                    setListings(userListings);
                } catch (error) {
                    console.error("Error fetching listings:", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (isLoaded) {
                setIsLoading(false);
            }
        }

        fetchListings();
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded || isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500">Loading your listings...</p>
                </div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">Please sign in to view your listings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Listings</h1>
                <Button asChild>
                    <Link href="/create-listing">Create Listing</Link>
                </Button>
            </div>

            {listings && listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing: Listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">
                        You haven't created any listings yet.
                    </p>
                    <Button asChild>
                        <Link href="/create-listing">Create Your First Listing</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

