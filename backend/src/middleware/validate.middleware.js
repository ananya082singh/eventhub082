const { validationResult } = require('express-validator');

/**
 * Validation middleware runner.
 * Checks for express-validator errors and returns 400 with detailed field errors.
 * Use after express-validator check chains in route definitions.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
}

module.exports = validate;
