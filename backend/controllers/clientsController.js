const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require('../models/clientsModel');

const registerClient = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const client = await createClient(name, email, phone, address);
    res.json({ client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listClients = async (req, res) => {
  try {
    const clients = await getAllClients();
    res.json({ clients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClient = async (req, res) => {
  try {
    const client = await getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({ client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editClient = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const client = await updateClient(req.params.id, name, email, phone, address);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({ client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeClient = async (req, res) => {
  try {
    const client = await deleteClient(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted successfully', client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerClient, listClients, getClient, editClient, removeClient };
