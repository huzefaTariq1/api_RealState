const mongoose=require("mongoose")

const chatModel=mongoose.Schema({
    chatName:{
        type:String
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message"
    }
},
{
    timestamps: true
}
)


module.exports=mongoose.model('chat',chatModel)