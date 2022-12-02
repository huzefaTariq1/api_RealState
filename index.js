const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv").config();
const userRoute=require("./routes/user");
const propertyRoute=require("./routes/property")
const chatRoute=require("./routes/chat")
const messageRoute=require("./routes/message")
var cors = require('cors')

// Connect DB
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

// Middleware
// app.use(express.json())
// app.use(express.urlencoded({extended:false}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

// Route
app.use("/api/user", userRoute);
app.use("/api/property",propertyRoute);
app.use("/api/chat",chatRoute);
app.use("/api/message",messageRoute);



port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`server is running on port to ${port} finally`)
})


