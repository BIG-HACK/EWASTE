# Cloudinary setup

Cloudinary is used for image uploads (listing photos and, later, journey pickup photos). Follow these steps to set it up.

---

## 1. Create an account

1. Go to [https://cloudinary.com](https://cloudinary.com).
2. Click **Sign up for free**.
3. Complete signup (email and password, or use Google/GitHub if offered).

---

## 2. Get your Cloud name

1. After login you’re on the **Dashboard**.
2. In the **Dashboard** section you’ll see:
   - **Cloud name** (e.g. `dxxxxxx`)
   - **API Key**
   - **API Secret**
3. Copy your **Cloud name**. You’ll put it in `.env` as `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.

You do **not** need to put the API Secret in the front end. The app uses **unsigned** uploads from the browser, so only the Cloud name and an Upload preset are needed in the client.

---

## 3. Create an unsigned Upload preset

Unsigned presets let the browser upload directly to Cloudinary without your API secret.

1. In the Cloudinary dashboard, open **Settings** (gear icon).
2. Go to the **Upload** tab.
3. Scroll to **Upload presets**.
4. Click **Add upload preset**.
5. Set:
   - **Preset name**: e.g. `ewaste_unsigned` (you’ll use this in `.env`).
   - **Signing Mode**: **Unsigned** (this is required for client-side uploads).
6. Optionally set **Folder** (e.g. `ewaste-listings`) so uploads go into a folder.
7. Click **Save**.

Copy the preset name (e.g. `ewaste_unsigned`) and add it to `.env` as `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

---

## 4. Add variables to your env file

In your project root, open **`.env`** or **`.env.local`** and set:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name_here
```

Replace with your actual Cloud name and Upload preset name. Both must start with `NEXT_PUBLIC_` so the upload widget in the browser can use them.

Restart the dev server after changing env vars.

---

## 5. Check that it works

1. Run the app and sign in as a donor.
2. Go to **Create Listing**.
3. Click the photo upload area; the Cloudinary widget should open.
4. Upload an image; after success, the image URL should appear in the form.

If the widget doesn’t open or you see “Cloudinary is not configured”, double-check the two env vars and that the preset is **Unsigned**.

---

## Summary

| Variable                               | Where to get it                                                    |
| -------------------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | Dashboard → Cloud name                                             |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Settings → Upload → Upload presets → your **unsigned** preset name |

No credit card is required for the free tier.
