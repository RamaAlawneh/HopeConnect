const Volunteer = require('../models/volunteer.model');
const Joi = require('joi');

// مخطط التحقق من بيانات المتطوع
const volunteerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  skills: Joi.string().optional()
});

// ✅ استرجاع جميع المتطوعين
exports.getAllVolunteers = (req, res) => {
  Volunteer.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching volunteers", details: err.message });
    res.json(results);
  });
};

// ✅ استرجاع متطوع حسب ID
exports.getVolunteerById = (req, res) => {
  const id = req.params.id;
  Volunteer.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error fetching volunteer", details: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Volunteer not found" });
    res.json(result[0]);
  });
};

// ✅ إنشاء متطوع جديد
exports.createVolunteer = (req, res) => {
  const { error } = volunteerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const newVolunteer = req.body;
  Volunteer.create(newVolunteer, (err, result) => {
    if (err) return res.status(500).json({ error: "Error creating volunteer", details: err.message });
    res.status(201).json({ message: 'Volunteer created successfully', id: result.insertId });
  });
};

// ✅ تحديث بيانات متطوع
exports.updateVolunteer = (req, res) => {
  const id = req.params.id;
  const { error } = volunteerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // التحقق من وجود المتطوع أولاً
  Volunteer.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error checking volunteer", details: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Volunteer not found" });

    // إذا موجود، يتم التحديث
    Volunteer.update(id, req.body, (err) => {
      if (err) return res.status(500).json({ error: "Error updating volunteer", details: err.message });
      res.json({ message: 'Volunteer updated successfully' });
    });
  });
};

// ✅ حذف متطوع
exports.deleteVolunteer = (req, res) => {
  const id = req.params.id;

  // تحقق من وجود المتطوع أولاً
  Volunteer.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: "Error checking volunteer", details: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Volunteer not found" });

    // إذا موجود، يتم الحذف
    Volunteer.delete(id, (err) => {
      if (err) return res.status(500).json({ error: "Error deleting volunteer", details: err.message });
      res.json({ message: 'Volunteer deleted successfully' });
    });
  });
};
// ✅ استرجاع متطوعين حسب نوع المهارة (الخدمة المقدمة)
exports.getVolunteersBySkill = (req, res) => {
  const skill = req.query.skill;
  if (!skill) return res.status(400).json({ message: "Skill query parameter is required" });

  Volunteer.getByServiceType(skill, (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching volunteers by skill", details: err.message });
    res.json(results);
  });
};
exports.assignToRequest = (req, res) => {
  const volunteerId = req.params.id;
  const requestId = req.body.requestId;

  Volunteer.assignToRequest(volunteerId, requestId, (err) => {
    if (err) return res.status(500).json({ error: "Error assigning volunteer", details: err.message });
    res.json({ message: "Volunteer assigned to request successfully" });
  });
};

// ✅ جلب الطلبات المرتبطة بمتطوع
exports.getVolunteerRequests = (req, res) => {
  const volunteerId = req.params.id;

  Volunteer.getAssignedRequests(volunteerId, (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching assigned requests", details: err.message });
    res.json(results);
  });
};