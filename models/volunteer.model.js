const db = require('../db');

const Volunteer = {
  // استرجاع جميع المتطوعين
  getAll: (callback) => {
    const sql = 'SELECT * FROM volunteer';
    db.query(sql, callback);
  },

  // استرجاع متطوع حسب ID
  getById: (id, callback) => {
    const sql = 'SELECT * FROM volunteer WHERE id = ?';
    db.query(sql, [id], callback);
  },

  // إنشاء متطوع جديد
  create: (volunteer, callback) => {
    const sql = 'INSERT INTO volunteer SET ?';
    db.query(sql, volunteer, callback);
  },

  // تعديل بيانات متطوع
  update: (id, volunteer, callback) => {
    const sql = 'UPDATE volunteer SET ? WHERE id = ?';
    db.query(sql, [volunteer, id], callback);
  },

  // حذف متطوع
  delete: (id, callback) => {
    const sql = 'DELETE FROM volunteer WHERE id = ?';
    db.query(sql, [id], callback);
  },

  // ✅ البحث عن متطوعين حسب نوع الخدمة (مثل تعليم، صحة، إلخ)
 getByServiceType: (serviceType, callback) => {
  const sql = 'SELECT * FROM volunteer WHERE skills LIKE ?';
  db.query(sql, [`%${serviceType}%`], callback);
},
assignToRequest: (volunteerId, requestId, callback) => {
    const sql = 'INSERT INTO volunteer_service_requests (volunteer_id, service_request_id) VALUES (?, ?)';
    db.query(sql, [volunteerId, requestId], callback);
  },

  getAssignedRequests: (volunteerId, callback) => {
    const sql = `
      SELECT sr.* FROM service_requests sr
      JOIN volunteer_service_requests vsr ON sr.id = vsr.service_request_id
      WHERE vsr.volunteer_id = ?
    `;
    db.query(sql, [volunteerId], callback);
  }

};


module.exports = Volunteer;
