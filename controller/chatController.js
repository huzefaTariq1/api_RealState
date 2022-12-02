const Chat=require("../model/ChatModel")
const User=require("../model/UserModel")

const acccessChat=async(req,res)=>{
try {
    const {userID}=req.body

    if (!userID){
        return res.status(400).send("UserId param not sent with request")
    }

    let isChat=await Chat.find({
        $and:[
            {users:{$elemMatch:{$eq:req.user.id}}},
            {users:{$elemMatch:{$eq:userID}}}
        ]
    }).populate("users","-password").populate("latestMessage")


    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name",
      });

      if (isChat.length > 0){
        res.send(isChat[0]);
      }else{

        var chatData = {
            chatName: "sender",
            users: [req.user.id, userID],
          };

          const createdChat = await Chat.create(chatData);
          const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
          );
          res.status(200).json(FullChat);

      }
      

} catch (error) {
    if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "No user found for this Id" })
    }
    res.status(500).send("server error")
    console.log(error.message)
}
}








// controller function for fetching all chats
const fetchChat=async(req,res)=>{
try {
   let fetch=await Chat.find({users:{$elemMatch:{$eq:req.user.id}}})
   .populate("users", "-password")
   .populate("latestMessage")
   .sort({ updatedAt: -1 })

   fetch = await User.populate(fetch, {
    path: "latestMessage.sender",
    select: "firstname",
  });
   res.send(fetch)
} catch (error) {
  if (error.kind === "ObjectId") {
    return res.status(404).json({ msg: "No user found for this Id" })
}
res.status(500).send("server error")
console.log(error.message)
}
}

module.exports = {
   acccessChat,
   fetchChat
}

