const jwt = require('jsonwebtoken');
const config = require('../config');
const { sendError } = require('../utils/responseFormat');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) return sendError(res, 403, 'Access denied, token missing');

  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    req.user = decoded; // Menyimpan id user ke dalam request
    next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};

module.exports = verifyToken;