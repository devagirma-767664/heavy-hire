const pool = require('../db');

// Operator creates request
const createMaintenanceRequest = async (machineId, operatorId, supervisorId, status, notes) => {
  const result = await pool.query(
    `INSERT INTO maintenance_requests 
     (machine_id, operator_id, supervisor_id, status, notes, created_at,
      operator_visible, supervisor_visible, mechanic_visible) 
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, true, true, true) 
     RETURNING *`,
    [machineId, operatorId, supervisorId, status || 'pending', notes]
  );
  return result.rows[0];
};

// Supervisor activates/approves request (optionally assigns mechanic)
const updateMaintenanceStatus = async (id, status, mechanicId = null) => {
  const result = await pool.query(
    `UPDATE maintenance_requests 
     SET status = $1, 
         mechanic_id = COALESCE($3, mechanic_id), 
         updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 RETURNING *`,
    [status, id, mechanicId]
  );
  return result.rows[0];
};

// Hide request for a specific role
const hideMaintenanceRequestForRole = async (id, role) => {
  let column;
  switch (role) {
    case "operator": column = "operator_visible"; break;
    case "supervisor": column = "supervisor_visible"; break;
    case "mechanic": column = "mechanic_visible"; break;
    default: throw new Error("Invalid role");
  }

  const result = await pool.query(
    `UPDATE maintenance_requests 
     SET ${column} = false, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

// Get single request by ID
const getMaintenanceRequestById = async (id) => {
  const result = await pool.query(
    `SELECT mr.*, 
            m.make || ' ' || m.model AS machine_name,
            op.name AS operator_name,
            sup.name AS supervisor_name,
            mech.name AS mechanic_name
     FROM maintenance_requests mr
     LEFT JOIN machines m ON mr.machine_id = m.id
     LEFT JOIN users op ON mr.operator_id = op.id
     LEFT JOIN users sup ON mr.supervisor_id = sup.id
     LEFT JOIN users mech ON mr.mechanic_id = mech.id
     WHERE mr.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Supervisor & mechanic view all requests
const getAllMaintenanceRequests = async () => {
  const result = await pool.query(
    `SELECT mr.*, 
            m.make || ' ' || m.model AS machine_name,
            op.name AS operator_name,
            sup.name AS supervisor_name,
            mech.name AS mechanic_name
     FROM maintenance_requests mr
     LEFT JOIN machines m ON mr.machine_id = m.id
     LEFT JOIN users op ON mr.operator_id = op.id
     LEFT JOIN users sup ON mr.supervisor_id = sup.id
     LEFT JOIN users mech ON mr.mechanic_id = mech.id
     WHERE mr.supervisor_visible = true OR mr.mechanic_visible = true
     ORDER BY mr.created_at DESC`
  );
  return result.rows;
};

// Operator view own requests
const getMaintenanceRequestsByOperator = async (operatorId) => {
  const result = await pool.query(
    `SELECT mr.*, 
            m.make || ' ' || m.model AS machine_name,
            op.name AS operator_name,
            sup.name AS supervisor_name,
            mech.name AS mechanic_name
     FROM maintenance_requests mr
     LEFT JOIN machines m ON mr.machine_id = m.id
     LEFT JOIN users op ON mr.operator_id = op.id
     LEFT JOIN users sup ON mr.supervisor_id = sup.id
     LEFT JOIN users mech ON mr.mechanic_id = mech.id
     WHERE mr.operator_id = $1 AND mr.operator_visible = true
     ORDER BY mr.created_at DESC`,
    [operatorId]
  );
  return result.rows;
};

module.exports = {
  createMaintenanceRequest,
  updateMaintenanceStatus,
  hideMaintenanceRequestForRole,
  getMaintenanceRequestById,
  getAllMaintenanceRequests,
  getMaintenanceRequestsByOperator
};
