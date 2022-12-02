const router=require("express").Router();
const {postProperty, updateProperty,getAllProperty, getSingleProperty, updateCoverImage, updateDocumentImage, updateVideo, updateGallery, getFilter,}=require("../controller/PropertyController");
const upload = require("../utils/multer");
const cloudinary=require("../utils/cloudinary")
const fs=require("fs")
const auth=require("../middleware/authMiddleware")


// @route     /api/property
// @desc      creating property post
// access     private

router.post("/",upload.array("pictures"),auth,postProperty);

// @route     /api/property/coverimg/:id
// @desc      edit/update cover photo 
// access     private
router.put("/coverimg/:id",upload.single("pictures"),auth,updateCoverImage)


// @route     /api/property/documentimg/:id
// @desc      edit/update document photo 
// access     private
router.put("/documentimg/:id",upload.single("pictures"),auth,updateDocumentImage)

// @route     /api/property/video/:id
// @desc      edit/update video 
// access     private
router.put("/video/:id",upload.single("pictures"),auth,updateVideo)

// @route     /api/property/updategallery/:id
// @desc      edit/update gallery
// access     private
router.put("/updategallery/:id",upload.array("pictures"),auth,updateGallery)


// @route     /api/property/:id
// @desc      edit/update property fields
// access     private
router.put("/:id",auth,updateProperty)





// @route     /api/property/:id
// @desc      geting all properties
// access     private
router.get("/",auth,getAllProperty)


// @route     /api/property/:id
// @desc      get single property
// access     private
router.get("/:id",auth,getSingleProperty)


// @route     /api/property/filter/type?search=keyword
// @desc      get single property
// access     private
router.get("/filter/type",auth,getFilter);


module.exports=router;