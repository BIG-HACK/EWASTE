import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import OrganisationRegistration from "@/lib/database/models/organisationRegistration.model";

// Set APPROVE_ORGANISATION_SECRET in .env.local; use the same link pattern as volunteer approve.
const APPROVE_SECRET = process.env.APPROVE_ORGANISATION_SECRET;

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const id = searchParams.get("id");

    if (!id) {
        return new NextResponse(
            "<!DOCTYPE html><html><body><h1>Missing organisation ID</h1><p>Invalid link.</p></body></html>",
            { status: 400, headers: { "Content-Type": "text/html" } }
        );
    }

    if (!APPROVE_SECRET || token !== APPROVE_SECRET) {
        return new NextResponse(
            "<!DOCTYPE html><html><body><h1>Invalid or expired link</h1><p>This approval link is invalid or has expired.</p></body></html>",
            { status: 403, headers: { "Content-Type": "text/html" } }
        );
    }

    try {
        await connectToDatabase();
        const registration = await OrganisationRegistration.findById(id);

        if (!registration) {
            return new NextResponse(
                "<!DOCTYPE html><html><body><h1>Registration not found</h1><p>This application may have been removed.</p></body></html>",
                { status: 404, headers: { "Content-Type": "text/html" } }
            );
        }

        if (registration.status === "confirmed") {
            return new NextResponse(
                `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; max-width: 480px; margin: 48px auto; padding: 24px; text-align: center;">
  <h1 style="color: #4f46e5;">Already confirmed</h1>
  <p>${escapeHtml(registration.name)} is already a confirmed organisation.</p>
</body></html>`,
                { status: 200, headers: { "Content-Type": "text/html" } }
            );
        }

        registration.status = "confirmed";
        registration.confirmedAt = new Date();
        await registration.save();

        return new NextResponse(
            `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; max-width: 480px; margin: 48px auto; padding: 24px; text-align: center;">
  <h1 style="color: #4f46e5;">Organisation confirmed</h1>
  <p><strong>${escapeHtml(registration.name)}</strong> has been confirmed. They can now sign in and set up their organisation profile to browse e-waste listings.</p>
</body></html>`,
            { status: 200, headers: { "Content-Type": "text/html" } }
        );
    } catch (error) {
        console.error("Error approving organisation:", error);
        return new NextResponse(
            "<!DOCTYPE html><html><body><h1>Something went wrong</h1><p>Please try again later.</p></body></html>",
            { status: 500, headers: { "Content-Type": "text/html" } }
        );
    }
}
