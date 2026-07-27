const express = require('express');
const { registerMachine, listMachines, getMachine, changeMachineStatus, editMachine, removeMachine } = require('../controllers/machineController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload')

const router = express.Router();

// Supervisor can register machines with image upload
router.post(
  '/',
  (req, res, next) => {
    console.log("➡️ Route hit: POST /machines");
    next();
  },
  authMiddleware,
  roleMiddleware(['supervisor']),
  upload.single('image'),
  registerMachine
);

// Everyone can list machines
router.get('/', authMiddleware,  listMachines);

// Everyone can view a single machine
router.get('/:id', authMiddleware,  getMachine);

// Supervisor can update machine status
router.put('/:id/status', authMiddleware, roleMiddleware(['supervisor']), changeMachineStatus);

// Supervisor can edit machine details
router.put('/:id',
  authMiddleware,
  roleMiddleware(['supervisor']),
  upload.single('image'),
  editMachine
);


// Supervisor can delete machines
router.delete('/:id', authMiddleware, roleMiddleware(['supervisor']), removeMachine);

module.exports = router;
