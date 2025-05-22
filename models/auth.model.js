const db = require('../db');
const bcrypt = require('bcrypt');

// البحث عن مستخدم باستخدام البريد الإلكتروني (باستخدام Promise)
exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    db.query(query, [email], (err, results) => {
      if (err) {
        return reject(err);
      }

      if (results.length === 0) {
        return resolve(null); // لا يوجد مستخدم
      }

      const user = results[0];

      // التأكد من أن حقل permissions يتم تحويله من JSON إلى Array
      try {
        if (typeof user.permissions === 'string') {
          user.permissions = JSON.parse(user.permissions);
        } else if (!Array.isArray(user.permissions)) {
          user.permissions = [];
        }
      } catch (e) {
        user.permissions = [];
      }

      resolve(user);
    });
  });
};
