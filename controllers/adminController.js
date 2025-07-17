const AdminModel = require("../models/adminModel");
const path = require("path");
const { exec } = require('child_process');
const fs = require('fs'); // Also add this if not already present

const AdminController = {

  getLogin: (req, res) => {
    res.render('admin/login',{
      pg: null
    });
  },

  getDashboard: (req, res) => {
    res.render('admin/dashboard',{ pg:'dashboard'});
  },

  getTodayVisitors: async (req, res) => {
    result = await AdminModel.getTodayVisitors();
    res.render('admin/today-visitors',{ result, pg:'today_visitors' });
  },

  getTodayVisitorInfo: async (req, res) => {
      try {
          // Get the ID from query parameters
          const { id } = req.query;

          // Validate the ID exists
          if (!id) {
              return res.status(400).send('Visitor ID is required');
          }

          // Fetch visitor data using the ID
          const visitor = await AdminModel.getTodayVisitorById(id);
          
          // Handle case where visitor isn't found
          if (!visitor) {
              return res.status(404).send('Visitor not found');
          }

          // Render the template with the visitor data
          res.render('admin/check_in_out', { visitor, pg:'today_visitors' });

      } catch (error) {
          console.error('Error in getting visitor info:', error);
          res.status(500).send('Internal Server Error');
      }
  },

  checkInVisitor: async (req, res) => {
    const errors = [];
    const { other_destinations, dependants, tag_no, remark, visitor_id} = req.body;
     // Fetch visitor data
    const visitor = await AdminModel.getTodayVisitorById(visitor_id);
    const checkTagNo = await AdminModel.checkTagNo(tag_no); 

    if (!tag_no) errors.push("Enter visitor tag number");
    if(Number(checkTagNo.cnt) !== 0) errors.push("Tag number in use by another visitor");
    console.log(checkTagNo, tag_no)

    if (errors.length > 0) {
      return sendResponse(res, { success: false, visitor, errors, formData: req.body, pg:'today_visitor' });
    }
    // update visits 
    formData = req.body;
    const visit_id = visitor.id //id is for visit 
    try{
      result = await AdminModel.updateVisit({...formData, visit_id});
    }
    catch(error){
      console.error('Database error:', error);
      res.status(500).send('Error updating visitor data');
    }
    
    return sendResponse(res, { 
      success: true, 
      visitor, 
      check_in: result.check_in,
       pg:'today_visitors'});
  },

  checkOutVisitor: async (req, res) => {
    const { visitor_id } = req.body;

     // Fetch visitor data
    const visitor = await AdminModel.getTodayVisitorById(visitor_id);

    // update visit 
    formData = req.body;
    const visit_id = visitor.id //id is for visit 
    try{
      result = await AdminModel.updateVisitCheckOut({...formData, visit_id});
      visitorData = {
        id: visitor.id,
        visitor_type: visitor.visitor_type,
        title_rank: visitor.title_rank,
        first_name: visitor.first_name,
        last_name: visitor.last_name,
        gender: visitor.gender,
        phone_number: visitor.phone_number,
        address: visitor.address,
        city: visitor.city,
        state: visitor.state,
        age_range: visitor.age_range,
        photo: visitor.photo,
        created_at: visitor.created_at,
        visitor_id: visitor.visitor_id,
        purpose_of_visit: visitor.purpose_of_visit,
        person_to_see: visitor.person_to_see,
        department: visitor.department,
        has_appointment: visitor.has_appointment,
        tag_no: visitor.tag_no,
        dependants: visitor.dependants,
        check_in: visitor.check_in,
        check_out: result.check_out,
        status: result.status,
        remark: visitor.remark
      }
      console.log('visitor data:',visitorData)
    }
    catch(error){
      console.error('Database error:', error);
      res.status(500).send('Error updating visitor data');
    }
    
    return sendResponse(res, { success: true, visitor: visitorData, pg:'today_visitors'});
  },

  getVerificationCodes: async (req, res) => {
    let sortedVerifications = null;
    if(req.session.verifications){
       const verifications = req.session.verifications;
       sortedVerifications = verifications.sort((a, b) => b.timestamp - a.timestamp);
    }
   
    res.render('admin/verification_codes',{ 
      verifications: sortedVerifications, 
      pg:'today_visitors' });
  },

  getAllVisitors: async (req, res) => {
    result = await AdminModel.getAllVisitors();
    res.render('admin/all-visitors',{ result, pg:'all_visitors' });
  },

  getVisitorInfo: async (req, res) => {
      try {
          // Get the ID from query parameters
          const { id } = req.query;

          // Validate the ID exists
          if (!id) {
              return res.status(400).send('Visitor ID is required');
          }

          // Fetch visitor data using the ID
          const visitor = await AdminModel.getVisitorInfo(id);
          const visits = await AdminModel.getVisitingInfo(id);
          const flags = await AdminModel.getFlags(id);

          // Handle case where visitor isn't found
          if (!visitor || !visits) {
              return res.status(404).send('Visitor or visiting details not found');
          }

          // Render the template with the visitor data
          res.render('admin/visitor_info', { visitor, visits, flags, pg:'all_visitors' });

      } catch (error) {
          console.error('Error getting visitor info:', error);
          res.status(500).send('Internal Server Error');
      }
  },

  getVisitDetails: async (req, res) => {
      try {
          // Get the ID from query parameters
          const { id } = req.params;

          // Validate the ID exists
          if (!id) {
              return res.status(400).send('Visit id is required');
          }

          // Fetch visitor data using the ID
          const visit = await AdminModel.getVisitDetails(Number(id));
          
          // Handle case where visitor isn't found
          if (!visit) {
              return res.status(404).send('Visiting details not found');
          }
          return res.json({success: true, data:visit});

      } catch (error) {
          console.error('Error getting visitor info:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
      }
  },

getAllFlaggedVisitors: async (req, res) => {
  result = await AdminModel.getAllFlaggedVisitors();
  res.render('admin/flagged-visitors',{ result, pg:'flagged_visitors' });
},

flagVisitor: async (req, res) => {
  const { visitorId, reason } = req.body;
  console.log(visitorId, reason);
  result = await AdminModel.getAllVisitors();

  const errors = []
  if(!reason || reason === '') errors.push("You need to enter a reason");
  
  if (errors.length > 0) {
     return sendResponse(res, { success: false, result, errors, formData: req.body, pg:'today_visitor' });
  }
  
  try{
    const flag = true;
    await AdminModel.updateVisitorFlag({visitorId, flag}); // flag visitor
    await AdminModel.insertFlag({visitorId, reason}); // log flag info
  }
    catch(error){
      console.error('Database error:', error);
      res.status(500).send('Error flagging visitor');
    }
    
    return sendResponse(res, { 
      success: true, 
      result, 
       pg:'all_visitors'});
},

unflagVisitor: async (req, res) => {
  const { visitorId } = req.body;
  console.log(visitorId);
  result = await AdminModel.getAllVisitors();
  
  try{
    const flag = false;
    await AdminModel.updateVisitorFlag({visitorId, flag}); // unflag visitor
  }
    catch(error){
      console.error('Database error:', error);
      res.status(500).send('Error unflagging visitor');
    }
    
    return sendResponse(res, { 
      success: true, 
      result, 
       pg:'all_visitors'});
},

recognizeFace: async (req, res) => {
    if (!req.files || !req.files.photo) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const photo = req.files.photo;
    const uploadDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const photoPath = path.join(uploadDir, `${Date.now()}_${photo.name}`);
    
    try {
        await photo.mv(photoPath);

        exec(`python ${path.join(__dirname, '../face_recognition.py')} "${photoPath}"`, 
        async (error, stdout, stderr) => {
            fs.unlink(photoPath, (unlinkErr) => {
                if (unlinkErr) console.error('Cleanup error:', unlinkErr);
            });

            if (error) {
                console.error('Python error:', stderr);
                return res.status(500).json({ error: "Recognition failed" });
            }

            try {
                const result = JSON.parse(stdout);
                console.log('result:', result);
                if (result.match) {
                    // Process all matches
                    const matchesWithDetails = [];
                    
                    for (const match of result.matches) {
                        const matchPath = match.identity;
                        const visitorPhone = path.basename(matchPath).split('_')[0];
                        const visitorName = path.basename(matchPath).split('_')[1] + " " +path.basename(matchPath).split('_')[2];
                        const visitorPhoto = path.basename(matchPath);
                        
                        try {
                            const phoneNumbers = result.matches.map(match => 
                            path.basename(match.identity).split('_')[0]
                            );
                            console.log('phones :', phoneNumbers);
                            const visitors = await AdminModel.getVisitorsByPhones(phoneNumbers);
                            console.log('visitors:', visitors);
                            matchesWithDetails.push({
                                ...match,
                                visitors
                            });
                        } catch (dbError) {
                            console.error('DB error for', visitorPhone, dbError);
                            matchesWithDetails.push(match);
                        }
                    }

                    res.json({
                        ...result,
                        matches: matchesWithDetails
                    });
                } else {
                    res.json(result);
                }
            } catch (e) {
                console.error('Parse error:', e);
                res.status(500).json({ error: "Invalid response" });
            }
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: "File processing failed" });
    }
}
}

function sendResponse(res, data, status = 200) {
  if (res.req.xhr || res.req.headers.accept.includes('application/json')) {
    return res.status(status).json(data);
  } else {
    return res.render('admin/check_in_out', data);
  }
}

module.exports = AdminController;