import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Auth Middleware - Protect routes from unauthorized access
 */

export const protect = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies

  // find the cookie in storage
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Fetch user
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
});
