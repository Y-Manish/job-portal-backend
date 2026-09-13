import express from "express";

import { ApplicationModel } from "../models/Applicationmodel.js";
import { JobModel } from "../models/Jobmodel.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

export const applicationRouter = express.Router();

applicationRouter.post(
  "/jobs/:jobId/apply",
  authenticateUser,
  authorizeRoles("JOB_SEEKER"),
  async (req, res) => {
    try {
      const job = await JobModel.findById(req.params.jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      if (job.status !== "OPEN") {
        return res.status(400).json({
          success: false,
          message: "Applications are closed for this job",
        });
      }

      if (new Date(job.applicationDeadline) < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Application deadline has passed",
        });
      }

      const existingApplication = await ApplicationModel.findOne({
        job: req.params.jobId,
        applicant: req.user.userId,
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this job",
        });
      }

      const application = await ApplicationModel.create({
        job: req.params.jobId,
        applicant: req.user.userId,
      });

      res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

applicationRouter.get(
  "/applications/my-applications",
  authenticateUser,
  authorizeRoles("JOB_SEEKER"),
  async (req, res) => {
    try {
      const applications = await ApplicationModel.find({
        applicant: req.user.userId,
      })
        .populate(
          "job",
          "title companyName location employmentType salaryRange status applicationDeadline"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: "Your applications fetched successfully",
        data: applications,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

applicationRouter.get(
  "/jobs/:jobId/applications",
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
          message: "You can view applications only for your own jobs",
        });
      }

      const applications = await ApplicationModel.find({
        job: req.params.jobId,
      })
        .populate("applicant", "name email role")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: "Applications fetched successfully",
        data: applications,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

applicationRouter.patch(
  "/applications/:applicationId/status",
  authenticateUser,
  authorizeRoles("EMPLOYER"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Status must be PENDING, ACCEPTED or REJECTED",
        });
      }

      const application = await ApplicationModel.findById(
        req.params.applicationId
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      const job = await JobModel.findById(application.job);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      if (job.employer.toString() !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message:
            "You can update applications only for your own jobs",
        });
      }

      application.status = status;

      await application.save();

      res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);