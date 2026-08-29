import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  }
);

export const JobModel = model("job", jobSchema);