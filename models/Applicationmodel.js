import { Schema, model } from "mongoose";

const applicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },

    applicant: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

applicationSchema.index(
  { job: 1, applicant: 1 },
  { unique: true }
);

export const ApplicationModel = model(
  "application",
  applicationSchema
);