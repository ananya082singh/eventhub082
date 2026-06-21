const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const { register, login } = require('../controllers/auth.controller');

const router = Router();

// POST /api/v1/auth/register
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters.'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.'),
  ],
  validate,
  register
);

// POST /api/v1/auth/login
router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address.'),
    body('password')
      .notEmpty()
      .withMessage('Password is required.'),
  ],
  validate,
  login
);

module.exports = router;
