/**
 * Skeleton loading placeholders for event cards and booking rows.
 */

export function EventCardSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-6 w-16" />
      </div>
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-2/3 mb-4" />
      <div className="flex flex-col gap-2">
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-2/3" />
      </div>
      <div className="mt-4 pt-3 border-t border-surface-700/50 flex justify-between">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-3 w-24" />
      </div>
    </div>
  );
}

export function BookingSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="skeleton h-6 w-1/2" />
        <div className="skeleton h-6 w-20" />
      </div>
      <div className="skeleton h-4 w-1/3 mb-2" />
      <div className="skeleton h-4 w-1/4" />
    </div>
  );
}

// Alias so MyBookings.jsx can import it under its own name
export const BookingRowSkeleton = BookingSkeleton;
