const VisitorModel = require('../models/visitorModel');
const PhoneVerificationModel = require('../models/phoneVerificationModel');
const { generateVerificationCode } = require('../services/verificationService');
const { cleanupFileOnError } = require('../services/fileUploadService');
const { clearSessionData } = require('../services/sessionService');
var request = require('request');

const VisitorController = {
  getHome: (req, res) => {
    res.render('visitors/home', {
      currentStep: 0,
      formData: null,
      errors: null,
      photo: null,
      status: null,
      title_rank: null,
      first_name: null,
      loginResult: null,
      visit_id: null
    });
  },

  handleStep1: async (req, res) => {
    // data validation - personal details
    const errors = [];
    const { title_rank, fname, lname, phone, gender, age_range, state, city_lg, address } = req.body;
    // const cleanedPhone = phone.replace(/\s+/g, '');
    const cleanedPhone = phone.replace(/\D+/g, '');

    if (cleanedPhone !== phone || !Number(phone)) errors.push("Enter your phone number correctly");
    const resultPhone = await PhoneVerificationModel.checkDuplicatePhone(cleanedPhone);

    if (!fname || fname.trim().length < 2) errors.push("First name must be at least 2 characters");
    if (!lname || lname.trim().length < 3) errors.push("Last name must be at least 3 characters");
    if (!phone || cleanedPhone.length !== 11) errors.push("Phone number must be 11 digits");
    if (!address || address.trim().length < 4) errors.push("Please enter a complete address");
    if (!gender) errors.push("Please enter your gender");
    if (!age_range) errors.push("Please enter your age range");
    if (resultPhone.cnt_phone > 0) errors.push("Phone number already exists");

    // check for errors before proceeding
    if (errors.length > 0) {
      return sendResponse(res, { success: false, errors, currentStep: 1, formData: req.body });
    }
    // save data to session if no error
    req.session.formData1 = { ...req.body, cleanedPhone };

    // generate verification code and store in session
    if (req.session.formData1) {
      req.session.verification_code = generateVerificationCode();

      // send sms to visitor phone
      var data = {
        "to": "234" + cleanedPhone.slice(1),
        "from": "talert",
        "sms": req.session.verification_code,
        "type": "plain",
        "api_key": "TLQMUpLEZmSnOcnPlJrTNDEHGggqrljYInUJEKEUoeLKyoSEzntiBzgVbmlMof",
        "channel": "generic"
      };
      var options = {
        'method': 'POST',
        'url': 'https://v3.api.termii.com/api/sms/send',
        'headers': {
          'Content-Type': ['application/json', 'application/json']
        },
        body: JSON.stringify(data)

      };
      console.log("data: ", data)
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });

      // store in array session
      req.session.verifications = req.session.verifications || [];
      req.session.verifications.push({
        phone: cleanedPhone,
        code: req.session.verification_code,
        timestamp: Date.now()
      });
    }

    try {
      return sendResponse(res, { success: true, cleanedPhone, vcode: req.session.verification_code });
    }
    catch (err) {
      return sendResponse(res, { success: false, errors: ["Error processing your request"], currentStep: 1 });
    }
  },

  handleStep2: async (req, res) => {
    // data validation - verification code
    const errors = [];
    const verify_code = req.session.verification_code;

    if (!req.body.verification_code.trim()) errors.push("Enter the verification code sent to your phone number");
    if (String(req.body.verification_code.trim()) !== String(verify_code)) errors.push("Invalid verification code");

    if (errors.length > 0) {
      return sendResponse(res, { success: false, errors, currentStep: 2, formData: req.body });
    }

    try {
      const phoneResult = await PhoneVerificationModel.insertVerification(req.session.formData1.cleanedPhone, verify_code);

      const verified_by = "code";
      req.session.formData2 = verified_by;
      return sendResponse(res, { success: true, currentStep: 3 });
    }
    catch (err) {
      console.error("Database error:", err);
      return sendResponse(res, { success: false, currentStep: 2, errors: ["Error verifying phone number"] }, 500);
    }
  },

  handleStep3: (req, res) => {
    const errors = [];
    const { passcode, cpasscode } = req.body;

    if (!passcode) errors.push("Enter a passcode");
    if (Number(passcode) !== Number(cpasscode)) errors.push("Confirm that your passcodes are the same");

    if (errors.length > 0) {
      console.log('error');
      return sendResponse(res, { success: false, errors, currentStep: 3, formData: req.body });
    }

    // save to session
    req.session.formData3 = Number(passcode);
    return sendResponse(res, { success: true, currentStep: 4 });
  },

  handleStep4: (req, res) => {
    const errors = [];
    const { purpose_of_visit, person_to_see, dept, hasAppt, tag_no, dependants } = req.body;

    if (!purpose_of_visit.trim()) errors.push("Enter your purpose of visit");
    if (!person_to_see.trim()) errors.push("Enter whom you want to see");
    if (!dept) errors.push("Enter your destination (dept)");
    if (!hasAppt) errors.push("Do you have an appointment?");
    // if (!tag_no) errors.push("Enter your tag number?");

    if (errors.length > 0) {
      return sendResponse(res, { success: false, errors, currentStep: 4, formData: req.body });
    }

    req.session.formData4 = req.body;
    return sendResponse(res, { success: true, currentStep: 5 });
  },

  handleStep5: async (req, res) => {
    if (!req.file) {
      return sendResponse(res, { success: false, errors: ["Photo is required"] }, 400);
    }

    try {
      const photo = req.file.filename;
      const formData1 = req.session.formData1;
      const formData2 = req.session.formData2;
      const formData3 = req.session.formData3;
      const formData4 = req.session.formData4;

      const visitor_id = await VisitorModel.createVisitor({
        ...formData1,
        formData2,
        formData3,
        photo
      });

      const visit_id = await VisitorModel.createVisits({
        visitor_id,
        ...formData4
      });

      clearSessionData(req);

      return sendResponse(res, {
        success: true,
        currentStep: 6,
        title_rank: formData1.title_rank,
        first_name: formData1.fname,
        photo,
        visitor_id,
        visit_id,
        formData: req.body
      });

    } catch (err) {
      console.error("Database error:", err);
      cleanupFileOnError(req);
      return sendResponse(res, { success: false, currentStep: 5, errors: ["Error saving visitor data"] }, 500);
    }
  },

  // Add this to visitorController.js
  checkVisitStatus: async (req, res) => {
    try {
      const { visit_id } = req.params;
      const status = await VisitorModel.getVisitStatus(visit_id);
      console.log('status', status);
      return res.json({ success: true, status });

    } catch (err) {
      console.error("Error checking visit status:", err);
      return res.status(500).json({ success: false, error: "Error checking status" });
    }
  }

};

function sendResponse(res, data, status = 200) {
  if (res.req.xhr || res.req.headers.accept.includes('application/json')) {
    return res.status(status).json(data);
  } else {
    return res.render('visitors/home', data);
  }
}

module.exports = VisitorController;