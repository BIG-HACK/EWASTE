"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getVolunteerByClerkId } from "@/lib/actions/volunteer.actions";
import { getAssignmentsForVolunteer } from "@/lib/actions/volunteer.actions";
import { VolunteerAssignmentCard } from "@/components/volunteer/VolunteerAssignmentCard";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Calendar } from "lucide-react";

type AssignmentWithListing = VolunteerAssignment & { listing: Listing | null };

export function VolunteerDashboard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
    const [assignments, setAssignments] = useState<AssignmentWithListing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!isLoaded || !isSignedIn || !user) {
                setLoading(false);
                return;
            }
            try {
                const [v, a] = await Promise.all([
                    getVolunteerByClerkId(user.id),
                    getAssignmentsForVolunteer(user.id),
                ]);
                setVolunteer(v);
                setAssignments(a || []);
                if (!v) {
                    router.replace("/volunteer/apply");
                    return;
                }
                if (v.status === "pending" || v.status === "rejected") {
                    setLoading(false);
                    return;
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [isLoaded, isSignedIn, user, router]);

    if (!isLoaded || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-muted-foreground">Loading your dashboard…</p>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
            </div>
        );
    }

    if (volunteer?.status === "pending") {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-lg rounded-lg border border-amber-200 bg-amber-50/50 p-8 text-center">
                    <p className="font-medium text-amber-900">Your application is under review.</p>
                    <p className="mt-2 text-sm text-amber-800">
                        We’ll verify your account within 3–5 business days. You can then pick up
                        e-waste listings from donors.
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/volunteer/apply">View application status</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (volunteer?.status === "rejected") {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Your volunteer application was not approved.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My pickups</h1>
                    <p className="text-muted-foreground">
                        Listings you’re assigned to pick up from donors
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/volunteer/listings">
                            <MapPin className="mr-2 h-4 w-4" />
                            Browse available listings
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/volunteer/portfolio">
                            <Calendar className="mr-2 h-4 w-4" />
                            My portfolio
                        </Link>
                    </Button>
                </div>
            </div>

            {assignments.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {assignments.map((a) => (
                        <VolunteerAssignmentCard key={a._id} assignment={a} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-medium">No pickups assigned yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Browse available donor listings and volunteer to pick one up.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/volunteer/listings">Browse listings</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
