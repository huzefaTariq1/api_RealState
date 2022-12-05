const ProperyModel = require("../model/ProperyModel")
const cloudinary = require("../utils/cloudinary")
const upload = require("../utils/multimulter");
const fs = require("fs")

const postProperty = async (req, res,next) => {




    try {

        const { catagery, realStateType, title, description, bedroom, washroom, carparking, kitchen, floorArea, tapAvailable, aircondition, quarterAvailble, price, fullAddress, houseno, streetno } = req.body




        let pictureFiles = []
        pictureFiles = req.files;
        
        //Check if files exist
        if (!pictureFiles)
            return res.status(400).json({ message: "No picture attached!" });
        if (pictureFiles.length > 9) {
            return res.status(400).json({ message: "cant selct more" })
        }
        //map through images and create a promise array using cloudinary upload function
        let multiplePicturePromise = pictureFiles.map((picture) =>
            cloudinary.uploader.upload(picture.path, {
                resource_type: "auto",
            }
            )
        );

        if (req.fileValidationError) {
         return   res.status(400).json({msg:"Cant Upload Video Size Greater than 10mb"})

       }
  
        // await all the cloudinary upload functions in promise.all, exactly where the magic happens
        let imageResponses = await Promise.all(multiplePicturePromise);
           
       if (!imageResponses){
        return res.status(400).json({ message: "No picture attached!" });
       }
        let cover = imageResponses[0].secure_url;
        let propertyUpload = []
        propertyUpload[0] = imageResponses[1].secure_url
        propertyUpload[1] = imageResponses[2].secure_url
        propertyUpload[2] = imageResponses[3].secure_url
        propertyUpload[3] = imageResponses[4].secure_url
        propertyUpload[4] = imageResponses[5].secure_url
        propertyUpload[5] = imageResponses[6].secure_url
        let documet = imageResponses[7].secure_url
        let propertyvideo = imageResponses[8].secure_url

        console.log({
            cover,
            propertyUpload,
            documet,
            propertyvideo
        })

        // console.log({coverurl:cover.secure_url,
        //     propertyUpload:propertyUpload[]
        // })

        // let property=new ProperyModel({
        //     user: req.user.id,
        //     catagery,
        //     realStateType,
        //     title,
        //     description,
        //     bedroom,
        //     coverimage:cover,
        //     propertyUpload,
        //     document:documet,
        //     video:propertyvideo
        // })

        let propertFiedls = {}
        propertFiedls.user = req.user.id;
        if (catagery) propertFiedls.catagery = catagery
        if (realStateType) propertFiedls.realStateType = realStateType
        if (title) propertFiedls.title = title
        if (description) propertFiedls.description = description
        if (cover) propertFiedls.coverimage = cover
        if (propertyUpload) propertFiedls.propertyUpload = propertyUpload
        if (documet) propertFiedls.document = documet
        if (propertyvideo) propertFiedls.video = propertyvideo
        if (price) propertFiedls.price = price
        if (fullAddress) propertFiedls.fullAddress = fullAddress
        if (houseno) propertFiedls.houseno = houseno
        if (streetno) propertFiedls.streetno = streetno

        // build sppecification field
        propertFiedls.specification = {}
        if (bedroom) propertFiedls.specification.bedroom = bedroom
        if (washroom) propertFiedls.specification.washroom = washroom
        if (carparking) propertFiedls.specification.carparking = carparking
        if (kitchen) propertFiedls.specification.kitchen = kitchen
        if (floorArea) propertFiedls.specification.floorArea = floorArea
        if (tapAvailable) propertFiedls.specification.tapAvailable = tapAvailable
        if (aircondition) propertFiedls.specification.aircondition = aircondition
        if (quarterAvailble) propertFiedls.specification.quarterAvailble = quarterAvailble

        let property = new ProperyModel(propertFiedls);
        await property.save()
        res.status(201).json(property)



        // property=await property.save()
        // res.status(201).json(property)

    } catch (err) {
        if (err.message=="Cannot read properties of undefined (reading 'secure_url')"){
            return res.status(400).json({ msg: "No Pictures Attached Which is required" })
        }
        res.status(500).json({
            messagess: err.message,
          
        });
    }
}



// controller function for edit authorize user property
const updateProperty = async (req, res) => {
    const { title, description, bedroom, washroom, carparking, kitchen, floorArea, tapAvailable, aircondition, quarterAvailble, price, fullAddress, houseno, streetno } = req.body

    try {

        var property = await ProperyModel.findById(req.params.id)

        // making sure the logged in user matches the property user
        if (property && property.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User Not Authorized" })
        }


        let propertFiedls = {}
        propertFiedls.user = req.user.id;

        if (title) propertFiedls.title = title
        if (description) propertFiedls.description = description
        if (price) propertFiedls.price = price
        if (fullAddress) propertFiedls.fullAddress = fullAddress
        if (houseno) propertFiedls.houseno = houseno
        if (streetno) propertFiedls.streetno = streetno

        // build sppecification field
        propertFiedls.specification = {}
        if (bedroom) propertFiedls.specification.bedroom = bedroom
        if (washroom) propertFiedls.specification.washroom = washroom
        if (carparking) propertFiedls.specification.carparking = carparking
        if (kitchen) propertFiedls.specification.kitchen = kitchen
        if (floorArea) propertFiedls.specification.floorArea = floorArea
        if (tapAvailable) propertFiedls.specification.tapAvailable = tapAvailable
        if (aircondition) propertFiedls.specification.aircondition = aircondition
        if (quarterAvailble) propertFiedls.specification.quarterAvailble = quarterAvailble

        property = await ProperyModel.findByIdAndUpdate(req.params.id, propertFiedls, { new: true })

        res.send(property)

    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).json({
            messagess: error.message,
        });
        console.log(error.message)
    }

}




