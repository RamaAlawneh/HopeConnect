const db = require('../config/db');

const createNotificationTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50),
      read_status BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  db.query(sql, (err) => {
    if (err) throw err;
    console.log("✅ notifications table ready.");
  });
};

createNotificationTable();

const Notification = {
  create: (notificationData, callback) => {
    const sql = `INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)`;
    db.query(sql, [notificationData.user_id, notificationData.message, notificationData.type], callback);
  },

  getAllByUserId: (user_id, callback) => {
    const sql = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(sql, [user_id], callback);
  },

  markAsRead: (id, callback) => {
    const sql = `UPDATE notifications SET read_status = true WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM notifications WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Notification;
