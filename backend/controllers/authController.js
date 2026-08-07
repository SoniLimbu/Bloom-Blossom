const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ name, email, password, phone });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, token: generateToken(user._id)
  });
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, token: generateToken(updated._id) });
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
