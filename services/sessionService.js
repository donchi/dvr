const session = require('express-session');
const MongoStore = require('connect-mongo');

function setupSession(app) {
  app.use(session({
    secret: 'your-secret-key', // Should be a long, random string in production
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      httpOnly: true,
      secure: false,
      sameSite: 'strict' // Helps prevent CSRF attacks
    },
    rolling: true, // Reset maxAge on every request
    store: new MongoStore({
      mongoUrl: 'mongodb://localhost:27017/sessions',
      ttl: 7 * 24 * 60 * 60
    }),
    
  }));
}

function clearSessionData(req) {
  req.session.formData1 = null;
  req.session.formData2 = null;
  req.session.formData3 = null;
  req.session.formData4 = null;
  req.session.verification_code = null;
  req.session.verifications = null;
  req.session.visitorData = null;
}

module.exports = {
  setupSession,
  clearSessionData
};