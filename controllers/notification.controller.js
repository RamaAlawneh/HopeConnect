const Notification = require('../models/notification.model');
const sendEmail = require('../utils/email.service'); // دعم البريد

const createNotification = (req, res) => {
  const { user_id, message, type, email } = req.body;
  if (!user_id || !message) {
    return res.status(400).json({ error: "user_id and message are required." });
  }

  Notification.create({ user_id, message, type }, async (err, result) => {
    if (err) return res.status(500).json({ error: "Database error while creating notification." });

    // ✅ إرسال بريد إذا وُجد
    if (email) {
      try {
        await sendEmail(email, "📬 إشعار جديد من HopeConnect", message);
      } catch (e) {
        console.warn("⚠️ فشل في إرسال البريد:", e.message);
      }
    }

    res.status(201).json({
      message: "Notification created successfully.",
      notification_id: result.insertId,
    });
  });
};

const getUserNotifications = (req, res) => {
  const user_id = req.params.user_id;
  Notification.getAllByUserId(user_id, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error while fetching notifications." });
    res.json(results);
  });
};

const markNotificationAsRead = (req, res) => {
  const id = req.params.id;
  Notification.markAsRead(id, (err) => {
    if (err) return res.status(500).json({ error: "Failed to mark notification as read." });
    res.json({ message: "Notification marked as read." });
  });
};

const deleteNotification = (req, res) => {
  const id = req.params.id;
  Notification.delete(id, (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete notification." });
    res.json({ message: "Notification deleted." });
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
};
