import { sendMail, escapeHtml, isNodemailerConfigured } from "./nodemailer";

/**
 * Sends an email to the organisation saying we will confirm their identity in 3 days.
 * Uses the same Nodemailer SMTP config as volunteer emails (see lib/email/nodemailer.ts).
 */
export async function sendOrganisationConfirmationEmail(toEmail: string, orgName: string) {
    if (!isNodemailerConfigured()) {
        console.warn("[Nodemailer] SMTP not configured; skipping organisation confirmation email.");
        return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #4f46e5; font-size: 1.5rem;">Thank you for registering</h1>
  <p>Hi ${escapeHtml(orgName)},</p>
  <p>We have received your organisation registration. Our team will <strong>confirm your identity within 3 business days</strong> after a manual review.</p>
  <p>Once verified, we’ll send you a follow-up email and you’ll be able to set up your organisation profile and browse available e-waste listings.</p>
  <p style="margin-top: 32px; font-size: 0.875rem; color: #666;">— SecondSpark</p>
</body>
</html>
`.trim();

    await sendMail({
        to: toEmail,
        subject: "We’ll confirm your identity in 3 days – SecondSpark",
        html,
    });
    console.log("[Nodemailer] Organisation confirmation email sent to", toEmail);
}

