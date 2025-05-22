const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/api/orphanages', (req, res) => {
  const sql = 'SELECT id, name, location, needs, status, lat, lng FROM orphanages';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err); // هذه تطبع الخطأ في الطرفية
      return res.status(500).json({ message: "Error fetching orphanages", error: err });
    }
    res.json(results);
  });
});






module.exports = router;
