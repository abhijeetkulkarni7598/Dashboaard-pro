const multer = require("multer");
const path = require("path");

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the file name
  },
});

// File validation for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only images are allowed"), false);
  }
  cb(null, true);
};

// Create upload middleware
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
  });

module.exports = upload;
