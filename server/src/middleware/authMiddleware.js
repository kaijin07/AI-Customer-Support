import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Auth Middleware - Protect routes from unauthorized access
 * This middleware verifies the JWT token and attaches the user to the request object.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Check for token in Cookies (HttpOnly cookie)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (token) {
    try {
      // Verify the token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB and attach to req object (excluding password)
      // This makes req.user available in all subsequent controller functions
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // Continue to the next middleware/controller
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // Handle case where no token is provided
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};
