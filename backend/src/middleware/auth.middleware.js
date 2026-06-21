const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

/**
 * Authentication middleware.
 * Extracts Bearer token from Authorization header, verifies it,
 * and attaches decoded user ({ id, email }) to req.user.
 */
function authMiddleware(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required. Please provide a valid token.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Attach user info to request for downstream handlers
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    // jwt.JsonWebTokenError or jwt.TokenExpiredError
    next(new ApiError(401, 'Invalid or expired token. Please log in again.'));
  }
}

module.exports = authMiddleware;
