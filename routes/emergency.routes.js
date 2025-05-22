const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency.controller');

// المسارات المتاحة للحالات الطارئة
router.post('/', emergencyController.createEmergency);         // POST: إنشاء
router.get('/', emergencyController.getEmergencies);           // GET: جلب الكل
router.get('/:id', emergencyController.getEmergencyById);      // GET: جلب حالة معينة
router.put('/:id', emergencyController.updateEmergency);       // PUT: تعديل
router.delete('/:id', emergencyController.deleteEmergency);    // DELETE: حذف

module.exports = router;
