import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { BookingRowSkeleton } from '../components/LoadingSkeleton';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await api.get('/bookings/my');
        setBookings(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await api.delete(`/bookings/${bookingId}`);
      toast.success(res.data.message || 'Booking cancelled successfully.');

      // Optimistic UI state update: set status to CANCELLED locally
      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <BookingRowSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center">
          <div className="text-red-400 text-lg font-medium mb-2">Something went wrong</div>
          <p className="text-surface-400">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">🎟️</div>
          <div className="text-surface-300 text-lg font-medium mb-2">No bookings found</div>
          <p className="text-surface-500 mb-6">You haven't booked any events yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';
            return (
              <div key={booking.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">{booking.event.name}</h2>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isCancelled ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-surface-400">{formatDate(booking.event.date)}</p>
                  <p className="text-sm text-surface-500">Venue: {booking.event.venue}</p>
                  <p className="text-sm text-surface-300 font-medium">Seats booked: {booking.seatsBooked}</p>
                </div>

                <div>
                  {!isCancelled && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="w-full md:w-auto px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 hover:border-transparent rounded-lg font-medium text-sm transition-all duration-200"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
