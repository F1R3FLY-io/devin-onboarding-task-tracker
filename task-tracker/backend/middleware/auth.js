const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  console.log('Auth middleware called');
  console.log('Request headers:', req.headers);
  
  const token = req.header('x-auth-token');
  console.log('Token from header:', token ? `${token.substring(0, 10)}...` : 'No token');

  if (!token) {
    console.log('No token provided, returning 401');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully, user ID:', decoded.user.id);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
