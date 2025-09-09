// authMiddleware.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    // 1. Check for token in all possible locations
    let token = req.cookies?.accessToken ||
               req.signedCookies?.accessToken ||
               (req.headers.authorization?.startsWith('Bearer ') 
                ? req.headers.authorization.split(' ')[1] 
                : null);

    // 2. Special handling for websocket upgrade requests
    if (!token && req.headers.upgrade === 'websocket') {
      token = req.headers?.cookie?.split(';')
        .find(c => c.trim().startsWith('accessToken='))
        ?.split('=')[1];
    }

    if (!token) {
      console.error('Token not found in:', {
        cookies: req.cookies,
        headers: req.headers
      });
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Verify user exists and token isn't revoked
    const user = await userModel.findById(decoded.id);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication'
      });
    }

    // 5. Attach user to request
    req.user = {
      id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion
    };
    
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Session expired - please refresh' 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Invalid authentication' 
    });
  }
};