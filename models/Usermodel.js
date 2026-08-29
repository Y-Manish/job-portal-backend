import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
    },

    role: {
      type: String,
      enum: {
        values: ["JOB_SEEKER", "EMPLOYER"],
        message: "Role must be JOB_SEEKER or EMPLOYER",
      },
      default: "JOB_SEEKER",
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  }
);

export const UserModel = model("user", userSchema);