import express from "express"

const app = express()
const PORT = 4000
app.use(express.json())//middleware to convert that JSON into req.body

app.get("/",(req,res)=>{
    res.send("Job Portal is running");
});

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Hyderabad",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Code Labs",
    location: "Bengaluru",
  },
];

//For getting all the jobs
app.get("/api/jobs",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Job portal backend is working",
        data:jobs
    })
})

//Get the job by id
app.get("/api/jobs/:id",(req,res)=>{
    const jobId = Number(req.params.id)
    const job = jobs.find((eachjob)=> eachjob.id === jobId);
    if(job===undefined)
    {
        return res.status(404).json({
            success:false,
            message:"Job not found"
        })
    }
    //else:
    res.status(200).json({
        success:true,
        message:"Job fetched successfully",
        data:job,
    });
});

//Add new Job 
app.post("/api/jobs",(req,res)=>{
    const newJob = req.body
      // Validate required fields
  if (!newJob.title || !newJob.company || !newJob.location) {
    return res.status(400).json({
      success: false,
      message: "Title, company and location are required",
    });
  }
  //Generate new id
  newJob.id =  jobs.length+1

  //Add new job to the array
  jobs.push(newJob)
    // Send response
  res.status(201).json({
    success: true,
    message: "Job created successfully",
    data: newJob,
  });
})

//Update job by id
app.patch("/api/jobs/:id", (req, res) => {
  // Read ID from URL
  const jobId = Number(req.params.id);

  // Find the job position
  const jobIndex = jobs.findIndex((eachJob) => eachJob.id === jobId);

  // Check whether the job exists
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  // Update the existing job with the fields sent by the client
  jobs[jobIndex] = {
    ...jobs[jobIndex],
    ...req.body,
    id: jobId,
  };

  res.status(200).json({
    success: true,
    message: "Job updated successfully",
    data: jobs[jobIndex],
  });
});

app.delete("/api/jobs/:id", (req, res) => {
  // Read ID from URL
  const jobId = Number(req.params.id);

  // Find the job position
  const jobIndex = jobs.findIndex((eachJob) => eachJob.id === jobId);

  // Check whether the job exists
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  // Remove one job from the array
  const deletedJob = jobs.splice(jobIndex, 1);

  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
    data: deletedJob[0],
  });
});

app.listen(PORT,()=>{
    console.log(`Server is running at the port ${PORT}`)
})

