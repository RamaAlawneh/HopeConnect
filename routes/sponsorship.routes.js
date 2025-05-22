const express = require('express');
const router = express.Router();
const sponsorshipController = require('../controllers/sponsorship.controller');

// 📌 جميع المسارات المتعلقة بالكفالة:
router.get('/', sponsorshipController.getAllSponsorships);
router.get('/:id', sponsorshipController.getSponsorshipById);
router.post('/', sponsorshipController.createSponsorship);
router.put('/:id', sponsorshipController.updateSponsorship);
router.delete('/:id', sponsorshipController.deleteSponsorship);

module.exports = router;
