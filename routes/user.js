const router = require("express").Router();
const upload = require("../utils/multer");
const { createUser,loginUser,getMe,updateUser,forgetPassword,passwordReset,saveVerifiedEmail,searchUser } = require("../controller/UserController")
const auth=require("../middleware/authMiddleware")

// @route     /api/user
// @desc       creating user
// access     public
router.post("/",upload.single("img"), createUser)

// @route     /api/user/login
// @desc      getting login user token for auth 
// access     public
router.post("/login",loginUser);

// @route     /api/user/me
// @desc      geting loged in user profile data  
// access     private
router.get("/me",auth,getMe);

// @route     /api/user/:id
// @desc      updating user profile 
// access     private
router.put("/:id",upload.single("img"),auth,updateUser);


// @route     /api/user/forget-password
// @desc      sending a link to email to reset password
// access     public
router.post("/forget-password",forgetPassword);


// @route     /api/user/forget-password/:id/:token
// @desc      unique link which resests passwords
// access     public
router.post("/forget-password/:id/:token", passwordReset);



router.get("/verify/:token",saveVerifiedEmail);



// @route     /api/user
// @desc      search all user
// access     private
router.get("/",auth,searchUser)



module.exports = router;