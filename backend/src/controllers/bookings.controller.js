const prisma = require('../prismaClient');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/v1/bookings
 * Creates a booking using prisma.$transaction to atomically:
 *   1. Check available seats
 *   2. Decrement availableSeats on the event
 *   3. Create the booking record
 * This prevents overbooking under concurrent load.
 */
async function createBooking(req, res, next) {
  try {
    const { eventId, seatsBooked } = req.body;
    const userId = req.user.id;

    const booking = await prisma.$transaction(async (tx) => {
      // 1. Read current event state (inside transaction for consistency)
      const event = await tx.event.findUnique({ where: { id: eventId } });

      if (!event) {
        throw new ApiError(404, 'Event not found.');
      }

      if (event.availableSeats < seatsBooked) {
        throw new ApiError(
          400,
          `Cannot book ${seatsBooked} seat(s). Only ${event.availableSeats} seat(s) available.`
        );
      }

      // 2. Decrement available seats atomically
      await tx.event.update({
        where: { id: eventId },
        data: { availableSeats: { decrement: seatsBooked } },
      });

      // 3. Create booking record
      return tx.booking.create({
        data: {
          userId,
          eventId,
          seatsBooked,
        },
        include: {
          event: true,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: `Successfully booked ${booking.seatsBooked} seat(s) for "${booking.event.name}".`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/bookings/my
 * Returns all bookings for the authenticated user, with event details.
 * Ordered by creation date descending (newest first).
 */
async function getMyBookings(req, res, next) {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/bookings/:id
 * Cancels a booking using prisma.$transaction to atomically:
 *   1. Update booking status to CANCELLED
 *   2. Increment availableSeats back on the event
 * Only the booking owner can cancel. Only ACTIVE bookings can be cancelled.
 */
async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // First, fetch the booking to validate ownership and status
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found.');
    }

    if (booking.userId !== userId) {
      throw new ApiError(403, 'You can only cancel your own bookings.');
    }

    if (booking.status === 'CANCELLED') {
      throw new ApiError(400, 'This booking has already been cancelled.');
    }

    // Atomic transaction: cancel booking + release seats
    await prisma.$transaction(async (tx) => {
      // 1. Update booking status to CANCELLED
      await tx.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      // 2. Increment available seats back to the event
      await tx.event.update({
        where: { id: booking.eventId },
        data: { availableSeats: { increment: booking.seatsBooked } },
      });
    });

    res.json({
      success: true,
      message: `Booking cancelled. ${booking.seatsBooked} seat(s) released for "${booking.event.name}".`,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createBooking, getMyBookings, cancelBooking };
