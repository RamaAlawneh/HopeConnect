const mysql = require("mysql");

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: "localhost",
    user: "Rama", // اسم المستخدم الخاص بقاعدة البيانات
    password: "1234", // كلمة المرور الخاصة بقاعدة البيانات
    database: "HopeConnect"
});


db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database: ", err);
    } else {
        console.log("Connected to the HopeConnect database!");
    }
});

module.exports = db;