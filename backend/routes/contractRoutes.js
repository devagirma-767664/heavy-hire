const express = require('express');
const {
  registerContract,
  listContracts,
  listActiveContracts,
  listReturnedContracts,   // ✅ import returned contracts
  getContract,
  removeContract,
  approveContract,
  returnContract,
  rejectContract,
  assignOperator, 
  listPendingContracts,
  updateContract,
  completeContract,
  acceptAssignment,
  requestChange
} = require('../controllers/contractController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Staff can register contracts
router.post('/', authMiddleware, roleMiddleware(['staff']), registerContract);

// Staff, Supervisor, Operator can list contracts
router.get('/', authMiddleware, roleMiddleware(['staff', 'supervisor', 'operator']), listContracts);

// ✅ New route for active contracts (must come before /:id)
router.get('/active', authMiddleware, roleMiddleware(['staff','supervisor','operator']), listActiveContracts);

// ✅ New route for returned contracts (must come before /:id)
router.get('/returned', authMiddleware, roleMiddleware(['staff','supervisor']), listReturnedContracts);

// Supervisor can list pending contracts
router.get('/pending', authMiddleware, roleMiddleware(['supervisor']), listPendingContracts);

// Staff, Supervisor, Operator can view a single contract
router.get('/:id', authMiddleware, roleMiddleware(['staff', 'supervisor', 'operator']), getContract);

// Staff & Supervisor can update contracts
router.put('/:id', authMiddleware, roleMiddleware(['staff', 'supervisor']), updateContract);

// Supervisor can approve contracts
router.put('/:id/approve', authMiddleware, roleMiddleware(['supervisor']), approveContract);

// Supervisor can reject contracts
router.put('/:id/reject', authMiddleware, roleMiddleware(['supervisor']), rejectContract);

// Supervisor can return contracts
router.put('/:id/return', authMiddleware, roleMiddleware(['supervisor']), returnContract);

// Supervisor can assign operator
router.put('/:id/assign-operator', authMiddleware, roleMiddleware(['supervisor']), assignOperator);

// Supervisor can delete contracts
router.delete('/:id', authMiddleware, roleMiddleware(['supervisor']), removeContract);

// Supervisor can mark contract complete
router.put('/:id/complete', authMiddleware, roleMiddleware(['supervisor']), completeContract);

// Operator accepts assignment
router.put('/:id/accept-assignment', authMiddleware, roleMiddleware(['operator']), acceptAssignment);

// Operator requests change
router.put('/:id/request-change', authMiddleware, roleMiddleware(['operator']), requestChange);

module.exports = router;
