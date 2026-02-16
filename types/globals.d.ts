declare type UserType = "donor" | "organisation" | "volunteer";

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
    assignedVolunteerId?: string;
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
    assignedVolunteerId?: string;
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

declare type VolunteerApplicationParams = {
    clerkId: string;
    name: string;
    age: number;
    email: string;
    phone: string;
    wantMeeting: boolean;
    availability?: string;
};

declare type Volunteer = {
    _id: string;
    clerkId: string;
    name: string;
    age: number;
    email: string;
    phone: string;
    wantMeeting: boolean;
    availability?: string;
    status: "pending" | "approved" | "rejected";
    appliedAt: string;
    approvedAt?: string;
    createdAt?: string;
    updatedAt?: string;
};

declare type JourneyLog = {
    _id?: string;
    content: string;
    createdAt: string;
};

declare type VolunteerAssignment = {
    _id: string;
    listingId: string;
    volunteerId: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    assignedAt: string;
    completedAt?: string;
    hoursSpent?: number;
    journeyLogs: JourneyLog[];
    createdAt?: string;
    updatedAt?: string;
};