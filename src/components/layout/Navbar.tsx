import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Map as MapIcon,
  Search,
  Sun,
  Moon,
  ChevronDown,
  User,
  PlusCircle,
  Menu,
  X,
  Briefcase,
  Utensils,
  CloudSun,
  CheckSquare,
  FileText,
  Bot
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenAssistant?: () => void;
  onOpenMenu?: () => void;
  isMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  onOpenAssistant,
  onOpenMenu,
  isMenuOpen
}) => {
  const { trips, activeTrip, setActiveTripId } = useTrip();
  const { theme, actualTheme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [tripDropdownOpen, setTripDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'planner', label: 'Plan Trip', highlight: true },
    { id: 'explore', label: 'Explore' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'map', label: 'Map View' },
    { id: 'budget', label: 'Budget' },
    { id: 'weather', label: 'Weather' }
  ];

  const moreItems = [
    { id: 'accommodations', label: 'Hotels & Stays', icon: Briefcase },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'packing', label: 'Packing Checklist', icon: CheckSquare },
    { id: 'documents', label: 'Travel Documents', icon: FileText },
    { id: 'mytrips', label: 'All My Trips', icon: Calendar },
    { id: 'dashboard', label: 'Traveler Dashboard', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2.5 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                  Voyager
                  <span className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" /> AI
                  </span>
                </span>
                <span className="hidden sm:block text-[11px] font-medium text-gray-400 dark:text-zinc-400 -mt-1 tracking-wide">
                  Smart Travel Studio
                </span>
              </div>
            </button>

            {/* Active Trip Quick Selector Badge (Desktop) */}
            {activeTrip && (
              <div className="relative hidden xl:block ml-4 pl-4 border-l border-gray-200 dark:border-zinc-800">
                <button
                  onClick={() => setTripDropdownOpen(!tripDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-100/80 dark:bg-zinc-800/60 hover:bg-gray-200/70 dark:hover:bg-zinc-700/60 text-xs font-semibold text-gray-700 dark:text-zinc-200 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span className="truncate max-w-[130px]">{activeTrip.city || activeTrip.destination}</span>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-400">({activeTrip.durationDays}d)</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {tripDropdownOpen && (
                  <div
                    className="absolute left-4 mt-2 w-64 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setTripDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-400">
                      Active Trips
                    </div>
                    {trips.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTripId(t.id);
                          setTripDropdownOpen(false);
                          onNavigate('itinerary');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-gray-50 dark:hover:bg-zinc-800/70 transition-colors ${
                          t.id === activeTrip.id
                            ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-950/30'
                            : 'text-gray-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <p className="truncate font-medium">{t.destination}</p>
                          <p className="text-[10px] text-gray-400 font-normal">{t.startDate} • {t.durationDays} days</p>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 shrink-0">
                          {t.status}
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 dark:border-zinc-800 mt-1 pt-1 px-2">
                      <button
                        onClick={() => {
                          setTripDropdownOpen(false);
                          onNavigate('planner');
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Plan New Destination</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                        : 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40 font-semibold'
                      : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* "More" dropdown for extended tabs */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  moreItems.some((m) => m.id === currentPage)
                    ? 'text-teal-600 dark:text-teal-400 font-semibold'
                    : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {moreItems.map((m) => {
                    const Icon = m.icon;
                    const isSubActive = currentPage === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          onNavigate(m.id);
                          setMoreDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-3.5 py-2 text-xs font-medium transition-colors ${
                          isSubActive
                            ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 font-bold'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 opacity-70" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls: Search, AI Concierge, Theme, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* AI Concierge Chatbot Button */}
            {onOpenAssistant && (
              <button
                onClick={onOpenAssistant}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200/80 dark:border-teal-800/80 transition-all shadow-sm cursor-pointer"
                title="Open Voyager AI Concierge"
              >
                <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden md:inline">AI Concierge</span>
              </button>
            )}

            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white bg-gray-100/80 dark:bg-zinc-800/60 hover:bg-gray-200/80 dark:hover:bg-zinc-700 transition-colors"
              title="Search destinations & activities (Cmd+K)"
            >
              <Search className="w-4 h-4 text-gray-400 dark:text-zinc-400" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded text-gray-400">
                ⌘K
              </kbd>
            </button>

            {/* PWA Install Button (Desktop & Tablet) */}
            <PWAInstallButton variant="nav" className="hidden sm:flex" />

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {actualTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {/* User Profile / Auth */}
            {isAuthenticated && user ? (
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-teal-500/40"
                />
                <span className="hidden xl:inline text-xs font-semibold text-gray-800 dark:text-zinc-200">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                if (onOpenMenu) {
                  onOpenMenu();
                } else {
                  setMobileMenuOpen(!mobileMenuOpen);
                }
              }}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMenuOpen || mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-3 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-3 min-h-[44px] rounded-xl text-xs font-semibold active:scale-95 transition-all flex items-center justify-between ${
                  currentPage === item.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{item.label}</span>
                {currentPage === item.id && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2" />}
              </button>
            ))}
          </div>

          <div className="pt-1">
            <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Trip Tools & Details
            </p>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onNavigate(m.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2.5 text-left px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-medium active:scale-95 transition-all ${
                      currentPage === m.id
                        ? 'text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80'
                        : 'text-gray-700 dark:text-zinc-300 bg-gray-50/60 dark:bg-zinc-900/60 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PWA Install Button inside mobile drawer */}
          <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
            <PWAInstallButton variant="full" />
          </div>
        </div>
      )}
    </header>
  );
};
