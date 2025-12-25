// middleware/auth.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export  const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = {
      id: decoded.id || decoded._id,
    };
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
     res.status(401).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

// module.exports = {auth};


