// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Please login to continue' });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'ROLE_ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Optional authentication - continues if logged in, otherwise just continues
const optionalAuth = (req, res, next) => {
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  optionalAuth
};
