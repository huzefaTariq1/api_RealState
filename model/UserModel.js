const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  type: {
    type: String,

  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  wallet: {
    type: String,
    default: 0
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String
  },
  avatar: {
    type: String,
    default:"https://i.ibb.co/8cpwKjy/default-img.jpg"
  },
  cloudinary_id: {
    type: String,
  },
  isVerified:{
    type:Boolean,
    default:false
  }
},
  {
    timestamps: true
  },
);

module.exports = mongoose.model("user", userSchema);