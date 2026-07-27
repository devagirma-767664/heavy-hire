const express = require('express');
const cors = require('cors');
const pool = require('./db');


const userRoutes = require('./routes/userRoutes');
const machineRoutes = require('./routes/machineRoutes');
const contractRoutes = require('./routes/contractRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const usageRoutes = require('./routes/usageRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const clientRoutes = require('./routes/clientsRoutes')
const notificationRouter = require('./routes/notificationRoutes')

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.use('/api/users', userRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRouter);


app.get('/', (req, res) => {
  res.send('Rental System API is running!');
});


app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
