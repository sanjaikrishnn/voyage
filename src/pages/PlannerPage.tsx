import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Heart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Plus,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';
import { TripPlannerInput, TravelStyle, BudgetTier, InterestCategory } from '../types';
import { generateTripPlan } from '../services/ai/tripPlanner';
import { useTrip } from '../context/TripContext';

interface PlannerPageProps {
  initialDestination?: string;
  onNavigate: (page: string) => void;
}

const TRAVEL_STYLES: { id: TravelStyle; title: string; desc: string; icon: string }[] = [
  { id: 'Relaxed', title: 'Relaxed & Easy', desc: 'Slow mornings, 2-3 stops, leisurely meals', icon: '🌿' },
  { id: 'Balanced', title: 'Balanced & Classic', desc: 'Optimal mix of landmarks & downtime', icon: '⚖️' },
  { id: 'Packed', title: 'Action-Packed', desc: 'See everything from sunrise to dusk', icon: '⚡' },
  { id: 'Adventure', title: 'Adventure & Outdoor', desc: 'Hikes, wildlife, expeditions & thrill', icon: '🧗' },
  { id: 'Luxury', title: 'Luxury & Indulgence', desc: '5-star stays, Michelin dining, private cars', icon: '✨' },
  { id: 'Backpacking', title: 'Backpacking & Local', desc: 'Budget-friendly, public rail, street eats', icon: '🎒' },
  { id: 'Family', title: 'Family-Friendly', desc: 'Kid-approved pacing, interactive spaces', icon: '👨‍👩‍👧' },
  { id: 'Romantic', title: 'Romantic Getaway', desc: 'Scenic sunsets, candlelit tables, intimate walks', icon: '🍷' },
  { id: 'Business & Leisure', title: 'Bleisure', desc: 'High-speed WiFi, executive lounges, evening exploration', icon: '💼' }
];

const INTEREST_OPTIONS: { id: InterestCategory; label: string; icon: string }[] = [
  { id: 'Culture', label: 'Art & Culture', icon: '🏛️' },
  { id: 'Food', label: 'Culinary & Dining', icon: '🍜' },
  { id: 'History', label: 'History & Heritage', icon: '📜' },
  { id: 'Nature', label: 'Nature & Parks', icon: '🌲' },
  { id: 'Photography', label: 'Photography & Views', icon: '📸' },
  { id: 'Architecture', label: 'Architecture & Design', icon: '🏢' },
  { id: 'Shopping', label: 'Shopping & Boutiques', icon: '🛍️' },
  { id: 'Nightlife', label: 'Nightlife & Bars', icon: '🍸' },
  { id: 'Beaches', label: 'Beaches & Coastal', icon: '🏖️' },
  { id: 'Museums', label: 'Museums & Galleries', icon: '🎨' },
  { id: 'Adventure', label: 'Adventure Sports', icon: '🏄' },
  { id: 'Wildlife', label: 'Wildlife & Aquariums', icon: '🐬' },
  { id: 'Sports', label: 'Sports & Wellness', icon: '🚴' }
];

