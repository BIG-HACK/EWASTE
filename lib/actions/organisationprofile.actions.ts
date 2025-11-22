"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import OrganisationProfile from "@/lib/database/models/organisationprofile.model";

export async function createOrganisationProfile(profile: CreateOrganisationProfileParams) {
    try {
        await connectToDatabase();

        const newProfile = await OrganisationProfile.create(profile);

        // Revalidate relevant pages
        revalidatePath("/organisation-profile");
        revalidatePath("/dashboard");

        return JSON.parse(JSON.stringify(newProfile));
    } catch (error) {
        console.error("Error creating organisation profile:", error);
        throw new Error("Failed to create organisation profile");
    }
}

export async function getOrganisationProfileByClerkId(clerkId: string) {
    try {
        await connectToDatabase();

        const profile = await OrganisationProfile.findOne({ clerkId });
        if (!profile) {
            return null;
        }
        return JSON.parse(JSON.stringify(profile));
    } catch (error) {
        console.error("Error getting organisation profile:", error);
        throw new Error("Failed to get organisation profile");
    }
}

export async function getOrganisationProfileById(profileId: string) {
    try {
        await connectToDatabase();

        const profile = await OrganisationProfile.findById(profileId);
        if (!profile) {
            return null;
        }
        return JSON.parse(JSON.stringify(profile));
    } catch (error) {
        console.error("Error getting organisation profile by ID:", error);
        throw new Error("Failed to get organisation profile");
    }
}

export async function updateOrganisationProfile(
    clerkId: string,
    profile: Partial<CreateOrganisationProfileParams>
) {
    try {
        await connectToDatabase();

        const updatedProfile = await OrganisationProfile.findOneAndUpdate(
            { clerkId },
            profile,
            { new: true }
        );

        if (!updatedProfile) {
            throw new Error("Organisation profile not found");
        }

        // Revalidate relevant pages
        revalidatePath("/organisation-profile");
        revalidatePath("/dashboard");

        return JSON.parse(JSON.stringify(updatedProfile));
    } catch (error) {
        console.error("Error updating organisation profile:", error);
        throw new Error("Failed to update organisation profile");
    }
}

export async function getAllOrganisationProfiles() {
    try {
        await connectToDatabase();

        const profiles = await OrganisationProfile.find({});
        return JSON.parse(JSON.stringify(profiles));
    } catch (error) {
        console.error("Error getting all organisation profiles:", error);
        throw new Error("Failed to get organisation profiles");
    }
}

