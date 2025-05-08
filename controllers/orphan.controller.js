const orphanModel = require('../models/orphan.model');

// ✅ استرجاع جميع الأيتام
exports.getAllOrphans = async (req, res) => {
    try {
        const data = await orphanModel.getAllOrphans();
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Error retrieving orphans.", error: err });
    }
};

// ✅ إضافة يتيم
exports.createOrphan = async (req, res) => {
    try {
        const newOrphan = {
            name: req.body.name,
            age: req.body.age,
            education_status: req.body.education_status,
            health_condition: req.body.health_condition
        };
        const data = await orphanModel.createOrphan(newOrphan);
        res.status(201).send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the orphan.",
            error: err
        });
    }
};

// ✅ استرجاع يتيم حسب ID
exports.getOrphanById = async (req, res) => {
    try {
        const data = await orphanModel.getOrphanById(req.params.id);
        res.send(data);
    } catch (err) {
        if (err.message === "Orphan not found") {
            return res.status(404).send({ message: "Orphan not found." });
        }
        res.status(500).send({ message: "Error fetching orphan.", error: err });
    }
};

// ✅ تحديث بيانات يتيم
exports.updateOrphan = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = {
            name: req.body.name,
            age: req.body.age,
            education_status: req.body.education_status,
            health_condition: req.body.health_condition
        };
        const data = await orphanModel.updateOrphan(id, updatedData);
        res.send(data);
    } catch (err) {
        if (err.message === "Orphan not found.") {
            return res.status(404).send({ message: "Orphan not found." });
        }
        res.status(500).send({
            message: "Some error occurred while updating the orphan.",
            error: err
        });
    }
};

// ✅ حذف يتيم
exports.deleteOrphan = async (req, res) => {
    try {
        await orphanModel.deleteOrphan(req.params.id);
        res.send({ message: "Orphan deleted successfully." });
    } catch (err) {
        if (err.message === "Orphan not found.") {
            return res.status(404).send({ message: "Orphan not found." });
        }
        res.status(500).send({ message: "Error deleting orphan.", error: err });
    }
};
