import express from "express";
import { jobRouter } from "./routes/jobApi.js";

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Portal is running");
});

// Attach Job API routes after /api
app.use("/api", jobRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});