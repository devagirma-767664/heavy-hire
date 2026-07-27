const { createNotification, getUserNotifications, markNotificationRead, deleteNotification } = require('../models/notificationsModel')

const sendNotification = async (req, res) => {
  const { user_id, message } = req.body;
  try {
    const notification = await createNotification(user_id, message);
    res.json({ notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listNotifications = async (req, res) => {
  try {
    const notifications = await getUserNotifications(req.user.id); // current logged-in user
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notification = await markNotificationRead(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeNotification = async (req, res) => {
  try {
    const notification = await deleteNotification(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification deleted successfully', notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendNotification, listNotifications, markRead, removeNotification };
