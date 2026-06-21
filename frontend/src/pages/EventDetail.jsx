import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getSeatsBadge(available, total) {
  const pct = (available / total) * 100;
  if (available === 0) return { className: 'badge-red', text: 'Sold Out' };
  if (pct < 10) return { className: 'badge-red', text: `Only ${available} left!` };
  if (pct < 50) return { className: 'badge-yellow', text: `${available} seats available` };
  return { className: 'badge-green', text: `${available} seats available` };
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Event not found.');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book seats.');
      navigate('/login');
      return;
    }

    setBooking(true);
    try {
      const res = await api.post('/bookings', {
        eventId: id,
        seatsBooked: parseInt(seatsBooked, 10),
      });

      toast.success(res.data.message);

      // Refetch event to update available seats in real-time
      const updatedEvent = await api.get(`/events/${id}`);
      setEvent(updatedEvent.data.data);
      setSeatsBooked(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-8">
          <div className="skeleton h-8 w-3/4 mb-4" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-2/3 mb-6" />
          <div className="skeleton h-6 w-1/3 mb-4" />
          <div className="skeleton h-6 w-1/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">😕</div>
          <div className="text-red-400 text-lg font-medium mb-2">Event Not Found</div>
          <p className="text-surface-400 mb-6">{error}</p>
          <Link to="/" className="btn-primary inline-block">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const badge = getSeatsBadge(event.availableSeats, event.totalSeats);
  const isSoldOut = event.availableSeats === 0;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-surface-400 hover:text-primary-400 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Events
      </Link>

      {/* Event Card */}
      <div className="glass-card p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{event.name}</h1>
          <span className={badge.className}>{badge.text}</span>
        </div>

        {/* Description */}
        <p className="text-surface-300 leading-relaxed mb-8">{event.description}</p>

        {/* Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-surface-800/60 rounded-xl">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-surface-500 uppercase tracking-wide">Date & Time</div>
              <div className="text-sm text-white font-medium">{formatDate(event.date)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-surface-800/60 rounded-xl">
            <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-surface-500 uppercase tracking-wide">Venue</div>
              <div className="text-sm text-white font-medium">{event.venue}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-surface-800/60 rounded-xl">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-surface-500 uppercase tracking-wide">Total Seats</div>
              <div className="text-sm text-white font-medium">{event.totalSeats}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-surface-800/60 rounded-xl">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-surface-500 uppercase tracking-wide">Available</div>
              <div className="text-sm text-white font-medium">{event.availableSeats} / {event.totalSeats}</div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="border-t border-surface-700/50 pt-6">
          <h2 className="text-lg font-semibold text-white mb-4">Book Your Seats</h2>

          {isSoldOut ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
              <p className="text-red-400 font-medium">This event is sold out.</p>
              <p className="text-surface-500 text-sm mt-1">Check back later — cancellations may free up seats.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label htmlFor="seats-input" className="block text-sm text-surface-400 mb-2">
                  Number of Seats
                </label>
                <input
                  id="seats-input"
                  type="number"
                  min={1}
                  max={event.availableSeats}
                  value={seatsBooked}
                  onChange={(e) => setSeatsBooked(Math.max(1, Math.min(event.availableSeats, parseInt(e.target.value, 10) || 1)))}
                  className="input-field"
                />
              </div>
              <button
                onClick={handleBooking}
                disabled={booking || isSoldOut}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                id="book-now-btn"
              >
                {booking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Book {seatsBooked} Seat{seatsBooked > 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
