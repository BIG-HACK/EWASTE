import { Schema, model, models } from "mongoose";

const JourneySchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    studentClerkId: { type: String, required: true },

    status: {
      type: String,
      enum: [
        "not_started",
        "outbound",
        "at_donor",
        "return",
        "completed",
        "cancelled",
      ],
      default: "not_started",
    },

    // outbound: student address -> donor address
    startedAt: { type: Date, required: false },
    pickupConfirmedAt: { type: Date, required: false },
    returnStartedAt: { type: Date, required: false },
    endedAt: { type: Date, required: false },

    // optional: store coordinates for log/audit
    startLocation: { type: { lat: Number, lng: Number }, required: false },
    pickupLocation: { type: { lat: Number, lng: Number }, required: false },
    endLocation: { type: { lat: Number, lng: Number }, required: false },

    // proof of pickup (and optionally at end)
    photoUrls: [{ type: String }],

    // panic
    panicPressedAt: { type: Date, required: false },
    panicLocation: { type: { lat: Number, lng: Number }, required: false },

    // volunteer notes at end of journey (optional)
    volunteerNotes: { type: String, required: false },
  },
  { timestamps: true },
);

// index for listing student journeys
JourneySchema.index({ studentClerkId: 1, createdAt: -1 });
JourneySchema.index({ listingId: 1 });

const Journey = models.Journey || model("Journey", JourneySchema);

export default Journey;
