const fs = require('fs');
const path = require('path');
const prefix='..';
const deleteImage = (imagePath) => {
    const actualPath = path.join(__dirname,"../",imagePath);
    console.log(actualPath)
    try {
        if (fs.existsSync(actualPath)) {
            fs.unlinkSync(actualPath);
            console.log('paisi')
        }
        else{
            console.log('painai')
        }
    }
    catch (error) {
        console.error('Error deleting image:', error);
    }
}

module.exports = deleteImage;