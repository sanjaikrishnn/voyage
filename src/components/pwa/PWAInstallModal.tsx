import React, { useState } from 'react';
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
  ExternalLink,
  Apple,
  Chrome
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isAndroid, isInstalled, isInIframe, install, openInNewTab } = usePWAInstall();

  // Active tab for manual instructions
  const defaultTab = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(defaultTab);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-7 relative overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close install modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/25 shrink-0">
            <img
              src="/icon.svg"
              alt="Voyager Logo"
              className="w-7 h-7 rounded-lg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white flex items-center gap-1.5">
              Download & Install Voyager
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                PWA
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Install as a standalone app with offline travel access
            </p>
          </div>
        </div>

        {/* Iframe Notice if embedded */}
        {isInIframe && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
              Preview Frame Detected
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Web browsers block direct installation inside preview iframes. Open Voyager directly in its own tab to install with 1-click.
            </p>
            <button
              onClick={openInNewTab}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Full Tab to Install</span>
            </button>
          </div>
        )}

        {/* Benefits Grid */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-xs font-bold text-gray-900 dark:text-white">Instant Launch</p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400">Zero lag</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <WifiOff className="w-4 h-4 text-teal-500 mx-auto mb-1" />
            <p className="text-xs font-bold text-gray-900 dark:text-white">Offline Maps</p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400">Cached trips</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-800">
            <Smartphone className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-xs font-bold text-gray-900 dark:text-white">Standalone</p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400">Full screen</p>
          </div>
        </div>

        {/* One-Click Native Prompt if ready */}
        {isInstallable && !isInIframe && (
          <div className="mb-5 p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/70 space-y-2.5">
            <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-200">
              <Download className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <p className="text-xs font-bold">Direct 1-Click Install Available</p>
            </div>
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/30 flex items-center justify-center space-x-2 active:scale-98 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install Voyager Now</span>
            </button>
            <p className="text-center text-[10px] text-teal-700/80 dark:text-teal-400">
              Opens your browser's native install prompt directly
            </p>
          </div>
        )}

        {isInstalled && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center space-x-3 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs font-bold">Voyager is already installed</p>
              <p className="text-[11px] opacity-90">
                You can launch it anytime from your home screen or app launcher.
              </p>
            </div>
          </div>
        )}

        {/* Platform Selection Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">
              How to install on your device:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-xl">
            <button
              onClick={() => setActiveTab('android')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'android'
                  ? 'bg-white dark:bg-zinc-700 text-teal-600 dark:text-teal-300 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android</span>
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'ios'
                  ? 'bg-white dark:bg-zinc-700 text-teal-600 dark:text-teal-300 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone/iPad</span>
            </button>
            <button
              onClick={() => setActiveTab('desktop')}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'desktop'
                  ? 'bg-white dark:bg-zinc-700 text-teal-600 dark:text-teal-300 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop/PC</span>
            </button>
          </div>

          {/* Android Steps */}
          {activeTab === 'android' && (
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/80 dark:border-zinc-700/80 space-y-2.5 text-xs text-gray-700 dark:text-zinc-300">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Open in Chrome or Samsung Internet</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                    Navigate to Voyager in your mobile browser.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Tap the 3 dots menu (⋮)</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                    Located in the top right corner of Chrome.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Tap "Install app" or "Add to Home screen"</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                    Confirm <strong>Install</strong>. The icon will appear in your apps list and home screen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* iOS Steps */}
          {activeTab === 'ios' && (
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/80 dark:border-zinc-700/80 space-y-2.5 text-xs text-gray-700 dark:text-zinc-300">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Tap the Share icon</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                    Found in Safari's bottom toolbar (<Share className="w-3.5 h-3.5 inline text-teal-500" />).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Tap "Add to Home Screen"</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                    Scroll down and select (<PlusSquare className="w-3.5 h-3.5 inline text-teal-500" />).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Tap "Add" in top right</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                    Voyager is added as a full-screen app on your iPhone/iPad!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Steps */}
          {activeTab === 'desktop' && (
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/80 dark:border-zinc-700/80 space-y-2.5 text-xs text-gray-700 dark:text-zinc-300">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Look at the browser address bar</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                    On Chrome or Edge, click the <strong>Install</strong> icon (⤓ or ⊕) on the right side of the URL bar.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Or use the browser menu</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                    Click Chrome's 3 dots (⋮) → <strong>Save and share</strong> → <strong>Install Voyager</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={openInNewTab}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in direct tab</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

