import nodemailer from "nodemailer";

/**
 * Nodemailer setup – used for volunteer verification and organisation confirmation.
 *
 * Add these to .env.local:
 *
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your-email@gmail.com
 *   SMTP_PASS=your-app-password
 *   SMTP_FROM=SecondSpark <your-email@gmail.com>   (optional; defaults to SMTP_USER)
 *
 * Gmail:
 *   - Use an App Password, not your normal password: Google Account → Security → 2-Step Verification → App passwords.
 *   - SMTP_HOST=smtp.gmail.com, SMTP_PORT=587 (TLS).
 *
 * Other providers:
 *   - Outlook: smtp.office365.com, port 587
 *   - Yahoo: smtp.mail.yahoo.com, port 587
 *   - SendGrid: smtp.sendgrid.net, port 587, user "apikey", pass = your API key
 */

function getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

export function isNodemailerConfigured(): boolean {
    return !!(
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
    );
}

export async function sendMail(options: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}): Promise<void> {
    const transporter = getTransporter();
    if (!transporter) {
        console.warn("[Nodemailer] SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local");
        return;
    }

    const from =
        options.from ||
        process.env.SMTP_FROM ||
        process.env.SMTP_USER ||
        "noreply@example.com";
    const to = Array.isArray(options.to) ? options.to : [options.to];

    await transporter.sendMail({
        from,
        to,
        subject: options.subject,
        html: options.html,
    });
    console.log("[Nodemailer] Email sent to", to.join(", "));
}

export function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
