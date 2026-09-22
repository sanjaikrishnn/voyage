import React from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CreditCard,
  CheckSquare,
  CloudSun,
  Map,
  ArrowRight,
  Heart,
  FileText,
  User,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { POPULAR_DESTINATIONS } from '../data/destinations';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { activeTrip, trips } = useTrip();
  const { user } = useAuth();

  // Calculate days until departure
  const today = new Date();
  const departureDate = new Date(activeTrip.startDate);
  const diffTime = departureDate.getTime() - today.getTime();
  const daysUntil = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Packing progress
  const packedCount = activeTrip.packingList.filter((i) => i.isPacked).length;
  const totalPacking = activeTrip.packingList.length;
  const packingPercent = totalPacking > 0 ? Math.round((packedCount / totalPacking) * 100) : 0;

  // Budget progress
  const totalActual = activeTrip.budgetItems.reduce((acc, item) => acc + item.actualAmount, 0);
  const targetBudget = activeTrip.estimatedTotalCost || 2200;
  const budgetPercent = Math.min(100, Math.round((totalActual / targetBudget) * 100));

  // Documents progress
  const docsVerified = activeTrip.documents.filter((d) => d.isCompleted).length;
  const totalDocs = activeTrip.documents.length;

  const savedPlaces = POPULAR_DESTINATIONS.filter((d) =>
    user?.savedDestinations.includes(d.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Traveler Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-zinc-900 to-slate-950 p-6 sm:p-8 text-white border border-teal-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-teal-500/30 shadow-lg"
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
              Welcome Back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-teal-300 font-medium">
              Home City: {user?.homeCity} • Currency: {user?.preferredCurrency}
            </p>
          </div>
        </div>

        {/* Departure Countdown Pill */}
        <div className="w-full md:w-auto px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center space-x-4">
          <Clock className="w-6 h-6 text-teal-400 shrink-0" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 block">
              Departure Countdown
            </span>
            <span className="text-xl font-extrabold text-white">
              {daysUntil} Days Away
            </span>
            <span className="text-[11px] text-gray-300 block">{activeTrip.city} ({activeTrip.startDate})</span>
          </div>
        </div>
      </div>

      {/* Active Trip Quick Overview Card */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-5 sm:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Primary Active Expedition
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {activeTrip.title}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('itinerary')}
            className="w-full sm:w-auto min-h-[42px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
          >
            <span>Open Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Tool Cards with Progress Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Packing */}
          <div
            onClick={() => onNavigate('packing')}
            className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 hover:border-teal-400 cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-teal-600" /> Packing List
              </span>
              <span className="text-xs font-bold text-teal-600">{packingPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${packingPercent}%` }} />
            </div>
            <p className="text-[11px] text-gray-400">{packedCount} of {totalPacking} items checked</p>
          </div>

          {/* Budget */}
          <div
            onClick={() => onNavigate('budget')}
            className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 hover:border-teal-400 cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Budget Spent
              </span>
              <span className="text-xs font-bold text-emerald-600">{budgetPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${budgetPercent}%` }} />
            </div>
            <p className="text-[11px] text-gray-400">${totalActual} of ${targetBudget} spent</p>
          </div>

          {/* Documents */}
          <div
            onClick={() => onNavigate('documents')}
            className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 hover:border-teal-400 cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" /> Documents
              </span>
              <span className="text-xs font-bold text-sky-600">{docsVerified}/{totalDocs}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-1.5 rounded-full"
                style={{ width: `${Math.round((docsVerified / Math.max(1, totalDocs)) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400">Passport & Visas ready</p>
          </div>

          {/* Route Map */}
          <div
            onClick={() => onNavigate('map')}
            className="p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-800/40 hover:border-teal-400 cursor-pointer transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Map className="w-4 h-4 text-indigo-600" /> Route Map
              </span>
              <span className="text-xs font-bold text-indigo-600">{activeTrip.durationDays} Days</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full w-full" />
            </div>
            <p className="text-[11px] text-gray-400">Interactive waypoint pins</p>
          </div>
        </div>
      </div>

      {/* Saved Destinations Wishlist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Saved Wishlist Destinations ({savedPlaces.length})</span>
          </h3>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            Explore More <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {savedPlaces.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onNavigate('explore')}
              className="rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-3.5 flex items-center space-x-3 cursor-pointer hover:border-teal-400 transition-all"
            >
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="truncate">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {dest.name}
                </h4>
                <p className="text-xs text-gray-400">{dest.country}</p>
                <p className="text-[11px] text-teal-600 font-semibold mt-0.5">
                  ${dest.avgDailyBudget} / day avg
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
