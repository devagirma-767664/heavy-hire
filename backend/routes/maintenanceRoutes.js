const express = require('express');
const {
  registerMaintenanceRequest,
  changeMaintenanceStatus,
  listMaintenanceRequests,
  getMaintenanceRequest,
  listOperatorRequests,
  removeMaintenanceRequestForRole
} = require('../controllers/maintenanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Operator submits maintenance request
router.post('/', authMiddleware, roleMiddleware(['operator']), registerMaintenanceRequest);

// Operator can view their own requests
router.get('/my', authMiddleware, roleMiddleware(['operator']), listOperatorRequests);

// Supervisor & Mechanic can list all requests
router.get('/', authMiddleware, roleMiddleware(['supervisor','mechanic']), listMaintenanceRequests);

// Supervisor & Mechanic can view a single request
router.get('/:id', authMiddleware, roleMiddleware(['supervisor','mechanic']), getMaintenanceRequest);

// Supervisor approves/rejects, Mechanic completes
router.put('/:id/status', authMiddleware, roleMiddleware(['supervisor','mechanic']), changeMaintenanceStatus);

// Remove request from a role’s page (soft delete visibility)
router.put('/:id/remove', authMiddleware, roleMiddleware(['operator','supervisor','mechanic']), removeMaintenanceRequestForRole);

module.exports = router;
