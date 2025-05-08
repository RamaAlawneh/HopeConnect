const express = require('express');
const router = express.Router();
const controller = require('../controllers/volunteerController');

router.get('/', controller.getAllVolunteers);
router.post('/', controller.addVolunteer);

module.exports = router;