export const PlannerPage: React.FC<PlannerPageProps> = ({
  initialDestination = '',
  onNavigate
}) => {
  const { createTrip } = useTrip();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [destination, setDestination] = useState<string>(initialDestination || 'Tokyo, Japan');
  const [additionalDestinations, setAdditionalDestinations] = useState<string[]>([]);
  const [newExtraDest, setNewExtraDest] = useState<string>('');

  // Dates
  const [startDate, setStartDate] = useState<string>('2026-10-10');
  const [endDate, setEndDate] = useState<string>('2026-10-15');
  const [isFlexibleDates, setIsFlexibleDates] = useState<boolean>(false);

  // Travelers
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  // Budget
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Moderate');
  const [customTotalBudget, setCustomTotalBudget] = useState<number>(2500);

  // Travel Style
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Balanced');

  // Interests
  const [selectedInterests, setSelectedInterests] = useState<InterestCategory[]>([
    'Food',
    'Culture',
    'Photography',
    'History'
  ]);

  // Preferences
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [accessibilityRequired, setAccessibilityRequired] = useState<boolean>(false);
  const [preferredTransport, setPreferredTransport] = useState<string>('Public Transit');
  const [hotelPreference, setHotelPreference] = useState<string>('Boutique Hotel');
  const [walkingPace, setWalkingPace] = useState<'Light' | 'Moderate' | 'High'>('Moderate');
  const [scheduleRhythm, setScheduleRhythm] = useState<'Early Bird' | 'Balanced' | 'Night Owl'>('Balanced');

  // AI Generation Loading State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);

  // Calculate day count
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const toggleInterest = (interest: InterestCategory) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddExtraDest = () => {
    if (newExtraDest.trim()) {
      setAdditionalDestinations([...additionalDestinations, newExtraDest.trim()]);
      setNewExtraDest('');
    }
  };

  const handleRemoveExtraDest = (index: number) => {
    setAdditionalDestinations(additionalDestinations.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep(0);

    const stages = [
      'Analyzing destination geography & seasons...',
      'Mapping neighborhood clusters & transit times...',
      'Curating authentic dining & iconic experiences...',
      'Synthesizing budget, accommodations & safety checks...'
    ];

    const stageInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 900);

    const inputData: TripPlannerInput = {
      destination,
      additionalDestinations,
      startDate,
      endDate,
      durationDays: calculatedDays,
      isFlexibleDates,
      travelers: {
        adults,
        children,
        infants
      },
      budgetTier,
      customTotalBudget: customTotalBudget || undefined,
      currency: 'USD',
      travelStyle,
      interests: selectedInterests,
      preferences: {
        isVegetarian,
        dietaryNotes,
        accessibilityRequired,
        preferredTransport,
        hotelPreference,
        walkingPace,
        scheduleRhythm
      }
    };

    try {
      const generatedPlan = await generateTripPlan(inputData);
      clearInterval(stageInterval);
      createTrip(generatedPlan);
      setIsGenerating(false);
      onNavigate('itinerary');
    } catch (e) {
      console.error('Generation error', e);
      clearInterval(stageInterval);
      setIsGenerating(false);
      onNavigate('itinerary');
    }
  };

  const stepsList = [
    { num: 1, label: 'Destination' },
    { num: 2, label: 'Dates' },
    { num: 3, label: 'Travelers' },
    { num: 4, label: 'Budget' },
    { num: 5, label: 'Style' },
    { num: 6, label: 'Interests' },
    { num: 7, label: 'Preferences' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Wizard Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>Intelligent Trip Studio</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-gray-900 dark:text-white">
          Design Your Journey
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Step {currentStep} of 7: {stepsList[currentStep - 1].label}
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
          />

          {stepsList.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-teal-600 text-white shadow-md'
                    : isCurrent
                    ? 'bg-white dark:bg-zinc-900 border-2 border-teal-600 text-teal-600 font-extrabold ring-4 ring-teal-500/20'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 border border-gray-200 dark:border-zinc-700'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : step.num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/90 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
        {/* STEP 1: DESTINATION */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                Where are you traveling to?
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                Enter your primary city or region. You can also add multi-city stops.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                Primary Destination
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-teal-600 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Tokyo, Japan or Paris, France"
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Quick Inspiration Pills */}
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 block mb-2">
                Popular Suggestions:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Tokyo, Japan',
                  'Paris, France',
                  'Bali, Indonesia',
                  'Swiss Alps, Switzerland',
                  'Kyoto, Japan',
                  'Dubai, UAE',
                  'Singapore',
                  'Santorini, Greece'
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDestination(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      destination === item
                        ? 'bg-teal-600 text-white font-bold'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiple Destinations Support */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 block">
                Additional Destinations (Optional Multi-City)
              </span>
              {additionalDestinations.map((dest, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="flex-1 px-3.5 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-xs text-gray-800 dark:text-zinc-200 flex items-center justify-between">
                    <span>{dest}</span>
                    <span className="text-[10px] text-gray-400">Stop #{idx + 2}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveExtraDest(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={newExtraDest}
                  onChange={(e) => setNewExtraDest(e.target.value)}
                  placeholder="e.g. Kyoto or Osaka"
                  className="flex-1 px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddExtraDest}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-semibold text-gray-700 dark:text-zinc-200 flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Stop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DATES */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                When are you going?
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                Select your travel window. The AI will cross-reference weather forecasts and seasonal events.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-teal-600 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-teal-600 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/60 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Trip Duration Summary Box */}
            <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-teal-950 dark:text-teal-200">
                    Calculated Duration: {calculatedDays} Days / {calculatedDays - 1} Nights
                  </p>
                  <p className="text-xs text-teal-800/70 dark:text-teal-300/70">
                    Day-by-day scheduling will be built for all {calculatedDays} days.
                  </p>
                </div>
              </div>
              <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={isFlexibleDates}
                  onChange={(e) => setIsFlexibleDates(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-gray-700 dark:text-zinc-300">Flexible Dates (±3 Days)</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: TRAVELERS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                Who is traveling with you?
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                Helps configure ticket counts, double vs twin rooms, and family pacing.
              </p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Solo Traveler', a: 1, c: 0, i: 0, icon: '🧍' },
                { label: 'Couple', a: 2, c: 0, i: 0, icon: '👫' },
                { label: 'Family (2+1)', a: 2, c: 1, i: 0, icon: '👨‍👩‍👦' },
                { label: 'Friends (3)', a: 3, c: 0, i: 0, icon: '👥' }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAdults(preset.a);
                    setChildren(preset.c);
                    setInfants(preset.i);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    adults === preset.a && children === preset.c && infants === preset.i
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 font-bold'
                      : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xl block mb-1">{preset.icon}</span>
                  <span className="text-xs">{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Exact Counters */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              {/* Adults */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Adults</p>
                  <p className="text-xs text-gray-400">Ages 13 and above</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 font-bold text-base flex items-center justify-center active:scale-95 transition-transform"
                    aria-label="Decrease adults"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 font-bold text-base flex items-center justify-center active:scale-95 transition-transform"
                    aria-label="Increase adults"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Children</p>
                  <p className="text-xs text-gray-400">Ages 2 to 12</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 font-bold text-base flex items-center justify-center active:scale-95 transition-transform"
                    aria-label="Decrease children"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 font-bold text-base flex items-center justify-center active:scale-95 transition-transform"
                    aria-label="Increase children"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Infants</p>
                  <p className="text-xs text-gray-400">Under 2 years</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 font-bold text-base flex items-center justify-center active:scale-95 transition-transform"
                    aria-label="Decrease infants"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{infants}</span>
                  <button
                    type="button"
                    onClick={() => setInfants(infants + 1)}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 font-bold text-base flex items-center justify-center active:scale-95 transition-transform"
                    aria-label="Increase infants"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                What is your target budget?
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                The AI scales restaurant recommendations, accommodations, and private tours to fit this comfort level.
              </p>
            </div>

            {/* 4 Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  tier: 'Budget' as BudgetTier,
                  title: 'Budget Explorer',
                  range: '$70 - $120 / day',
                  desc: 'Hostels & cozy guesthouses, street food, public transport, free attractions'
                },
                {
                  tier: 'Moderate' as BudgetTier,
                  title: 'Moderate Comfort',
                  range: '$150 - $260 / day',
                  desc: '3-4 star hotels, popular local bistros, guided museum tours, mixed transit'
                },
                {
                  tier: 'Premium' as BudgetTier,
                  title: 'Premium Upgrade',
                  range: '$300 - $550 / day',
                  desc: 'Boutique design hotels, acclaimed tasting menus, skip-the-line passes'
                },
                {
                  tier: 'Luxury' as BudgetTier,
                  title: 'Luxury Excellence',
                  range: '$600+ / day',
                  desc: '5-star grand resorts, Michelin dining, private chauffeurs, bespoke VIP experiences'
                }
              ].map((b) => (
                <button
                  key={b.tier}
                  type="button"
                  onClick={() => setBudgetTier(b.tier)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    budgetTier === b.tier
                      ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-500/20'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{b.title}</h4>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">{b.range}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">{b.desc}</p>
                </button>
              ))}
            </div>

            {/* Custom Total Budget Input */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                Custom Estimated Total Budget (USD)
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-gray-400">$</span>
                <input
                  type="number"
                  value={customTotalBudget}
                  onChange={(e) => setCustomTotalBudget(Number(e.target.value))}
                  step="100"
                  min="200"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                ≈ ${Math.round(customTotalBudget / Math.max(1, calculatedDays))} per day for {adults + children} travelers
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: TRAVEL STYLE */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                What is your preferred travel style?
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                Dictates daily scheduling density, walking fatigue, and activity tone.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setTravelStyle(style.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    travelStyle === style.id
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 ring-2 ring-teal-500/20'
                      : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-2xl block mb-2">{style.icon}</span>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{style.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: INTERESTS */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                What interests you most?
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                Select at least 2 categories. We will balance these across your daily schedule.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-bold shadow-sm'
                        : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="text-lg">{interest.icon}</span>
                    <span className="text-xs truncate">{interest.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
              Selected: {selectedInterests.length} interests active
            </p>
          </div>
        )}

        {/* STEP 7: PREFERENCES */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                Personal Preferences & Logistics
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                Fine-tune dining constraints, physical mobility, schedule rhythm, and transportation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dietary */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                  Dietary & Food
                </h4>
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-gray-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={isVegetarian}
                    onChange={(e) => setIsVegetarian(e.target.checked)}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Prioritize Vegetarian / Plant-Based Options</span>
                </label>
                <input
                  type="text"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="Other allergies (e.g. Halal, Gluten-free, Peanut)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Accessibility */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                  Mobility & Pace
                </h4>
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-gray-800 dark:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={accessibilityRequired}
                    onChange={(e) => setAccessibilityRequired(e.target.checked)}
                    className="rounded text-teal-600 w-4 h-4"
                  />
                  <span>Wheelchair / Stroller Accessible Venues Only</span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Daily Walking:</span>
                  {(['Light', 'Moderate', 'High'] as const).map((pace) => (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => setWalkingPace(pace)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        walkingPace === pace
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                      }`}
                    >
                      {pace}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                  Preferred Transportation
                </h4>
                <select
                  value={preferredTransport}
                  onChange={(e) => setPreferredTransport(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 focus:outline-none"
                >
                  <option value="Public Transit">Subway & Fast Trains (Eco-friendly)</option>
                  <option value="Walking & Metro">Walking & Short Metro</option>
                  <option value="Taxi & Private Car">Taxi & Private Car Transfer</option>
                  <option value="Rental Car">Rental Car (Self Drive)</option>
                </select>
              </div>

              {/* Rhythm */}
              <div className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                  Daily Rhythm
                </h4>
                <select
                  value={scheduleRhythm}
                  onChange={(e) => setScheduleRhythm(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 focus:outline-none"
                >
                  <option value="Early Bird">Early Riser (Start ~8:00 AM)</option>
                  <option value="Balanced">Balanced (Start ~9:30 AM)</option>
                  <option value="Night Owl">Night Owl (Start ~11:00 AM, Night dining)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Bottom Controls */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="w-full sm:w-auto px-5 py-3 min-h-[44px] rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold text-gray-700 dark:text-zinc-300 flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {currentStep < 7 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto px-8 py-3.5 min-h-[48px] rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 hover:opacity-95 active:scale-95 text-white text-sm font-bold shadow-xl shadow-teal-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My AI Trip Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Generation Overlay Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto ring-8 ring-teal-500/10 animate-spin">
              <Compass className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">
                Engineering Your {destination} Itinerary
              </h3>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                {generationStep === 0 && 'Analyzing destination geography & seasons...'}
                {generationStep === 1 && 'Mapping neighborhood clusters & transit times...'}
                {generationStep === 2 && 'Curating authentic dining & iconic experiences...'}
                {generationStep === 3 && 'Synthesizing budget, accommodations & safety checks...'}
              </p>
            </div>

            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 transition-all duration-500"
                style={{ width: `${((generationStep + 1) / 4) * 100}%` }}
              />
            </div>

            <div className="text-[11px] text-gray-400">
              Personalizing {calculatedDays} days • {adults + children} travelers • {travelStyle} pace
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
