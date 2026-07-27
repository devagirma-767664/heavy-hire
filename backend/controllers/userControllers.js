const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, approveUser, getPendingUsers, deleteUser, getActiveUsers, getAvailableOperators, setOperatorStatus, toggleUserStatus } = require('../models/userModel');
const { createNotification } = require('../models/notificationsModel');


const registerUser = async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, role, hashedPassword);

    const supervisors = await getActiveUsers();
    const supervisorList = supervisors.filter(s => s.role === 'supervisor');
    for (const sup of supervisorList) {
      await createNotification(
        sup.id,
        `New user ${user.name} registered and is pending approval`,
        "user_registration"
      );
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!user.approved) {
      return res.status(403).json({ error: 'Account not yet approved by supervisor' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
console.log('JWT_SECRET at sign time:', process.env.JWT_SECRET);
    const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
    res.json({ 
      token,
      user: {
        name: user.name,
        id: user.id,
        email: user.email,
        role: user.role
      },
      expiresIn: 3600 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const approveUserAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await approveUser(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await createNotification(
      user.id,
      `Your account has been approved and is now active.`,
      "account_approved"
    );

    res.json({ message: 'User approved successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listPendingUsers = async (req, res) => {
  try {
    const users = await getPendingUsers();
    res.json({ pending: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listActiveUsers = async (req,res) => {
  try {
    const users = await getActiveUsers();
    res.json({active: users});
  } catch (err) {
    res.status(500).json({error: err.message})
  };
};


const deleteUserAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await deleteUser(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ If the deleted user is an operator, free them
    if (user.role === 'operator') {
      await setOperatorStatus(user.id, 'available');
    }

    res.json({ message: 'User deleted successfully', user });
  } catch (err) {
    console.error('Delete user error:', err); // helpful for debugging
    res.status(500).json({ error: err.message });
  }
};


const listAvailableOperators = async (req, res) => {
  try {
    const users = await getAvailableOperators();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const listAvailableMechanics = async (req, res) => {
  try {
    const users = await getActiveUsers();
    const mechanics = users.filter(u => u.role === 'mechanic');
    res.json({ mechanics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Force one-way toggle: only allow "on duty" → "available"
    const user = await setOperatorStatus(id, "available");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User status updated to available", user });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: err.message });
  }
};


const toggleUserStatusController = async (req, res) => {
  try {
    const user = await toggleUserStatus(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await createNotification(
      user.id,
      `Your status has been updated to "${user.status}".`,
      'user_status_update'
    );
    
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { registerUser, loginUser, approveUserAccount, listPendingUsers, deleteUserAccount, listActiveUsers, listAvailableOperators, updateUserStatus, toggleUserStatusController, listAvailableMechanics };
