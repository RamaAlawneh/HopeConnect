// generateHash.js
const bcrypt = require('bcrypt');

const plainPassword = "123456"; // كلمة المرور المراد تشفيرها

// تشفير كلمة المرور
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log("Hashed Password:", hash);
  
  // انسخ هذا الهاش لتحديث قاعدة البيانات
  console.log("\nSQL Command to update database:");
  console.log(`UPDATE admin SET password = '${hash}' WHERE email = 'admin@domain.com';`);
});