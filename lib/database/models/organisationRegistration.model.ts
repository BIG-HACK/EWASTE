import { Schema, model, models } from "mongoose";

const OrganisationRegistrationSchema = new Schema(
    {
        clerkId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        productTypes: { type: [String], required: true }, // what types of products they're looking for
        aboutOrg: { type: String, required: true },
        identificationTag: { type: String, required: false }, // optional tag/number for verification
        status: {
            type: String,
            enum: ["pending", "confirmed", "rejected"],
            default: "pending",
        },
        submittedAt: { type: Date, default: Date.now },
        confirmedAt: { type: Date, required: false },
    },
    { timestamps: true }
);

const OrganisationRegistration =
    models.OrganisationRegistration ||
    model("OrganisationRegistration", OrganisationRegistrationSchema);

export default OrganisationRegistration;
