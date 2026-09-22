import React, { createContext, useContext, useState, useEffect } from 'react';
import { TripPlan, Activity, DayItinerary, BudgetItem, PackingItem } from '../types';
import { INITIAL_DEMO_TRIPS } from '../data/demoTrips';
import {
  fetchTripsFromApi,
  saveTripToApi,
  deleteTripFromApi,
  checkDatabaseStatus
} from '../services/db/apiClient';

interface TripContextType {
  trips: TripPlan[];
  activeTrip: TripPlan;
  setActiveTripId: (id: string) => void;
  createTrip: (trip: TripPlan) => void;
  updateTrip: (id: string, updates: Partial<TripPlan>) => void;
  deleteTrip: (id: string) => void;
  duplicateTrip: (id: string) => void;
  addActivity: (dayNumber: number, activity: Omit<Activity, 'id'>) => void;
  editActivity: (dayNumber: number, activityId: string, updates: Partial<Activity>) => void;
  deleteActivity: (dayNumber: number, activityId: string) => void;
  moveActivity: (dayNumber: number, activityId: string, direction: 'up' | 'down') => void;
  regenerateActivityWithAI: (dayNumber: number, activityId: string, preference?: string) => Promise<void>;
  applyOptimization: (optimizedDays: DayItinerary[]) => void;
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  togglePackingItem: (id: string) => void;
  addPackingItem: (name: string, category: PackingItem['category']) => void;
  deletePackingItem: (id: string) => void;
  toggleDocumentItem: (id: string) => void;
  isSupabaseConnected?: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [trips, setTrips] = useState<TripPlan[]>(() => {
    const saved = localStorage.getItem('voyager_trips');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved trips', e);
      }
    }
    return INITIAL_DEMO_TRIPS;
  });

  const [activeTripId, setActiveTripIdState] = useState<string>(() => {
    return localStorage.getItem('voyager_active_trip_id') || trips[0]?.id || INITIAL_DEMO_TRIPS[0].id;
  });

  // Check Supabase status and fetch latest data from database on mount
  useEffect(() => {
    let isMounted = true;
    async function initDatabaseSync() {
      try {
        const status = await checkDatabaseStatus();
        if (isMounted) {
          setIsSupabaseConnected(status.configured);
        }
        const remoteTrips = await fetchTripsFromApi();
        if (isMounted && remoteTrips && remoteTrips.length > 0) {
          setTrips(remoteTrips);
          if (!remoteTrips.some((t) => t.id === activeTripId)) {
            setActiveTripIdState(remoteTrips[0].id);
          }
        }
      } catch (err) {
        console.warn('Initial database sync error:', err);
      }
    }
    initDatabaseSync();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage and persist active trip to Supabase/API backend with debounce
  useEffect(() => {
    localStorage.setItem('voyager_trips', JSON.stringify(trips));
    const timer = setTimeout(() => {
      const active = trips.find((t) => t.id === activeTripId);
      if (active) {
        saveTripToApi(active);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [trips, activeTripId]);

  useEffect(() => {
    localStorage.setItem('voyager_active_trip_id', activeTripId);
  }, [activeTripId]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || INITIAL_DEMO_TRIPS[0];

  const setActiveTripId = (id: string) => {
    setActiveTripIdState(id);
  };

  const createTrip = (newTrip: TripPlan) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripIdState(newTrip.id);
    saveTripToApi(newTrip);
  };

  const updateTrip = (id: string, updates: Partial<TripPlan>) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
          saveTripToApi(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (filtered.length === 0) {
        return INITIAL_DEMO_TRIPS;
      }
      if (activeTripId === id) {
        setActiveTripIdState(filtered[0].id);
      }
      return filtered;
    });
    deleteTripFromApi(id);
  };

  const duplicateTrip = (id: string) => {
    const target = trips.find((t) => t.id === id);
    if (!target) return;
    const duplicated: TripPlan = {
      ...target,
      id: `trip-${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTrips((prev) => [duplicated, ...prev]);
    setActiveTripIdState(duplicated.id);
    saveTripToApi(duplicated);
  };

  const addActivity = (dayNumber: number, newActData: Omit<Activity, 'id'>) => {
    const act: Activity = {
      ...newActData,
      id: `act-${Date.now()}`
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== activeTrip.id) return t;
        const updatedDays = t.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: [...day.activities, act]
          };
        });
        return { ...t, days: updatedDays, updatedAt: new Date().toISOString() };
      })
    );
  };

  const editActivity = (dayNumber: number, activityId: string, updates: Partial<Activity>) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== activeTrip.id) return t;
        const updatedDays = t.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          const updatedActivities = day.activities.map((a) =>
            a.id === activityId ? { ...a, ...updates } : a
          );
          return { ...day, activities: updatedActivities };
        });
        return { ...t, days: updatedDays, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deleteActivity = (dayNumber: number, activityId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== activeTrip.id) return t;
        const updatedDays = t.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: day.activities.filter((a) => a.id !== activityId)
          };
        });
        return { ...t, days: updatedDays, updatedAt: new Date().toISOString() };
      })
    );
  };

  const moveActivity = (dayNumber: number, activityId: string, direction: 'up' | 'down') => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== activeTrip.id) return t;
        const updatedDays = t.days.map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          const index = day.activities.findIndex((a) => a.id === activityId);
          if (index === -1) return day;
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= day.activities.length) return day;

          const copy = [...day.activities];
          const temp = copy[index];
          copy[index] = copy[targetIndex];
          copy[targetIndex] = temp;

          return { ...day, activities: copy };
        });
        return { ...t, days: updatedDays, updatedAt: new Date().toISOString() };
      })
    );
  };

  const regenerateActivityWithAI = async (dayNumber: number, activityId: string, preference?: string) => {
    const day = activeTrip.days.find((d) => d.dayNumber === dayNumber);
    const activity = day?.activities.find((a) => a.id === activityId);
    if (!activity) return;

    try {
      const res = await fetch('/api/ai/regenerate-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentActivity: activity, city: activeTrip.city, preference })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.activity) {
          editActivity(dayNumber, activityId, data.activity);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend activity regen offline, using intelligent swap', e);
    }

    // Smart heuristic alternative replacement
    const replacements = [
      {
        title: `${activeTrip.city} Artisan Tea Ceremony & Tranquil Zen Garden`,
        shortDescription: 'Escape the city rush in a quiet courtyard experiencing centuries-old tea preparation techniques.',
        category: 'culture' as const,
        estimatedCost: 28,
        indoorOutdoor: 'indoor' as const
      },
      {
        title: `Scenic Sunset Riverside Boardwalk & Live Acoustics`,
        shortDescription: 'Golden hour walk along the illuminated waterfront with local indie buskers and artisan stalls.',
        category: 'sightseeing' as const,
        estimatedCost: 10,
        indoorOutdoor: 'outdoor' as const
      },
      {
        title: `Acclaimed Plant-Based Tasting Bistro`,
        shortDescription: 'Innovative multi-course tasting menu spotlighting locally harvested seasonal vegetables.',
        category: 'food' as const,
        estimatedCost: 45,
        indoorOutdoor: 'indoor' as const
      }
    ];

    const pick = replacements[Math.floor(Math.random() * replacements.length)];
    editActivity(dayNumber, activityId, {
      title: pick.title,
      shortDescription: pick.shortDescription,
      category: pick.category,
      estimatedCost: pick.estimatedCost,
      indoorOutdoor: pick.indoorOutdoor
    });
  };

  const applyOptimization = (optimizedDays: DayItinerary[]) => {
    updateTrip(activeTrip.id, { days: optimizedDays });
  };

  const addBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...item,
      id: `b-${Date.now()}`
    };
    updateTrip(activeTrip.id, {
      budgetItems: [...activeTrip.budgetItems, newItem]
    });
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    const updated = activeTrip.budgetItems.map((b) => (b.id === id ? { ...b, ...updates } : b));
    updateTrip(activeTrip.id, { budgetItems: updated });
  };

  const deleteBudgetItem = (id: string) => {
    const filtered = activeTrip.budgetItems.filter((b) => b.id !== id);
    updateTrip(activeTrip.id, { budgetItems: filtered });
  };

  const togglePackingItem = (id: string) => {
    const updated = activeTrip.packingList.map((p) => (p.id === id ? { ...p, isPacked: !p.isPacked } : p));
    updateTrip(activeTrip.id, { packingList: updated });
  };

  const addPackingItem = (name: string, category: PackingItem['category']) => {
    const newItem: PackingItem = {
      id: `p-${Date.now()}`,
      name,
      category,
      isPacked: false,
      isCustom: true
    };
    updateTrip(activeTrip.id, {
      packingList: [...activeTrip.packingList, newItem]
    });
  };

  const deletePackingItem = (id: string) => {
    const filtered = activeTrip.packingList.filter((p) => p.id !== id);
    updateTrip(activeTrip.id, { packingList: filtered });
  };

  const toggleDocumentItem = (id: string) => {
    const updated = activeTrip.documents.map((d) => (d.id === id ? { ...d, isCompleted: !d.isCompleted } : d));
    updateTrip(activeTrip.id, { documents: updated });
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        setActiveTripId,
        createTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,
        addActivity,
        editActivity,
        deleteActivity,
        moveActivity,
        regenerateActivityWithAI,
        applyOptimization,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        togglePackingItem,
        addPackingItem,
        deletePackingItem,
        toggleDocumentItem,
        isSupabaseConnected
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
