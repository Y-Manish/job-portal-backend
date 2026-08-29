import express from "express";
import mongoose from "mongoose";
import { jobRouter } from "./routes/jobApi.js";

const app = express();
const PORT = 4000;
mongoose.connect("mongodb://localhost:27017/job_portal_db").then(()=>{
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
  console.log("MongoDB connection failed");
  console.log(error.message);
  });

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Portal is running");
});

// Attach Job API routes after /api
app.use("/api", jobRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});