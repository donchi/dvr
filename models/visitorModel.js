const { pool } = require('./db');

const VisitorModel = {
  async createVisitor(visitorData) {
    const query = `
      INSERT INTO visitors (
        visitor_type, title_rank, first_name, last_name, phone_number, gender, age_range, state, city, address, verified_by, passcode, photo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id
    `;
    const result = await pool.query(query, [
      "New",
      visitorData.title_rank,
      visitorData.fname,
      visitorData.lname,
      visitorData.cleanedPhone,
      visitorData.gender,
      visitorData.age_range,     
      visitorData.state,
      visitorData.city_lga,
      visitorData.address,
      visitorData.formData2,
      visitorData.formData3,
      visitorData.photo
    ]);
    return result.rows[0].id;
  },

  async createVisits(visitData) {
    const query = `
      INSERT INTO visits(
        visitor_id, purpose_of_visit, person_to_see, department, has_appointment
      ) VALUES ($1, $2, $3, $4, $5)
       RETURNING id
    `;
    const result = await pool.query(query, [
      visitData.visitor_id,
      visitData.purpose_of_visit,
      visitData.person_to_see,
      visitData.dept,
      visitData.hasAppt === '1'
    ]);
    return result.rows[0].id;
  },

async getCheckInStatus({ visit_id, visitor_id }) {
  const query = `
    SELECT status FROM visits
    WHERE id = $1 AND visitor_id = $2
  `;
  const result = await pool.query(query, [visit_id, visitor_id]);
  return result.rows[0]?.status || 'pending';
},

async Login({cleanedPhone, passcode}){
  const query = `
    SELECT id, title_rank, phone_number, passcode, first_name, last_name, photo
    FROM visitors
    WHERE phone_number = $1 AND passcode = $2
  `;
  const result = await pool.query(query,[cleanedPhone, passcode])
  return result.rows[0];
},

updateVisitorType: async (visitor_id) => {
  await pool.query(`UPDATE visitors SET visitor_type = 'Returning' WHERE id  = $1`, [visitor_id]);
},

getVisitStatus: async (visit_id) => {
  const result = await pool.query('SELECT status FROM visits WHERE id = $1', [visit_id]);
  return result.rows[0].status;
},

isCheckedIn: async (visitor_id) => {
  const result = await pool.query(
    `SELECT count(1) as cnt FROM visits WHERE visitor_id = $1 
      AND created_at::date = CURRENT_DATE AND status = 'checked in'`, 
    [visitor_id]);
  return result.rows[0];
},

getVisitorInfo: async (id) => {
  const result = await pool.query(
    `SELECT * FROM visitors WHERE id = $1`, 
    [id]);
  return result.rows[0];
}
};

module.exports = VisitorModel;