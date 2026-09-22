import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';

import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { FloatingAssistant } from './components/assistant/FloatingAssistant';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { InteractiveTripMap } from './components/map/InteractiveTripMap';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

import { HomePage } from './pages/HomePage';
import { PlannerPage } from './pages/PlannerPage';
import { ExplorePage } from './pages/ExplorePage';
import { ItineraryPage } from './pages/ItineraryPage';
import { BudgetPage } from './pages/BudgetPage';
import { WeatherPage } from './pages/WeatherPage';
import { PackingPage } from './pages/PackingPage';
import { AccommodationsPage } from './pages/AccommodationsPage';
import { FoodPage } from './pages/FoodPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';

const AppContent: React.FC = () => {
  const { activeTrip } = useTrip();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [plannerDestination, setPlannerDestination] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDestinationForPlan = (dest: string) => {
    setPlannerDestination(dest);
    setCurrentPage('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onSelectDestinationForPlan={handleSelectDestinationForPlan}
          />
        );
      case 'planner':
        return (
          <PlannerPage
            initialDestination={plannerDestination}
            onNavigate={handleNavigate}
          />
        );
      case 'explore':
        return (
          <ExplorePage
            onNavigate={handleNavigate}
            onSelectDestinationForPlan={handleSelectDestinationForPlan}
          />
        );
      case 'itinerary':
        return <ItineraryPage onNavigate={handleNavigate} />;
      case 'map':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
                  Interactive Route Map
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                  Waypoint trail, distance vectors, and points of interest for {activeTrip.city || activeTrip.destination}
                </p>
              </div>
            </div>
            <InteractiveTripMap trip={activeTrip} />
          </div>
        );
      case 'budget':
        return <BudgetPage />;
      case 'weather':
        return <WeatherPage onNavigate={handleNavigate} />;
      case 'packing':
        return <PackingPage />;
      case 'accommodations':
        return <AccommodationsPage />;
      case 'food':
        return <FoodPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'mytrips':
        return <MyTripsPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onSelectDestinationForPlan={handleSelectDestinationForPlan}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 selection:bg-teal-500 selection:text-white pb-20 md:pb-0 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Page Canvas */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Bar Navigation */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onToggleAssistant={() => setIsAssistantOpen((prev) => !prev)}
        isAssistantOpen={isAssistantOpen}
      />

      {/* Floating AI Travel Concierge */}
      <FloatingAssistant
        isOpen={isAssistantOpen}
        onToggle={() => setIsAssistantOpen((prev) => !prev)}
        onNavigate={handleNavigate}
      />

      {/* Global Search Omnibar (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* PWA Offline Connectivity Banner */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripProvider>
          <AppContent />
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
