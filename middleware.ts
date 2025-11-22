import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/onboarding",
    "/api/webhook/clerk",
    // "/api/uploadthing"
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    // If the user isn't signed in and the route is private, redirect to sign-in
    if (!userId && !isPublicRoute(req)) {
        return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Catch users who do not have userType set in their publicMetadata
    // Redirect them to the /onboarding route to complete onboarding
    const userType = (sessionClaims?.metadata as any)?.userType;

    if (userId && !userType && req.nextUrl.pathname !== "/onboarding") {
        const onboardingUrl = new URL("/onboarding", req.url);
        return NextResponse.redirect(onboardingUrl);
    }

    // If user has completed onboarding and tries to access onboarding page, redirect to home
    if (userId && userType && req.nextUrl.pathname === "/onboarding") {
        const homeUrl = new URL("/", req.url);
        return NextResponse.redirect(homeUrl);
    }

    // If the user is logged in and the route is protected, let them view
    if (userId && !isPublicRoute(req)) {
        return NextResponse.next();
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