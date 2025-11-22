import { Schema, model, models } from "mongoose";

const ListingSchema = new Schema({
    // USER INFO
    clerkId: { type: String, required: true, unique: false },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    photo: { type: String, required: true },
    needsRepair: { type: Boolean, required: true },
    notes: { type: String, required: false },
    tags: { type: [String], required: false },
    resolved: { type: Boolean, required: true, default: false },
    matchedOrganisationId: { type: String, required: false },

}, {
    timestamps: true
});

const Listing = models.Listing || model("Listing", ListingSchema);

export default Listing;
