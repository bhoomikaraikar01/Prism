const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Name, email and password are required' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    user = await User.create({ name, email, password_hash: password, role: role || 'CITIZEN' });
    const token = generateToken(user._id, user.role);
    res.status(201).json({ user: { id: user._id, name: user.name, role: user.role, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Login user with email & password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password_hash !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = generateToken(user._id, user.role);
    res.json({ user: { id: user._id, name: user.name, role: user.role, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Request OTP for login
exports.requestOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otp_expires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();
    
    // In production, send OTP via SMS here
    console.log(`[DEV ONLY] OTP for ${mobile} is ${otp}`);
    res.json({ message: 'OTP sent successfully (check console in dev)' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Verify OTP and Login
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({ mobile, otp, otp_expires: { $gt: Date.now() } });
    
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });
    
    user.otp = undefined;
    user.otp_expires = undefined;
    user.is_verified = true;
    await user.save();
    
    const token = generateToken(user._id, user.role);
    res.json({ user: { id: user._id, name: user.name, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Google OAuth Placeholder
exports.googleAuth = async (req, res) => {
  // Logic to verify Google ID token would go here
  res.status(501).json({ message: 'Google OAuth not fully implemented yet' });
};
