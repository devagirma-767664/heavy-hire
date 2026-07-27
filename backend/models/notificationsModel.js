const pool = require('../db');

const createNotification = async (userId, message, type = 'general') => {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, message, type) 
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, message, type]
  );
  return result.rows[0];
};

const getUserNotifications = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const markNotificationRead = async (id) => {
  const result = await pool.query(
    'UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

const deleteNotification = async (id) => {
  const result = await pool.query('DELETE FROM notifications WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { createNotification, getUserNotifications, markNotificationRead, deleteNotification };
