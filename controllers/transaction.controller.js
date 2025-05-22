const Transaction = require('../models/transaction.model');

exports.getAllTransactions = (req, res) => {
  Transaction.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getByUserId = (req, res) => {
  Transaction.getByUserId(req.params.user_id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createTransaction = (req, res) => {
  const { user_id, donation_amount, donation_category } = req.body;
  const transaction_fee = donation_amount * 0.05;
  const net_amount = donation_amount - transaction_fee;

  const transaction = { user_id, donation_amount, transaction_fee, net_amount, donation_category };

  Transaction.create(transaction, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Transaction created successfully', id: result.insertId });
  });
};

exports.updateTransaction = (req, res) => {
  Transaction.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Transaction updated successfully' });
  });
};

exports.deleteTransaction = (req, res) => {
  Transaction.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Transaction deleted successfully' });
  });
};
