const { createLogisticsAction, updateLogisticsStatus, getLogisticsActionById, getAllLogisticsActions } = require('../models/logisticsModel');
const { createNotification } = require('../models/notificationsModel');

// Logistics schedules delivery
const scheduleDelivery = async (req, res) => {
  try {
    const { contract_id, machine_id, logistics_id } = req.body;

    const action = await createLogisticsAction(contract_id, machine_id, logistics_id, 'deliver', 'pending');
    res.json({ message: 'Delivery scheduled successfully', logistics_action: action });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to schedule delivery' });
  }
};

// Logistics confirms delivery
const confirmDelivery = async (req, res) => {
  try {
    const action = await updateLogisticsStatus(req.params.id, 'completed');
    if (!action) return res.status(404).json({ error: 'Logistics action not found' });

    await createNotification(action.supervisor_id, `Machine ${action.machine_id} delivered for contract ${action.contract_id}.`);
    res.json({ message: 'Delivery confirmed', action });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logistics confirms return
const confirmReturn = async (req, res) => {
  try {
    const action = await updateLogisticsStatus(req.params.id, 'completed');
    if (!action) return res.status(404).json({ error: 'Logistics action not found' });

    // Notify supervisor + mechanic
    await createNotification(action.supervisor_id, `Machine ${action.machine_id} returned.`);
    await createNotification(action.mechanic_id, `Inspection required for machine ${action.machine_id}.`);

    res.json({ message: 'Return confirmed, inspection triggered', action });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List logistics actions
const listLogisticsActions = async (req, res) => {
  try {
    const actions = await getAllLogisticsActions();
    res.json({ actions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { scheduleDelivery, confirmDelivery, confirmReturn, listLogisticsActions };
