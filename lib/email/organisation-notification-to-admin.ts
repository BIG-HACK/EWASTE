import { sendMail, escapeHtml, isNodemailerConfigured } from "./nodemailer";

// Inbox that receives "New organisation registration" so you can click to approve. Defaults to same as volunteer inbox.
const ADMIN_EMAIL =
    process.env.ORGANISATION_NOTIFICATION_EMAIL ||
    process.env.VOLUNTEER_NOTIFICATION_EMAIL ||
    "secondspark.tech@gmail.com";

type OrganisationRegistrationData = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    productTypes: string[];
    aboutOrg: string;
    identificationTag?: string;
    submittedAt: string;
};

export async function sendOrganisationRegistrationNotificationToAdmin(
    registration: OrganisationRegistrationData
) {
    if (!isNodemailerConfigured()) {
        console.warn("[Nodemailer] SMTP not configured; skipping organisation notification to admin.");
        return;
    }

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.VERCEL_URL ||
        "http://localhost:3000";
    const base = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
    const token = process.env.APPROVE_ORGANISATION_SECRET;
    const approveLink = token
        ? `${base}/api/organisation/approve?token=${encodeURIComponent(token)}&id=${encodeURIComponent(registration._id)}`
        : `${base}/api/organisation/approve?id=${encodeURIComponent(registration._id)}`;

    const productList = registration.productTypes?.length
        ? registration.productTypes.map((p) => escapeHtml(p)).join(", ")
        : "—";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #4f46e5; font-size: 1.5rem;">New organisation registration</h1>
  <p>An organisation has registered on SecondSpark. Review their details below.</p>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(registration.name)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(registration.email)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(registration.phone)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Product types they want</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${productList}</td></tr>
    ${registration.identificationTag ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Identification tag</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(registration.identificationTag)}</td></tr>` : ""}
  </table>
  <p style="margin-top: 12px;"><strong>About the organisation:</strong></p>
  <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 8px;">${escapeHtml(registration.aboutOrg)}</p>

  <p style="margin-top: 24px;">To confirm this organisation so they can set up their profile and browse listings, click the button below:</p>
  <p style="margin: 20px 0;">
    <a href="${approveLink}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Approve organisation</a>
  </p>
  <p style="font-size: 0.875rem; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="font-size: 0.875rem; word-break: break-all;">${approveLink}</p>

  <p style="margin-top: 32px; font-size: 0.875rem; color: #666;">— SecondSpark</p>
</body>
</html>
`.trim();

    console.log("[Nodemailer] Sending organisation notification to", ADMIN_EMAIL, "for", registration.name);

    await sendMail({
        to: ADMIN_EMAIL,
        subject: `New organisation registration: ${registration.name}`,
        html,
    });
}
