import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { jobRouter } from "./routes/jobApi.js";
import { userRouter } from "./routes/userApi.js";

dotenv.config();

const app = express();
const PORT = 4000;

mongoose
  .connect("mongodb://localhost:27017/job_portal_db")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed");
    console.log(error.message);
  });

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Job Portal is running");
});

app.use("/api", jobRouter);
app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});