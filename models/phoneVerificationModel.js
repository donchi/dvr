const { pool } = require('./db');

const PhoneVerificationModel = {

  async checkDuplicatePhone(cleanedPhone){
    const query = `
      SELECT count(phone_number) as cnt_phone from visitors
      WHERE phone_number = $1
    `;
    const result = await pool.query(query, [cleanedPhone]);
    return result.rows[0];
  },

  async insertVerification(phone, verification_code) {
    const query = `
      INSERT INTO phone_verification_log (phone_number, verification_code)
      VALUES ($1, $2)
    `;
    const result = await pool.query(query, [phone, verification_code]);
    return result.rows[0];
  }
  
};

module.exports = PhoneVerificationModel;