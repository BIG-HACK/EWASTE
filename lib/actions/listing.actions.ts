"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import Listing from "@/lib/database/models/listing.model";

export async function createListing(listing: CreateListingParams) {
    try {
        await connectToDatabase();

        const newListing = await Listing.create(listing);

        // Revalidate the dashboard and home pages to show new listing
        revalidatePath("/dashboard");
        revalidatePath("/");

        return JSON.parse(JSON.stringify(newListing));
    } catch (error) {
        console.error("Error creating listing:", error);
        throw new Error("Failed to create listing");
    }
}

export async function getListingsForUser(clerkId: string) {
    try {
        await connectToDatabase();

        const listings = await Listing.find({ clerkId });
        return JSON.parse(JSON.stringify(listings));
    } catch (error) {
        console.error("Error getting listings for user:", error);
        throw new Error("Failed to get listings for user");
    }
}

export async function getListingById(listingId: string) {
    try {
        await connectToDatabase();

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return null;
        }
        return JSON.parse(JSON.stringify(listing));
    } catch (error) {
        console.error("Error getting listing by ID:", error);
        throw new Error("Failed to get listing");
    }
}

export async function updateListing(listingId: string, listing: Partial<CreateListingParams>) {
    try {
        await connectToDatabase();

        const updatedListing = await Listing.findByIdAndUpdate(
            listingId,
            listing,
            { new: true }
        );

        if (!updatedListing) {
            throw new Error("Listing not found");
        }

        // Revalidate the dashboard and home pages to show updated listing
        revalidatePath("/dashboard");
        revalidatePath(`/dashboard/listing/${listingId}`);
        revalidatePath("/");

        return JSON.parse(JSON.stringify(updatedListing));
    } catch (error) {
        console.error("Error updating listing:", error);
        throw new Error("Failed to update listing");
    }
}