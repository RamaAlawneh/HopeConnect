const db = require('../db');

exports.getAllForMap = (req, res) => {
  const sql = 'SELECT id, name, location, needs, rating FROM orphanages';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};
