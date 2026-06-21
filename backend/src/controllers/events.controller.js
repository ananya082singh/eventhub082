const prisma = require('../prismaClient');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/v1/events
 * Returns all events ordered by date ascending. Public endpoint.
 */
async function getAllEvents(req, res, next) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/events/:id
 * Returns a single event by ID. Public endpoint.
 */
async function getEventById(req, res, next) {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new ApiError(404, 'Event not found.');
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllEvents, getEventById };
