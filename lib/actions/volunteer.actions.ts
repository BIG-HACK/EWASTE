"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { connectToDatabase } from "@/lib/database";
import Volunteer from "@/lib/database/models/volunteer.model";
import VolunteerAssignment from "@/lib/database/models/volunteerAssignment.model";
import Listing from "@/lib/database/models/listing.model";
import { sendVolunteerApplicationNotification } from "@/lib/email/volunteer-notification";

export async function submitVolunteerApplication(data: VolunteerApplicationParams) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const existing = await Volunteer.findOne({ clerkId: userId });
        if (existing) {
            console.log("[Volunteer] Application already exists for this account (status: " + existing.status + "). No new email sent.");
            return JSON.parse(JSON.stringify(existing));
        }

        const status =
            process.env.AUTO_APPROVE_VOLUNTEERS === "true" ? "approved" : "pending";
        const volunteer = await Volunteer.create({
            ...data,
            clerkId: userId,
            status,
            ...(status === "approved" ? { approvedAt: new Date() } : {}),
        });

        if (status === "pending") {
            try {
                await sendVolunteerApplicationNotification({
                    _id: volunteer._id.toString(),
                    name: volunteer.name,
                    age: volunteer.age,
                    email: volunteer.email,
                    phone: volunteer.phone,
                    wantMeeting: volunteer.wantMeeting,
                    availability: volunteer.availability,
                    appliedAt: volunteer.appliedAt?.toISOString?.() ?? new Date().toISOString(),
                });
            } catch (emailError) {
                console.error("[Volunteer] Notification email failed:", emailError);
            }
        }

        revalidatePath("/volunteer/apply");
        revalidatePath("/dashboard");
        return JSON.parse(JSON.stringify(volunteer));
    } catch (error) {
        console.error("Error submitting volunteer application:", error);
        throw new Error("Failed to submit application");
    }
}

export async function getVolunteerByClerkId(clerkId: string) {
    try {
        await connectToDatabase();
        const volunteer = await Volunteer.findOne({ clerkId });
        return volunteer ? JSON.parse(JSON.stringify(volunteer)) : null;
    } catch (error) {
        console.error("Error getting volunteer:", error);
        return null;
    }
}

export async function getAssignmentsForVolunteer(clerkId: string) {
    try {
        await connectToDatabase();
        const assignments = await VolunteerAssignment.find({
            volunteerId: clerkId,
            status: { $in: ["pending", "in_progress"] },
        })
            .sort({ assignedAt: -1 })
            .lean();
        const listingIds = (assignments as any[]).map((a) => a.listingId);
        const listings = await Listing.find({ _id: { $in: listingIds } }).lean();
        const listingMap = Object.fromEntries(listings.map((l: any) => [l._id.toString(), l]));
        const enriched = (assignments as any[]).map((a) => ({
            ...a,
            listing: listingMap[a.listingId.toString()] || null,
        }));
        return JSON.parse(JSON.stringify(enriched));
    } catch (error) {
        console.error("Error getting assignments:", error);
        return [];
    }
}

/** Listings that have an org match and no volunteer assigned yet (available to claim) */
export async function getPublicListingsForVolunteers() {
    try {
        await connectToDatabase();
        const assignedListingIds = await VolunteerAssignment.distinct("listingId", {
            status: { $in: ["pending", "in_progress"] },
        });
        const listings = await Listing.find({
            matchedOrganisationId: { $exists: true, $ne: "" },
            assignedVolunteerId: { $in: [null, undefined, ""] },
            _id: { $nin: assignedListingIds },
            resolved: false,
        })
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(listings));
    } catch (error) {
        console.error("Error getting public listings:", error);
        return [];
    }
}

