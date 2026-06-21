import { Link } from 'react-router-dom';

/**
 * Formats a date string into a readable format.
 */
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

/**
 * Returns badge style based on seat availability percentage.
 */
function getSeatsBadge(available, total) {
  const pct = (available / total) * 100;

  if (available === 0) {
    return { className: 'badge-red', text: 'Sold Out' };
  }
  if (pct < 10) {
    return { className: 'badge-red', text: `${available} left` };
  }
  if (pct < 50) {
    return { className: 'badge-yellow', text: `${available} seats` };
  }
  return { className: 'badge-green', text: `${available} seats` };
}

export default function EventCard({ event }) {
  const badge = getSeatsBadge(event.availableSeats, event.totalSeats);

  return (
    <Link
      to={`/events/${event.id}`}
      className="glass-card p-6 hover:bg-surface-700/50 transition-all duration-300 group block animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
          {event.name}
        </h3>
        <span className={badge.className}>{badge.text}</span>
      </div>

      {/* Description */}
      <p className="text-surface-400 text-sm line-clamp-2 mb-4">
        {event.description}
      </p>

      {/* Meta info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-surface-300">
          <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(event.date)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-surface-300">
          <svg className="w-4 h-4 text-accent-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.venue}</span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="mt-4 pt-3 border-t border-surface-700/50 flex items-center justify-between">
        <span className="text-xs text-surface-500">
          {event.totalSeats} total seats
        </span>
        <span className="text-xs text-primary-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
          View Details
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
