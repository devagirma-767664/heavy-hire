const {
  createInspection,
  getAllInspections,
  getInspectionById,
  deleteInspection,
} = require('../models/inspectionModel');
const { updateMachineStatus } = require('../models/machinesModel');
const { createNotification } = require('../models/notificationsModel');
const pool = require('../db'); // ✅ needed for custom queries

// Mechanic registers inspection
const registerInspection = async (req, res) => {
  const { machine_id, mechanic_id, supervisor_id, contract_id, result, notes } = req.body;
  try {
    // ✅ pass supervisor_id into model
    const inspection = await createInspection(
      machine_id,
      mechanic_id,
      contract_id,
      result,
      notes,
      supervisor_id
    );

    // Update machine status based on inspection result
    if (result === 'clear') {
      await updateMachineStatus(machine_id, 'available');
    } else if (result === 'needs_maintenance') {
      await updateMachineStatus(machine_id, 'under_maintenance');
      await createNotification(mechanic_id, `Machine ${machine_id} under maintenance.`);
    }

    // Notify supervisor
    if (supervisor_id) {
      await createNotification(
        supervisor_id,
        `Inspection completed for machine ${machine_id}. Result: ${result}`
      );
    }

    res.json({ inspection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ List inspections, filter by mechanic_id if provided
const listInspections = async (req, res) => {
  try {
    const { mechanic_id } = req.query;
    let inspections;

    if (mechanic_id) {
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
      `, [mechanic_id]);
      inspections = result.rows;
    } else {
      inspections = await getAllInspections();
    }

    res.json({ inspections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInspection = async (req, res) => {
  try {
    const inspection = await getInspectionById(req.params.id);
    if (!inspection) return res.status(404).json({ error: 'Inspection not found' });
    res.json({ inspection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeInspection = async (req, res) => {
  try {
    const inspection = await deleteInspection(req.params.id);
    if (!inspection) return res.status(404).json({ error: 'Inspection not found' });
    res.json({ message: 'Inspection deleted successfully', inspection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerInspection, listInspections, getInspection, removeInspection };
