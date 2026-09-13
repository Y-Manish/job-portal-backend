import express from "express";

import { JobModel } from "../models/Jobmodel.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

export const jobRouter = express.Router();

jobRouter.post(
  "/jobs",
  authenticateUser,
  authorizeRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const newJob = await JobModel.create({
        ...req.body,
        employer: req.user.userId,
      });

      res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: newJob,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

jobRouter.get("/jobs", async (req, res) => {
  try {
    const jobs = await JobModel.find();

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
});

jobRouter.get(
  "/jobs/my-jobs",
  authenticateUser,
  authorizeRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const jobs = await JobModel.find({
        employer: req.user.userId,
      });

      res.status(200).json({
        success: true,
        message: "Your jobs fetched successfully",
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

jobRouter.get("/jobs/:jobId", async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.jobId);

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
});

jobRouter.patch(
  "/jobs/:jobId",
  authenticateUser,
  authorizeRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const job = await JobModel.findById(req.params.jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      if (job.employer.toString() !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can update only your own jobs",
        });
      }

      delete req.body.employer;

      const updatedJob = await JobModel.findByIdAndUpdate(
        req.params.jobId,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: updatedJob,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

jobRouter.delete(
  "/jobs/:jobId",
  authenticateUser,
  authorizeRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const job = await JobModel.findById(req.params.jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      if (job.employer.toString() !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can delete only your own jobs",
        });
      }

      await JobModel.findByIdAndDelete(req.params.jobId);

      res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);