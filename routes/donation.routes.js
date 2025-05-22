const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');
const { verifyToken, checkPermission } = require('../middlewares/auth.js');
const { exportDonationsToGoogleSheet } = require('../Apis/exportDonationsToSheet');
// عرض جميع التبرعات
router.get('/', donationController.getAllDonations);

router.get(
  '/external/export-sheet',  // ملاحظة: لازم تحط هذا قبل :id لأنه ممكن يتعارض
  verifyToken,
  checkPermission('canViewDonations'),
  donationController.exportDonationsToGoogleSheet
);

// إضافة تبرع
router.post('/', donationController.createDonation);


// عرض تبرع معين
router.get('/:id', donationController.getDonationById);

// تعديل تبرع
router.put('/:id', donationController.updateDonation);

// حذف تبرع
router.delete('/:id', donationController.deleteDonation);

// 🟢 تصدير التبرعات إلى Google Sheets


module.exports = router;
