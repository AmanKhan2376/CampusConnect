import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Internship", "Competition", "Workshop", "Event", "Hackathon"],
      required: true,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    deadline: {
      type: Date,
      required: true,
      index: true,
    },
    eventDate: {
      type: Date,
    },
    eligibility: [
      {
        type: String,
      },
    ],
    skills: [{ type: String, lowercase: true }],
    tags: [{ type: String, lowercase: true }],
    description: {
      type: String,
      maxLength: 1000,
    },
    applyLink: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: String,
      required: true,
    },
    coordinators: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        contact: {
          type: String,
          required: true,
        },
      },
    ],
    location: {
      type: String,
      trim: true,
    },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;
