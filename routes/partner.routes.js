const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partner.controller');

router.get('/', partnerController.getAllPartners);
router.post('/', partnerController.createPartner);

router.put('/:id', partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);
router.get('/:id', partnerController.getPartnerById);


module.exports = router;
