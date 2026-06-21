const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require('../controllers/bookings.controller');

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

// POST /api/v1/bookings — Create a booking
router.post(
  '/',
  [
    body('eventId')
      .notEmpty()
      .withMessage('Event ID is required.')
      .isUUID()
      .withMessage('Event ID must be a valid UUID.'),
    body('seatsBooked')
      .isInt({ min: 1 })
      .withMessage('Number of seats must be at least 1.'),
  ],
  validate,
  createBooking
);

// GET /api/v1/bookings/my — Get authenticated user's bookings
router.get('/my', getMyBookings);

// DELETE /api/v1/bookings/:id — Cancel a booking
router.delete('/:id', cancelBooking);

module.exports = router;
