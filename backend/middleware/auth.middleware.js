const jwt = require('jsonwebtoken');
const debugLog = require('../utils/debugLog');

const authMiddleware = (roles = []) => {

  return (req, res, next) => {

    try {

      const authHeader = req.header('Authorization');

      if (!authHeader) {
        return res.status(401).json({
          message: 'Access denied. No token provided.'
        });
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      const verified = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      if (!verified || !verified.id) {
        return res.status(401).json({
          message: 'Invalid token payload'
        });
      }

      req.user = verified;

      // Role check
      if (
        roles.length > 0 &&
        !roles.includes(req.user.role)
      ) {
        return res.status(403).json({
          message: 'Forbidden'
        });
      }

      // #region agent log
      debugLog({ location: 'auth.middleware.js', message: 'auth passed', data: { role: req.user?.role, rolesRequired: roles }, hypothesisId: 'H1' });
      // #endregion

      next();

    } catch (error) {

      // #region agent log
      debugLog({ location: 'auth.middleware.js', message: 'auth failed', data: { error: error.message }, hypothesisId: 'H1' });
      // #endregion

      return res.status(401).json({
        message: 'Invalid token'
      });

    }

  };

};

module.exports = authMiddleware;