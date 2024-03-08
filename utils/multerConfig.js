const multer = require('multer');

// Function to initialize multer with the provided directory
const configureMulter = (directory) => {
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
