import { Schema, model, models } from "mongoose";

const StudentTodoSchema = new Schema(
  {
    studentClerkId: { type: String, required: true },

    title: { type: String, required: true },
    description: { type: String, required: false },

    type: {
      type: String,
      enum: ["pickup", "training", "general", "follow_up"],
      default: "general",
    },

    // link to a listing or journey when type is pickup
    relatedListingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: false,
    },
    relatedJourneyId: {
      type: Schema.Types.ObjectId,
      ref: "Journey",
      required: false,
    },

    dueDate: { type: Date, required: false },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, required: false },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true },
);

StudentTodoSchema.index({ studentClerkId: 1, completed: 1, dueDate: 1 });

const StudentTodo =
  models.StudentTodo || model("StudentTodo", StudentTodoSchema);

export default StudentTodo;
