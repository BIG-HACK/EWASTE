import { Schema, model, models } from "mongoose";

const ListingSchema = new Schema({
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
    assignedVolunteerId: { type: String, required: false },
    category: { type: String, required: false }, // e.g. Laptops, Monitors, Phones & Tablets
    yearsUsed: { type: Number, required: false }, // how many years the item was used
}, {
    timestamps: true
});

const Listing = models.Listing || model("Listing", ListingSchema);

export default Listing;
