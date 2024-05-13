// authenticationMiddleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Middleware function to verify the JWT token and extract user ID
const authenticateUser = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach the user ID to the request object
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser };