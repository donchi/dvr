const { pool } = require('./db');

const AdminModel = {
  async getTodayVisitors() {
    const query = `
      SELECT * FROM visitors
      JOIN visits ON visitors.id = visits.visitor_id
      WHERE visits.created_at::date = CURRENT_DATE
      ORDER BY visits.id DESC
    `;
    const result = await pool.query(query)
    return result.rows;
  },

  async getTodayVisitorById(id){
    const query = `
      SELECT * FROM visitors
      JOIN visits ON visitors.id = visits.visitor_id
      WHERE visitors.id = $1 AND visits.created_at::date = CURRENT_DATE
      ORDER BY visits.id DESC
    `;
    const result = await pool.query(query,[id]);
    return result.rows[0];
  },

    async updateVisit(visitorData){
    const query = `
      UPDATE visits SET 
      check_in = CURRENT_TIMESTAMP,
      other_destinations = $1,
      dependants = $2,
      tag_no = $3,
      status = $4,
      remark = $5
      WHERE visitor_id = $6
      AND id = $7
      RETURNING check_in
    `;
    const result = await pool.query(query,[
      visitorData.other_destinations,
      visitorData.dependants,
      visitorData.tag_no,
      "checked in",
      visitorData.remark,
      visitorData.visitor_id,
      visitorData.visit_id
    ]);
    return result.rows[0];
  },

  async updateVisitCheckOut(visitorData){
    const query = `
      UPDATE visits SET 
      check_out = CURRENT_TIMESTAMP,
      status = $1
      WHERE visitor_id = $2
      AND id = $3
      RETURNING check_out, status
    `;
    const result = await pool.query(query,[
      "checked out",
      visitorData.visitor_id,
      visitorData.visit_id
    ]);
    return result.rows[0];
  },

  async getAllVisitors(){
    const query = `
      WITH visit_dates AS (
        SELECT 
            visitor_id,
            MIN(check_in) AS first_check_in,
            MAX(check_in) AS last_check_in
        FROM 
            visits
        GROUP BY 
            visitor_id
        )
      SELECT 
          v.*,
          vd.first_check_in as first_visit,
          vd.last_check_in as last_visit
      FROM 
          visitors v
      LEFT JOIN 
          visit_dates vd ON v.id = vd.visitor_id
      ORDER BY 
          v.last_name, v.first_name;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getVisitorInfo(id){
    const query = `
      WITH visit_dates AS (
        SELECT 
            visitor_id,
            MIN(check_in) AS first_check_in,
            MAX(check_in) AS last_check_in
        FROM 
            visits
        GROUP BY 
            visitor_id
        )
      SELECT 
          v.*,
          vd.first_check_in as first_visit,
          vd.last_check_in as last_visit
      FROM 
          visitors v
      LEFT JOIN 
          visit_dates vd ON v.id = vd.visitor_id
      WHERE v.id = $1
    `;
    const result = await pool.query(query,[id]);
    return result.rows[0];
  },

  async getVisitingInfo(id){
    const query = `
      SELECT * FROM visits
      WHERE visitor_id = $1
    `;
    const result = await pool.query(query,[id]);
    return result.rows;
  },

    async getFlags(id){
    const query = `
      SELECT * FROM flags
      WHERE visitor_id = $1
    `;
    const result = await pool.query(query,[id]);
    return result.rows;
  },

  async getVisitDetails(id){
    const query = `
      SELECT * FROM visits
      WHERE id = $1
    `;
    const result = await pool.query(query,[id]);
    return result.rows[0];
  },

  async checkTagNo(tag_no){
    const query = `
      SELECT count(1) as cnt FROM visits
      WHERE tag_no = $1 AND created_at::date = CURRENT_DATE
      AND status = 'checked in'
    `;
    const result = await pool.query(query,[tag_no]);
    return result.rows[0];
  },

  async getVisitorsByPhones(phoneNumbers) { 
      if (!phoneNumbers || phoneNumbers.length === 0) return [];
      
      const query = `
          SELECT id, first_name, last_name, phone_number, photo
          FROM visitors
          WHERE phone_number = ANY($1::varchar[])
      `;
      const result = await pool.query(query, [phoneNumbers]);
      return result.rows[0];
  },

  async getAllFlaggedVisitors(){
    const query = `
      WITH visit_dates AS (
        SELECT 
            visitor_id,
            MIN(check_in) AS first_check_in,
            MAX(check_in) AS last_check_in,
            COUNT(check_in) AS total_visits
        FROM 
            visits
        GROUP BY 
            visitor_id
        )
      SELECT 
          v.*,
          vd.first_check_in as first_visit,
          vd.last_check_in as last_visit,
          vd.total_visits as total_visits
      FROM 
          visitors v
      LEFT JOIN 
          visit_dates vd ON v.id = vd.visitor_id
      WHERE v.is_flagged = TRUE
      ORDER BY 
          v.last_name, v.first_name;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async updateVisitorFlag({visitorId, flag}){
    const query = `
     UPDATE visitors SET
     is_flagged = $1
     WHERE id = $2
    `;
    const result = await pool.query(query,[flag, visitorId]);
  },

   async insertFlag({visitorId, reason}){
    const query = `
      INSERT INTO flags (visitor_id, reason) VALUES($1, $2)
    `;
    const result = await pool.query(query,[visitorId, reason]);

  },
}

module.exports = AdminModel;