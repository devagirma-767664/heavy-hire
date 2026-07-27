const { 
  createContract, 
  getAllContracts, 
  getContractById, 
  updateContract,        
  updateContractStatus, 
  assignOperator, 
  deleteContract,
  getReturnedContracts 
} = require('../models/contractModel');
const { updateMachineStatus } = require('../models/machinesModel');
const { createNotification } = require('../models/notificationsModel');
const { setOperatorStatus, getActiveUsers } = require('../models/userModel');

const registerContract = async (req, res) => {


  const { 
    machine_id, 
    client_id, 
    staff_id, 
    supervisor_id,
    operator_id,
    project_description,
    project_location, 
    start_date, 
    end_date, 
    duration_unit,
    duration_months,
    duration_hours,
    fixed_cost, 
    status,
    comments 
  } = req.body;

  try {
    
    // ✅ enforce staff_id from logged-in user
    const staff_id = req.user?.id || req.body.staff_id;
    if (!staff_id) {
      return res.status(400).json({ error: "Staff ID is required" });
    }
    
    // Validation based on duration_unit
    if (duration_unit === 'day' && (!start_date || !end_date)) {
      return res.status(400).json({ error: 'Start and end dates are required for day-based contracts.' });
    }
    if (duration_unit === 'month' && !duration_months) {
      return res.status(400).json({ error: 'Duration in months is required for month-based contracts.' });
    }
    if (duration_unit === 'hour' && !duration_hours) {
      return res.status(400).json({ error: 'Duration in hours is required for hour-based contracts.' });
    }

    const contract = await createContract(
      machine_id, 
      client_id, 
      staff_id, 
      supervisor_id,
      operator_id,
      project_description,
      project_location, 
      start_date || null, 
      end_date || null, 
      duration_unit,
      duration_months || null,
      duration_hours || null,
      fixed_cost, 
      status || 'pending',
      comments || null
    );

    const supervisors = await getActiveUsers();
    const supervisorList = supervisors.filter(s => s.role === 'supervisor');
    for (const sup of supervisorList) {
      await createNotification(
        sup.id,
        `Contract #${contract.id} created and awaiting approval`,
        "contract_pending"
      );
    }

    res.json({ contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listContracts = async (req, res) => {
  try {
    console.log("User role:", req.user.role, "User ID:", req.user.id);

    const contracts = await getAllContracts();
    console.log("Contracts fetched:", contracts.length);

    let filtered = contracts;

    if (req.user.role === 'staff') {
      filtered = contracts.filter(c =>
        c.staff_id === req.user.id &&
        ['pending','approved','assigned','active','returned'].includes(c.status)
      );
    }

    console.log("Filtered contracts:", filtered);

    res.json({ contracts: filtered });
  } catch (err) {
    console.error("Error in listContracts:", err);
    res.status(500).json({ error: err.message });
  }
};



const listActiveContracts = async (req, res) => {
  try {
    const contracts = await getAllContracts();
    const active = contracts.filter(c =>
      ['approved', 'assigned','active'].includes(c.status)
    );
    res.json({ contracts: active });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ List returned contracts
const listReturnedContracts = async (req, res) => {
  try {
    const contracts = await getReturnedContracts();
    res.json({ contracts });
  } catch (err) {
    console.error("Error in listReturnedContracts:", err);
    res.status(500).json({ error: err.message });
  }
};


const getContract = async (req, res) => {
  try {
    const contract = await getContractById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    res.json({ contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Staff & Supervisor can update contract details
const updateContractController = async (req, res) => {
  const { 
    project_description,
    project_location,
    fixed_cost,
    start_date,
    end_date,
    comments,
    status,
    duration_unit,
    duration_months,
    duration_hours
  } = req.body;

  try {
    const contract = await updateContract(
      req.params.id,
      project_description,
      project_location,
      fixed_cost,
      start_date,
      end_date,
      comments,
      req.user.role === 'staff' ? 'pending' : undefined,
      duration_unit,
      duration_months,
      duration_hours
    );

    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const supervisors = await getActiveUsers();
    const supervisorList = supervisors.filter(s => s.role === 'supervisor');
    for (const sup of supervisorList) {
      await createNotification(
        sup.id,
        `Contract #${contract.id} has been updated and requires review`,
        "contract_update"
      );
    }

    res.json({ message: 'Contract updated successfully', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changeContractStatus = async (req, res) => {
  const { status, comments } = req.body;
  try {
    const contract = await updateContractStatus(req.params.id, status, comments, req.user.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    res.json({ contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeContract = async (req, res) => {
  try {

    const contract = await deleteContract(req.params.id);

    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    res.json({ message: 'Contract deleted successfully', contract });

    if (contract.operator_id) {
    await setOperatorStatus(contract.operator_id, 'available');

    await createNotification(
      contract.operator_id,
      `Contract ${contract.id} was deleted. You are now available.`,
      'contract_deleted'
  );
}
    if (contract.machine_id) {
      await updateMachineStatus(contract.machine_id, 'available');
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const approveContract = async (req, res) => {
  try {
    // ✅ supervisorId comes from auth middleware (req.user.id)
    const supervisorId = req.user.id;

    // ✅ pass supervisorId into updateContractStatus
    const contract = await updateContractStatus(
      req.params.id,
      'approved',
      null,
      supervisorId
    );

    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    console.log("DEBUG: staff_id for approved contract:", contract.staff_id);
    console.log("DEBUG: supervisor_id for approved contract:", contract.supervisor_id);

    await updateMachineStatus(contract.machine_id, 'assigned');

    // ✅ notify staff
    await createNotification(
      contract.staff_id,
      `Your contract ${contract.id} has been approved.`,
      'contract_approved'
    );

    // ✅ notify supervisor (optional, but useful)
    await createNotification(
      contract.supervisor_id,
      `You approved contract ${contract.id}.`,
      'contract_approved_supervisor'
    );

    res.json({ message: 'Contract approved successfully', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const rejectContract = async (req, res) => {
  const { comments } = req.body;
  try {
    const contract = await updateContractStatus(req.params.id, 'rejected', comments);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    await createNotification(contract.staff_id, 
      `Your contract ${contract.id} was rejected. Comments: "${comments}"`, 'contract_rejected');

    res.json({ message: 'Contract rejected', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const returnContract = async (req, res) => {
  const { comments } = req.body;
  try {
    const contract = await updateContractStatus(req.params.id, 'returned', comments);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    console.log("DEBUG: staff_id for returned contract:", contract.staff_id);

    await createNotification(contract.staff_id, 
      `Your contract ${contract.id} was returned with comments: "${comments}"`, 'contract_returned');

    res.json({ message: 'Contract returned with comments', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const assignOperatorController = async (req, res) => {
  const { id } = req.params;
  const { operator_id } = req.body;

  try {
    await assignOperator(id, operator_id);
    await setOperatorStatus(operator_id, 'on duty');
    await updateContractStatus(id, 'assigned');

    const contract = await getContractById(id);

    await createNotification(operator_id, `You have been assigned to contract ${contract.id}`, 'operator_assigned');

    res.json({ message: 'Operator assigned successfully', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const listPendingContracts = async (req, res) => {
  try {
    const contracts = await getAllContracts();
    const pending = contracts.filter(c => c.status === 'pending');
    res.json({ contracts: pending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const acceptAssignment = async (req, res) => {
  try {

    console.log("Accepting assignment for contract:", req.params.id);

    const contract = await updateContractStatus(req.params.id, 'assigned');
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    
    console.log("Updated contract:", contract);

    // Notify supervisor(s)
    const supervisors = await getActiveUsers();
    const supervisorList = supervisors.filter(s => s.role === 'supervisor');
    for (const sup of supervisorList) {
      await createNotification(
        sup.id,
        `Operator accepted contract #${contract.id}. Usage can now begin.`,
        'assignment_accepted'
      );
    }

    // TODO: Transfer contract info to usage log
    // e.g., await createUsageLog(contract.id, contract.machine_id, contract.operator_id, new Date());

    res.json({ message: 'Assignment accepted successfully', contract });
  } catch (err) {
    console.error("Error in acceptAssignment:", err);
    res.status(500).json({ error: err.message });
  }
};


const requestChange = async (req, res) => {
  const { comments } = req.body;
  try {
    const contract = await getContractById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const supervisors = await getActiveUsers();
    const supervisorList = supervisors.filter(s => s.role === 'supervisor');
    for (const sup of supervisorList) {
      await createNotification(
        sup.id,
        `Operator requested change for contract #${contract.id}. Comments: "${comments}"`,
        'assignment_change_request'
      );
    }

    res.json({ message: 'Change request sent successfully', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const completeContract = async (req, res) => {
  try {
    const contract = await updateContractStatus(req.params.id, 'completed');
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    // ✅ Free the machine
    await updateMachineStatus(contract.machine_id, 'available');

    // ✅ Free the operator if assigned
    if (contract.operator_id) {
      await setOperatorStatus(contract.operator_id, 'available');
      await createNotification(
        contract.operator_id,
        `Contract ${contract.id} has been completed. You are now available.`,
        'contract_completed'
      );
    }

    // ✅ Notify staff
    await createNotification(
      contract.staff_id,
      `Your contract ${contract.id} has been marked as completed.`,
      'contract_completed'
    );

    // ✅ Trigger mechanic inspection
    if (contract.mechanic_id) {
      const inspection = await createInspection(
        contract.machine_id,
        contract.mechanic_id,
        contract.id,
        'pending',
        'Inspection required after contract completion'
      );

      await createNotification(
        contract.mechanic_id,
        `Inspection required for machine ${contract.machine_id} after contract ${contract.id} completion.`,
        'inspection_required'
      );

      if (contract.supervisor_id) {
        await createNotification(
          contract.supervisor_id,
          `Inspection created for machine ${contract.machine_id} after contract ${contract.id} completion.`,
          'inspection_created'
        );
      }
      
    };

    res.json({ message: 'Contract completed successfully', contract });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { 
  registerContract, 
  listContracts, 
  getContract, 
  updateContract: updateContractController,  
  changeContractStatus, 
  removeContract, 
  approveContract, 
  returnContract, 
  rejectContract, 
  assignOperator: assignOperatorController, 
  listPendingContracts,
  completeContract,
  acceptAssignment,
  requestChange,
  listActiveContracts ,
  listReturnedContracts
};
