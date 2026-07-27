const pool = require('../db');

// Step 1: Start usage log
const startUsageLog = async (operatorId, machineId, contractId, startGauge, startPhoto) => {
  const result = await pool.query(
    `INSERT INTO usage_logs 
     (operator_id, machine_id, contract_id, start_gauge, start_photo, start_time) 
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
    [operatorId, machineId, contractId, startGauge, startPhoto]
  );
  await pool.query (
    `UPDATE contracts SET usage_started = TRUE WHERE id = $1`,
    [contractId]
  )
   const usageLogWithSupervisor = await pool.query(
    `SELECT ul.*, c.supervisor_id
     FROM usage_logs ul
     JOIN contracts c ON ul.contract_id = c.id
     WHERE ul.id = $1`,
    [result.rows[0].id]
  );

  return usageLogWithSupervisor.rows[0];
};

// Step 2: End usage log
const endUsageLog = async (id, endGauge, endPhoto) => {
  const result = await pool.query(
    `UPDATE usage_logs 
     SET end_gauge = $1, end_photo = $2, end_time = CURRENT_TIMESTAMP,
         duration = $1 - start_gauge,
         supervisor_reviewed = FALSE,
         approved = NULL
     WHERE id = $3 RETURNING *`,
    [endGauge, endPhoto, id]
  );
   const usageLogWithSupervisor = await pool.query(
    `SELECT ul.*, c.supervisor_id
     FROM usage_logs ul
     JOIN contracts c ON ul.contract_id = c.id
     WHERE ul.id = $1`,
    [result.rows[0].id]
  );

  return usageLogWithSupervisor.rows[0];
};

// Supervisor marks usage as reviewed
const reviewUsageLog = async (id) => {
  const result = await pool.query(
    `UPDATE usage_logs 
     SET supervisor_reviewed = TRUE
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

// Get all usage logs
const getAllUsageLogs = async () => {
  const result = await pool.query(
    `SELECT ul.*,
            ul.start_photo, ul.end_photo, 
            u.name AS operator_name, 
            CONCAT(m.make, m.type , m.model) AS machine_name,
            c.supervisor_id,
            c.duration_hours AS contract_duration
     FROM usage_logs ul
     JOIN users u ON ul.operator_id = u.id
     JOIN machines m ON ul.machine_id = m.id
     JOIN contracts c ON ul.contract_id = c.id
     ORDER BY ul.start_time DESC`
  );
  return result.rows;
};

// Get usage log by ID
const getUsageLogById = async (id) => {
  const result = await pool.query(
    `SELECT ul.*,
            ul.start_photo, ul.end_photo, 
            u.name AS operator_name, 
            CONCAT(m.make, m.type, m.model) AS machine_name,   
            c.supervisor_id,
            c.duration_hours AS contract_duration
     FROM usage_logs ul
     JOIN users u ON ul.operator_id = u.id
     JOIN machines m ON ul.machine_id = m.id
     JOIN contracts c ON ul.contract_id = c.id
     WHERE ul.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Delete usage log
const deleteUsageLog = async (id) => {
  const result = await pool.query('DELETE FROM usage_logs WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// Approve usage log
const approveUsageLog = async (id) => {
  // 1. Mark usage as approved
  const usageResult = await pool.query(
    `UPDATE usage_logs
     SET supervisor_reviewed = TRUE, approved = TRUE
     WHERE id = $1 RETURNING *`,
    [id]
  );
  const usageLog = usageResult.rows[0];

  if (!usageLog) return null;

  // 2. Complete contract (free operator + machine)
  await pool.query(
    `UPDATE contracts
     SET status = 'completed'
     WHERE id = $1`,
    [usageLog.contract_id]
  );

  await pool.query(
    `UPDATE machines
     SET status = 'available'
     WHERE id = $1`,
    [usageLog.machine_id]
  );

  await pool.query(
    `UPDATE users
     SET status = 'available'
     WHERE id = $1`,
    [usageLog.operator_id]
  );

  return usageLog ;

};


const rejectUsageLog = async (id) => {
  const usageResult = await pool.query(
    `UPDATE usage_logs
     SET supervisor_reviewed = TRUE,
         approved = FALSE,
         end_time = NULL,       -- ✅ clear end_time
         end_gauge = NULL,      -- ✅ clear end_gauge
         end_photo = NULL       -- ✅ clear photo
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return usageResult.rows[0];
};


// Get usage logs for a specific operator
const getOperatorUsageLogs = async (operatorId) => {
  const result = await pool.query(
    `SELECT ul.*, 
            c.id AS contract_id,
            c.status AS contract_status,
            c.supervisor_id,   
            m.make, m.model, m.serial_number
     FROM usage_logs ul
     JOIN contracts c ON ul.contract_id = c.id
     JOIN machines m ON ul.machine_id = m.id
     WHERE ul.operator_id = $1
       AND ul.activated = TRUE
       AND (ul.end_time IS NULL OR ul.approved = FALSE) 
     ORDER BY ul.start_time DESC`,
    [operatorId]
  );
  return result.rows;
};
;


// Supervisor activates usage log (moves contract to in_progress)
const activateUsageLog = async (id) => {
  const usageResult = await pool.query(
    `UPDATE usage_logs
     SET activated = TRUE, supervisor_reviewed = FALSE, approved = NULL
     WHERE id = $1 RETURNING *`,
    [id]
  );
  const usageLog = usageResult.rows[0];
  if (!usageLog) return null;
  return usageLog;
};


const bookInspectionLog = async (usageId, mechanicId, notes) => {
  // Fetch usage log with contract + machine
  const usageResult = await pool.query(
    `SELECT ul.*, c.supervisor_id, c.id AS contract_id
     FROM usage_logs ul
     JOIN contracts c ON ul.contract_id = c.id
     WHERE ul.id = $1`,
    [usageId]
  );
  const usageLog = usageResult.rows[0];
  if (!usageLog) return null;

  // Create inspection record
  const inspectionResult = await pool.query(
    `INSERT INTO inspections 
     (machine_id, mechanic_id, contract_id, supervisor_id, result, notes, inspection_date)
     VALUES ($1, $2, $3, $4, 'pending', $5, CURRENT_TIMESTAMP)
     RETURNING *`,
    [usageLog.machine_id, mechanicId, usageLog.contract_id, usageLog.supervisor_id, notes]
  );

  return inspectionResult.rows[0];
};




module.exports = { 
  startUsageLog, 
  endUsageLog, 
  reviewUsageLog, 
  getAllUsageLogs, 
  getUsageLogById, 
  deleteUsageLog,
  approveUsageLog,
  rejectUsageLog,
  getOperatorUsageLogs,
  activateUsageLog,
  bookInspectionLog
};
