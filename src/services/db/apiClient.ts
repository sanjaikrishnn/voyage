import { TripPlan, UserProfile } from '../../types';

export interface DatabaseStatus {
  configured: boolean;
  connected?: boolean;
  voyageTableExists?: boolean;
  voyageColumnsReady?: boolean;
  tablesExist?: boolean;
  projectUrl?: string | null;
  database: string;
  message: string;
}

export async function checkDatabaseStatus(): Promise<DatabaseStatus> {
  try {
    const res = await fetch('/api/db/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch DB status:', e);
  }
  return {
    configured: false,
    connected: false,
    tablesExist: false,
    database: 'Local Persistence',
    message: 'Connecting to local storage fallback'
  };
}

export async function fetchTripsFromApi(): Promise<TripPlan[] | null> {
  try {
    const res = await fetch('/api/db/trips');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.trips) && data.trips.length > 0) {
        return data.trips;
      }
    }
  } catch (e) {
    console.warn('Could not fetch trips from server:', e);
  }
  return null;
}

export async function saveTripToApi(trip: TripPlan): Promise<boolean> {
  try {
    const res = await fetch('/api/db/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip)
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.success);
    }
  } catch (e) {
    console.warn('Could not sync trip to server:', e);
  }
  return false;
}

export async function deleteTripFromApi(tripId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/db/trips/${tripId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.success);
    }
  } catch (e) {
    console.warn('Could not delete trip on server:', e);
  }
  return false;
}

export async function saveUserProfileToApi(profile: UserProfile): Promise<boolean> {
  try {
    const res = await fetch('/api/db/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.success);
    }
  } catch (e) {
    console.warn('Could not sync profile to server:', e);
  }
  return false;
}
