const express = require('express');
const router = express.Router();
const VisitorController = require('../controllers/visitorController');
const ReturningVisitorController = require('../controllers/returningVisitorController');
const { upload } = require('../services/fileUploadService');
const VisitorModel = require('../models/visitorModel');

router.get('/visitors', VisitorController.getHome);
router.get('/visitors/status/:visit_id', VisitorController.checkVisitStatus);
router.get('/api/visitor/status', async (req, res) => {
  try {
    const { visit_id, visitor_id } = req.query;
    const status = await VisitorModel.getCheckInStatus({ visit_id, visitor_id });
    console.log('route status', status);

    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: 'Error checking status' });
  }
});


// New Visitors
router.post("/visitors/submit-step1", VisitorController.handleStep1);
router.post("/visitors/submit-step2", VisitorController.handleStep2);
router.post("/visitors/submit-step3", VisitorController.handleStep3);
router.post("/visitors/submit-step4", VisitorController.handleStep4);
router.post("/visitors/submit-step5", upload.single('photo'), VisitorController.handleStep5);


// Returning Visitors
// router.get('/visitors/update-visitor-info', ReturningVisitorController.getVisitorInfo)

router.post("/visitors/returning-visitor-submit-step1", ReturningVisitorController.login);
router.post("/visitors/returning-visitor-submit-step2", ReturningVisitorController.handleStep2);


module.exports = router;