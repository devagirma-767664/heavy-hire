const pool = require('../db');

// Create a logistics action (delivery or pickup)
const createLogisticsAction = async (contractId, machineId, logisticsId, action, status = 'pending') => {
  const result = await pool.query(
    `INSERT INTO logistics_actions 
     (contract_id, machine_id, logistics_id, action, status) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [contractId, machineId, logisticsId, action, status]
  );
  return result.rows[0];
};

// Update logistics status (e.g., mark as completed)
const updateLogisticsStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE logistics_actions 
     SET status = $1 
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

// Get a single logistics action
const getLogisticsActionById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM logistics_actions WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// Get all logistics actions
const getAllLogisticsActions = async () => {
  const result = await pool.query(
    'SELECT * FROM logistics_actions ORDER BY timestamp DESC'
  );
  return result.rows;
};

module.exports = {
  createLogisticsAction,
  updateLogisticsStatus,
  getLogisticsActionById,
  getAllLogisticsActions
};
