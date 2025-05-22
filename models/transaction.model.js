const connection = require('../db');

const Transaction = {
  getAll: (cb) => connection.query('SELECT * FROM transactions', cb),
  getByUserId: (user_id, cb) => connection.query('SELECT * FROM transactions WHERE user_id = ?', [user_id], cb),
  create: (data, cb) => connection.query('INSERT INTO transactions SET ?', data, cb),
  update: (id, data, cb) => connection.query('UPDATE transactions SET ? WHERE id = ?', [data, id], cb),
  delete: (id, cb) => connection.query('DELETE FROM transactions WHERE id = ?', [id], cb)
};

module.exports = Transaction;
