const mongoose=require("mongoose")

const serviceProviderSchema=new mongoose.Schema({
type:{
    type:String
},
firstname:{
    type:String
},
lastname:{
    type:String
},
phoneNumber:{
    type:String
},
email:{
    type:String
},
password:{
    type:String
},
confirmPassword:{
    type:String
}
},
{
    timestamps:true
})


module.exports = mongoose.model("serviceprovider", serviceProviderSchema);