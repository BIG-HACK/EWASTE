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
    resolved?: boolean;
    matchedOrganisationId?: string;
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
    resolved: boolean;
    matchedOrganisationId?: string;
    notes?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
};

declare type CreateOrganisationProfileParams = {
    clerkId: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    description: string;
    needs?: string[];
    tags?: string[];
};

declare type OrganisationProfile = {
    _id: string;
    clerkId: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    description: string;
    needs?: string[];
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
};