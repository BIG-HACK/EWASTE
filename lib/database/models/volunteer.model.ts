import { Schema, model, models } from "mongoose";

const VolunteerSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    wantMeeting: { type: Boolean, required: true, default: false },
    availability: { type: String, required: false },
    status: { type: String, required: true, enum: ["pending", "approved", "rejected"], default: "pending" },
    appliedAt: { type: Date, required: true, default: Date.now },
    approvedAt: { type: Date, required: false },
}, {
    timestamps: true
});

const Volunteer = models.Volunteer || model("Volunteer", VolunteerSchema);

export default Volunteer;
