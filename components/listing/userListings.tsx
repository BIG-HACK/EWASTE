"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getListingsForUser } from "@/lib/actions/listing.actions";
import { ListingItem } from "@/components/listing/listingItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Leaf, TreeDeciduous, Award } from "lucide-react";

export function UserListings() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const carbonSaved = listings.length * 60;
    const treesPlanted = listings.length * 3;

    let rank = "Eco-Starter";
    if (listings.length >= 3) rank = "Green Guardian";
    if (listings.length >= 6) rank = "Planet Hero";
    if (listings.length >= 10) rank = "Legendary Recycler";

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

            {listings && listings.length > 0 && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: CO2 */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 bg-emerald-100 rounded-full">
                            <Leaf className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-emerald-900 font-semibold text-sm uppercase tracking-wider">CO₂ Reduced</p>
                            <p className="text-emerald-700 font-bold text-3xl">{carbonSaved} kg</p>
                        </div>
                    </div>

                    {/* Card 2: Trees */}
                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 bg-teal-100 rounded-full">
                            <TreeDeciduous className="w-8 h-8 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-teal-900 font-semibold text-sm uppercase tracking-wider">Tree Equivalent</p>
                            <p className="text-teal-700 font-bold text-3xl">{treesPlanted}</p>
                        </div>
                    </div>

                    {/* Card 3: Rank */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Award className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-blue-900 font-semibold text-sm uppercase tracking-wider">Your Rank</p>
                            <p className="text-blue-700 font-bold text-xl">{rank}</p>
                        </div>
                    </div>
                </div>
            )}

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

