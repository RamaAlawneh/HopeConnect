const db = require('../db');

const Feedback = {
  getAll: (callback) => {
    const query = 'SELECT * FROM feedback ORDER BY created_at DESC';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM feedback WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (feedback, callback) => {
    const query = 'INSERT INTO feedback (user_name, email, message) VALUES (?, ?, ?)';
    db.query(query, [feedback.user_name, feedback.email, feedback.message], callback);
  },

  deleteById: (id, callback) => {
    const query = 'DELETE FROM feedback WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Feedback;
