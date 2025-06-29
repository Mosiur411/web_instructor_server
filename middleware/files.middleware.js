const multer = require('multer');
const fs = require('fs');
const { getRandomString } = require('../utils/helpers');
const { AllowedFileTypes, MaxFileSize } = require('../utils/constants');

const uploadDirectory = './uploads';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const newFileName = `${getRandomString()}-${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MaxFileSize },
  fileFilter: (req, file, cb) => {
    if (!AllowedFileTypes.has(file.mimetype)) {
      cb(new Error('Invalid file type'), false);
    } else {
      cb(null, true);
    }
  },
});



module.exports = {
  upload,
};



