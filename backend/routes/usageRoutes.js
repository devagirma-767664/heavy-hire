const express = require('express');
const { 
  startUsage, 
  activateUsage,   
  endUsage, 
  approveUsage,   
  rejectUsage,    
  listUsageLogs, 
  getUsageLog, 
  removeUsageLog,
  listOperatorUsageLogs,
  bookInspection   // ✅ new
} = require('../controllers/usageController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const uploadUsagePhoto = require('../middleware/usageUpload');

const router = express.Router();

// Step 1: Operator starts usage
router.post(
  '/start',
  authMiddleware,
  roleMiddleware(['operator']),
  uploadUsagePhoto.single('start_photo'),
  startUsage
);

// Step 2a: Supervisor activates usage
router.put(
  '/:id/activate',
  authMiddleware,
  roleMiddleware(['supervisor']),
  activateUsage
);

// Step 2b: Operator ends usage
router.put(
  '/:id/end',
  authMiddleware,
  roleMiddleware(['operator']),
  uploadUsagePhoto.single('end_photo'),
  endUsage
);

// Step 3: Supervisor approves usage (contract completion only)
router.put(
  '/:id/approve',
  authMiddleware,
  roleMiddleware(['supervisor']),
  approveUsage
);

// Step 3b: Supervisor books inspection after approval
router.post(
  '/:id/book-inspection',
  authMiddleware,
  roleMiddleware(['supervisor']),
  bookInspection
);

// Step 4: Supervisor rejects usage
router.put(
  '/:id/reject',
  authMiddleware,
  roleMiddleware(['supervisor']),
  rejectUsage
);

// Supervisor & Operator can list usage logs
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['supervisor','operator']),
  listUsageLogs
);

// ✅ Operator can list their own active usage logs
router.get(
  '/operator',
  authMiddleware,
  roleMiddleware(['operator']),
  listOperatorUsageLogs
);

// Supervisor & Operator can view a single usage log
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['supervisor','operator']),
  getUsageLog
);

// Supervisor can delete usage logs (optional)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['supervisor']),
  removeUsageLog
);

module.exports = router;
