


const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    const fileSize = parseInt(req.headers['content-length']);
    if (ext !== ".mp4" &&  ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".JPG" && ext !== ".PNG") {
      cb(new Error("File type is not supported"), false);
      return;
    }else if (ext === ".mp4" && fileSize >10000000){
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError);
      // cb(new Error("video size to large"), false);
      // return;
    }
    cb(null, true);
  },
});