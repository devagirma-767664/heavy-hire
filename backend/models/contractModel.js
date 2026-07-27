const pool = require('../db');
const {setOperatorStatus} = require('../models/userModel');

const createContract = async (
  machineId, 
  clientId, 
  staffId, 
  supervisorId,
  operatorId,
  projectDescription,
  projectLocation, 
  startDate, 
  endDate, 
  durationUnit,
  durationMonths,
  durationHours,
  fixedCost, 
  status,
  comments
) => {
  const result = await pool.query(
    `INSERT INTO contracts 
     (machine_id, client_id, staff_id, supervisor_id, operator_id, 
      project_description, project_location, start_date, end_date,
      duration_unit, duration_months, duration_hours,
      fixed_cost, status, comments) 
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     RETURNING *`,
    [
      machineId,
      clientId,
      staffId,
      supervisorId || null,
      operatorId || null,
      projectDescription,
      projectLocation,
      startDate || null,
      endDate || null,
      durationUnit,
      durationMonths || null,
      durationHours || null,
      fixedCost,
      status,
      comments || null,
    ]
  );
  return result.rows[0];
};

const getAllContracts = async () => {
  const result = await pool.query(`
    SELECT c.*,
      c.usage_started,  
       m.make AS machine_make,
       m.model AS machine_model,
       m.serial_number,
       m.type AS machine_type,
       m.year,
       m.rental_price,
       cl.name AS client_name,
       cl.email AS client_email,
       cl.phone AS client_phone,
       cl.address AS client_address,
       u.name AS operator_name
    FROM contracts c
    JOIN machines m ON c.machine_id = m.id
    JOIN clients cl ON c.client_id = cl.id
    LEFT JOIN users u ON c.operator_id = u.id
    ORDER BY c.created_at DESC;
  `);
  return result.rows;
};

const getContractById = async (id) => {
  const result = await pool.query(`
    SELECT c.*,
       m.make AS machine_make,
       m.model AS machine_model,
       m.serial_number,
       m.type AS machine_type,
       m.year,
       m.rental_price,
       cl.name AS client_name,
       cl.email AS client_email,
       cl.phone AS client_phone,
       cl.address AS client_address,
       u.name AS operator_name
    FROM contracts c
    JOIN machines m ON c.machine_id = m.id
    JOIN clients cl ON c.client_id = cl.id
    LEFT JOIN users u ON c.operator_id = u.id
    WHERE c.id = $1;
  `, [id]);
  return result.rows[0];
};

const updateContract = async (
  id,
  projectDescription,
  projectLocation,
  fixedCost,
  startDate,
  endDate,
  comments,
  status
) => {
   await pool.query(
    `UPDATE contracts 
     SET project_description = COALESCE($2, project_description),
         project_location = COALESCE($3, project_location),
         fixed_cost = COALESCE($4, fixed_cost),
         start_date = COALESCE($5, start_date),
         end_date = COALESCE($6, end_date),
         comments = COALESCE($7, comments),
         status = COALESCE($8, status),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id, projectDescription, projectLocation, fixedCost, startDate, endDate, comments, status]
  );
  const result = await pool.query(
    `SELECT c.*, c.staff_id, c.supervisor_id
     FROM contracts c
     WHERE c.id = $1`,
    [id]
  );

  return result.rows[0];
};


const getReturnedContracts = async () => {
  const result = await pool.query(`
    SELECT c.*,
       m.make,
       m.model,
       m.serial_number,
       m.type AS machine_type,
       m.year,
       m.rental_price,
       cl.name AS client_name,
       cl.email AS client_email,
       cl.phone AS client_phone,
       cl.address AS client_address,
       u.name AS operator_name
    FROM contracts c
    JOIN machines m ON c.machine_id = m.id
    JOIN clients cl ON c.client_id = cl.id
    LEFT JOIN users u ON c.operator_id = u.id
    WHERE c.status = 'returned'
    ORDER BY c.created_at DESC;
  `);
  return result.rows;
};

const updateContractStatus = async (id, status, comments = null, supervisorId = null) => {
  // 1. Update contract status, comments, and supervisor if provided
  const result = await pool.query(
    `UPDATE contracts 
     SET status = $1,
         comments = COALESCE($3, comments),
         supervisor_id = COALESCE($4, supervisor_id),   -- ✅ update supervisor_id if passed
         updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING *`,
    [status, id, comments, supervisorId]
  );

  if (!result.rows[0]) return null;

  // 2. Return contract with staff_id and supervisor_id for notifications
  const contractWithUsers = await pool.query(
    `SELECT c.*, c.staff_id, c.supervisor_id
     FROM contracts c
     WHERE c.id = $1`,
    [id]
  );

  return contractWithUsers.rows[0];
};


const assignOperator = async (id, operatorId) => {
  const result = await pool.query(
    `UPDATE contracts 
     SET operator_id = $2, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $1 
     RETURNING *`,
    [id, operatorId]
  );
  if (operatorId) {
    await setOperatorStatus(operatorId, 'on duty');
  }
  return await getContractById(id);
};

const deleteContract = async (id) => {
  const result = await pool.query(
    'DELETE FROM contracts WHERE id = $1 RETURNING *',
    [id]
  );
  const contract = result.rows[0];

  if (contract && contract.operator_id) {
    await setOperatorStatus(contract.operator_id, 'available');
  }

  return contract;
};


module.exports = { 
  createContract, 
  getAllContracts, 
  getContractById, 
  updateContract,        // ✅ new function
  updateContractStatus, 
  assignOperator, 
  deleteContract,
  getReturnedContracts 
};
