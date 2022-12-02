const router = require("express").Router();
const auth=require("../middleware/authMiddleware")
const { sendMessage, allMessages }=require("../controller/messageController")

// @route     /api/message
// @desc      sending one to one message
// access     private
router.post("/",auth,sendMessage)

// @route     /api/message/id
// @desc      fetching all chat messages
// access     private
router.get("/:id",auth,allMessages)

module.exports = router;