const donationModel = require('../models/donation.model');
const orphanModel = require('../models/orphan.model');
const Joi = require('joi');
const { exportDonationsToSheet } = require('../Apis/exportDonationsToSheet');  // ✅ استدعاء الدالة الجديدة

// نموذج التحقق من البيانات


const donationSchema = Joi.object({
    amount: Joi.number().positive().required(),
    donor_name: Joi.string().min(3).required(),
    date: Joi.date().required(),
    category: Joi.string().min(3).required(),

    // إما orphan_id أو orphanage_id
    orphan_id: Joi.number().integer().positive(),
    orphanage_id: Joi.number().integer().positive()
}).xor('orphan_id', 'orphanage_id');  // هذا السطر هو المفتاح: إما هذا أو ذاك فقط



// استرجاع جميع التبرعات
exports.getAllDonations = (req, res) => {
    donationModel.getAllDonations((err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error retrieving donations." });
        }
        res.send(data);
    });
};

// إضافة تبرع
exports.createDonation = async (req, res) => {
    const { error } = donationSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const { orphan_id, orphanage_id } = req.body;

    if (!orphan_id && !orphanage_id) {
        return res.status(400).send({ message: "You must provide either orphan_id or orphanage_id." });
    }

    if (orphan_id && orphanage_id) {
        return res.status(400).send({ message: "Provide only one of orphan_id or orphanage_id." });
    }

    try {
        // التحقق من orphan أو orphanage
        if (orphan_id) {
            const orphan = await orphanModel.getOrphanById(orphan_id);
            if (!orphan) {
                return res.status(404).send({ message: "Orphan not found" });
            }
        }
        // يمكنك هنا إضافة فحص orphanage إذا كان لديك orphanageModel

        const newDonation = {
            amount: req.body.amount,
            donor_name: req.body.donor_name,
            date: req.body.date,
            category: req.body.category,
            orphan_id: orphan_id || null,
            orphanage_id: orphanage_id || null
        };

        donationModel.createDonation(newDonation, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the donation."
                });
            }
            res.status(201).send(data);
        });

    } catch (err) {
        return res.status(500).send({ message: "Error checking orphan or orphanage." });
    }
};


// استرجاع تبرع معين
exports.getDonationById = (req, res) => {
    donationModel.getDonationById(req.params.id, (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error fetching donation." });
        }
        if (!data) {
            return res.status(404).send({ message: "Donation not found." });
        }
        res.send(data);
    });
};

// تحديث تبرع
exports.updateDonation = async (req, res) => {
    const id = req.params.id;
    const updatedData = {
        amount: req.body.amount,
        donor_name: req.body.donor_name,
        date: req.body.date,
        category: req.body.category,
        orphan_id: req.body.orphan_id,
        orphanage_id: req.body.orphanage_id
    };

    const { error } = donationSchema.validate(updatedData);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    if (!updatedData.orphan_id && !updatedData.orphanage_id) {
        return res.status(400).send({ message: "You must provide either orphan_id or orphanage_id." });
    }

    if (updatedData.orphan_id && updatedData.orphanage_id) {
        return res.status(400).send({ message: "Provide only one of orphan_id or orphanage_id." });
    }

    try {
        if (updatedData.orphan_id) {
            const orphan = await orphanModel.getOrphanById(updatedData.orphan_id);
            if (!orphan) {
                return res.status(404).send({ message: "Orphan not found" });
            }
        }
        // تحقق من orphanage هنا عند وجود orphanageModel

        donationModel.updateDonation(id, updatedData, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while updating the donation."
                });
            }
            res.send(data);
        });
    } catch (err) {
        return res.status(500).send({ message: "Error checking orphan or orphanage." });
    }
};


// حذف تبرع
exports.deleteDonation = (req, res) => {
    donationModel.deleteDonation(req.params.id, (err, result) => {
        if (err) {
            return res.status(500).send({ message: "Error deleting donation." });
        }
        res.send({ message: "Donation deleted successfully." });
    });
};

// ✅ دالة التصدير إلى Google Sheet
exports.exportDonationsToGoogleSheet = async (req, res) => {
    const result = await exportDonationsToSheet();
    if (result.success) {
        return res.status(200).json({ message: "Donations exported successfully", count: result.count });
    } else {
        return res.status(500).json({ message: "Export failed", error: result.error });
    }
};

