import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getVolunteerByClerkId } from "@/lib/actions/volunteer.actions";
import { getPublicListingsForVolunteers } from "@/lib/actions/volunteer.actions";
import { PublicListingCard } from "@/components/volunteer/PublicListingCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function VolunteerListingsPage() {
    const user = await currentUser();
    const userType = user?.publicMetadata?.userType as string | undefined;

    if (!user) redirect("/sign-in");
    if (userType !== "volunteer") redirect("/");

    const volunteer = await getVolunteerByClerkId(user.id);
    if (!volunteer || volunteer.status !== "approved") {
        redirect("/volunteer/apply");
    }

    const listings = await getPublicListingsForVolunteers();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </Button>
            </div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Available pickups</h1>
                <p className="text-muted-foreground">
                    Donor listings that need a volunteer to pick up. Select one to assign yourself.
                </p>
            </div>

            {listings.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {listings.map((listing) => (
                        <PublicListingCard key={listing._id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
                    <p className="font-medium">No listings available right now</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Listings that have been matched with an organisation will appear here when
                        they need a volunteer for pickup.
                    </p>
                    <Button asChild variant="outline" className="mt-6">
                        <Link href="/dashboard">Back to dashboard</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
