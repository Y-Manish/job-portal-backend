import express from "express";
import { JobModel } from "../models/Jobmodel.js";

export const jobRouter = express.Router();

jobRouter.post("/jobs", async (req, res) => {
  try {
    const newJob = await JobModel.create(req.body);

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
});

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

jobRouter.get("/jobs/:jobId",async (req,res)=>{
  try{
    const job = await JobModel.findById(req.params.jobId)
    if(job===null)
    {
      return res.status(404).json({
        success:false,
        message:"Job not found"
      })
    }
    res.status(200).json({
      success:true,
      message:"job fetched successfully",
      data:job
    })
  }catch(error){
    res.status(400).json({
      success:false,
      message:error.message
    })
  }
})

jobRouter.patch("/jobs/:jobId",async(req,res)=>{
  try{
    const updatedJob = await JobModel.findByIdAndUpdate(
      req.params.jobId,
      req.body,
      {
        new:true, //Returns the modified document instead of the original one
        runValidators:true, // To validate the updated data with schema 
      }
    )
        if (updatedJob === null) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

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
})

jobRouter.delete("/jobs/:jobId", async (req, res) => {
  try {
    const deletedJob = await JobModel.findByIdAndDelete(req.params.jobId);

    if (deletedJob === null) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: deletedJob,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});