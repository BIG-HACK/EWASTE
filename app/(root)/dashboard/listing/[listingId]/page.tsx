import { getListingById } from "@/lib/actions/listing.actions";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ListingDetail } from "@/components/listing/ListingDetail";
import { dummyMatches } from "@/constants";

export default async function ListingDetailPage({
    params,
}: {
    params: Promise<{ listingId: string }>;
}) {
    const { listingId } = await params;

    let listing;

    // Check if it's a dummy match from our constants
    if (listingId.startsWith("match_")) {
        listing = dummyMatches.find(l => l._id === listingId);
    } else {
        // Otherwise try to fetch from database
        try {
            listing = await getListingById(listingId);
        } catch (error) {
            console.error("Error fetching listing:", error);
            // If ID is invalid format, getListingById might throw, so we catch it
            listing = null;
        }
    }

    const user = await currentUser();

    if (!listing) {
        notFound();
    }

    // Check if the current user owns this listing
    const isOwner = user ? listing.clerkId === user.id : false;

    return <ListingDetail listing={listing} isOwner={isOwner} />;
}

