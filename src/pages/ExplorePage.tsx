import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight,
  Heart,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { POPULAR_DESTINATIONS, TRAVEL_CATEGORIES } from '../data/destinations';
import { useAuth } from '../context/AuthContext';

interface ExplorePageProps {
  onNavigate: (page: string) => void;
  onSelectDestinationForPlan?: (destinationName: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onNavigate,
  onSelectDestinationForPlan
}) => {
  const { isDestinationSaved, toggleSavedDestination } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [budgetFilter, setBudgetFilter] = useState<number>(1000);

  const filtered = POPULAR_DESTINATIONS.filter((d) => {
    const matchesCategory =
      selectedCategory === 'All' || d.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.popularActivities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBudget = d.avgDailyBudget <= budgetFilter;
    return matchesCategory && matchesSearch && matchesBudget;
  });

  const handlePlan = (dest: string) => {
    if (onSelectDestinationForPlan) {
      onSelectDestinationForPlan(dest);
    }
    onNavigate('planner');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-teal-500" />
          <span>Worldwide Destination Atlas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-gray-900 dark:text-white">
          Discover Extraordinary Places
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Curated destinations with verified seasonal travel windows, average daily expense metrics, and instant AI itinerary generators.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, country, or keyword (e.g. ramen, hiking, temples)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/60 dark:bg-zinc-800/60 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Max Budget Slider */}
          <div className="flex items-center space-x-3 w-full md:w-72 bg-gray-50 dark:bg-zinc-800/60 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700">
            <span className="text-xs font-semibold text-gray-600 dark:text-zinc-300 whitespace-nowrap">
              Max / Day:
            </span>
            <input
              type="range"
              min="80"
              max="600"
              step="20"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(Number(e.target.value))}
              className="flex-1 accent-teal-600"
            />
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 min-w-[50px] text-right">
              ${budgetFilter}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === 'All'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
            }`}
          >
            All Destinations ({POPULAR_DESTINATIONS.length})
          </button>
          {TRAVEL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dest) => {
          const isSaved = isDestinationSaved(dest.id);
          return (
            <div
              key={dest.id}
              className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                  {dest.category}
                </span>

                <button
                  onClick={() => toggleSavedDestination(dest.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-display leading-tight">{dest.name}</h3>
                    <span className="text-xs font-bold flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {dest.rating}
                    </span>
                  </div>
                  <p className="text-xs text-white/80">{dest.country}</p>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                    {dest.tagline}
                  </p>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dest.popularActivities.slice(0, 3).map((act, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Best Time: {dest.bestTimeToVisit}
                    </span>
                    <span className="text-sm font-bold text-teal-700 dark:text-teal-400">
                      ${dest.avgDailyBudget} <span className="text-[10px] font-normal text-gray-400">/ day</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handlePlan(`${dest.name}, ${dest.country}`)}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center space-x-1 transition-all"
                  >
                    <span>Plan Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <Compass className="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-zinc-300">No destinations matched your criteria</h3>
          <p className="text-xs text-gray-400 mt-1">Try increasing your daily budget filter or clearing search terms.</p>
        </div>
      )}
    </div>
  );
};
