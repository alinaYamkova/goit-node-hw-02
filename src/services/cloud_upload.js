
const { promisify } = require('util');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadCloud = promisify(cloudinary.uploader.upload);

class UploadService {
  async saveAvatar(pathFile, oldIdCloudAvatar) {
    const { public_id: idCloudAvatar, secure_url: avatarUrl } = 
      await uploadCloud(pathFile, {
        public_id: oldIdCloudAvatar?.replace('CloudAvatar/', ''),
        folder: 'CloudAvatar',
        transformation: { width: 250, height: 250, crop: 'pad' }, //'CloudAvatar/public_id'
      });
    return { idCloudAvatar: public_id, avatarUrl: secure_url };
  }
}

module.exports = UploadService;


