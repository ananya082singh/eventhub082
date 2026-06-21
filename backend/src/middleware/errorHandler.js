const { Prisma } = require('@prisma/client');
const ApiError = require('../utils/ApiError');

/**
 * Global error handler middleware.
 * Catches all errors and returns a consistent JSON response shape:
 * { success: false, message: "..." }
 *
 * Handles:
 * - ApiError (custom) → uses its statusCode
 * - Prisma P2002 (unique constraint) → 409 Conflict
 * - Prisma P2025 (record not found) → 404 Not Found
 * - Everything else → 500 Internal Server Error
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', err);
  }

  // Custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma unique constraint violation (e.g., duplicate email)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json({
        success: false,
        message: `A record with this ${field} already exists.`,
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'The requested record was not found.',
      });
    }
  }

  // Fallback: unexpected errors
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
  });
}

module.exports = errorHandler;
