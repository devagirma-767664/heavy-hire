const multer = require('multer');
const path = require('path');

// Storage for usage log photos
const usageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/usage_logs')); // ✅ usage log folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Multer instance for usage logs
const uploadUsagePhoto = multer({ storage: usageStorage });

module.exports = uploadUsagePhoto;
