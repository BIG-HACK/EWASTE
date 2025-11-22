"use server";

import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";

export async function createUser(user: CreateUserParams) {
    try {
        await connectToDatabase();

        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
}

export async function getUserById(userId: string) {
    try {
        await connectToDatabase();

        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error getting user by ID:", error);
        throw new Error("Failed to get user by ID");
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
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
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

        // Delete user
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
}

export async function setUserType(userType: UserType) {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        await connectToDatabase();

        // Update user in database
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: userId },
            { userType },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found");
        }

        // Update Clerk user metadata so middleware can access it
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                userType
            }
        });

        revalidatePath("/");

        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.error("Error setting user type:", error);
        throw new Error("Failed to set user type");
    }
}

// const getCurrentUser = async () => {
//     try {
//         const { userId } = await auth();
//         if (!userId) {
//             throw new Error("Unauthorized");
//         }
//         return await getUserById(userId);
//     } catch (error) {
//         console.error("Error getting current user:", error);
//         throw new Error("Failed to get current user");
//     }
// }

// export { getCurrentUser };