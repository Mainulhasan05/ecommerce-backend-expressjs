const sharp = require('sharp');
const fs = require('fs');
const path=require('path');
const deleteImage = require('./deleteImage');

function sizeReducer(inputImagePath, maxSize) {
  return new Promise((resolve, reject) => {
    sharp.cache(false);
    sharp(inputImagePath)
      .resize({ fit: 'inside', width: maxSize })
      .toFile(inputImagePath + '_reduced.png', (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(inputImagePath + '_reduced.png');
        }
      }
    );
  });
}

module.exports = sizeReducer;
