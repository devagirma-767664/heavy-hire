const pool = require('../db');

const createMachine = async (
  make, model, serialNumber, type, year, rentalPrice, status, notes, imageUrl
) => {
  console.log("➡️ createMachine called with:", {
    make, model, serialNumber, type, year, rentalPrice, status, notes, imageUrl
  });
  try {
    const result = await pool.query(
      `INSERT INTO machines 
       (make, model, serial_number, type, year, rental_price, status, notes, image_url) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [make, model, serialNumber, type, year, rentalPrice, status, notes, imageUrl]
    );
    console.log("➡️ DB insert result:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("❌ DB error in createMachine:", err.message);
    throw err;
  }
};


const getAllMachines = async () => {
  const result = await pool.query('SELECT * FROM machines ORDER BY created_at DESC');
  return result.rows;
};

const getMachineById = async (id) => {
  const result = await pool.query('SELECT * FROM machines WHERE id = $1', [id]);
  return result.rows[0];
};

const updateMachineStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE machines SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

const updateMachine = async (
  id,
  make,
  model,
  type,
  year,
  rentalPrice,
  status,
  notes,
  imageUrl
) => {
  const result = await pool.query(
    `UPDATE machines 
     SET make = $1, model = $2, type = $3, year = $4, rental_price = $5, 
         status = $6, notes = $7, image_url = $8
     WHERE id = $9 RETURNING *`,
    [make, model, type, year, rentalPrice, status, notes, imageUrl, id]
  );
  return result.rows[0];
};

const deleteMachine = async (id) => {
  const result = await pool.query('DELETE FROM machines WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createMachine,
  getAllMachines,
  getMachineById,
  updateMachineStatus,
  updateMachine,
  deleteMachine,
};
