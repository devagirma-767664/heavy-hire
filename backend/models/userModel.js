const pool = require('../db');

const createUser = async (name, email, role, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, role, password_hash, approved, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, email, role, hashedPassword, false, 'available']
  );
  return result.rows[0];
};


const approveUser = async (userId) => {
  const result = await pool.query(
    'UPDATE users SET approved = TRUE WHERE id = $1 RETURNING *',
    [userId]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const getActiveUsers = async () => {
  const result = await pool.query('SELECT * FROM users WHERE approved = TRUE');
  return result.rows;
}



const getPendingUsers = async () => {
  const result = await pool.query('SELECT * FROM users WHERE approved = FALSE');
  return result.rows;
};


const deleteUser = async (id) => {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};


const setOperatorStatus = async (operatorId, status) => {
  const result = await pool.query(
    'UPDATE users SET status = $1 WHERE id = $2 RETURNING *',
    [status, operatorId]
  );
  return result.rows[0];
};


const getAvailableOperators = async () => {
  const result = await pool.query(
    'SELECT * FROM users WHERE role = $1 AND status = $2 AND approved = TRUE',
    ['operator', 'available']
  );
  return result.rows;
};


const toggleUserStatus = async (id) => {
  const result = await pool.query(
    `UPDATE users
     SET status = CASE
       WHEN status = 'on duty' THEN 'available'
       ELSE 'on duty'
     END,
     updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};


module.exports = { createUser, approveUser, findUserByEmail, getPendingUsers, deleteUser, getActiveUsers, getAvailableOperators, setOperatorStatus, toggleUserStatus };
