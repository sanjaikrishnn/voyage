import React from 'react';
import {
  X,
  Download,
  Share,
  PlusSquare,
  Smartphone,
  Laptop,
  CheckCircle2,
  WifiOff,
  Zap,
  Sparkles
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close install modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/25 shrink-0">
            <img
              src="/icon.svg"
              alt="Voyager Logo"
              className="w-8 h-8 rounded-lg"
              onError={(e) => {
                // fallback if svg fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-1.5">
              Install Voyager App
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                PWA
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Install for instant offline access and native app performance
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-gray-900 dark:text-white">Instant Launch</p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">Zero load lag</p>
          </div>
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <WifiOff className="w-5 h-5 text-teal-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-gray-900 dark:text-white">Offline Mode</p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">Cached itineraries</p>
          </div>
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <Smartphone className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-gray-900 dark:text-white">Standalone</p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">Full screen mode</p>
          </div>
        </div>

        {/* Installation Instructions / Action */}
        <div className="space-y-4">
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center space-x-3 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="text-sm font-bold">Voyager is already installed</p>
                <p className="text-xs opacity-90">
                  You are running or have installed the app. You can launch it directly from your home screen or application launcher!
                </p>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/25 flex items-center justify-center space-x-2 active:scale-98 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Install Voyager Now</span>
              </button>
              <p className="text-center text-[11px] text-gray-400 dark:text-zinc-500">
                Click above to trigger the native installation dialog in your browser.
              </p>
            </div>
          ) : isIOS ? (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200/80 dark:border-zinc-700/80 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                iOS Safari Instructions
              </p>
              <div className="space-y-2.5 text-xs text-gray-700 dark:text-zinc-300">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Tap the Share icon</span>
                    <p className="text-gray-500 dark:text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                      Found in Safari's bottom toolbar (<Share className="w-3.5 h-3.5 inline text-teal-500" />).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Select "Add to Home Screen"</span>
                    <p className="text-gray-500 dark:text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                      Scroll down in the action sheet and tap (<PlusSquare className="w-3.5 h-3.5 inline text-teal-500" />).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    3
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Tap "Add" in the top right</span>
                    <p className="text-gray-500 dark:text-zinc-400 text-[11px] mt-0.5">
                      The Voyager app icon will appear immediately on your home screen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/80 border border-gray-200/80 dark:border-zinc-700/80 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Desktop & Android Browser Installation
              </p>
              <div className="space-y-2 text-xs text-gray-600 dark:text-zinc-300">
                <div className="flex items-center space-x-2">
                  <Laptop className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>
                    <strong>Chrome / Edge / Brave:</strong> Click the <strong>Install</strong> icon in the right side of the address bar.
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>
                    <strong>Android Chrome:</strong> Tap the three-dot menu (⋮) and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
