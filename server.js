import express from "express"

const app = express()
const PORT = 4000

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

//Get the user by id
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


app.listen(PORT,()=>{
    console.log(`Server is running at the port ${PORT}`)
})

