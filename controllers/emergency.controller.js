const emergencyModel = require('../models/emergency.model');

// إضافة حالة طارئة جديدة
const createEmergency = async (req, res) => {
    try {
        const emergency = await emergencyModel.addEmergencyCase(req.body);
        res.status(201).json({ message: 'Emergency created successfully', emergency });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// جلب كل الحالات الطارئة
const getEmergencies = async (req, res) => {
    try {
        const emergencies = await emergencyModel.getAllEmergencyCases(); // ✔ صحيح الآن
        res.json(emergencies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// جلب حالة طارئة واحدة
const getEmergencyById = async (req, res) => {
    try {
        const emergency = await emergencyModel.getEmergencyCaseById(req.params.id); // ✔
        if (emergency) res.json(emergency);
        else res.status(404).json({ message: 'Emergency not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// تحديث حالة طارئة
const updateEmergency = async (req, res) => {
    try {
        const result = await emergencyModel.updateEmergencyCase(req.params.id, req.body); // ✔
        res.json({ message: 'Emergency updated successfully', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// حذف حالة طارئة
const deleteEmergency = async (req, res) => {
    try {
        await emergencyModel.deleteEmergencyCase(req.params.id); // ✔
        res.json({ message: 'Emergency deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEmergency,
    getEmergencies,
    getEmergencyById,
    updateEmergency,
    deleteEmergency
};
