const db = require('../db'); // قاعدة بيانات mysql
const bcrypt = require('bcrypt');

const User = {
  // إنشاء مستخدم مع تشفير كلمة السر + إضافة permissions (مصفوفة)
  create: async (user, callback) => {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const permissionsJson = JSON.stringify(user.permissions || []); // تحويل المصفوفة إلى JSON نصي
      const sql = `INSERT INTO users (name, email, password, role, permissions) VALUES (?, ?, ?, ?, ?)`;
      db.query(sql, [user.name, user.email, hashedPassword, user.role || 'user', permissionsJson], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      });
    } catch (err) {
      callback(err);
    }
  },

  // إيجاد مستخدم عبر البريد الإلكتروني مع تحويل permissions إلى مصفوفة
  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], (err, results) => {
      if (err) return callback(err);
      if (!results[0]) return callback(null, null);

      const user = results[0];
      try {
        user.permissions = JSON.parse(user.permissions || '[]');
      } catch {
        user.permissions = [];
      }
      callback(null, user);
    });
  },

  // إيجاد مستخدم عبر المعرف (ID) مع تحويل permissions إلى مصفوفة
  findById: (id, callback) => {
    const sql = `SELECT id, name, email, role, permissions FROM users WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      if (!results[0]) return callback(null, null);

      const user = results[0];
      try {
        user.permissions = JSON.parse(user.permissions || '[]');
      } catch {
        user.permissions = [];
      }
      callback(null, user);
    });
  },

  // تحديث بيانات مستخدم مع تحديث permissions (تحويل المصفوفة إلى نص JSON)
  update: (id, userData, callback) => {
    const permissionsJson = JSON.stringify(userData.permissions || []);
    const sql = `UPDATE users SET name = ?, email = ?, role = ?, permissions = ? WHERE id = ?`;
    const values = [userData.name, userData.email, userData.role, permissionsJson, id];
    db.query(sql, values, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  // حذف مستخدم
  delete: (id, callback) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }
};

module.exports = User;
