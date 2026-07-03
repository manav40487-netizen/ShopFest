const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// Temporary OTP store
const otpStore = {};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Step 1 - Send OTP 
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store temporarily 
    otpStore[email] = {
      otp,
      name,
      password,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    const message = `
      <h2>Welcome to ShopFest, ${name}!</h2>
      <p>Your email verification OTP is: <strong style="font-size:24px">${otp}</strong></p>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail({
      email,
      subject: 'ShopFest - Verify Your Email',
      message
    });

    res.status(200).json({ message: 'OTP sent to your email. Please verify to complete registration.' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 2 - Verify OTP and create user
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ message: 'OTP expired or not found. Please register again.' });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please register again.' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // OTP correct — NOW create the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(record.password, salt);

    const user = await User.create({
      name: record.name,
      email,
      password: hashedPassword
    });

    delete otpStore[email]; // cleanup

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, getUsers };