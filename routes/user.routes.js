const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.js'); // ملف الـ auth اللي فيه التحقق
const { isAdmin, checkPermission } = require('../controllers/auth.controller'); // دوال الصلاحيات

// إنشاء مستخدم جديد (عادة بس مسؤول أو عبر التسجيل في auth.routes)
router.post('/register', userController.register);

// استرجاع بيانات المستخدم الحالي (مطلوب تسجيل دخول)
router.get('/me', authMiddleware.verifyToken, userController.getCurrentUser);

// استرجاع بيانات مستخدم حسب المعرف (مطلوب تسجيل دخول)
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);

// تحديث مستخدم (مطلوب تسجيل دخول + صلاحية تعديل)
router.put('/:id', authMiddleware.verifyToken, checkPermission('update_user'), userController.updateUser);

// حذف مستخدم (مطلوب تسجيل دخول + صلاحية حذف)
router.delete('/:id', authMiddleware.verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
