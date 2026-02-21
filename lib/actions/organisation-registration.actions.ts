"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database";
import OrganisationRegistration from "@/lib/database/models/organisationRegistration.model";
import { sendOrganisationConfirmationEmail } from "@/lib/email/organisation-confirmation";
import { sendOrganisationRegistrationNotificationToAdmin } from "@/lib/email/organisation-notification-to-admin";

export async function submitOrganisationRegistration(data: OrganisationRegistrationParams) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const existing = await OrganisationRegistration.findOne({ clerkId: userId });
        if (existing) {
            if (existing.status === "confirmed")
                throw new Error("Your organisation is already confirmed. Go to Organisation Profile to set up.");
            if (existing.status === "pending")
                return JSON.parse(JSON.stringify(existing)); // already submitted
        }

        const registration = await OrganisationRegistration.create({
            clerkId: userId,
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone.trim(),
            productTypes: data.productTypes.filter(Boolean),
            aboutOrg: data.aboutOrg.trim(),
            identificationTag: data.identificationTag?.trim() || undefined,
            status: "pending",
        });

        try {
            await sendOrganisationConfirmationEmail(registration.email, registration.name);
        } catch (emailError) {
            console.error("[Organisation] Confirmation email failed:", emailError);
        }
        try {
            await sendOrganisationRegistrationNotificationToAdmin({
                _id: registration._id.toString(),
                name: registration.name,
                email: registration.email,
                phone: registration.phone,
                productTypes: registration.productTypes || [],
                aboutOrg: registration.aboutOrg,
                identificationTag: registration.identificationTag,
                submittedAt: registration.submittedAt?.toISOString?.() ?? new Date().toISOString(),
            });
        } catch (adminEmailError) {
            console.error("[Organisation] Admin notification email failed:", adminEmailError);
        }

        revalidatePath("/organisation/register");
        revalidatePath("/organisation-profile");
        revalidatePath("/dashboard");
        return JSON.parse(JSON.stringify(registration));
    } catch (error) {
        console.error("Error submitting organisation registration:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to submit registration");
    }
}

export async function getOrganisationRegistrationByClerkId(clerkId: string) {
    try {
        await connectToDatabase();
        const reg = await OrganisationRegistration.findOne({ clerkId });
        return reg ? JSON.parse(JSON.stringify(reg)) : null;
    } catch (error) {
        console.error("Error getting organisation registration:", error);
        return null;
    }
}

export async function getOrganisationRegistrationById(id: string) {
    try {
        await connectToDatabase();
        const reg = await OrganisationRegistration.findById(id);
        return reg ? JSON.parse(JSON.stringify(reg)) : null;
    } catch (error) {
        console.error("Error getting organisation registration by ID:", error);
        return null;
    }
}
