import { Schema, model, models } from "mongoose";

const OrganisationProfileSchema = new Schema({
    // USER INFO
    clerkId: { type: String, required: true, unique: false },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String, required: true },
    needs: { type: [String], required: false },
    tags: { type: [String], required: false },
}, {
    timestamps: true
});

const OrganisationProfile = models.OrganisationProfile || model("OrganisationProfile", OrganisationProfileSchema);

export default OrganisationProfile;
