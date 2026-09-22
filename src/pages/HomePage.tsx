import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  Compass,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Heart
} from 'lucide-react';
import { POPULAR_DESTINATIONS, TRAVEL_CATEGORIES } from '../data/destinations';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectDestinationForPlan?: (destinationName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectDestinationForPlan
}) => {
  const { trips, setActiveTripId } = useTrip();
  const { isDestinationSaved, toggleSavedDestination } = useAuth();
  const [searchDestination, setSearchDestination] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleStartPlanning = (dest?: string) => {
    const target = dest || searchDestination;
    if (onSelectDestinationForPlan && target.trim()) {
      onSelectDestinationForPlan(target);
    }
    onNavigate('planner');
  };

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) => {
    if (selectedCategory === 'all') return true;
    return d.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="w-full space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
        {/* Ambient Backing Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Next-Generation Travel Intelligence</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-gray-900 dark:text-white leading-[1.15]">
            Plan Your Perfect Trip <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              With Autonomous AI
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Tell us where you want to go, what you love, and your budget. Our AI creates a personalized travel experience in seconds.
          </p>

          {/* Quick Search & Start Planning CTA Bar */}
          <div className="max-w-2xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full flex items-center">
              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 absolute left-3.5" />
              <input
                type="text"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartPlanning()}
                placeholder="Where to? (e.g. Tokyo, Paris, Bali, Swiss Alps...)"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleStartPlanning()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center space-x-2 shrink-0"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick suggested chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-gray-500 dark:text-zinc-400">
            <span className="font-semibold text-gray-700 dark:text-zinc-300">Popular:</span>
            {['Tokyo', 'Paris', 'Bali', 'Swiss Alps', 'Singapore', 'Santorini'].map((place) => (
              <button
                key={place}
                onClick={() => handleStartPlanning(place)}
                className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              >
                {place}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Horizontal Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-gray-900 dark:text-white">
              Travel by Experience
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
              Select an archetype to browse curated AI recommendations
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 10 Travel Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800/80 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {TRAVEL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-all ${
                selectedCategory === cat.name
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-semibold'
                  : 'bg-gray-100 dark:bg-zinc-800/80 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured AI Planning Preview Interactive Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-teal-900 via-zinc-900 to-slate-950 p-6 sm:p-10 text-white shadow-2xl overflow-hidden relative border border-teal-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time Itinerary Generation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight">
                From Wishlist to Hour-by-Hour Itinerary in 10 Seconds
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Voyager optimizes travel times, aligns with opening hours, clusters attractions by neighborhood, checks weather forecasts, and respects your dietary preferences.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xl font-bold text-teal-400">100%</p>
                  <p className="text-[11px] text-gray-400">Personalized Pace</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xl font-bold text-teal-400">45 Min</p>
                  <p className="text-[11px] text-gray-400">Avg Transit Saved</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <p className="text-xl font-bold text-teal-400">Live</p>
                  <p className="text-[11px] text-gray-400">Weather-Aware</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('planner')}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-2"
                >
                  <span>Design My Custom Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('itinerary')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all"
                >
                  Inspect Sample Itinerary
                </button>
              </div>
            </div>

            {/* Right Itinerary Card Visual Mock */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-zinc-900/90 border border-zinc-700/80 p-5 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=150&q=80"
                      alt="Tokyo"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">Tokyo Neon & Tradition</h4>
                      <p className="text-[11px] text-teal-400">Day 1 • 5 Activities Scheduled</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
                    AI Optimized
                  </span>
                </div>

                {/* Timeline Items */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                    <span className="text-xs font-bold text-teal-400 shrink-0 mt-0.5">09:30</span>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-white">Meiji Jingu Shrine & Forest Walk</p>
                      <p className="text-gray-400">Cedar Torii gates & peaceful imperial woodland</p>
                    </div>
                    <span className="text-[10px] text-gray-400">0.4 km</span>
                  </div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                    <span className="text-xs font-bold text-teal-400 shrink-0 mt-0.5">12:00</span>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-white">Afuri Harajuku Yuzu Ramen</p>
                      <p className="text-gray-400">Acclaimed citrus broth & chashu noodles</p>
                    </div>
                    <span className="text-[10px] text-emerald-400">$$</span>
                  </div>

                  <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                    <span className="text-xs font-bold text-teal-400 shrink-0 mt-0.5">17:30</span>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-white">Sunset at Shibuya Sky 47F</p>
                      <p className="text-gray-400">360° open-air glass observatory over Mount Fuji</p>
                    </div>
                    <span className="text-[10px] text-amber-400">★ 4.95</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-zinc-800">
                  <span>Forecast: 21°C • Sunny</span>
                  <span className="text-teal-400 font-semibold">Zero Backtracking Route</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Worldwide</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
              Popular AI Destinations
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-md">
            Click any destination to explore complete itineraries, local culinary highlights, budget averages, and weather forecasts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.slice(0, 8).map((dest) => {
            const isSaved = isDestinationSaved(dest.id);
            return (
              <div
                key={dest.id}
                className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-800">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-md">
                    {dest.category}
                  </span>

                  {/* Save Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavedDestination(dest.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
                    aria-label="Save destination"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  </button>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-lg font-bold font-display leading-tight">{dest.name}</p>
                    <p className="text-xs text-white/80">{dest.country}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1 font-semibold text-gray-800 dark:text-zinc-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {dest.rating}
                        <span className="font-normal text-gray-400">({dest.reviewsCount})</span>
                      </span>
                      <span>{dest.bestTimeToVisit}</span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                      {dest.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Avg. Budget</p>
                      <p className="text-sm font-bold text-teal-700 dark:text-teal-400">
                        ${dest.avgDailyBudget} <span className="text-[10px] font-normal text-gray-400">/ day</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartPlanning(`${dest.name}, ${dest.country}`)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 transition-colors"
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Community Trips / Ready Itineraries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-gray-900 dark:text-white">
              Featured Pre-Planned Journeys
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
              Ready-to-use full itineraries with verified hotels, dining, and maps
            </p>
          </div>
          <button
            onClick={() => onNavigate('mytrips')}
            className="text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            My Trips ({trips.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.slice(0, 3).map((trip) => (
            <div
              key={trip.id}
              onClick={() => {
                setActiveTripId(trip.id);
                onNavigate('itinerary');
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-sm">
                  {trip.durationDays} Days • {trip.travelStyle}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500 text-white">
                  {trip.budgetTier}
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {trip.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2">
                  {trip.overview.summary}
                </p>
                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {trip.startDate}
                  </span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    Open Itinerary <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Craftsmanship Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/70 dark:border-zinc-800 p-8 sm:p-12 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
            Built For Seamless, Unhurried Travel
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700/60 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                01
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Logistically Grounded</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                Calculates real transit minutes between points of interest so you never spend half your holiday stuck in traffic or backtracking.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700/60 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                02
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Weather-Smart Shifts</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                Forecasted rain? The itinerary engine moves open-air lookouts to clear mornings and reserves indoor galleries for showers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700/60 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                03
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Live Concierge Chat</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                Need a vegetarian alternative or want to reduce pacing on Day 3? Ask the floating AI assistant to tweak your plan on the fly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
