import express from "express";

import { UserModel } from "../models/Usermodel.js";
import { JobModel } from "../models/Jobmodel.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

export const adminRouter = express.Router();

adminRouter.get(
  "/admin/users",
  authenticateUser,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const users = await UserModel.find().select("-password");

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

adminRouter.get(
  "/admin/users/:userId",
  authenticateUser,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User fetched successfully",
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

adminRouter.patch(
  "/admin/users/:userId/status",
  authenticateUser,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["ACTIVE", "BLOCKED"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be ACTIVE or BLOCKED",
        });
      }

      const user = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { status },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User status updated successfully",
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

adminRouter.delete(
  "/admin/users/:userId",
  authenticateUser,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

adminRouter.get(
  "/admin/jobs",
  authenticateUser,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const jobs = await JobModel.find().populate(
        "employer",
        "name email role"
      );

      res.status(200).json({
        success: true,
        message: "Jobs fetched successfully",
        data: jobs,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

adminRouter.get(
  "/admin/jobs/:jobId",
  authenticateUser,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const job = await JobModel.findById(req.params.jobId).populate(
        "employer",
        "name email role"
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Job fetched successfully",
        data: job,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

adminRouter.delete(
  "/admin/jobs/:jobId",
  authenticateUser,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const job = await JobModel.findByIdAndDelete(req.params.jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Job removed successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);