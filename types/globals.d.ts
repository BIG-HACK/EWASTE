declare type UserType = "donor" | "organisation" | "student";

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

// ---- Student volunteer ----

declare type CreateStudentProfileParams = {
  clerkId: string;
  address: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  availabilityNotes?: string;
  availabilitySlots?: Record<string, string[]>;
  maxDistanceKm?: number;
  transportMode?: "walk" | "bike" | "car" | "public";
};

declare type StudentProfile = {
  _id: string;
  clerkId: string;
  address: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  availabilityNotes?: string;
  availabilitySlots?: Record<string, string[]>;
  maxDistanceKm?: number;
  transportMode?: "walk" | "bike" | "car" | "public";
  totalJourneysCompleted?: number;
  lastJourneyCompletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

declare type JourneyStatus =
  | "not_started"
  | "outbound"
  | "at_donor"
  | "return"
  | "completed"
  | "cancelled";

declare type LatLng = { lat: number; lng: number };

declare type CreateJourneyParams = {
  listingId: string;
  studentClerkId: string;
};

declare type Journey = {
  _id: string;
  listingId: string;
  studentClerkId: string;
  status: JourneyStatus;
  startedAt?: string;
  pickupConfirmedAt?: string;
  returnStartedAt?: string;
  endedAt?: string;
  startLocation?: LatLng;
  pickupLocation?: LatLng;
  endLocation?: LatLng;
  photoUrls?: string[];
  panicPressedAt?: string;
  panicLocation?: LatLng;
  volunteerNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

declare type StudentTodoType = "pickup" | "training" | "general" | "follow_up";
declare type StudentTodoPriority = "low" | "medium" | "high";

declare type CreateStudentTodoParams = {
  studentClerkId: string;
  title: string;
  description?: string;
  type?: StudentTodoType;
  relatedListingId?: string;
  relatedJourneyId?: string;
  dueDate?: string;
  priority?: StudentTodoPriority;
};

declare type StudentTodo = {
  _id: string;
  studentClerkId: string;
  title: string;
  description?: string;
  type: StudentTodoType;
  relatedListingId?: string;
  relatedJourneyId?: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  priority: StudentTodoPriority;
  createdAt?: string;
  updatedAt?: string;
};
