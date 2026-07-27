require('dotenv').config();
const { Pool } = require('pg');

console.log('DATABASE_URL from env:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('connect', async (client) => {
  console.log('New client connected, setting search_path...');
  await client.query('SET search_path TO public');
  console.log('search_path set successfully');
});

module.exports = pool;