import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Helper to generate a signed JSON Web Token
 * @param {string} id - The user ID to encode in the token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * Helper to create a JWT, save it in a cookie, and send the response
 * This keeps the token safe from client-side JavaScript access (XSS)
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Generate token
  const token = generateToken(user._id);

  // Define cookie options
  const options = {
    // Expiration date (converted from days in .env to milliseconds)
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Cookie only sent over HTTPS in production
    sameSite: 'strict', // Protects against CSRF attacks
  };

  // Set the 'token' cookie and send JSON response
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
      },
    });
};

// Simple regex for email validation
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, businessName } = req.body;

    // Validation
    if (!name || !email || !password || !businessName) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please include a valid email' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if user exists in DB
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password before saving to DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user record
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      businessName,
    });

    if (user) {
      // Send token in cookie
      sendTokenResponse(user, 201, res);
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Authenticate a user (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and explicitly select password (hidden by default in model)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches the hashed version in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Send token in cookie
      sendTokenResponse(user, 200, res);
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Logout user by clearing the auth cookie
 * @route   GET /api/auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  // Overwrite the 'token' cookie with 'none' and set it to expire immediately
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
    data: {},
  });
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Requires 'protect' middleware)
 */
export const getMe = async (req, res) => {
  try {
    // req.user was set by the 'protect' middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
