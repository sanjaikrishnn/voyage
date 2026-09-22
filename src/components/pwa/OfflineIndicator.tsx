import React from 'react';
import { WifiOff, HardDrive } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:left-6 z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-zinc-900/95 text-white border border-teal-500/30 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            Offline Mode Active
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </p>
          <p className="text-[11px] text-zinc-400">
            Itineraries and map tiles are served from local PWA cache.
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center space-x-1 text-[11px] font-semibold text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-800/60">
        <HardDrive className="w-3.5 h-3.5" />
        <span>Cached</span>
      </div>
    </div>
  );
};
