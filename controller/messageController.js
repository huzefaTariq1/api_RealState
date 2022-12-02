
const Chat=require("../model/ChatModel")
const Message=require("../model/MessageModel")
const User=require("../model/UserModel")

// controller function for sending messages
const sendMessage=async(req,res)=>{
    const {content,chatId}=req.body
    if (!content || !chatId){
        res.status(400).json({msg:"Invalid data passed"})
    }
   
    var newMessage = {
        sender: req.user.id,
        content: content,
        chat: chatId,
      };

      try {
        
         // cretaing chat
        let message= await Message.create(newMessage)
        //populate sender with sender name and avatar
        message = await message.populate("sender", "firstname avatar")
            //populate chat with message
        message = await message.populate("chat")
        //populate user with message
        message = await User.populate(message, {
          path: "chat.users",
          select: "firstname avatar email",
        });
        

        // updating latest message to last send message
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
        
      } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).send("server error")
        console.log(error.message)
      }
}

// controller function for getting all messages of chat
const allMessages=async(req,res)=>{
    try {
        const messages = await Message.find({ chat: req.params.id })
        .populate("sender", "firstname avatar email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).send("server error")
        console.log(error.message)
    }
}


module.exports = {
    sendMessage,
    allMessages
 }