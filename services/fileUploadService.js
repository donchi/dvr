const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: 'public/images/visitors/',
  filename: (req, file, cb) => {
    // Get form data from session (assuming you're using sessions)
    const phone = req.session.formData1?.cleanedPhone || 'unknown';
    const firstName = req.session.formData1?.fname || 'visitor';
    const lastName = req.session.formData1?.lname || '';

    // Sanitize names for filename safety
    const sanitize = (str) => str.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    // Create filename: phone_firstname_lastname_timestamp.ext
    const extension = path.extname(file.originalname);
    const filename = `${phone}_${sanitize(firstName)}_${sanitize(lastName)}_${Date.now()}${extension}`.toLowerCase();
    
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

function cleanupFileOnError(req) {
  if (req.file && fs.existsSync(req.file.path)) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error('Error deleting temp file:', err);
    }
  }
}

module.exports = {
  upload,
  cleanupFileOnError
};