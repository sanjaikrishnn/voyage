import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, Calendar, Compass, Briefcase, Utensils, ArrowRight } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../../data/destinations';
import { useTrip } from '../../context/TripContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { trips, setActiveTripId } = useTrip();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled outside or here
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const matchedDestinations = POPULAR_DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.popularActivities.some((a) => a.toLowerCase().includes(q))
  );

  const matchedTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.travelStyle.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-gray-400 dark:text-zinc-500 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations, activities, hotels, my trips..."
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* My Trips */}
          {matchedTrips.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-2">
                My Trips
              </p>
              <div className="space-y-1.5">
                {matchedTrips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => {
                      setActiveTripId(trip.id);
                      onNavigate('itinerary');
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50/70 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                          {trip.title}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {trip.destination} • {trip.durationDays} Days • {trip.status}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Destinations */}
          {matchedDestinations.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-2">
                Destinations & Highlights
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedDestinations.slice(0, 6).map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => {
                      onNavigate('explore');
                      onClose();
                    }}
                    className="flex items-center space-x-3 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 hover:border-teal-300 dark:hover:border-teal-800 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-all text-left group"
                  >
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-11 h-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {dest.name}, {dest.country}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        ${dest.avgDailyBudget}/day • {dest.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedDestinations.length === 0 && matchedTrips.length === 0 && (
            <div className="text-center py-8">
              <Compass className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-600 mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                No matching results found for "{query}"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for "Tokyo", "Paris", "Hotels", "Romantic", or "Museums"
              </p>
            </div>
          )}
        </div>

        {/* Quick Footer */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 text-[11px] text-gray-400 flex items-center justify-between">
          <span>Search Voyager knowledge base</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
