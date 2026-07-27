const express = require('express');
const { scheduleDelivery, confirmDelivery, confirmReturn, listLogisticsActions } = require('../controllers/logisticsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Logistics schedules delivery
router.post('/delivery', authMiddleware, roleMiddleware(['logistics']), scheduleDelivery);

// Logistics confirms delivery
router.put('/:id/deliver', authMiddleware, roleMiddleware(['logistics']), confirmDelivery);

// Logistics confirms return
router.put('/:id/return', authMiddleware, roleMiddleware(['logistics']), confirmReturn);

// Supervisor & Logistics can list actions
router.get('/', authMiddleware, roleMiddleware(['supervisor','logistics']), listLogisticsActions);

module.exports = router;
