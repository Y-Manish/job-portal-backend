import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

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
        values: ["JOB_SEEKER", "EMPLOYER", "ADMIN"],
        message: "Role must be JOB_SEEKER, EMPLOYER or ADMIN",
      },
      default: "JOB_SEEKER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    education: [
      {
        institution: {
          type: String,
          trim: true,
        },

        degree: {
          type: String,
          trim: true,
        },

        field: {
          type: String,
          trim: true,
        },

        year: {
          type: Number,
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

export const UserModel = model("user", userSchema);