export async function claimListing(listingId: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const volunteer = await Volunteer.findOne({ clerkId: userId });
        if (!volunteer || volunteer.status !== "approved") {
            throw new Error("Only approved volunteers can claim listings");
        }

        const existing = await VolunteerAssignment.findOne({
            listingId,
            status: { $in: ["pending", "in_progress"] },
        });
        if (existing) throw new Error("This listing is already assigned to a volunteer");

        const listing = await Listing.findById(listingId);
        if (!listing) throw new Error("Listing not found");
        if (listing.assignedVolunteerId) throw new Error("Listing already has a volunteer");

        const assignment = await VolunteerAssignment.create({
            listingId,
            volunteerId: userId,
            status: "pending",
        });
        await Listing.findByIdAndUpdate(listingId, { assignedVolunteerId: userId });

        revalidatePath("/volunteer/listings");
        revalidatePath("/volunteer/dashboard");
        revalidatePath("/dashboard");
        return JSON.parse(JSON.stringify(assignment));
    } catch (error) {
        console.error("Error claiming listing:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to claim listing");
    }
}

export async function getCompletedAssignmentsForVolunteer(clerkId: string) {
    try {
        await connectToDatabase();
        const assignments = await VolunteerAssignment.find({
            volunteerId: clerkId,
            status: "completed",
        })
            .sort({ completedAt: -1 })
            .lean();
        const listingIds = (assignments as any[]).map((a) => a.listingId);
        const listings = await Listing.find({ _id: { $in: listingIds } }).lean();
        const listingMap = Object.fromEntries(listings.map((l: any) => [l._id.toString(), l]));
        const enriched = (assignments as any[]).map((a) => ({
            ...a,
            listing: listingMap[a.listingId.toString()] || null,
        }));
        return JSON.parse(JSON.stringify(enriched));
    } catch (error) {
        console.error("Error getting completed assignments:", error);
        return [];
    }
}

export async function addJourneyLog(assignmentId: string, content: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();
        const assignment = await VolunteerAssignment.findOne({
            _id: assignmentId,
            volunteerId: userId,
        });
        if (!assignment) throw new Error("Assignment not found");

        assignment.journeyLogs = assignment.journeyLogs || [];
        assignment.journeyLogs.push({ content, createdAt: new Date() });
        await assignment.save();

        revalidatePath("/volunteer/dashboard");
        revalidatePath("/volunteer/portfolio");
        revalidatePath(`/volunteer/assignment/${assignmentId}`);
        return JSON.parse(JSON.stringify(assignment));
    } catch (error) {
        console.error("Error adding journey log:", error);
        throw new Error("Failed to add log");
    }
}

export async function updateAssignmentStatus(
    assignmentId: string,
    status: "in_progress" | "completed" | "cancelled",
    hoursSpent?: number
) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();
        const assignment = await VolunteerAssignment.findOne({
            _id: assignmentId,
            volunteerId: userId,
        });
        if (!assignment) throw new Error("Assignment not found");

        assignment.status = status;
        if (status === "completed") {
            assignment.completedAt = new Date();
            if (hoursSpent != null) assignment.hoursSpent = hoursSpent;
        }
        await assignment.save();

        if (status === "completed" || status === "cancelled") {
            await Listing.findByIdAndUpdate(assignment.listingId, {
                assignedVolunteerId: status === "completed" ? undefined : null,
                resolved: status === "completed",
            });
        }

        revalidatePath("/volunteer/dashboard");
        revalidatePath("/volunteer/portfolio");
        revalidatePath("/dashboard");
        return JSON.parse(JSON.stringify(assignment));
    } catch (error) {
        console.error("Error updating assignment:", error);
        throw new Error("Failed to update status");
    }
}

export async function getAssignmentById(assignmentId: string) {
    try {
        await connectToDatabase();
        const assignment = await VolunteerAssignment.findById(assignmentId).lean();
        if (!assignment) return null;
        const listing = await Listing.findById((assignment as any).listingId).lean();
        return JSON.parse(
            JSON.stringify({
                ...assignment,
                listing: listing || null,
            })
        );
    } catch (error) {
        console.error("Error getting assignment:", error);
        return null;
    }
}
