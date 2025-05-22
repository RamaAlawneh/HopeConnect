const db = require('../db');

const Logistics = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM logistics';
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM logistics WHERE id = ?';
    db.query(sql, [id], callback);
  },

  create: (logisticsData, callback) => {
    const sql = 'INSERT INTO logistics SET ?';
    db.query(sql, logisticsData, callback);
  },

  update: (id, logisticsData, callback) => {
    const sql = 'UPDATE logistics SET ? WHERE id = ?';
    db.query(sql, [logisticsData, id], callback);
  },

  remove: (id, callback) => {
    const sql = 'DELETE FROM logistics WHERE id = ?';
    db.query(sql, [id], callback);
  },
};

module.exports = Logistics;
