const UserModel = require('../models/User');

const hasAdminRole = (session, user) => {
  const sessionRole = String(session?.role || '').toUpperCase();
  const userRole = String(user?.role || '').toUpperCase();
  const sessionRoleId = Number(session?.roleId);
  const userRoleId = Number(user?.role_id);

  return (
    sessionRole === 'ROLE_ADMIN' ||
    userRole === 'ROLE_ADMIN' ||
    sessionRoleId === 1 ||
    userRoleId === 1
  );
};

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Please login to continue' });
  }
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Please login to continue' });
    }

    if (hasAdminRole(req.session, null)) {
      return next();
    }

    // Fallback: recover role from DB if session role is stale/missing.
    const user = await UserModel.getUserById(req.session.userId);
    if (user && hasAdminRole(req.session, user)) {
      req.session.role = user.role;
      req.session.roleId = user.role_id;
      return next();
    }

    return res.status(403).json({ error: 'Admin access required' });
  } catch (error) {
    return res.status(500).json({ error: 'Authorization check failed' });
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
