import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Navigation,
  Sparkles,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Share2,
  Download,
  CheckCircle2,
  Map as MapIcon,
  List,
  Utensils,
  Landmark,
  Camera,
  Layers,
  ChevronRight,
  RefreshCw,
  Sun,
  X,
  Sliders
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { Activity, DayItinerary, OptimizationGoal } from '../types';
import { InteractiveTripMap } from '../components/map/InteractiveTripMap';
import { optimizeItineraryWithAI } from '../services/ai/itineraryOptimizer';

interface ItineraryPageProps {
  onNavigate: (page: string) => void;
}

export const ItineraryPage: React.FC<ItineraryPageProps> = ({ onNavigate }) => {
  const {
    activeTrip,
    editActivity,
    deleteActivity,
    moveActivity,
    addActivity,
    regenerateActivityWithAI,
    applyOptimization
  } = useTrip();

  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Optimization Modal State
  const [isOptimizeOpen, setIsOptimizeOpen] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [selectedGoals, setSelectedGoals] = useState<OptimizationGoal[]>([
    'reduce_travel_time',
    'group_nearby',
    'avoid_backtracking'
  ]);

  // Edit Activity Modal State
  const [editingActivity, setEditingActivity] = useState<{
    dayNumber: number;
    activity: Activity;
  } | null>(null);

  // Add Activity Modal State
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newActivityData, setNewActivityData] = useState<Omit<Activity, 'id'>>({
    time: '14:30',
    title: '',
    shortDescription: '',
    location: '',
    duration: '1h 30m',
    category: 'sightseeing',
    estimatedCost: 15,
    distanceFromPrevious: '0.8 km',
    transportMethod: 'Walk'
  });

  // Share Notification Feedback
  const [shareFeedback, setShareFeedback] = useState<string>('');

  const currentDay = activeTrip.days.find((d) => d.dayNumber === activeDayNumber) || activeTrip.days[0];

  const handleRunOptimizer = async () => {
    setIsOptimizing(true);
    try {
      const res = await optimizeItineraryWithAI(activeTrip.days, selectedGoals, activeTrip.city);
      setOptimizationResult(res);
    } catch (e) {
      console.error('Optimization failed', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimizer = () => {
    if (optimizationResult && optimizationResult.optimizedDays) {
      applyOptimization(optimizationResult.optimizedDays);
      setIsOptimizeOpen(false);
      setOptimizationResult(null);
      setShareFeedback('Optimization applied to itinerary!');
      setTimeout(() => setShareFeedback(''), 3000);
    }
  };

  const handleShareTrip = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback('Trip link copied to clipboard!');
    setTimeout(() => setShareFeedback(''), 3000);
  };

  const handleExportTrip = () => {
    const tripJson = JSON.stringify(activeTrip, null, 2);
    const blob = new Blob([tripJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTrip.destination.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShareFeedback('Itinerary downloaded as JSON!');
    setTimeout(() => setShareFeedback(''), 3000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;
    editActivity(editingActivity.dayNumber, editingActivity.activity.id, editingActivity.activity);
    setEditingActivity(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityData.title.trim()) return;
    addActivity(activeDayNumber, newActivityData);
    setIsAddOpen(false);
    setNewActivityData({
      time: '15:00',
      title: '',
      shortDescription: '',
      location: '',
      duration: '1h 30m',
      category: 'sightseeing',
      estimatedCost: 20,
      distanceFromPrevious: '1.2 km',
      transportMethod: 'Walk'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Toast Feedback */}
      {shareFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{shareFeedback}</span>
        </div>
      )}

      {/* Itinerary Header Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-zinc-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {activeTrip.durationDays} Days • {activeTrip.travelStyle}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/10 text-white/90">
                {activeTrip.startDate} to {activeTrip.endDate}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-300">
                {activeTrip.budgetTier} Tier
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
              {activeTrip.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              {activeTrip.overview.summary}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Optimize CTA */}
            <button
              onClick={() => setIsOptimizeOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:opacity-95 text-zinc-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Route Optimizer</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShareTrip}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Export */}
            <button
              onClick={handleExportTrip}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Export as JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher & Day Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        {/* Day Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {activeTrip.days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayNumber(day.dayNumber)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeDayNumber === day.dayNumber
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                  : 'bg-gray-100 dark:bg-zinc-800/80 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>

        {/* View Mode Toggle: List vs Map */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'map'
                ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map Route</span>
          </button>
        </div>
      </div>

      {/* MAP VIEW */}
      {viewMode === 'map' ? (
        <InteractiveTripMap trip={activeTrip} />
      ) : (
        /* TIMELINE / LIST VIEW */
        <div className="space-y-6">
          {/* Day Theme Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-teal-600 dark:text-teal-400 font-bold mb-1">
                <span>DAY {currentDay.dayNumber} OF {activeTrip.durationDays}</span>
                <span>•</span>
                <span>{currentDay.date}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-gray-900 dark:text-white">
                {currentDay.theme}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                {currentDay.summary}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Est. Cost</span>
                <span className="text-sm font-bold text-teal-700 dark:text-teal-400">
                  ${currentDay.estimatedDailyCost || 60}
                </span>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[42px] rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-teal-200 dark:border-teal-800 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity</span>
              </button>
            </div>
          </div>

          {/* Activities Timeline */}
          <div className="space-y-4">
            {currentDay.activities.map((act, index) => {
              const isFood = act.category === 'food';
              const isStay = act.category === 'accommodation';
              const isCulture = act.category === 'culture' || act.category === 'sightseeing';

              return (
                <div
                  key={act.id}
                  className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 relative group"
                >
                  {/* Left Column: Number & Time */}
                  <div className="md:w-32 flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800 pb-2 md:pb-0 md:pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm font-extrabold font-mono text-gray-900 dark:text-white">
                        {act.time}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{act.duration}</span>
                    </div>

                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 mt-2">
                      {act.category}
                    </span>
                  </div>

                  {/* Middle Column: Activity Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                        {act.title}
                      </h3>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2 shrink-0">
                        {act.estimatedCost === 0 ? 'Free' : `$${act.estimatedCost}`}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
                      {act.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1 font-medium text-teal-700 dark:text-teal-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{act.location}</span>
                      </span>

                      {act.distanceFromPrevious && (
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-gray-400" />
                          <span>{act.distanceFromPrevious} ({act.transportMethod || 'Walk'})</span>
                        </span>
                      )}

                      {act.indoorOutdoor && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-500">
                          {act.indoorOutdoor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Edit & Order Controls */}
                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-1.5 shrink-0 pt-2.5 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-zinc-800">
                    {/* Move Up */}
                    <button
                      onClick={() => moveActivity(currentDay.dayNumber, act.id, 'up')}
                      disabled={index === 0}
                      className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-gray-500 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 transition-all"
                      title="Move earlier"
                      aria-label="Move activity earlier"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveActivity(currentDay.dayNumber, act.id, 'down')}
                      disabled={index === currentDay.activities.length - 1}
                      className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-gray-500 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 transition-all"
                      title="Move later"
                      aria-label="Move activity later"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* AI Regenerate / Alternative */}
                    <button
                      onClick={() => regenerateActivityWithAI(currentDay.dayNumber, act.id)}
                      className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60 active:scale-95 transition-all"
                      title="AI Swap: Replace with smart alternative"
                      aria-label="AI alternative activity"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditingActivity({ dayNumber: currentDay.dayNumber, activity: { ...act } })}
                      className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-gray-500 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 transition-all"
                      title="Edit activity"
                      aria-label="Edit activity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteActivity(currentDay.dayNumber, act.id)}
                      className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 transition-all"
                      title="Remove from itinerary"
                      aria-label="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OPTIMIZE MODAL */}
      {isOptimizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsOptimizeOpen(false);
                setOptimizationResult(null);
              }}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">
                  Voyager Route & Schedule Optimizer
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  AI re-evaluates stops for zero backtracking and smooth pacing
                </p>
              </div>
            </div>

            {/* Optimization Goals Selector */}
            <div className="space-y-2 mb-6">
              <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 block">
                Select Optimization Objectives:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'reduce_travel_time' as OptimizationGoal, label: 'Cut Transit Times' },
                  { id: 'group_nearby' as OptimizationGoal, label: 'Cluster Nearby Districts' },
                  { id: 'avoid_backtracking' as OptimizationGoal, label: 'Zero Backtracking' },
                  { id: 'balance_fatigue' as OptimizationGoal, label: 'Pace Walking Strain' },
                  { id: 'weather_shift' as OptimizationGoal, label: 'Adapt to Weather' }
                ].map((goal) => {
                  const isChecked = selectedGoals.includes(goal.id);
                  return (
                    <label
                      key={goal.id}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold'
                          : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedGoals(selectedGoals.filter((g) => g !== goal.id));
                          } else {
                            setSelectedGoals([...selectedGoals, goal.id]);
                          }
                        }}
                        className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                      />
                      <span>{goal.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* If not generated yet */}
            {!optimizationResult ? (
              <button
                onClick={handleRunOptimizer}
                disabled={isOptimizing}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/25 flex items-center justify-center space-x-2"
              >
                {isOptimizing ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Route Vectors...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Route Optimization</span>
                  </>
                )}
              </button>
            ) : (
              /* Optimization Comparison Result */
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Optimized Itinerary Ready
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      -{optimizationResult.estimatedMinutesSaved} Minutes Transit
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    {optimizationResult.explanation}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Improvements Overview
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-zinc-300">
                    {optimizationResult.changesApplied?.map((change: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={handleApplyOptimizer}
                    className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/25"
                  >
                    Apply Optimization
                  </button>
                  <button
                    onClick={() => setOptimizationResult(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-600 dark:text-zinc-300"
                  >
                    Recalculate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT ACTIVITY MODAL */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingActivity(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Edit Activity
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  value={editingActivity.activity.title}
                  onChange={(e) =>
                    setEditingActivity({
                      ...editingActivity,
                      activity: { ...editingActivity.activity, title: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={editingActivity.activity.time}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        activity: { ...editingActivity.activity, time: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingActivity.activity.duration}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        activity: { ...editingActivity.activity, duration: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editingActivity.activity.location}
                  onChange={(e) =>
                    setEditingActivity({
                      ...editingActivity,
                      activity: { ...editingActivity.activity, location: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingActivity.activity.shortDescription}
                  onChange={(e) =>
                    setEditingActivity({
                      ...editingActivity,
                      activity: { ...editingActivity.activity, shortDescription: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    value={editingActivity.activity.estimatedCost}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        activity: { ...editingActivity.activity, estimatedCost: Number(e.target.value) }
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingActivity.activity.category}
                    onChange={(e) =>
                      setEditingActivity({
                        ...editingActivity,
                        activity: { ...editingActivity.activity, category: e.target.value as any }
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="culture">Culture</option>
                    <option value="nature">Nature</option>
                    <option value="shopping">Shopping</option>
                    <option value="nightlife">Nightlife</option>
                    <option value="accommodation">Accommodation</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-3 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs active:scale-95 transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="px-5 py-3 min-h-[44px] rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-600 dark:text-zinc-300 active:bg-gray-100 dark:active:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ACTIVITY MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Add Activity to Day {activeDayNumber}
            </h3>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roppongi Hills Observation Deck"
                  value={newActivityData.title}
                  onChange={(e) => setNewActivityData({ ...newActivityData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={newActivityData.time}
                    onChange={(e) => setNewActivityData({ ...newActivityData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newActivityData.duration}
                    onChange={(e) => setNewActivityData({ ...newActivityData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-10-1 Roppongi, Minato"
                  value={newActivityData.location}
                  onChange={(e) => setNewActivityData({ ...newActivityData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Key highlights, booking notes, photo tips..."
                  value={newActivityData.shortDescription}
                  onChange={(e) => setNewActivityData({ ...newActivityData, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    value={newActivityData.estimatedCost}
                    onChange={(e) => setNewActivityData({ ...newActivityData, estimatedCost: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newActivityData.category}
                    onChange={(e) => setNewActivityData({ ...newActivityData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
                  >
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="culture">Culture</option>
                    <option value="nature">Nature</option>
                    <option value="shopping">Shopping</option>
                    <option value="nightlife">Nightlife</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-3 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs active:scale-95 transition-all"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-3 min-h-[44px] rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-600 dark:text-zinc-300 active:bg-gray-100 dark:active:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
