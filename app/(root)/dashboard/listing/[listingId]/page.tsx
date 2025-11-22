import { getListingById } from "@/lib/actions/listing.actions";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ListingDetail } from "@/components/listing/ListingDetail";

export default async function ListingDetailPage({
    params,
}: {
    params: Promise<{ listingId: string }>;
}) {
    const { listingId } = await params;
    const listing = await getListingById(listingId);
    const user = await currentUser();

    if (!listing) {
        notFound();
    }

    // Check if the current user owns this listing
    const isOwner = user ? listing.clerkId === user.id : false;

    return <ListingDetail listing={listing} isOwner={isOwner} />;
}

