const express = require('express');
const { registerInspection, listInspections, getInspection, removeInspection } = require('../controllers/inspectionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Mechanics can register inspections
router.post('/', authMiddleware, roleMiddleware(['mechanic']), registerInspection);

// Supervisor & Mechanic can list inspections
router.get('/', authMiddleware, roleMiddleware(['supervisor','mechanic']), listInspections);

// Supervisor & Mechanic can view a single inspection
router.get('/:id', authMiddleware, roleMiddleware(['supervisor','mechanic']), getInspection);

// Supervisor can delete inspections
router.delete('/:id', authMiddleware, roleMiddleware(['supervisor']), removeInspection);

module.exports = router;
