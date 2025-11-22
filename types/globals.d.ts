declare type UserType = "donor" | "organisation";

declare type CreateUserParams = {
    clerkId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    photo: string;
    userType?: UserType | null;
};

declare type UpdateUserParams = {
    firstName: string;
    lastName: string;
    username: string;
    photo: string;
    userType?: UserType | null;
};

declare type User = {
    _id: string;
    clerkId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
    userType: UserType | null;
};

declare type CreateListingParams = {
    clerkId: string;
    title: string;
    description: string;
    address: string;
    photo: string;
    needsRepair: boolean;
    notes?: string;
    tags?: string[];
};

declare type Listing = {
    _id: string;
    clerkId: string;
    title: string;
    description: string;
    address: string;
    photo: string;
    needsRepair: boolean;
    notes?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
};