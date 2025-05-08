const db = require('../db');

const Volunteer = {
  getAll: (cb) => {
    db.query('SELECT * FROM volunteers', cb);
  },
  create: (data, cb) => {
    db.query('INSERT INTO volunteers SET ?', data, cb);
  }
};

module.exports = Volunteer;
