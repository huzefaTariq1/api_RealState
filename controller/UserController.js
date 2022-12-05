const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../model/UserModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const nodemailer=require("nodemailer")


const createUser = async (req, res) => {

    const { type, firstname, lastname, phone, email, password } = req.body

    try {
         if (req.file){
            var result = await cloudinary.uploader.upload(req.file.path)

             //const result = await cloudinary.uploader.upload(req.file.path || "https://i.ibb.co/8cpwKjy/default-img.jpg")
        // check user already exist
        var user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User Already Registered At This Email" });
        }

        // creating user instance
        user = new User({
            type,
            firstname,
            lastname,
            phone,
            email,
            password,
            avatar: result.secure_url,
            cloudinary_id: result.public_id
        })
         }else{
           user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User Already Registered At This Email" });
        }
            user = new User({
                type,
                firstname,
                lastname,
                phone,
                email,
                password
            })
         }
        //const result = await cloudinary.uploader.upload(req.file.path || "https://i.ibb.co/8cpwKjy/default-img.jpg")
        // check user already exist
        // let user = await User.findOne({ email });
        // if (user) {
        //     return res.status(400).json({ msg: "User Already Registered At This Email" });
        // }

        // // creating user instance
        // user = new User({
        //     type,
        //     firstname,
        //     lastname,
        //     phone,
        //     email,
        //     password,
        //     avatar: result.secure_url,
        //     cloudinary_id: result.public_id
        // })


        // encrypt password
        const salt = await bcrypt.genSalt(10);
        //assign encrpyt password to user that will save in DB
        user.password = await bcrypt.hash(password, salt)
        //save in DB
        await user.save()



        const verifytoken = JWT.sign({ email: email }, process.env.SECRECT_TOKEN,
          
          );


          const link = `https://twidle-agent-api.herokuapp.com/api/user/verify/${verifytoken}`;








          const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });
    
          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Verify User `,
            text: `
<!doctype html>
<html lang="en-US">
<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Verify Email</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                    <img src="https://i.ibb.co/C90Dm07/tlogo.png" width="100">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Please Verify Your Emial
                                         </h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                           Click on Below Link and Verfy Your Email
                                        </p>
                                        <a href=${link}
                                            style="background:#326FFD;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email
                                            </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                   
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>
</html>`,
            html: `
<!doctype html>
<html lang="en-US">
<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Verify Email</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                   
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                    <img src="https://i.ibb.co/C90Dm07/tlogo.png" width="100">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Please Verify Your Emial
                                            </h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                        Click on Below Link and Verfy Your Email
                                        </p>
                                        <a href="${link}"
                                            style="background:#326FFD;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email
                                            </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                   
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>
</html>`,
          };







    
          transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(400).json({ messgae: "Error" });
            }
            return res.status(200).json({ messgae: "Email Sent" });
          });







        //cerating payload
        const payload = {
            user: {
                id: user.id
            }
        }

        //signing token
        JWT.sign(
            payload,
            process.env.SECRECT_TOKEN,
            { expiresIn: "24hr" },
            (err, token) => {
                if (err) throw err;
                res.json({msg:"Accounct Created Successfully"})
            }
        )


    } catch (error) {
        console.log(error)
    }
}







// controller function logging in user
const loginUser = async (req, res) => {
    const { type, email, password } = req.body
    try {
        // getting user from db check email registar or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.
                status(400)
                .json({ msg: "Invalid Credentials " });
        }

        // matching user type
        if (user.type !== type) {
            return res.status(400).json({msg:"Please Provide Your Correct Type which you registerd"})
        }

        // comaparing password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ msg: "Invalid Credentials " });
        }

        if (user.isVerified){

        //creating payload
        const payload = {
            user: {
                id: user.id
            }
        }


        let fullname = `${user.firstname} ${user.lastname}`
        // preaper an object detail which send to user
        userdetail = {
            fullname,
            type:user.type,
            email: user.email,
            avatar: user.avatar,
            id: user.id
        }

        // jwt signature
        JWT.sign(
            payload,
            process.env.SECRECT_TOKEN,
            { expiresIn: "24hr" },
            (err, token) => {
                if (err) throw err;
                res.json({ userdetail, token })
            }
        )
        }
        else {
            return res
            .status(400)
            .json({ message: "Email Verification Pending" });
        }

    } catch (error) {
        console.log(error)
    }
}




//controller function for getting current loged in user's detail
const getMe=async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.send(user)
    } catch (error) {
        res.status(500).send("server error")
        console.log(error.message)
    }
}






//controller function for edit autorized user profile
const updateUser=async(req,res)=>{
    const { type, firstname,lastname,phone,password } = req.body
    const result=await cloudinary.uploader.upload(req.file.path)  

     // geting user by id
     let user = await User.findById(req.params.id)

     if (user && user._id.toString() !== req.user.id) {
        return res.status(401)
            .json({ errors: [{ msg: "User not Authorized" }] })
    }

     // encrypt password
     const salt = await bcrypt.genSalt(10);

     let encryptedpassword = await bcrypt.hash(password, salt)

      //  // updateing 
      try {
        user = await User.findByIdAndUpdate(req.params.id, {
            type,
            firstname,
            lastname,
            phone,
            password:encryptedpassword,
            avatar:result.secure_url,
            cloudinary_id:result.public_id
        }, { new: true });
        user = await user.save();

        res.status(200).json({ user });

    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).send("server error")
        console.log(error.message)
    }
} 




// controller function for forget password
const forgetPassword=async(req,res)=>{
    const {email}=req.body

    try {

        if (!email){
            return res.status(400).json({ msg: "Email is Required" });
        }

        // checking for email existance
        let user = await User.findOne({ email });
        if (!user){
            return res.status(400).json({msg:"Invalid Email"})
        }

        // generate token
        const token=JWT.sign({userId:user._id},
            process.env.SECRECT_TOKEN,
            {expiresIn:"40m"})

        
            const link = `http://localhost:3000/api/user/forget-password/${user._id}/${token}`

    
            const transport = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD,
                },
              });
        
              const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: `Password Reset Request`,
                text: `
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                        <img src="https://i.ibb.co/C90Dm07/tlogo.png" width="100">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                requested to reset your password</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                We cannot simply send you your old password. A unique link to reset your
                                                password has been generated for you. To reset your password, click the
                                                following link and follow the instructions.
                                            </p>
                                            <a href=${link}
                                                style="background:#326FFD;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                Password</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                       
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    </html>`,
                html: `
    <!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                       
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                        <img src="https://i.ibb.co/C90Dm07/tlogo.png" width="100">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                requested to reset your password</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                We cannot simply send you your old password. A unique link to reset your
                                                password has been generated for you. To reset your password, click the
                                                following link and follow the instructions.
                                            </p>
                                            <a href="${link}"
                                                style="background:#326FFD;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                Password</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                       
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    </html>`,
              };



   



        
              transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return res.status(400).json({ messgae: "Error" });
                }
                return res.status(200).json({ messgae: "Email Sent" });
              });
        
        
    } catch (error) {
        res.status(500).send("server error")
        console.log(error.message)
    }
}

