const db = require('../db');

const Admin = {
  // إنشاء مدير جديد
  create: (adminData, callback) => {
    const { name, email, password, role } = adminData; // ✅ نستخدم password هنا بدل hashedPassword
    const sql = 'INSERT INTO admin (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, role || 'moderator'], callback);
  },

  // البحث عن مدير عبر البريد
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // جلب جميع المدراء
  getAll: (callback) => {
    db.query('SELECT id, name, email, role, created_at FROM admin', callback);
  },

  // حذف مدير بالمعرف
  deleteById: (id, callback) => {
    db.query('DELETE FROM admin WHERE id = ?', [id], callback);
  }
};

module.exports = Admin;
