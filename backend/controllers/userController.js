const User = require('../models/User');

// @desc    Get all users (admin)
// @route   GET /api/users
const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// @desc    Get user by ID (admin)
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin user' });
  await user.deleteOne();
  res.json({ message: 'User removed' });
};

module.exports = { getUsers, getUserById, deleteUser };
