const Feedback = require('../models/feedback.model');

// جلب جميع الملاحظات
exports.getAllFeedback = (req, res) => {
  Feedback.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Error retrieving feedback' });
    res.json(results);
  });
};

// جلب ملاحظة حسب ID
exports.getFeedbackById = (req, res) => {
  const id = req.params.id;
  Feedback.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error retrieving feedback by ID' });
    if (result.length === 0) return res.status(404).json({ message: 'Feedback not found' });
    res.json(result[0]);
  });
};

// إنشاء ملاحظة جديدة
exports.createFeedback = (req, res) => {
  const { user_name, email, message } = req.body;
  if (!user_name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const feedback = { user_name, email, message };
  Feedback.create(feedback, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error creating feedback' });
    res.status(201).json({ message: 'Feedback submitted successfully', id: result.insertId });
  });
};

// حذف ملاحظة
exports.deleteFeedback = (req, res) => {
  const id = req.params.id;
  Feedback.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error deleting feedback' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted successfully' });
  });
};
