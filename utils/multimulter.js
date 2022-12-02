const multer=require("multer")
const fs = require("fs");

if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}



const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });


// var upload = multer({ storage: storage });
const upload = multer({ storage });

module.exports=upload