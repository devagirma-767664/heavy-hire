const { 
  createMachine, 
  getAllMachines, 
  getMachineById, 
  updateMachineStatus, 
  updateMachine, 
  deleteMachine 
} = require('../models/machinesModel');

const registerMachine = async (req, res) => {
  const { make, model, serial_number, type, year, rental_price, status, notes } = req.body;

  console.log("➡️ Incoming request body:", req.body);
  console.log("➡️ Incoming file:", req.file);

  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/machines/${req.file.filename}`;
  }

  console.log("➡️ Values passed to createMachine:", {
    make,
    model,
    serial_number,
    type,
    year,
    rental_price,
    status,
    notes,
    imageUrl
  });

  try {
    const machine = await createMachine(
      make,
      model,
      serial_number,
      type,
      year,
      rental_price,
      status,
      notes,
      imageUrl
    );
    res.json({ machine });
  } catch (err) {
    console.error("❌ Error creating machine:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: "Failed to create machine" });
  }
};




const listMachines = async (req, res) => {
  try {
    const machines = await getAllMachines();
    res.json({ machines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMachine = async (req, res) => {
  try {
    const machine = await getMachineById(req.params.id);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json({ machine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changeMachineStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const machine = await updateMachineStatus(req.params.id, status);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json({ machine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editMachine = async (req, res) => {
  const { make, model, type, year, rental_price, status, notes } = req.body;
  // ✅ if a new file is uploaded, use it; otherwise keep existing
  const image_url = req.file ? `/uploads/machines/${req.file.filename}` : req.body.image_url;

  try {
    const machine = await updateMachine(
      req.params.id,
      make,
      model,
      type,
      year,
      rental_price,
      status,
      notes,
      image_url
    );
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json({ machine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const removeMachine = async (req, res) => {
  try {
    const machine = await deleteMachine(req.params.id);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    res.json({ message: 'Machine deleted successfully', machine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerMachine, listMachines, getMachine, changeMachineStatus, editMachine, removeMachine };
