import { Schema, model, models } from "mongoose";

const StudentProfileSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },

    // primary address used as start/end for all journeys (student's home)
    address: { type: String, required: true },

    // contact and safety
    phone: { type: String, required: false },
    emergencyContactName: { type: String, required: false },
    emergencyContactPhone: { type: String, required: false },

    // optional: when they're available for pickups
    availabilityNotes: { type: String, required: false },
    // e.g. { monday: ["09:00-12:00"], tuesday: [] } - optional structured availability
    availabilitySlots: { type: Schema.Types.Mixed, required: false },

    // optional preferences for matching
    maxDistanceKm: { type: Number, required: false },
    transportMode: {
      type: String,
      enum: ["walk", "bike", "car", "public"],
      required: false,
    },

    // computed/cached stats (updated when journeys complete) - optional
    totalJourneysCompleted: { type: Number, default: 0 },
    lastJourneyCompletedAt: { type: Date, required: false },
  },
  { timestamps: true },
);

// journeys are stored in the Journey collection (query by studentClerkId)
// to-dos are stored in the StudentTodo collection (query by studentClerkId)

const StudentProfile =
  models.StudentProfile || model("StudentProfile", StudentProfileSchema);

export default StudentProfile;
