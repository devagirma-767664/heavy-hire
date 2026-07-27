const express = require('express');
const { sendNotification, listNotifications, markRead, removeNotification } = require('../controllers/notificationsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Any role can view their own notifications
router.get('/', authMiddleware, listNotifications);

// Mark a notification as read
router.put('/:id/read', authMiddleware, markRead);

// Delete a notification
router.delete('/:id', authMiddleware, removeNotification);

// Admin/Supervisor can send notifications manually (optional)
router.post('/', authMiddleware, sendNotification);

module.exports = router;
