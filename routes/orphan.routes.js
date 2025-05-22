const express = require('express');
const router = express.Router();
const orphanController = require('../controllers/orphan.controller');

// عرض كل الأيتام
router.get('/', orphanController.getAllOrphans);

// إضافة يتيم
router.post('/', orphanController.createOrphan);

// عرض يتيم معين
router.get('/:id', orphanController.getOrphanById);

// تعديل يتيم
router.put('/:id', orphanController.updateOrphan);

// حذف يتيم
router.delete('/:id', orphanController.deleteOrphan);

module.exports = router;
