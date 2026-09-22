import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Clock,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Utensils,
  Hotel,
  Landmark,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { TripPlan, Activity } from '../../types';

interface InteractiveTripMapProps {
  trip: TripPlan;
  onSelectActivity?: (dayNumber: number, actId: string) => void;
}

export const InteractiveTripMap: React.FC<InteractiveTripMapProps> = ({
  trip,
  onSelectActivity
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(() => {
    return trip.days[0]?.activities[0] || null;
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentDay = trip.days.find((d) => d.dayNumber === selectedDayNumber) || trip.days[0];
  const activities = currentDay ? currentDay.activities : [];

  const filteredActivities = activities.filter((act) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'food') return act.category === 'food';
    if (filterCategory === 'stay') return act.category === 'accommodation';
    if (filterCategory === 'sights') return act.category === 'sightseeing' || act.category === 'culture' || act.category === 'nature';
    return true;
  });

  // Calculate SVG plot positions for activities along an organic curved transit path
  const markerCoords = filteredActivities.map((act, index) => {
    // Distribute markers gracefully along a stylized canvas grid
    const total = filteredActivities.length || 1;
    const t = index / Math.max(1, total - 1);
    // Stylized coordinate curve across 800x500 viewport
    const x = 140 + t * 520 + Math.sin(index * 2.1) * 60;
    const y = 100 + t * 280 + Math.cos(index * 1.8) * 45;
    return { activity: act, x, y, index: index + 1 };
  });

  // SVG route path connecting sequential markers
  const pathD = markerCoords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = markerCoords[idx - 1];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2 + (idx % 2 === 0 ? 30 : -30);
    return `${acc} Q ${midX} ${midY}, ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col lg:flex-row">
      {/* Left / Main Map Canvas */}
      <div className="flex-1 flex flex-col relative min-h-[460px] sm:min-h-[520px] bg-slate-100 dark:bg-zinc-950 overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 z-10">
          {/* Day Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {trip.days.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDayNumber(day.dayNumber);
                  setSelectedActivity(day.activities[0] || null);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDayNumber === day.dayNumber
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === 'all'
                  ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('sights')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === 'sights'
                  ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              Attractions
            </button>
            <button
              onClick={() => setFilterCategory('food')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === 'food'
                  ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              Dining
            </button>
            <button
              onClick={() => setFilterCategory('stay')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === 'stay'
                  ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              Stays
            </button>
          </div>
        </div>

        {/* Map Interactive Canvas */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center p-4">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full max-h-[540px] drop-shadow-sm select-none"
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
          >
            {/* Map Grid & Topographic Elements */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-slate-200/60 dark:text-zinc-800/40" strokeWidth="1" />
              </pattern>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Base Background Landmass & Water Body */}
            <rect width="800" height="500" fill="currentColor" className="text-slate-50 dark:text-zinc-900" />
            <rect width="800" height="500" fill="url(#grid)" />

            {/* Stylized River / Water Canal */}
            <path
              d="M -20 380 Q 200 420, 380 320 T 680 180 T 820 120"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="28"
              strokeLinecap="round"
              className="opacity-30 dark:opacity-20"
            />
            <path
              d="M -20 380 Q 200 420, 380 320 T 680 180 T 820 120"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeDasharray="6 4"
              className="opacity-50 dark:opacity-30"
            />

            {/* Stylized District Roads */}
            <path d="M 60 50 L 740 450 M 120 450 L 680 50 M 50 250 L 750 250" fill="none" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="2.5" />
            <circle cx="400" cy="250" r="140" fill="none" stroke="currentColor" className="text-slate-200/50 dark:text-zinc-800/30" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* District Labels */}
            <text x="180" y="70" className="text-[12px] font-bold fill-slate-400 dark:fill-zinc-600 uppercase tracking-widest">
              {trip.city} North Quarter
            </text>
            <text x="560" y="440" className="text-[12px] font-bold fill-slate-400 dark:fill-zinc-600 uppercase tracking-widest">
              Cultural District
            </text>

            {/* Connecting Route Transit Line */}
            {pathD && (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                  className="filter drop-shadow-md animate-pulse"
                />
              </>
            )}

            {/* Activity Waypoint Markers */}
            {markerCoords.map(({ activity, x, y, index }) => {
              const isSelected = selectedActivity?.id === activity.id;
              const isFood = activity.category === 'food';
              const isStay = activity.category === 'accommodation';
              const isCulture = activity.category === 'culture' || activity.category === 'sightseeing';

              const pinColor = isStay ? '#6366f1' : isFood ? '#f59e0b' : isCulture ? '#0d9488' : '#10b981';

              return (
                <g
                  key={activity.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedActivity(activity)}
                >
                  {/* Subtle Pulse aura if selected */}
                  {isSelected && (
                    <circle
                      r="26"
                      fill={pinColor}
                      className="opacity-25 animate-ping"
                    />
                  )}

                  {/* Marker Pin Base */}
                  <circle
                    r={isSelected ? 18 : 15}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="filter drop-shadow-md transition-all duration-200 group-hover:scale-110"
                  />

                  {/* Number Badge */}
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={isSelected ? '12' : '11'}
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {index}
                  </text>

                  {/* Hover Floating Mini Title */}
                  <g className={`transition-opacity duration-150 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <rect
                      x="-60"
                      y="-40"
                      width="120"
                      height="24"
                      rx="6"
                      fill="#0f172a"
                      className="dark:fill-zinc-800 drop-shadow-lg"
                    />
                    <text
                      x="0"
                      y="-24"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      className="truncate"
                    >
                      {activity.time} • {activity.title.slice(0, 14)}...
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Floating Map Legend & Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-1 shadow-lg z-10">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
              className="p-1.5 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
              className="p-1.5 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-[10px] font-mono font-bold text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200"
              title="Reset Zoom"
            >
              100%
            </button>
          </div>

          {/* Map Compass Indicator */}
          <div className="absolute top-18 left-4 flex items-center space-x-1.5 px-2.5 py-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg text-[11px] font-semibold text-gray-600 dark:text-zinc-400 border border-gray-200/60 dark:border-zinc-800">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>{trip.city} Coords: 35.68°N, 139.75°E</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Selected Stop Details & Sequence List */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Day {currentDay.dayNumber} Route Sequence
            </h4>
            <p className="text-xs text-gray-400">
              {filteredActivities.length} waypoints scheduled
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold">
            {currentDay.estimatedDailyCost ? `$${currentDay.estimatedDailyCost} Est.` : 'Daily Plan'}
          </span>
        </div>

        {/* Highlighted Activity Detail Card */}
        {selectedActivity ? (
          <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-teal-50/60 to-emerald-50/30 dark:from-zinc-800/80 dark:to-zinc-800/40 border border-teal-200/60 dark:border-zinc-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-600 text-white">
                {selectedActivity.time}
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {selectedActivity.duration}
              </span>
            </div>

            <div>
              <h5 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                {selectedActivity.title}
              </h5>
              <p className="text-xs text-teal-700 dark:text-teal-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" /> {selectedActivity.location}
              </p>
            </div>

            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
              {selectedActivity.shortDescription}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-teal-200/40 dark:border-zinc-700/60 text-xs">
              <span className="font-semibold text-gray-700 dark:text-zinc-200 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                {selectedActivity.estimatedCost === 0 ? 'Free Entry' : `$${selectedActivity.estimatedCost}`}
              </span>
              <span className="text-gray-500 dark:text-zinc-400">
                Transit: {selectedActivity.transportMethod || 'Walk'}
              </span>
            </div>
          </div>
        ) : (
          <div className="my-4 p-4 text-center text-xs text-gray-400">
            Click any marker to inspect destination details.
          </div>
        )}

        {/* Scrollable Waypoint List */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px] pr-1">
          {filteredActivities.map((act, idx) => {
            const isSelected = selectedActivity?.id === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-gray-900 dark:text-white font-semibold'
                    : 'border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/60 text-gray-600 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate mr-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                    isSelected ? 'bg-teal-600' : 'bg-gray-400 dark:bg-zinc-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="truncate font-medium">{act.title}</p>
                    <p className="text-[10px] text-gray-400">{act.time} • {act.location}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
