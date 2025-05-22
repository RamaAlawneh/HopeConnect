const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');

router.post('/', controller.createNotification);
router.get('/:user_id', controller.getUserNotifications);
router.put('/read/:id', controller.markNotificationAsRead);
router.delete('/:id', controller.deleteNotification);

module.exports = router;
