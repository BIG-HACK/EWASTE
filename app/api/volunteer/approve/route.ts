import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Volunteer from "@/lib/database/models/volunteer.model";

const APPROVE_SECRET = process.env.APPROVE_VOLUNTEER_SECRET;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const id = searchParams.get("id");

    if (!id) {
        return new NextResponse(
            "<!DOCTYPE html><html><body><h1>Missing volunteer ID</h1><p>Invalid link.</p></body></html>",
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
        const volunteer = await Volunteer.findById(id);

        if (!volunteer) {
            return new NextResponse(
                "<!DOCTYPE html><html><body><h1>Volunteer not found</h1><p>This application may have been removed.</p></body></html>",
                { status: 404, headers: { "Content-Type": "text/html" } }
            );
        }

        if (volunteer.status === "approved") {
            return new NextResponse(
                `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; max-width: 480px; margin: 48px auto; padding: 24px; text-align: center;">
  <h1 style="color: #059669;">Already approved</h1>
  <p>${escapeHtml(volunteer.name)} is already an approved volunteer.</p>
</body></html>`,
                { status: 200, headers: { "Content-Type": "text/html" } }
            );
        }

        volunteer.status = "approved";
        volunteer.approvedAt = new Date();
        await volunteer.save();

        return new NextResponse(
            `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, sans-serif; max-width: 480px; margin: 48px auto; padding: 24px; text-align: center;">
  <h1 style="color: #059669;">Volunteer approved</h1>
  <p><strong>${escapeHtml(volunteer.name)}</strong> has been approved. They can now sign in to SecondSpark and start picking up e-waste listings from donors.</p>
</body></html>`,
            { status: 200, headers: { "Content-Type": "text/html" } }
        );
    } catch (error) {
        console.error("Error approving volunteer:", error);
        return new NextResponse(
            "<!DOCTYPE html><html><body><h1>Something went wrong</h1><p>Please try again later.</p></body></html>",
            { status: 500, headers: { "Content-Type": "text/html" } }
        );
    }
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