const updateCoverImage = async (req, res) => {
    try {

        let coverimagefile = req.file
        if (!coverimagefile) {
            return res.status(400).json({ message: "No picture attached!" });
        }

        const coverImage = await cloudinary.uploader.upload(coverimagefile.path)

        let property = await ProperyModel.findById(req.params.id)

        if (property && property.user.toString() !== req.user.id) {
            return res.status(401).json("User not Authorized")
        }


        const updatedCover = await ProperyModel.findByIdAndUpdate(req.params.id, {
            coverimage: coverImage.secure_url
        }, { new: true })


        res.send(updatedCover)

    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).json({
            messagess: error.message,
        });
        console.log(error.message)
    }
}







// controller function for edit/update authorize user document
const updateDocumentImage = async (req, res) => {
    try {

        let documentImageFile = req.file
        if (!documentImageFile) {
            return res.status(400).json({ msg: "No Picture Attached" })
        }

        let documentimage = await cloudinary.uploader.upload(documentImageFile.path)

        let property = await ProperyModel.findById(req.params.id)

        if (property && property.user.toString() !== req.user.id) {
            return res.status(401).json("User not Authorized")
        }

        const updateDoc = await ProperyModel.findByIdAndUpdate(req.params.id, {
            document: documentimage.secure_url
        }, { new: true })

        res.send(updateDoc)


    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).json({
            messagess: error.message,
        });
        console.log(error.message)
    }
}






// controller function for edit/update property video of authrize user
const updateVideo = async (req, res) => {
    try {

        let propertVideo = req.file

        if (!propertVideo) {
            return res.status(401).json({ msg: "No Video Attached" })
        }

        let video = await cloudinary.uploader.upload(propertVideo.path, {
            resource_type: "video",
        })

        let property = await ProperyModel.findById(req.params.id)

        if (property && property.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not Authorized" })
        }

        const updatedVideo = await ProperyModel.findByIdAndUpdate(req.params.id, {
            video: video.secure_url
        }, { new: true })

        res.send(updatedVideo)

    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).json({
            messagess: error.message,
        });
        console.log(error.message)
    }
}







//controller function for edit/update gallery photos 
const updateGallery = async (req, res) => {
    try {
        let pictureFiles = []
        pictureFiles = req.files;
        //Check if files exist
        if (!pictureFiles)
            return res.status(400).json({ message: "No picture attached!" });
        if (pictureFiles.length > 6) {
            return res.status(400).json({ message: "cant selct more than 6" })
        }
        //map through images and create a promise array using cloudinary upload function
        let multiplePicturePromise = pictureFiles.map((picture) =>
            cloudinary.uploader.upload(picture.path, {
                resource_type: "auto",
            })
        );
        // await all the cloudinary upload functions in promise.all, exactly where the magic happens
        let imageResponses = await Promise.all(multiplePicturePromise);

        let propertyUpload = []
        propertyUpload[0] = imageResponses[0].secure_url
        propertyUpload[1] = imageResponses[1].secure_url
        propertyUpload[2] = imageResponses[2].secure_url
        propertyUpload[3] = imageResponses[3].secure_url
        propertyUpload[4] = imageResponses[4].secure_url
        propertyUpload[5] = imageResponses[5].secure_url



        let property = await ProperyModel.findById(req.params.id)

        if (property && property.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not Authorized" })
        }


        const updategal = await ProperyModel.findByIdAndUpdate(req.params.id, {
            propertyUpload
        }, { new: true })

        res.send(updategal)


    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "No user found for this Id" })
        }
        res.status(500).json({
            messagess: error.message,
        });
        console.log(error.message)
    }
}


//controller function for getting all recipies
const getAllProperty = async (req, res) => {
    try {

        const properties = await ProperyModel.find().populate('user', ['firstname', 'lastname', 'phone', 'email', 'avatar'])
        res.send(properties)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
}


// controller function for getting single property
const getSingleProperty = async (req, res) => {
    try {
        const singleProperty = await ProperyModel.findById(req.params.id).populate('user', ['firstname', 'lastname', 'phone', 'email', 'avatar'])
        res.send(singleProperty)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
}





const getFilter=async(req,res)=>{
    try {
        let filterData=await ProperyModel.find({
            "$or":[
                {"catagery":{$regex:req.query.search}}
            ]
        }).populate('user', ['firstname', 'lastname', 'phone', 'email', 'avatar'])
        res.send({data:filterData})

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
}






module.exports = {
    postProperty,
    updateProperty,
    getAllProperty,
    getSingleProperty,
    updateCoverImage,
    updateDocumentImage,
    updateVideo,
    updateGallery,
    getFilter,
}