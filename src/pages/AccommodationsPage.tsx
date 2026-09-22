import React, { useState } from 'react';
import {
  Hotel,
  Star,
  MapPin,
  Wifi,
  Coffee,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { Accommodation } from '../types';

export const AccommodationsPage: React.FC = () => {
  const { activeTrip, updateTrip } = useTrip();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedHotelId, setSelectedHotelId] = useState<string>(
    activeTrip.accommodations[0]?.id || ''
  );
  const [confirmedMessage, setConfirmedMessage] = useState<string>('');

  const accommodations = activeTrip.accommodations || [];

  const filtered = accommodations.filter((h) => {
    if (selectedType === 'all') return true;
    return h.type.toLowerCase() === selectedType.toLowerCase();
  });

  const handleSelectStay = (hotel: Accommodation) => {
    setSelectedHotelId(hotel.id);
    setConfirmedMessage(`"${hotel.name}" set as your primary base for ${activeTrip.city}!`);
    setTimeout(() => setConfirmedMessage(''), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Toast */}
      {confirmedMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{confirmedMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <Hotel className="w-4 h-4" />
          <span>Curated Stays & Sanctuaries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
          Where to Stay in {activeTrip.city || activeTrip.destination}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          AI filtered for optimal proximity to your Day 1–{activeTrip.durationDays} itinerary route
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {['all', 'luxury', 'boutique', 'mid-range', 'budget'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              selectedType === type
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? 'All Accommodations' : type}
          </button>
        ))}
      </div>

      {/* Stays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hotel) => {
          const isPrimary = selectedHotelId === hotel.id;
          return (
            <div
              key={hotel.id}
              className={`rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border transition-all flex flex-col justify-between ${
                isPrimary
                  ? 'border-teal-500 shadow-lg ring-2 ring-teal-500/20'
                  : 'border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                  {hotel.type}
                </span>

                {isPrimary && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-500 text-white shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Selected Stay
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {hotel.rating} / 5
                    </span>
                    <span className="text-xs font-mono font-bold bg-teal-600/90 px-2 py-0.5 rounded">
                      ${hotel.pricePerNight} <span className="text-[10px] font-normal">/ night</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {hotel.name}
                  </h3>

                  <p className="text-xs text-teal-700 dark:text-teal-400 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{hotel.location} • {hotel.distanceToCenter}</span>
                  </p>

                  <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>

                {/* Amenities pills */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <button
                      onClick={() => handleSelectStay(hotel)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                        isPrimary
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                          : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isPrimary ? 'Active Primary Base' : 'Set as Trip Base'}</span>
                    </button>

                    <span className="text-[10px] text-gray-400">
                      ≈ ${hotel.pricePerNight * activeTrip.durationDays} total
                    </span>
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
