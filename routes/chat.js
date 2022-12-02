const router = require("express").Router();
const auth=require("../middleware/authMiddleware")

const { acccessChat, fetchChat }=require("../controller/chatController")


// @route     /api/chat
// @desc      creating chat between two users (loged in user and other user)
// access     private
router.post("/",auth,acccessChat)

// @route     /api/chat
// @desc      fetching all chats of loged in user
// access     private
router.get("/",auth,fetchChat)

module.exports = router;