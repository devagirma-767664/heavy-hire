const {
  createMaintenanceRequest,
  updateMaintenanceStatus,
  getMaintenanceRequestById,
  getAllMaintenanceRequests,
  getMaintenanceRequestsByOperator,
  hideMaintenanceRequestForRole,
} = require('../models/maintenanceModel');
const { createNotification } = require('../models/notificationsModel');

// Operator submits maintenance request
const registerMaintenanceRequest = async (req, res) => {

  const { machine_id, operator_id, supervisor_id, notes } = req.body;

  try {
    const request = await createMaintenanceRequest(
      machine_id,
      operator_id,
      supervisor_id,
      'pending',
      notes
    );

    // Notify supervisor
    await createNotification(
      supervisor_id,
      `New maintenance request submitted for machine ${machine_id} by operator ${operator_id}.`
    );

    res.json({ request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supervisor approves/rejects/completes maintenance
const changeMaintenanceStatus = async (req, res) => {
  const { status, mechanic_id } = req.body;
  try {
    const request = await updateMaintenanceStatus(req.params.id, status, mechanic_id);
    if (!request)
      return res.status(404).json({ error: 'Maintenance request not found' });

    if (status === 'approved') {
      // Notify operator
      await createNotification(
        request.operator_id,
        `Your maintenance request for machine ${request.machine_id} was approved.`
      );
      // Notify mechanic (assigned)
      if (request.mechanic_id) {
        await createNotification(
          mechanic_id,
          `Maintenance approved for machine ${request.machine_id}. You are assigned to complete it.`
        );
      }
    } else if (status === 'rejected') {
      // Notify operator
      await createNotification(
        request.operator_id,
        `Maintenance request rejected for machine ${request.machine_id}.`
      );
    } else if (status === 'completed') {
      // Notify supervisor
      await createNotification(
        request.supervisor_id,
        `Maintenance completed for machine ${request.machine_id} by mechanic ${request.mechanic_id}.`
      );
      // Notify operator
      await createNotification(
        request.operator_id,
        `Maintenance completed for your request on machine ${request.machine_id}.`
      );
    }

    res.json({ request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all requests (supervisor/mechanic view)
const listMaintenanceRequests = async (req, res) => {
  try {
    const requests = await getAllMaintenanceRequests();
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List operator’s own requests
const listOperatorRequests = async (req, res) => {
  try {
    const requests = await getMaintenanceRequestsByOperator(req.user.id);
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single request by ID
const getMaintenanceRequest = async (req, res) => {
  try {
    const request = await getMaintenanceRequestById(req.params.id);
    if (!request)
      return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove request from a role’s page (soft delete)
const removeMaintenanceRequestForRole = async (req, res) => {
  const { role } = req.body;
  try {
    const request = await hideMaintenanceRequestForRole(req.params.id, role);
    if (!request)
      return res.status(404).json({ error: 'Maintenance request not found' });

    res.json({ request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerMaintenanceRequest,
  changeMaintenanceStatus,
  listMaintenanceRequests,
  getMaintenanceRequest,
  listOperatorRequests,
  removeMaintenanceRequestForRole,
};
