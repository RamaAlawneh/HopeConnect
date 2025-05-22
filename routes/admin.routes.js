const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isSuperAdmin } = require('../middlewares/auth');

router.post('/register', verifyToken, isSuperAdmin, adminController.register); // only super admin
router.post('/login', adminController.login);
router.get('/', verifyToken, adminController.getAllAdmins);
router.delete('/:id', verifyToken, isSuperAdmin, adminController.deleteAdmin);

module.exports = router;
