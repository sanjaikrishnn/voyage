import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'badge' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, isStandalone, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If running in standalone mode (already launched as installed app), hide
  if (isStandalone || isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  if (variant === 'nav') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold shadow-sm transition-all active:scale-95 ${className}`}
          title="Install Voyager as a Progressive Web App"
          aria-label="Install Voyager App"
        >
          <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Install App</span>
        </button>

        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  if (variant === 'badge') {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 text-[11px] font-bold hover:bg-teal-100 transition-colors ${className}`}
          aria-label="Install App"
        >
          <Download className="w-3 h-3" />
          <span>Install PWA</span>
        </button>

        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center space-x-2 active:scale-95 transition-all ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Install Voyager App</span>
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
