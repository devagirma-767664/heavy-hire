const { 
  startUsageLog, 
  endUsageLog, 
  approveUsageLog,   
  rejectUsageLog,    
  getAllUsageLogs, 
  getUsageLogById, 
  deleteUsageLog,
  getOperatorUsageLogs,
  activateUsageLog,
  bookInspectionLog    // ✅ new
} = require('../models/usageModel');
const { createNotification } = require('../models/notificationsModel');


// Operator starts usage
const startUsage = async (req, res) => {
  const { operator_id, machine_id, contract_id, start_gauge } = req.body;
  try {
    const startPhotoPath = req.file ? `/uploads/usage_logs/${req.file.filename}` : null;

    const usageLog = await startUsageLog(
      operator_id,
      machine_id,
      contract_id,
      start_gauge,
      startPhotoPath
    );

    if (usageLog.supervisor_id) {
      await createNotification(
        usageLog.supervisor_id,
        `Usage started for machine ${machine_id}. Gauge: ${start_gauge}`
      );
    }

    res.json({ usageLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supervisor activates usage
const activateUsage = async (req, res) => {
  try {
    const usageLog = await activateUsageLog(req.params.id);
    if (!usageLog) return res.status(404).json({ error: 'Usage log not found' });

    // Notify operator
    await createNotification(
      usageLog.operator_id,
      `Your usage for machine ${usageLog.machine_id} has been activated. Contract is now in progress.`
    );

    res.json({ message: 'Usage activated, contract now in progress', usageLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Operator ends usage
const endUsage = async (req, res) => {
  const { end_gauge } = req.body;
  try {
    const endPhotoPath = req.file ? `/uploads/usage_logs/${req.file.filename}` : null;

    const usageLog = await endUsageLog(req.params.id, end_gauge, endPhotoPath);

    if (usageLog.supervisor_id) {
      await createNotification(
        usageLog.supervisor_id,
        `Usage completed for machine ${usageLog.machine_id}. Duration: ${usageLog.duration} hours`
      );
    }

    res.json({ usageLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supervisor approves usage
const approveUsage = async (req, res) => {
  try {
    const usageLog = await approveUsageLog(req.params.id);

    if (!usageLog) return res.status(404).json({ error: 'Usage log not found' });

    await createNotification(
      usageLog.operator_id,
      `Your usage for machine ${usageLog.machine_id} has been approved. Contract completed.`
    );

    res.json({ message: 'Usage approved and contract completed', usageLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supervisor rejects usage
const rejectUsage = async (req, res) => {
  try {
    const usageLog = await rejectUsageLog(req.params.id);
    if (!usageLog) return res.status(404).json({ error: 'Usage log not found' });

    await createNotification(
      usageLog.operator_id,
      `Your usage for machine ${usageLog.machine_id} was rejected. Please resubmit the end usage log.`
    );

    res.json({ message: 'Usage rejected, operator must resubmit', usageLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listUsageLogs = async (req, res) => {
  try {
    const logs = await getAllUsageLogs();
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsageLog = async (req, res) => {
  try {
    const log = await getUsageLogById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Usage log not found' });
    res.json({ log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeUsageLog = async (req, res) => {
  try {
    const log = await deleteUsageLog(req.params.id);
    if (!log) return res.status(404).json({ error: 'Usage log not found' });
    res.json({ message: 'Usage log deleted successfully', log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Operator fetches their own active usage logs
const listOperatorUsageLogs = async (req, res) => {
  try {
    const operatorId = req.user.id; // ✅ use authMiddleware
    const logs = await getOperatorUsageLogs(operatorId);

    // ✅ An operator with zero active/pending logs is a normal, valid state
    // (e.g. nothing started yet, or a log is awaiting supervisor activation) —
    // not an error condition. Always return 200 with whatever logs exist.
    res.json({ logs: logs || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supervisor books inspection after approval
const bookInspection = async (req, res) => {
  try {
    const { mechanic_id, notes } = req.body; // supervisor selects mechanic
    const inspection = await bookInspectionLog(req.params.id, mechanic_id, notes);

    if (!inspection) return res.status(404).json({ error: 'Usage log not found for inspection booking' });

    // Notify mechanic
    await createNotification(
      mechanic_id,
      `You have been assigned to inspect machine ${inspection.machine_id} for contract ${inspection.contract_id}.`,
      'inspection_assigned'
    );

    // Notify supervisor
    await createNotification(
      inspection.supervisor_id,
      `Inspection booked for machine ${inspection.machine_id} after contract ${inspection.contract_id} completion.`,
      'inspection_created'
    );

    res.json({ message: 'Inspection booked successfully', inspection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  startUsage, 
  activateUsage,   // ✅ new
  endUsage, 
  approveUsage,   
  rejectUsage,    
  listUsageLogs, 
  getUsageLog, 
  removeUsageLog,
  listOperatorUsageLogs,
  bookInspection 
};
