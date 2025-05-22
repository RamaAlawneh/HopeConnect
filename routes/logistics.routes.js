const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');

router.get('/', logisticsController.getAllLogistics);
router.get('/:id', logisticsController.getLogisticsById);
router.post('/', logisticsController.createLogistics);
router.put('/:id', logisticsController.updateLogistics);
router.delete('/:id', logisticsController.deleteLogistics);

module.exports = router;
