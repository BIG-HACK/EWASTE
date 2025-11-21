"use server";

import { connectToDatabase } from "@/lib/database";
import { revalidatePath } from "next/cache";

import User from "@/lib/database/models/user.model";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createUser(user: CreateUserParams) {
    try {
        await connectToDatabase();

        console.log("CONNECTED TO DATABASE");

        const newUser = await User.create(user);

        console.log("CREATED USER: ", newUser);

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserById(userId: string): Promise<User> {
    try {
        await connectToDatabase();

        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectToDatabase();

        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
            new: true,
        });

        if (!updatedUser) throw new Error("User update failed");
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();

        // Find user to delete
        const userToDelete = await User.findOne({ clerkId });

        if (!userToDelete) {
            throw new Error("User not found");
        }

        // TODO: delete all posts

        // Delete user
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        console.log("CREATING A NEW POST")

        await connectToDatabase();

        const { sessionClaims } = await auth();
        const userId = sessionClaims?.userId as string;

        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");

        console.log("Found user: ")
        console.log(user);

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId });

        if (!user) return null;

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error fetching user by Clerk ID:", error);
        throw error;
    }
}

export async function setUserType(userType: UserType) {
    try {
        await connectToDatabase();

        const { userId: clerkUserId, sessionClaims } = await auth();
        const mongoUserId = sessionClaims?.userId as string;

        if (!clerkUserId || !mongoUserId) throw new Error("Not authenticated");

        // Update MongoDB user
        const updatedUser = await User.findByIdAndUpdate(
            mongoUserId,
            { userType },
            { new: true }
        );

        if (!updatedUser) throw new Error("User update failed");

        // Sync to Clerk metadata so middleware can access it
        await (await clerkClient()).users.updateUserMetadata(clerkUserId, {
            publicMetadata: {
                userId: mongoUserId,
                userType: userType,
            },
        });

        revalidatePath("/");
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.error("Error setting user type:", error);
        throw error;
    }
}