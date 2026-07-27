const express = require('express');

const { registerUser, loginUser, approveUserAccount, listPendingUsers, deleteUserAccount, listActiveUsers, listAvailableOperators, updateUserStatus, toggleUserStatusController, listAvailableMechanics } = require('../controllers/userControllers');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/approve/:id', authMiddleware, roleMiddleware(['supervisor']), approveUserAccount);
router.get('/pending', authMiddleware, roleMiddleware(['supervisor']), listPendingUsers);
router.delete('/delete/:id', authMiddleware, roleMiddleware(['supervisor']), deleteUserAccount);
router.get('/active', authMiddleware, roleMiddleware(['supervisor']), listActiveUsers);
router.get('/operators/available', listAvailableOperators);
router.patch(
  '/status/:id',
  authMiddleware,
  roleMiddleware(['supervisor']),
  updateUserStatus
);

router.put('/:id/toggle-status', authMiddleware, roleMiddleware(['supervisor']), toggleUserStatusController);

router.get('/mechanics/available', authMiddleware, roleMiddleware(['supervisor']), listAvailableMechanics);



module.exports = router;
