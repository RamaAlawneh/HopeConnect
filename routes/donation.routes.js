const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');

// عرض جميع التبرعات
router.get('/', donationController.getAllDonations);

// إضافة تبرع
router.post('/', donationController.createDonation);

// عرض تبرع معين
router.get('/:id', donationController.getDonationById);

// تعديل تبرع
router.put('/:id', donationController.updateDonation);

// حذف تبرع
router.delete('/:id', donationController.deleteDonation);

module.exports = router;
//just try 