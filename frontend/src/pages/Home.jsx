import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { EventCardSkeleton } from '../components/LoadingSkeleton';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events.');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Client-side filtering
  const filteredEvents = useMemo(() => {
    let result = events;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.venue.toLowerCase().includes(query)
      );
    }

    // Upcoming only filter
    if (upcomingOnly) {
      const now = new Date();
      result = result.filter((e) => new Date(e.date) > now);
    }

    return result;
  }, [events, searchQuery, upcomingOnly]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="gradient-text">Discover Events</span>
        </h1>
        <p className="text-surface-400 text-lg max-w-2xl mx-auto">
          Browse upcoming events and book your seats instantly.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by event name or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field !pl-10"
            id="search-events"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => setUpcomingOnly(e.target.checked)}
            className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-primary-500 focus:ring-primary-500/50"
            id="upcoming-only-toggle"
          />
          <span className="text-sm text-surface-300 select-none">Upcoming only</span>
        </label>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center">
          <div className="text-red-400 text-lg font-medium mb-2">Something went wrong</div>
          <p className="text-surface-400">{error}</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">🎭</div>
          <div className="text-surface-300 text-lg font-medium mb-2">No events found</div>
          <p className="text-surface-500">
            {searchQuery || upcomingOnly
              ? 'Try adjusting your search or filters.'
              : 'Check back later for new events!'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-surface-500 mb-4">
            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
