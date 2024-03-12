const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Function to initialize multer with the provided directory
const configureMulter = (directory) => {
  
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Set up multer for file uploads
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, directory);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
      
    }
  });
// append the directory to the filename
  const upload = multer({ storage: storage });

  return upload;
};

module.exports = configureMulter;
