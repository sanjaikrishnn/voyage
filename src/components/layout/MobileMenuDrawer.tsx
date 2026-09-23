import React from 'react';
import {
  X,
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Map as MapIcon,
  Sun,
  Moon,
  User,
  Briefcase,
  Utensils,
  CloudSun,
  CheckSquare,
  FileText,
  Bot,
  Search,
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenSearch?: () => void;
  onOpenAuth?: () => void;
  onOpenAssistant?: () => void;
  onOpenInstallModal?: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  onOpenAssistant,
  onOpenInstallModal
}) => {
  const { currentTrip } = useTrip();
  const { actualTheme, setTheme } = useTheme();
  const { user } = useAuth();
  const { isInstallable, isInstalled, install, openInNewTab, isInIframe } = usePWAInstall();

  if (!isOpen) return null;

  const handleNav = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const handleInstallClick = async () => {
    if (isInstallable && !isInIframe) {
      const outcome = await install();
      if (!outcome && onOpenInstallModal) {
        onOpenInstallModal();
      }
    } else if (isInIframe) {
      openInNewTab();
    } else if (onOpenInstallModal) {
      onOpenInstallModal();
    }
  };

  const mainLinks = [
    { id: 'planner', label: 'AI Trip Planner', icon: Sparkles, desc: 'Generate custom itinerary', highlight: true },
    { id: 'home', label: 'Explore Destinations', icon: Compass, desc: 'Featured voyages & guides' },
    { id: 'itinerary', label: 'Trip Itinerary', icon: Calendar, desc: 'Daily activities & timeline' },
    { id: 'map', label: 'Interactive Map', icon: MapIcon, desc: 'Route visualization & places' },
    { id: 'budget', label: 'Budget & Expenses', icon: DollarSign, desc: 'Track spending & totals' }
  ];

  const toolLinks = [
    { id: 'accommodations', label: 'Hotels & Stays', icon: Briefcase },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'weather', label: 'Weather Forecast', icon: CloudSun },
    { id: 'packing', label: 'Packing Checklist', icon: CheckSquare },
    { id: 'documents', label: 'Travel Documents', icon: FileText },
    { id: 'dashboard', label: 'All Trips & Dashboard', icon: User }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[88vh] bg-white dark:bg-zinc-900 rounded-t-3xl border-t border-gray-200 dark:border-zinc-800 shadow-2xl p-5 overflow-y-auto flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle & close row */}
        <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
              V
            </div>
            <div>
              <p className="text-sm font-bold font-display text-gray-900 dark:text-white">
                Navigation & Tools
              </p>
              {currentTrip && (
                <p className="text-[11px] text-teal-600 dark:text-teal-400 truncate max-w-[200px]">
                  Active: {currentTrip.destination}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PWA Download / Install App Banner */}
        {!isInstalled && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <p className="text-xs font-bold flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                {isInIframe ? 'Open in App View' : 'Download / Install Voyager'}
              </p>
              <p className="text-[11px] text-teal-50 opacity-90">
                {isInIframe
                  ? 'Open outside preview frame to install'
                  : 'Fast offline access without browser tabs'}
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-white text-teal-800 text-xs font-bold shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              {isInIframe ? 'Open Tab' : 'Install'}
            </button>
          </div>
        )}

        {/* Primary Pages */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-1">
            Main Navigation
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {mainLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all active:scale-98 cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 font-bold'
                      : 'bg-gray-50/70 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-xl ${
                        isActive
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-200/60 dark:bg-zinc-700/60 text-gray-600 dark:text-zinc-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Trip Tools Grid */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-1">
            Trip Tools & Management
          </p>
          <div className="grid grid-cols-2 gap-2">
            {toolLinks.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentPage === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleNav(tool.id)}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white font-bold shadow-sm'
                      : 'bg-gray-50 dark:bg-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-500 dark:text-teal-400 shrink-0" />
                  <span className="truncate">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Utilities: Search, AI Concierge, Theme, Auth */}
        <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-3 gap-2">
          {onOpenAssistant && (
            <button
              onClick={() => {
                onClose();
                onOpenAssistant();
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 text-center active:scale-95 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 mb-1 text-teal-600 dark:text-teal-400" />
              <span className="text-[10px] font-bold">AI Concierge</span>
            </button>
          )}

          {onOpenSearch && (
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 text-gray-700 dark:text-zinc-300 text-center active:scale-95 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 mb-1 text-gray-500 dark:text-zinc-400" />
              <span className="text-[10px] font-bold">Search</span>
            </button>
          )}

          <button
            onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 text-gray-700 dark:text-zinc-300 text-center active:scale-95 transition-all cursor-pointer"
          >
            {actualTheme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 mb-1 text-amber-400" />
                <span className="text-[10px] font-bold">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mb-1 text-gray-600" />
                <span className="text-[10px] font-bold">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
