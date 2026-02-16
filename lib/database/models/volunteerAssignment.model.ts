import { Schema, model, models } from "mongoose";

const JourneyLogSchema = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
}, { _id: true });

const VolunteerAssignmentSchema = new Schema({
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    volunteerId: { type: String, required: true }, // clerkId of volunteer
    status: {
        type: String,
        required: true,
        enum: ["pending", "in_progress", "completed", "cancelled"],
        default: "pending",
    },
    assignedAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date, required: false },
    hoursSpent: { type: Number, required: false },
    journeyLogs: { type: [JourneyLogSchema], required: false, default: [] },
}, {
    timestamps: true
});

const VolunteerAssignment = models.VolunteerAssignment || model("VolunteerAssignment", VolunteerAssignmentSchema);

export default VolunteerAssignment;
