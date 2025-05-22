const express=require("express");
const app=express();
const userroute=require("./routes/userRoutes")
const cookieParser = require('cookie-parser');
const userCandidate=require("./routes/userCandidate")
//require('dotenv').config();
const bodyParser=require("body-parser");
app.use(express.json());
app.use(cookieParser());
const PORT =process.env.PORT || 3000;
app.use("/profile",userroute)
app.use("/candidate",userCandidate);
app.get("/",(req,res)=>{
    res.send("sumanpandey");
})
app.listen(PORT,()=>{
    console.log("listening on port 3000");
})