const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!hasCloudinaryConfig && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = hasCloudinaryConfig
  ? cloudinaryStorage({
      cloudinary,
      folder: 'boardgames',
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp']
    })
  : multer.diskStorage({
      destination: uploadsDir,
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
      }
    });

const upload = multer({ storage });

const uploadImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Image upload failed' });
    }

    if (req.file && hasCloudinaryConfig) {
      req.file.path = req.file.secure_url || req.file.path; // ✅ fixed
    } else if (req.file) {
      req.file.path = `/uploads/${req.file.filename}`;
    }

    next();
  });
};

module.exports = { upload, uploadImage }; // ✅ fixed