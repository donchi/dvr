const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');


router.get('/admin', AdminController.getLogin);
router.get('/admin/dashboard', AdminController.getDashboard);
router.get('/admin/today-visitors', AdminController.getTodayVisitors);
router.get('/admin/check_in_out', AdminController.getTodayVisitorInfo);
router.get('/admin/verification_codes', AdminController.getVerificationCodes);
router.get('/admin/all-visitors', AdminController.getAllVisitors);
router.get('/admin/visitor_info', AdminController.getVisitorInfo);
router.get('/api/visitor-details/:id', AdminController.getVisitDetails);
router.get('/admin/flagged-visitors', AdminController.getAllFlaggedVisitors);
router.get('/admin/ai-photo-recognition', (req, res) =>{
  res.render('admin/ai-photo-recognition',{pg:'ai_recognition'})
})
router.get('/admin/facial-gallery', (req, res) =>{
  res.render('admin/facial-gallery',{pg:'facial_gallery'})
})
router.get('/admin/manual-checkin', (req, res) =>{
  res.render('admin/manual-checkin',{pg:'today_visitors'})
})
router.get('/admin/messages', (req, res) =>{
  res.render('admin/messages',{pg:'messages'})
})
router.get('/admin/notifications', (req, res) =>{
  res.render('admin/notifications',{pg:'notifications'})
})
router.get('/admin/manual-checkin-visitors', (req, res) =>{
  res.render('admin/manual-checkin-visitors',{pg:'manual-checkin-visitors'})
})
router.get('/admin/settings', (req, res) =>{
  res.render('admin/settings',{pg:'settings'})
})

router.post('/admin/checkin-visitor', AdminController.checkInVisitor);
router.post('/admin/checkout-visitor', AdminController.checkOutVisitor);
router.post('/api/recognize-face', AdminController.recognizeFace);
router.post('/api/flag-visitor', AdminController.flagVisitor);
router.post('/api/unflag-visitor', AdminController.unflagVisitor);

module.exports = router;