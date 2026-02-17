import { getListingById } from "@/lib/actions/listing.actions";
import { notFound } from "next/navigation";
import { PublicListingDetail } from "@/components/listing/PublicListingDetail";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function PublicListingDetailPage({
    params,
}: {
    params: Promise<{ listingId: string }>;
}) {
    const { listingId } = await params;

    let listing: Listing | null = null;
    try {
        listing = await getListingById(listingId);
    } catch {
        listing = null;
    }

    if (!listing) notFound();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/listings">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to listings
                    </Link>
                </Button>
            </div>
            <PublicListingDetail listing={listing} />
        </div>
    );
}
