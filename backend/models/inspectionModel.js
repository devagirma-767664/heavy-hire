const pool = require('../db');

// ✅ Create inspection record with supervisor_id
const createInspection = async (
  machineId,
  mechanicId,
  contractId,
  result,
  notes,
  supervisorId
) => {
  const resultQuery = await pool.query(
    `INSERT INTO inspections 
     (machine_id, mechanic_id, contract_id, supervisor_id, result, notes, inspection_date) 
     VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *`,
    [machineId, mechanicId, contractId, supervisorId, result, notes]
  );
  return resultQuery.rows[0];
};

// ✅ Get all inspections with machine, mechanic, and supervisor details
const getAllInspections = async () => {
  const result = await pool.query(`
    SELECT i.*,
           m.make, m.model, m.serial_number, m.type AS machine_type,
           mech.name AS mechanic_name,
           sup.name AS supervisor_name,
           c.project_description, c.staff_id, c.supervisor_id
    FROM inspections i
    JOIN machines m ON i.machine_id = m.id
    JOIN users mech ON i.mechanic_id = mech.id
    LEFT JOIN users sup ON i.supervisor_id = sup.id
    JOIN contracts c ON i.contract_id = c.id
    ORDER BY i.inspection_date DESC;
  `);
  return result.rows;
};

// ✅ Get single inspection by ID with details
const getInspectionById = async (id) => {
  const result = await pool.query(`
    SELECT i.*,
           m.make, m.model, m.serial_number, m.type AS machine_type,
           mech.name AS mechanic_name,
           sup.name AS supervisor_name,
           c.project_description, c.staff_id, c.supervisor_id
    FROM inspections i
    JOIN machines m ON i.machine_id = m.id
    JOIN users mech ON i.mechanic_id = mech.id
    LEFT JOIN users sup ON i.supervisor_id = sup.id
    JOIN contracts c ON i.contract_id = c.id
    WHERE i.id = $1;
  `, [id]);
  return result.rows[0];
};

// ✅ Delete inspection
const deleteInspection = async (id) => {
  const result = await pool.query(
    'DELETE FROM inspections WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};


// ✅ Get inspections filtered by mechanic_id
const getInspectionsByMechanic = async (mechanicId) => {
  const result = await pool.query(`
    SELECT i.*,
           m.make, m.model, m.serial_number, m.type AS machine_type,
           mech.name AS mechanic_name,
           sup.name AS supervisor_name,
           c.project_description, c.staff_id, c.supervisor_id
    FROM inspections i
    JOIN machines m ON i.machine_id = m.id
    JOIN users mech ON i.mechanic_id = mech.id
    LEFT JOIN users sup ON i.supervisor_id = sup.id
    JOIN contracts c ON i.contract_id = c.id
    WHERE i.mechanic_id = $1
    ORDER BY i.inspection_date DESC;
  `, [mechanicId]);
  return result.rows;
};


module.exports = {
  createInspection,
  getAllInspections,
  getInspectionById,
  deleteInspection,
  getInspectionsByMechanic
};
