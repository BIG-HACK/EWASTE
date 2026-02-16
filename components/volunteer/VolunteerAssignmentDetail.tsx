"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    addJourneyLog,
    updateAssignmentStatus,
} from "@/lib/actions/volunteer.actions";
import { MapPin, Package, FileText, ArrowLeft, CheckCircle } from "lucide-react";

type AssignmentWithListing = VolunteerAssignment & { listing: Listing | null };

interface VolunteerAssignmentDetailProps {
    assignmentId: string;
    initialAssignment: AssignmentWithListing;
}

export function VolunteerAssignmentDetail({
    assignmentId,
    initialAssignment,
}: VolunteerAssignmentDetailProps) {
    const [assignment, setAssignment] = useState(initialAssignment);
    const [logContent, setLogContent] = useState("");
    const [logLoading, setLogLoading] = useState(false);
    const [hoursSpent, setHoursSpent] = useState(
        assignment.hoursSpent?.toString() ?? ""
    );
    const [completeLoading, setCompleteLoading] = useState(false);
    const [completed, setCompleted] = useState(assignment.status === "completed");

    const listing = assignment.listing;
    if (!listing) return null;

    const handleAddLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logContent.trim()) return;
        setLogLoading(true);
        try {
            const updated = await addJourneyLog(assignmentId, logContent.trim());
            setAssignment((prev) => ({ ...prev, ...updated, listing: prev.listing }));
            setLogContent("");
        } catch (e) {
            console.error(e);
            alert("Failed to add log");
        } finally {
            setLogLoading(false);
        }
    };

    const handleMarkComplete = async () => {
        const hours = hoursSpent.trim() ? parseFloat(hoursSpent) : undefined;
        if (hours != null && (isNaN(hours) || hours < 0)) {
            alert("Please enter a valid number of hours.");
            return;
        }
        setCompleteLoading(true);
        try {
            await updateAssignmentStatus(assignmentId, "completed", hours);
            setCompleted(true);
        } catch (e) {
            console.error(e);
            alert("Failed to mark complete");
        } finally {
            setCompleteLoading(false);
        }
    };

    const handleStartPickup = async () => {
        setCompleteLoading(true);
        try {
            const updated = await updateAssignmentStatus(assignmentId, "in_progress");
            setAssignment((prev) => ({ ...prev, ...updated, listing: prev.listing }));
        } catch (e) {
            console.error(e);
            alert("Failed to update status");
        } finally {
            setCompleteLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to dashboard
                </Link>
            </Button>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <div className="relative h-64 w-full bg-muted">
                            <Image
                                src={listing.photo}
                                alt={listing.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute right-2 top-2">
                                <Badge>
                                    {assignment.status === "pending"
                                        ? "Pending"
                                        : assignment.status === "in_progress"
                                          ? "In progress"
                                          : "Completed"}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                {listing.title}
                            </CardTitle>
                            <CardDescription>{listing.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{listing.address}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {!completed && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5" />
                                    Journey log
                                </CardTitle>
                                <CardDescription>
                                    Add notes about the pickup (e.g. &quot;Collected from donor&quot;, &quot;Dropped at warehouse&quot;)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddLog} className="flex gap-2">
                                    <Input
                                        placeholder="e.g. Picked up device from donor"
                                        value={logContent}
                                        onChange={(e) => setLogContent(e.target.value)}
                                        disabled={logLoading}
                                    />
                                    <Button type="submit" disabled={logLoading || !logContent.trim()}>
                                        {logLoading ? "Adding…" : "Add"}
                                    </Button>
                                </form>
                                {assignment.journeyLogs && assignment.journeyLogs.length > 0 && (
                                    <ul className="mt-4 space-y-2">
                                        {assignment.journeyLogs.map((log, i) => (
                                            <li
                                                key={i}
                                                className="flex gap-2 rounded bg-muted/50 px-3 py-2 text-sm"
                                            >
                                                <span className="shrink-0 text-muted-foreground">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </span>
                                                <span>{log.content}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {!completed && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Mark as complete</CardTitle>
                                <CardDescription>
                                    When you’ve finished the pickup, add hours spent and mark complete.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="hours">Hours spent (optional)</Label>
                                    <Input
                                        id="hours"
                                        type="number"
                                        min={0}
                                        step={0.5}
                                        placeholder="e.g. 1.5"
                                        value={hoursSpent}
                                        onChange={(e) => setHoursSpent(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {assignment.status === "pending" && (
                                        <Button
                                            variant="outline"
                                            onClick={handleStartPickup}
                                            disabled={completeLoading}
                                        >
                                            Start pickup
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleMarkComplete}
                                        disabled={completeLoading}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark complete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {completed && (
                        <Card className="border-emerald-200 bg-emerald-50/50">
                            <CardContent className="pt-6">
                                <p className="font-medium text-emerald-900">
                                    This pickup is complete.
                                </p>
                                {assignment.hoursSpent != null && (
                                    <p className="mt-1 text-sm text-emerald-800">
                                        Hours spent: {assignment.hoursSpent}
                                    </p>
                                )}
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/volunteer/portfolio">View in portfolio</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
