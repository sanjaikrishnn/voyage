import React, { useState } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Sparkles,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

interface WeatherPageProps {
  onNavigate: (page: string) => void;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({ onNavigate }) => {
  const { activeTrip } = useTrip();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const forecastDays = activeTrip.days.map((day, idx) => {
    const isRainy = idx % 3 === 1;
    return {
      dayNumber: day.dayNumber,
      date: day.date,
      condition: isRainy ? 'Afternoon Showers' : 'Partly Sunny',
      tempMax: 22 - (idx % 2),
      tempMin: 14 + (idx % 3),
      rainProb: isRainy ? 65 : 15,
      humidity: isRainy ? 78 : 55,
      windSpeed: '12 km/h',
      uvIndex: 5,
      sunrise: '05:48 AM',
      sunset: '18:15 PM',
      bestOutdoorWindow: isRainy ? '08:30 AM – 12:30 PM (Pre-Rain)' : 'All Day (Peak Light 10 AM – 4 PM)'
    };
  });

  const selectedDay = forecastDays[selectedDayIndex] || forecastDays[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <CloudSun className="w-4 h-4" />
          <span>Meteorological Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
          {activeTrip.city || activeTrip.destination} Weather Forecast
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Synchronized for {activeTrip.startDate} to {activeTrip.endDate} ({activeTrip.durationDays} Days)
        </p>
      </div>

      {/* AI Smart Weather Advisory Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-950 to-zinc-950 text-white border border-teal-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              AI Scheduling Suggestion
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-500/30 text-teal-300">
                Live Analysis
              </span>
            </h3>
            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Day 2 forecasts brief afternoon showers (~65% rain probability around 2:00 PM). We suggest visiting open-air parks in the morning and taking cover in museums or traditional tea houses by 1:30 PM.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('itinerary')}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center space-x-1.5 shrink-0 self-start md:self-auto"
        >
          <span>Adjust Day 2 in Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Day Selector Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {forecastDays.map((day, idx) => (
          <button
            key={day.dayNumber}
            onClick={() => setSelectedDayIndex(idx)}
            className={`whitespace-nowrap px-4 py-3 rounded-2xl border text-center transition-all min-w-[130px] ${
              selectedDayIndex === idx
                ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 shadow-md ring-2 ring-teal-500/20'
                : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/70'
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-gray-400 block">
              Day {day.dayNumber}
            </span>
            <span className="text-xs font-bold text-gray-900 dark:text-white block mt-0.5">
              {day.date}
            </span>
            <div className="flex items-center justify-center space-x-1 my-1">
              {day.rainProb > 40 ? (
                <CloudRain className="w-4 h-4 text-sky-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <span className="text-xs font-mono font-semibold text-gray-800 dark:text-zinc-200">
              {day.tempMax}° / {day.tempMin}°
            </span>
          </button>
        ))}
      </div>

      {/* Selected Day Spotlight Card */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 dark:border-zinc-800 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center border border-amber-200/50 dark:border-amber-900/50">
              {selectedDay.rainProb > 40 ? (
                <CloudRain className="w-8 h-8 text-sky-500" />
              ) : (
                <Sun className="w-8 h-8 text-amber-500" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-3xl font-extrabold font-display text-gray-900 dark:text-white">
                  {selectedDay.tempMax}°C
                </h3>
                <span className="text-sm text-gray-400 font-medium">/ Low {selectedDay.tempMin}°C</span>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                {selectedDay.condition} • {selectedDay.date} (Day {selectedDay.dayNumber})
              </p>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/60 dark:border-zinc-700 text-xs">
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Best Outdoor Window:</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">{selectedDay.bestOutdoorWindow}</span>
          </div>
        </div>

        {/* 4 Detail Grid Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gray-50/60 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-semibold">Precipitation</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedDay.rainProb}%</p>
            <p className="text-[11px] text-gray-400">Humidity: {selectedDay.humidity}%</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50/60 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Wind className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-semibold">Wind</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedDay.windSpeed}</p>
            <p className="text-[11px] text-gray-400">Gentle breeze</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50/60 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Sunrise className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold">Dawn</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedDay.sunrise}</p>
            <p className="text-[11px] text-gray-400">First morning light</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50/60 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Sunset className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-semibold">Dusk</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedDay.sunset}</p>
            <p className="text-[11px] text-gray-400">Golden hour photography</p>
          </div>
        </div>
      </div>
    </div>
  );
};
