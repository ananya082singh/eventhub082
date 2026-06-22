require('dotenv').config();

// Catch hidden crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION', err);
});

const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/events.routes');
const bookingRoutes = require('./routes/bookings.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// --------------- Health Check ---------------
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Event Booking API is running.' });
});

// --------------- API Routes ---------------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// --------------- 404 Handler ---------------
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// --------------- Global Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
