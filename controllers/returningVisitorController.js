const VisitorModel = require('../models/visitorModel');
const { clearSessionData } = require('../services/sessionService');

const ReturningVisitorController = {

  login: async (req, res) => {
    const errors = [];
    const { phone, passcode } = req.body;
    const cleanedPhone = phone.replace(/\D+/g, '');

    if(cleanedPhone !== phone || !Number(phone)) errors.push("Enter your phone number correctly");
    console.log(cleanedPhone, passcode);
    const loginResult = await VisitorModel.Login({cleanedPhone, passcode});
    if(!loginResult || typeof loginResult === 'undefined') errors.push("Login Invalid");
    
    const visitor_id = loginResult?.id;
    const isCheckedIn = await VisitorModel.isCheckedIn(visitor_id);
    if(isCheckedIn.cnt > 0) errors.push("You are already checked in");

    if (errors.length > 0) {
      return sendResponse(res, { success: false, errors, currentStep: 1, formData: req.body });
    }
    
    // update visitor as returning visitor
    await VisitorModel.updateVisitorType(visitor_id);
    req.session.visitorData = loginResult;
    return sendResponse(res, { success: true, currentStep: 2, loginResult });
  },

  handleStep2: async (req, res) => {
    const errors = [];
    const { purpose_of_visit, person_to_see, dept, hasAppt } = req.body;

    if (!purpose_of_visit.trim()) errors.push("Enter your purpose of visit");
    if (!person_to_see.trim()) errors.push("Enter whom you want to see");
    if (!dept) errors.push("Enter your destination (dept)");
    if (!hasAppt) errors.push("Do you have an appointment?");

    if (errors.length > 0) {
      return sendResponse(res, { success: false, errors, currentStep: 3, formData3: req.body });
    }

    try {
      const formData1 = req.body;
      const visitor_id = req.session.visitorData.id;
      const photo = req.session.visitorData.photo;
      const first_name = req.session.visitorData.first_name;
      const last_name = req.session.visitorData.last_name;
      const title_rank = req.session.visitorData.title_rank;

      const visit_id = await VisitorModel.createVisits({
      visitor_id,
      ...formData1
    });

    clearSessionData(req);
    console.log('visit id', visit_id)
    return sendResponse(res, { 
      success: true, 
      currentStep: 3, 
      title_rank: title_rank,
      first_name: first_name,
      last_name: last_name,
      photo,
      visit_id
    });

    } catch (err) {
      console.error("Database error:", err);
      cleanupFileOnError(req);
      return sendResponse(res, { success: false, currentStep: 3, errors: ["Error saving visiting data"] }, 500);
    }
  },

getVisitorInfo: async (req, res) => {
      try {
          const { id } = req.query;
          const visitor = await VisitorModel.getVisitorInfo(id);
          res.render('visitors/update-visitor-info', { visitor });

      } catch (error) {
          console.error('Error in getting visitor info:', error);
          res.status(500).send('Internal Server Error');
      }
  },
};

function sendResponse(res, data, status = 200) {
  if (res.req.xhr || res.req.headers.accept.includes('application/json')) {
    return res.status(status).json(data);
  } else {
    return res.render('visitors/home', data);
  }
}

module.exports = ReturningVisitorController;