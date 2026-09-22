import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Copy,
  Trash2,
  Download,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { TripPlan } from '../types';

interface MyTripsPageProps {
  onNavigate: (page: string) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ onNavigate }) => {
  const { trips, activeTrip, setActiveTripId, duplicateTrip, deleteTrip } = useTrip();
  const [filterTab, setFilterTab] = useState<'All' | 'Upcoming' | 'Active' | 'Completed' | 'Draft'>('All');
  const [feedback, setFeedback] = useState<string>('');

  const filteredTrips = trips.filter((t) => {
    if (filterTab === 'All') return true;
    return t.status === filterTab;
  });

  const handleDuplicate = (id: string, title: string) => {
    duplicateTrip(id);
    setFeedback(`Duplicated "${title}" successfully!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    deleteTrip(id);
    setFeedback(`Removed "${title}" from your trips.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleSelectTrip = (trip: TripPlan) => {
    setActiveTripId(trip.id);
    onNavigate('itinerary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Itinerary Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
            All Your Expeditions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Manage, duplicate, edit, and export your personalized AI itineraries
          </p>
        </div>

        <button
          onClick={() => onNavigate('planner')}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Journey</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {(['All', 'Upcoming', 'Active', 'Completed', 'Draft'] as const).map((tab) => {
          const count = tab === 'All' ? trips.length : trips.filter((t) => t.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                filterTab === tab
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
              }`}
            >
              <span>{tab} Trips</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => {
          const isActive = trip.id === activeTrip.id;
          return (
            <div
              key={trip.id}
              className={`rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-lg'
              }`}
            >
              {/* Cover Photo */}
              <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                  {trip.durationDays} Days • {trip.travelStyle}
                </span>

                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  trip.status === 'Active'
                    ? 'bg-emerald-500 text-white'
                    : trip.status === 'Upcoming'
                    ? 'bg-teal-600 text-white'
                    : 'bg-zinc-700 text-white'
                }`}>
                  {trip.status}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-bold font-display leading-tight">{trip.title}</h3>
                  <p className="text-xs text-white/80">{trip.city}, {trip.country}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {trip.overview.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-zinc-300">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      {trip.startDate}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ${trip.estimatedTotalCost || 1800} Est.
                    </span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => handleSelectTrip(trip)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm flex items-center space-x-1"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-1 text-gray-400">
                    <button
                      onClick={() => handleDuplicate(trip.id, trip.title)}
                      className="p-1.5 hover:text-teal-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
                      title="Duplicate Trip"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {trips.length > 1 && (
                      <button
                        onClick={() => handleDelete(trip.id, trip.title)}
                        className="p-1.5 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
