const express = require('express');
const { registerClient, listClients, getClient, editClient, removeClient } = require('../controllers/clientsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Staff can register clients
router.post('/', authMiddleware, roleMiddleware(['staff']), registerClient);

// Supervisor can view all clients
router.get('/', authMiddleware, roleMiddleware(['staff','supervisor']), listClients);

// Staff can view a single client
router.get('/:id', authMiddleware, roleMiddleware(['staff','supervisor']), getClient);

// Staff can update client info
router.put('/:id', authMiddleware, roleMiddleware(['staff']), editClient);

// Supervisor can delete clients
router.delete('/:id', authMiddleware, roleMiddleware(['staff','supervisor']), removeClient);

module.exports = router;
