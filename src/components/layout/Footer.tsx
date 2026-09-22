import React from 'react';
import { Compass, Sparkles, Shield, Globe, Award, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
                Voyager AI
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Engineering the future of personalized luxury travel. Multi-city AI itinerary generation, real-time route optimization, weather-aware scheduling, and live concierge assistance.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-xs text-gray-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Secure Travel Planner
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" /> 190+ Destinations
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Planning Engine
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('planner')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  AI Trip Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Trending Destinations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('itinerary')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Interactive Itinerary
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('budget')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Budget Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Route Map Visualizer
                </button>
              </li>
            </ul>
          </div>

          {/* Travel Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Travel Intelligence
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Weather Forecasts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packing')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  AI Packing Checklist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('food')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Local Food & Cafes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('accommodations')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Curated Stays & Hotels
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('documents')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Passports & Visas
                </button>
              </li>
            </ul>
          </div>

          {/* Featured Trips */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Featured Expeditions
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('itinerary')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Tokyo Neon & Tradition (5d)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('itinerary')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Paris Gastronomy & Art (4d)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('itinerary')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Bali Eco-Villa Sanctuary (6d)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Swiss Alps & Glacier Trains
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 dark:border-zinc-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 dark:text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Voyager AI Travel Technologies Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1">
              Engineered with <Sparkles className="w-3.5 h-3.5 text-teal-500 inline" /> Gemini Intelligence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
