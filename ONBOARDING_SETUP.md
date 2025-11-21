# User Type & Onboarding System

This document explains the user type system and onboarding flow implementation.

## Overview

Users can be one of two types:
- **Donor**: Users who want to donate e-waste items
- **Organisation**: Organizations that collect and process e-waste

## How It Works

### 1. User Registration Flow

1. User signs up via Clerk authentication
2. Webhook creates user in MongoDB without a `userType` (defaults to `null`)
3. User is automatically redirected to `/onboarding` by middleware
4. User selects their account type (Donor or Organisation)
5. Selection is saved to both MongoDB and Clerk's public metadata
6. User is redirected to home page and can now access the full app

### 2. Database Schema

**User Model** (`lib/database/models/user.model.ts`):
```typescript
{
  clerkId: String (required, unique)
  email: String (required, unique)
  username: String (required, unique)
  firstName: String (required)
  lastName: String (required)
  photo: String (required)
  userType: String (enum: ["donor", "organisation"], default: null)
}
```

### 3. Middleware Protection

The middleware (`middleware.ts`) handles:
- **Authentication**: Protects non-public routes
- **Onboarding Redirect**: Redirects users without `userType` to `/onboarding`
- **Onboarding Bypass**: Prevents users who already have a type from accessing onboarding

### 4. Available Actions

**Server Actions** (`lib/actions/user.actions.ts`):

```typescript
// Set user type during onboarding
setUserType(userType: "donor" | "organisation"): Promise<User>

// Get current authenticated user
getCurrentUser(): Promise<User>

// Get user by Clerk ID
getUserByClerkId(clerkId: string): Promise<User | null>

// Get user by MongoDB ID
getUserById(userId: string): Promise<User>

// Update user
updateUser(clerkId: string, user: UpdateUserParams): Promise<User>

// Delete user
deleteUser(clerkId: string): Promise<User | null>
```

## Usage Examples

### Check User Type in a Component

```typescript
import { getCurrentUser } from "@/lib/actions/user.actions";

export default async function MyPage() {
  const user = await getCurrentUser();
  
  if (user.userType === "donor") {
    // Show donor-specific content
  } else if (user.userType === "organisation") {
    // Show organisation-specific content
  }
  
  return <div>Welcome, {user.firstName}!</div>;
}
```

### Client-Side User Type Access

```typescript
"use client";
import { useUser } from "@clerk/nextjs";

export default function MyClientComponent() {
  const { user } = useUser();
  const userType = user?.publicMetadata?.userType;
  
  return <div>You are a {userType}</div>;
}
```

### Conditional Rendering Based on Type

```typescript
import { getCurrentUser } from "@/lib/actions/user.actions";

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  return (
    <div>
      <h1>Dashboard</h1>
      {user.userType === "donor" ? (
        <DonorDashboard />
      ) : (
        <OrganisationDashboard />
      )}
    </div>
  );
}
```

## Public Routes

These routes are accessible without authentication:
- `/` - Home page
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/api/webhook/clerk` - Clerk webhook endpoint

## Protected Routes

All other routes require:
1. Authentication (user must be signed in)
2. Completed onboarding (user must have selected a type)

## Customization

### Adding More User Types

1. Update the enum in `user.model.ts`:
```typescript
userType: { type: String, enum: ["donor", "organisation", "recycler"], default: null }
```

2. Update the TypeScript type in `types/globals.d.ts`:
```typescript
declare type UserType = "donor" | "organisation" | "recycler";
```

3. Add a new card in the onboarding page (`app/(auth)/onboarding/page.tsx`)

### Customizing the Onboarding Page

The onboarding page is a client component at `/app/(auth)/onboarding/page.tsx`. You can:
- Modify the design and styling
- Add additional fields or steps
- Change the cards/options presented
- Add form validation

### Changing Redirect Behavior

Modify the middleware logic in `middleware.ts`:
```typescript
// Change where users are redirected after onboarding
if (userType && isOnOnboarding) {
  const dashboardUrl = new URL("/dashboard", req.url);
  return NextResponse.redirect(dashboardUrl);
}
```

## Testing

1. **Sign up a new user**: They should be redirected to `/onboarding`
2. **Select a user type**: They should be redirected to home
3. **Try accessing `/onboarding` again**: Should redirect back to home
4. **Check Clerk dashboard**: User's public metadata should contain `userType`
5. **Check MongoDB**: User document should have `userType` field

## Troubleshooting

**Issue**: User stuck on onboarding page after selection
- Check browser console for errors
- Verify `WEBHOOK_SECRET` is set in environment variables
- Check MongoDB connection

**Issue**: Middleware not redirecting properly
- Clear cookies and try again
- Check that Clerk public metadata is being updated
- Verify middleware matcher is correctly configured

**Issue**: TypeScript errors with user type
- Ensure you're importing `UserType` from globals.d.ts
- Check that the user object has the `userType` field

## Environment Variables Required

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
WEBHOOK_SECRET=whsec_...

# MongoDB
MONGODB_URI=mongodb+srv://...

# URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

