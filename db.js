// المسار: config/db.js

const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "Rama",
    password: '1234',
    database: "rama1"
});


db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database: ", err);
    } else {
        console.log("Connected to the HopeConnect database!");
    }
});

module.exports = db;
