const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Function to initialize multer with the provided directory
const configureMulter = (directory) => {
  // Check if the directory exists
  if (!fs.existsSync(directory)) {
    // If the directory doesn't exist, create it
    fs.mkdirSync(directory, { recursive: true });
  }

  // Set up multer for file uploads
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, directory); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
  });

  return multer({ storage: storage });
};

module.exports = configureMulter;
