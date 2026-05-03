import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import config from '../config/index.js';
import asyncHandler from '../utils/asyncHandler.js';

const client = new OAuth2Client(config.googleClientId);

/**
 * Helper to generate a signed JSON Web Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

/**
 * Helper to create a JWT, save it in a cookie, and send the response
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const isProd = config.env === 'production';
  const options = {
    expires: new Date(
      Date.now() + config.jwtCookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };

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
        provider: user.provider,
      },
    });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, businessName } = req.body;

  // Prevent duplicate signup
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    businessName,
    provider: 'local',
  });

  sendTokenResponse(user, 201, res);
});

/**
 * @desc    Authenticate a user (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');

  if (!user || user.provider !== 'local') {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Google OAuth Login
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken, businessName } = req.body;

  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.googleClientId,
  });

  const { email, name, sub: googleId } = ticket.getPayload();

  let user = await User.findOne({ email });

  if (user) {
    // If user exists with provider "local", reject login to avoid confusion/security issues
    if (user.provider === 'local') {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login with your password.'
      });
    }
    sendTokenResponse(user, 200, res);
  } else {
    // If it's a NEW user and businessName is missing, we need to ask for it
    if (!businessName || !businessName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'BUSINESS_NAME_REQUIRED'
      });
    }

    // Create new user via Google
    user = await User.create({
      name,
      email,
      businessName,
      provider: 'google',
    });
    sendTokenResponse(user, 201, res);
  }
});

/**
 * @desc    Logout user by clearing the auth cookie
 * @route   GET /api/auth/logout
 * @access  Public
 */
export const logoutUser = asyncHandler(async (req, res) => {
  const isProd = config.env === 'production';
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
    data: {},
  });
});

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
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
      provider: user.provider,
    }
  });
});
