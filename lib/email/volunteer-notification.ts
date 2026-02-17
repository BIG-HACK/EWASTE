import { sendMail, escapeHtml, isNodemailerConfigured } from "./nodemailer";

const COMPANY_EMAIL = process.env.VOLUNTEER_NOTIFICATION_EMAIL ?? "secondspark.tech@gmail.com";

type VolunteerData = {
    _id: string;
    name: string;
    age: number;
    email: string;
    phone: string;
    wantMeeting: boolean;
    availability?: string;
    appliedAt: string;
};

export async function sendVolunteerApplicationNotification(volunteer: VolunteerData) {
    if (!isNodemailerConfigured()) {
        console.warn("[Nodemailer] SMTP not configured; skipping volunteer notification email");
        return;
    }

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.VERCEL_URL ||
        "http://localhost:3000";
    const base = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
    const token = process.env.APPROVE_VOLUNTEER_SECRET;
    const approveLink = token
        ? `${base}/api/volunteer/approve?token=${encodeURIComponent(token)}&id=${encodeURIComponent(volunteer._id)}`
        : `${base}/api/volunteer/approve?id=${encodeURIComponent(volunteer._id)}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #059669; font-size: 1.5rem;">New volunteer application</h1>
  <p>Someone has applied to become a volunteer on SecondSpark. Review their details below.</p>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(volunteer.name)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Age</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${volunteer.age}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(volunteer.email)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(volunteer.phone)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Wants a meeting</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${volunteer.wantMeeting ? "Yes" : "No"}</td></tr>
    ${volunteer.availability ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Availability</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(volunteer.availability)}</td></tr>` : ""}
  </table>

  <p style="margin-top: 24px;">To approve this volunteer so they can start picking up e-waste, click the button below:</p>
  <p style="margin: 20px 0;">
    <a href="${approveLink}" style="display: inline-block; background: #059669; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Approve volunteer</a>
  </p>
  <p style="font-size: 0.875rem; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="font-size: 0.875rem; word-break: break-all;">${approveLink}</p>

  <p style="margin-top: 32px; font-size: 0.875rem; color: #666;">— SecondSpark</p>
</body>
</html>
`.trim();

    console.log("[Nodemailer] Sending volunteer notification to", COMPANY_EMAIL, "for", volunteer.name);

    await sendMail({
        to: COMPANY_EMAIL,
        subject: `New volunteer application: ${volunteer.name}`,
        html,
    });
}
