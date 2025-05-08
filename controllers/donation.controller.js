const donationModel = require('../models/donation.model');
const orphanModel = require('../models/orphan.model');
const Joi = require('joi');  // إضافة التحقق من صحة البيانات

// نموذج التحقق من البيانات
const donationSchema = Joi.object({
    amount: Joi.number().positive().required(),
    donor_name: Joi.string().min(3).required(),
    date: Joi.date().required(),
    orphan_id: Joi.number().integer().required()
});

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
    // التحقق من صحة البيانات
    const { error } = donationSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    try {
        // تحقق من وجود اليتيم
        const orphan = await orphanModel.getOrphanById(req.body.orphan_id);
        if (!orphan) {
            return res.status(404).send({ message: "Orphan not found" });
        }

        const newDonation = {
            amount: req.body.amount,
            donor_name: req.body.donor_name,
            date: req.body.date,
            orphan_id: req.body.orphan_id
        };

        donationModel.createDonation(newDonation, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while creating the donation."
                });
            }
            res.status(201).send(data); // إرسال البيانات بعد الإنشاء
        });
    } catch (err) {
        return res.status(500).send({ message: "Error checking orphan." });
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
        orphan_id: req.body.orphan_id
    };

    // التحقق من صحة البيانات
    const { error } = donationSchema.validate(updatedData);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    try {
        // تحقق من وجود اليتيم
        const orphan = await orphanModel.getOrphanById(updatedData.orphan_id);
        if (!orphan) {
            return res.status(404).send({ message: "Orphan not found" });
        }

        donationModel.updateDonation(id, updatedData, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while updating the donation."
                });
            }
            res.send(data);
        });
    } catch (err) {
        return res.status(500).send({ message: "Error checking orphan." });
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
