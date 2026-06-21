const { Router } = require('express');
const { getAllEvents, getEventById } = require('../controllers/events.controller');

const router = Router();

// GET /api/v1/events — List all events (public)
router.get('/', getAllEvents);

// GET /api/v1/events/:id — Get event details (public)
router.get('/:id', getEventById);

module.exports = router;
