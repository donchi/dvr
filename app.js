const express = require("express");
const path = require("path");
const fileUpload = require('express-fileupload'); // Add this line
const { pool, testDbConnection } = require("./models/db");
const { setupSession } = require("./services/sessionService");
const visitorRoutes = require("./routes/visitorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Test database connection
testDbConnection();

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this if not already present

// Configure file upload middleware
app.use('/api/recognize-face', fileUpload({
    useTempFiles: true,          // Use temporary files instead of memory
    tempFileDir: '/tmp/',       // Temporary file directory
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    abortOnLimit: true,         // Return 413 error if file is too large
    safeFileNames: true,        // Sanitize filenames
    preserveExtension: true,    // Keep file extensions
    debug: process.env.NODE_ENV === 'development' // Debug in development
}));

// Session setup
setupSession(app);

// Route middleware
app.use('/', visitorRoutes);
app.use('/', adminRoutes);

app.locals.toProperCase = (str) => {
  if (typeof str !== 'string' || !str.trim()) return '';
  
  const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 
                     'in', 'with','nor', 'of', 'on', 'or', 'the', 'to', 'up', 'yet'];
  
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, arr) => {
      // Skip small words unless they're the first/last word
      if (index > 0 && index < arr.length - 1 && smallWords.includes(word)) {
        return word;
      }
      
      // Handle hyphenated words (like "Smith-Jones")
      if (word.includes('-')) {
        return word.split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('-');
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!'); //replace with an error page
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});