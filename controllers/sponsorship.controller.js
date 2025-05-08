const sponsorshipModel = require('../models/sponsorship.model');
const orphanModel = require('../models/orphan.model');
const Joi = require('joi');

// مخطط التحقق
const sponsorshipSchema = Joi.object({
    sponsor_name: Joi.string().min(3).required(),
    sponsor_contact: Joi.string().email().required(),
    amount: Joi.number().positive().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().allow(null),
    status: Joi.string().valid('active', 'inactive', 'completed').required(),
    orphan_id: Joi.number().integer().required()
});

// استرجاع جميع الكفالات
exports.getAllSponsorships = (req, res) => {
    sponsorshipModel.getAllSponsorships((err, data) => {
        if (err) return res.status(500).json({ message: 'خطأ في جلب الكفالات' });
        res.json(data);
    });
};

// إنشاء كفالة جديدة
exports.createSponsorship = async (req, res) => {
    const { error } = sponsorshipSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const orphan = await orphanModel.getOrphanById(req.body.orphan_id);
        if (!orphan) return res.status(404).json({ message: 'اليتيم غير موجود' });

        sponsorshipModel.createSponsorship(req.body, (err, result) => {
            if (err) return res.status(500).json({ message: 'خطأ في إنشاء الكفالة', error: err });
            res.status(201).json(result);
        });
    } catch (err) {
        res.status(500).json({ message: 'حدث خطأ عند التحقق من اليتيم', error: err });
    }
};

// استرجاع كفالة واحدة
exports.getSponsorshipById = (req, res) => {
    sponsorshipModel.getSponsorshipById(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: 'خطأ في جلب الكفالة' });
        if (!result) return res.status(404).json({ message: 'الكفالة غير موجودة' });
        res.json(result);
    });
};

// تحديث كفالة
exports.updateSponsorship = async (req, res) => {
    const { error } = sponsorshipSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const orphan = await orphanModel.getOrphanById(req.body.orphan_id);
        if (!orphan) return res.status(404).json({ message: 'اليتيم غير موجود' });

        sponsorshipModel.updateSponsorship(req.params.id, req.body, (err, result) => {
            if (err) return res.status(500).json({ message: 'خطأ في تعديل الكفالة', error: err });
            res.json({ id: req.params.id, ...req.body });
        });
    } catch (err) {
        res.status(500).json({ message: 'خطأ عند التحقق من اليتيم', error: err });
    }
};

// حذف كفالة
exports.deleteSponsorship = (req, res) => {
    sponsorshipModel.deleteSponsorship(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: 'خطأ في حذف الكفالة', error: err });
        res.json({ message: 'تم حذف الكفالة بنجاح' });
    });
};
