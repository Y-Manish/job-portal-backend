import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/Usermodel.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

export const userRouter = express.Router();

userRouter.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const newUser = await UserModel.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

userRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

userRouter.get(
  "/protected",
  authenticateUser,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Protected route accessed successfully",
      user: req.user,
    });
  }
);

userRouter.get(
  "/employer-only",
  authenticateUser,
  authorizeRoles("EMPLOYER"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Employer route accessed successfully",
    });
  }
);

userRouter.get(
  "/profile",
  authenticateUser,
  async (req, res) => {
    try {
      const user = await UserModel.findById(
        req.user.userId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

userRouter.patch(
  "/profile",
  authenticateUser,
  authorizeRoles("JOB_SEEKER"),
  async (req, res) => {
    try {
      const allowedFields = [
        "name",
        "skills",
        "experience",
        "education",
      ];

      const updates = {};

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.user.userId,
        updates,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);