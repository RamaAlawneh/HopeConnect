const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/map', (req, res) => {
  const sql = 'SELECT id, name, location, needs, rating FROM orphanages';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
