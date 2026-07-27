const pool = require('../db');

const createClient = async (name, email, phone, address) => {
  const result = await pool.query(
    `INSERT INTO clients (name, email, phone, address) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, phone, address]
  );
  return result.rows[0];
};

const getAllClients = async () => {
  const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
  return result.rows;
};

const getClientById = async (id) => {
  const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
  return result.rows[0];
};

const updateClient = async (id, name, email, phone, address) => {
  const result = await pool.query(
    `UPDATE clients 
     SET name = $1, email = $2, phone = $3, address = $4 
     WHERE id = $5 RETURNING *`,
    [name, email, phone, address, id]
  );
  return result.rows[0];
};

const deleteClient = async (id) => {
  const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { createClient, getAllClients, getClientById, updateClient, deleteClient };
