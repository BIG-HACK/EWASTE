"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getVolunteerByClerkId } from "@/lib/actions/volunteer.actions";
import { getCompletedAssignmentsForVolunteer } from "@/lib/actions/volunteer.actions";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, MapPin, FileText, Award } from "lucide-react";

type AssignmentWithListing = VolunteerAssignment & { listing: Listing | null };

export function VolunteerPortfolio() {
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
                const v = await getVolunteerByClerkId(user.id);
                setVolunteer(v);
                if (!v || v.status !== "approved") {
                    setLoading(false);
                    return;
                }
                const a = await getCompletedAssignmentsForVolunteer(user.id);
                setAssignments(a || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [isLoaded, isSignedIn, user]);

    if (!isLoaded || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-muted-foreground">Loading portfolio…</p>
            </div>
        );
    }

    if (!isSignedIn) {
        router.replace("/sign-in");
        return null;
    }

    if (!volunteer || volunteer.status !== "approved") {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Only approved volunteers can view the portfolio.</p>
                <Button asChild className="mt-4">
                    <Link href="/volunteer/apply">Apply to volunteer</Link>
                </Button>
            </div>
        );
    }

    const totalHours = assignments.reduce((sum, a) => sum + (a.hoursSpent || 0), 0);
    const totalPickups = assignments.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Volunteer portfolio</h1>
                <p className="text-muted-foreground">
                    Your completed pickups and journey logs
                </p>
            </div>

            <div className="mb-10 grid gap-4 sm:grid-cols-2">
                <Card className="border-2">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
                            <p className="text-sm text-muted-foreground">Hours spent</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                            <Award className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalPickups}</p>
                            <p className="text-sm text-muted-foreground">Pickups completed</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Past listings</h2>
                {assignments.length > 0 ? (
                    <div className="space-y-6">
                        {assignments.map((a) => (
                            <Card key={a._id} className="overflow-hidden">
                                {a.listing && (
                                    <>
                                        <div className="flex flex-col md:flex-row">
                                            <div className="relative h-48 w-full md:w-56 shrink-0 bg-muted">
                                                <Image
                                                    src={a.listing.photo}
                                                    alt={a.listing.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 p-6">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="secondary">Completed</Badge>
                                                    {a.hoursSpent != null && (
                                                        <Badge variant="outline">
                                                            {a.hoursSpent} hr{a.hoursSpent !== 1 ? "s" : ""}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="mt-2 flex items-center gap-2">
                                                    <Package className="h-5 w-5" />
                                                    {a.listing.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1 line-clamp-2">
                                                    {a.listing.description}
                                                </CardDescription>
                                                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    {a.listing.address}
                                                </div>
                                                {a.completedAt && (
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        Completed{" "}
                                                        {new Date(a.completedAt).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {a.journeyLogs && a.journeyLogs.length > 0 && (
                                            <CardContent className="border-t pt-4">
                                                <h3 className="mb-3 flex items-center gap-2 font-medium">
                                                    <FileText className="h-4 w-4" />
                                                    Journey log
                                                </h3>
                                                <ul className="space-y-2">
                                                    {a.journeyLogs.map((log, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex gap-2 text-sm"
                                                        >
                                                            <span className="shrink-0 text-muted-foreground">
                                                                {new Date(log.createdAt).toLocaleString()}
                                                            </span>
                                                            <span>{log.content}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        )}
                                    </>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
                        <p className="font-medium">No completed pickups yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Complete pickups and add journey logs to see them here.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/volunteer/listings">Browse available listings</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
