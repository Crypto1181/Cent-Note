const express = require("express")
const { registerUser, loginUser, getUserProfile, updateProfile, verify } = require("../controllers/user.controller")
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "vaulted_profiles",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/myProfile', verify, getUserProfile)
router.post('/updateProfile', verify, upload.single('profileImage'), updateProfile)

module.exports = router