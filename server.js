const express =require("express");
const mongoose=require("mongoose");
const authRoutes=require("./routes/authRoutes");
const todoRoutes=require("./routes/todoRoutes");
const app= express();
app.use(express.json());
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/task7DB")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((error)=>{
    console.log("MongoDB Error",error);
});
app.use("/api/auth",authRoutes);
app.use("/api/todos",todoRoutes);

app.get("/",(req,res)=>{
    res.send("Server is running");
});
app.listen(5000,()=>{
    console.log("Server Running");
})