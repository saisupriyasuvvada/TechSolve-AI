require("dotenv").config();
console.log(process.env.GEMINI_API_KEY);

const express=require('express');
const cors=require('cors');

const videoRoutes = require("./routes/videoRoutes");
const reelRoutes = require("./routes/reelRoutes");
const queryRoutes = require("./routes/queryRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const engagementRoutes = require("./routes/engagementRoutes");
const compareRoutes = require("./routes/compareRoutes");
// const {checkDocuments} = require("./services/chromaService");
const {
  resetCollection
} = require("./services/chromaService");

const app=express();



app.use(cors());
app.use(express.json());

app.use("/api/video", videoRoutes);
app.use("/api/reel", reelRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/analyze", analysisRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/compare", compareRoutes)
// checkDocuments();
// resetCollection();

app.get('/',(req,res)=>{
    res.json({message:'Backend is running Successfully'});
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});