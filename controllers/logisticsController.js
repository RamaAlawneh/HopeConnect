const Logistics = require('../models/logisticsModel');

exports.getAllLogistics = (req, res) => {
  Logistics.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getLogisticsById = (req, res) => {
  const id = req.params.id;
  Logistics.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result[0]);
  });
};

exports.createLogistics = (req, res) => {
  const data = req.body;
  Logistics.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Logistics created', id: result.insertId });
  });
};

exports.updateLogistics = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  Logistics.update(id, data, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Logistics updated' });
  });
};

exports.deleteLogistics = (req, res) => {
  const id = req.params.id;
  Logistics.remove(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Logistics deleted' });
  });
};
