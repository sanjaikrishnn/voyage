import React, { useState } from 'react';
import {
  Utensils,
  Star,
  MapPin,
  Sparkles,
  Plus,
  CheckCircle2,
  DollarSign,
  Coffee,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { Restaurant } from '../types';

export const FoodPage: React.FC = () => {
  const { activeTrip, addActivity } = useTrip();
  const [filterVibe, setFilterVibe] = useState<string>('all');
  const [addedMessage, setAddedMessage] = useState<string>('');

  const restaurants = activeTrip.restaurants || [];

  const filtered = restaurants.filter((r) => {
    if (filterVibe === 'all') return true;
    if (filterVibe === 'veg') return r.isVegetarianFriendly;
    return r.vibe.toLowerCase().includes(filterVibe.toLowerCase());
  });

  const handleAddRestaurantToItinerary = (resto: Restaurant, dayNumber = 1) => {
    addActivity(dayNumber, {
      time: '19:00',
      title: `Dinner at ${resto.name}`,
      shortDescription: `Enjoy authentic ${resto.cuisine} dining. Specialties: ${resto.mustTryDishes.join(', ')}. Atmosphere: ${resto.vibe}.`,
      location: resto.location,
      duration: '1h 45m',
      category: 'food',
      estimatedCost: resto.priceLevel === '$$$$' ? 120 : resto.priceLevel === '$$$' ? 60 : 30,
      transportMethod: 'Walk'
    });
    setAddedMessage(`"${resto.name}" added to Day ${dayNumber} itinerary!`);
    setTimeout(() => setAddedMessage(''), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Toast Notification */}
      {addedMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{addedMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <Utensils className="w-4 h-4" />
          <span>Culinary & Street Gastronomy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
          Food & Dining in {activeTrip.city || activeTrip.destination}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Handpicked regional specialties, hidden neighborhood ramen/bistros, and rooftop cocktail lounges
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Dining Spots' },
          { id: 'veg', label: '🌱 Vegetarian-Friendly' },
          { id: 'casual', label: 'Casual & Street' },
          { id: 'fine', label: 'Fine Dining' },
          { id: 'lively', label: 'Lively / Izakaya' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterVibe(tab.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              filterVibe === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
              <img
                src={r.imageUrl}
                alt={r.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                {r.cuisine}
              </span>

              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-500 text-white shadow-sm">
                {r.priceLevel}
              </span>

              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {r.rating} / 5
                </span>
                <span className="text-[11px] text-white/90">{r.vibe}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {r.name}
                  </h3>
                  {r.isVegetarianFriendly && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                      Plant-Based
                    </span>
                  )}
                </div>

                <p className="text-xs text-teal-700 dark:text-teal-400 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{r.location}</span>
                </p>

                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                  {r.description}
                </p>

                {/* Must try specialties */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Signature Must-Try:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {r.mustTryDishes.map((dish, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to itinerary button */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => handleAddRestaurantToItinerary(r, 1)}
                  className="w-full py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-600 text-teal-700 dark:text-teal-300 hover:text-white dark:hover:bg-teal-600 text-xs font-bold transition-all flex items-center justify-center space-x-1 border border-teal-200 dark:border-teal-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dinner to Day 1 Itinerary</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
