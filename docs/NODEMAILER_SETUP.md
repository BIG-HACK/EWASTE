# Nodemailer setup

Volunteer verification and organisation confirmation emails are sent with **Nodemailer** using SMTP. Add these variables to `.env.local`.

## Required variables

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Optional:

```env
SMTP_FROM=SecondSpark <your-email@gmail.com>
```

If `SMTP_FROM` is not set, the “From” address defaults to `SMTP_USER`.

---

## Gmail

1. Turn on **2-Step Verification** for your Google account (Security → 2-Step Verification).
2. Create an **App Password**: Google Account → Security → 2-Step Verification → App passwords. Choose “Mail” and your device, then copy the 16-character password.
3. In `.env.local`:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```

   Use the app password (spaces optional).

---

## Other providers

| Provider   | SMTP_HOST           | SMTP_PORT |
|-----------|---------------------|-----------|
| Outlook   | smtp.office365.com  | 587       |
| Yahoo     | smtp.mail.yahoo.com | 587       |
| SendGrid  | smtp.sendgrid.net   | 587       |

- **SendGrid:** set `SMTP_USER=apikey` and `SMTP_PASS` to your SendGrid API key.

---

## Volunteer notification (admin email)

The app sends volunteer application notifications to this address:

```env
VOLUNTEER_NOTIFICATION_EMAIL=gupta56411@gapps.uwcsea.edu.sg
```

That inbox receives “New volunteer application: [name]” with an “Approve volunteer” link. The link uses:

```env
APPROVE_VOLUNTEER_SECRET=your-secret-token
```

Keep this secret safe; it is used in the approval URL.

---

## Organisation flow

When an organisation registers:

1. **They** receive an email: “We’ll confirm your identity in 3 days” (to the address they gave).
2. **You (admin)** receive an email at the same inbox as volunteer notifications (or a separate one – see below) with their details and an **“Approve organisation”** button. Clicking it confirms them so they can set up their profile and browse listings.

To approve organisations you need in `.env.local`:

```env
APPROVE_ORGANISATION_SECRET=your-secret-token
```

By default, the “New organisation registration” email goes to the same address as `VOLUNTEER_NOTIFICATION_EMAIL`. To use a different inbox for organisation approvals:

```env
ORGANISATION_NOTIFICATION_EMAIL=secondspark.tech@gmail.com
```

---

## Testing

If SMTP is not configured, the app logs a warning and skips sending; it does not throw. To test:

1. Set the four SMTP variables in `.env.local`.
2. Submit a volunteer application or an organisation registration.
3. Check the configured inbox (and spam) for the email.
