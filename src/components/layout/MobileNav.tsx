import React from 'react';
import { Home, Compass, MapPin, Map, Bot, Menu } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onToggleAssistant: () => void;
  isAssistantOpen: boolean;
  onOpenMenu?: () => void;
  isMenuOpen?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  onToggleAssistant,
  isAssistantOpen,
  onOpenMenu,
  isMenuOpen = false
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'planner', label: 'Plan', icon: Compass },
    { id: 'itinerary', label: 'Itinerary', icon: MapPin },
    { id: 'map', label: 'Map', icon: Map }
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-gray-200/90 dark:border-zinc-800 px-1 pt-1.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-xl touch-manipulation select-none"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentPage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[50px] px-2 py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
              isActive
                ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/40'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* Floating AI Assistant Trigger in Bottom Nav */}
      <button
        onClick={onToggleAssistant}
        className={`flex flex-col items-center justify-center min-h-[48px] min-w-[50px] px-2 py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
          isAssistantOpen
            ? 'text-teal-700 dark:text-teal-300 font-bold bg-teal-100/70 dark:bg-teal-900/50'
            : 'text-teal-600 dark:text-teal-400'
        }`}
      >
        <div className="relative">
          <Bot className="w-5 h-5 mb-0.5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
        </div>
        <span className="text-[10px] tracking-tight">AI Guide</span>
      </button>

      {/* Full Menu Trigger */}
      <button
        onClick={() => {
          if (onOpenMenu) {
            onOpenMenu();
          } else {
            onNavigate('dashboard');
          }
        }}
        className={`flex flex-col items-center justify-center min-h-[48px] min-w-[50px] px-2 py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
          isMenuOpen
            ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/70 dark:bg-teal-950/40'
            : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Menu</span>
      </button>
    </nav>
  );
};