//controller function for reset password
const passwordReset=async(req,res)=>{
    const {newPassword,confirmPassword}= req.body
    const {id,token}=req.params
    //res.send({newPassword,confirmPassword,id,token})
    try {
        if (!newPassword || !confirmPassword ){
            return res.status(400).json({ msg: "All fiedls are required" });
        }

        if (newPassword!==confirmPassword){
            return res.status(400).json({msg:"Password And Confirm Password Should be Matched"})
        }
       
        // verifying wheather link is valid or expire
        const isValid= await JWT.verify(token,process.env.SECRECT_TOKEN)

        // get user by id
        const user = await User.findById(id)

      
        // encrypt password 
        const salt=await bcrypt.genSalt(10)

        let encryptedpassword = await bcrypt.hash(newPassword, salt)

        //  // updateing 

        const isSuccess = await User.findByIdAndUpdate(user._id, {
            $set: {
              password: encryptedpassword,
            },
          });

          if (isSuccess) {
            return res.status(200).json({
              message: "Password Changed Successfully",
            });
          }
        

    } catch (error) {
        if (error.message==="jwt expired") {
            return res.status(401).json({msg:"link has been expired"})
        }
        res.status(500).send("server error")
        console.log(error.message)
        
    }
}


// controller function for verifiying email
const saveVerifiedEmail=async(req,res)=>{
    const { token } = req.params
    try {  


        const isEmailVerified = await JWT.verify(token, process.env.SECRECT_TOKEN);
     
        if (isEmailVerified){
            const getUser = await User.findOne({
                email: isEmailVerified.email,
              });

              const saveEmail = await User.findByIdAndUpdate(getUser._id, {
                $set: {
                  isVerified: true,
                },
              });

              if (saveEmail) {
                return res
                  .status(200)
                  .json({ message: "Email Verification Success" });
              }
        }

    } catch (error) {
        if (error.message==="jwt expired") {
            return res.status(401).json({msg:"link has been expired"})
        }
        res.status(500).send("server error")
        console.log(error.message)
    }
}







// controller function for searching user
const searchUser=async(req,res)=>{
    try {
        const keyword = req.query.search
        ? {
            $or: [
              { firstname: { $regex: req.query.search, $options: "i" } },
              { lastname: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};
    
      const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
      res.send(users);
       
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).send("server error")
        console.log(error.message)
    }
}

module.exports = {
    createUser,
    loginUser,
    getMe,
    updateUser,
    forgetPassword,
    passwordReset,
    saveVerifiedEmail,
    searchUser
}

//  https://i.ibb.co/8cpwKjy/default-img.jpg