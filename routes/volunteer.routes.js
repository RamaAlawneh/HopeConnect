const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteer.controller');

router.get('/', volunteerController.getAllVolunteers);
router.get('/:id', volunteerController.getVolunteerById);
router.get('/volunteers/by-skill', volunteerController.getVolunteersBySkill);
router.post('/', volunteerController.createVolunteer);
router.post('/volunteers/:id/assign', volunteerController.assignToRequest);
router.get('/volunteers/:id/requests', volunteerController.getVolunteerRequests);

router.put('/:id', volunteerController.updateVolunteer);
router.delete('/:id', volunteerController.deleteVolunteer);

module.exports = router;
