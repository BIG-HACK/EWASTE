import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook/clerk",
    // "/api/uploadthing"
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    // Protect non-public routes
    if (!isPublicRoute(req)) {
        await auth.protect();
    }

    // If user is authenticated and has a userId but no userType, redirect to onboarding
    if (userId && sessionClaims) {
        const userType = (sessionClaims as any)?.metadata?.userType || (sessionClaims as any)?.publicMetadata?.userType;
        const isOnOnboarding = isOnboardingRoute(req);

        // If user doesn't have a userType and isn't already on onboarding, redirect
        if (!userType && !isOnOnboarding && !isPublicRoute(req)) {
            const onboardingUrl = new URL("/onboarding", req.url);
            return NextResponse.redirect(onboardingUrl);
        }

        // If user has userType and is on onboarding, redirect to home
        if (userType && isOnOnboarding) {
            const homeUrl = new URL("/", req.url);
            return NextResponse.redirect(homeUrl);
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};