const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// تسجيل دخول
router.post('/login', authController.login);

// لو بدك تسجيل مستخدم عبر auth
// router.post('/register', authController.register);

module.exports = router;
