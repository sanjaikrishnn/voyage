import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TripPlan, UserProfile, DestinationCard, DayItinerary, Activity, BudgetItem, PackingItem, TravelDocument } from '../../types';
import { INITIAL_DEMO_TRIPS } from '../../data/demoTrips';
import { POPULAR_DESTINATIONS } from '../../data/destinations';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseBackendClient(): SupabaseClient | null {
  let url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('MY_SUPABASE') || url === '') {
    return null;
  }

  // Normalize url: strip /rest/v1 or trailing slashes that users commonly append
  url = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false }
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseClient;
}

export function isSupabaseBackendConfigured(): boolean {
  return getSupabaseBackendClient() !== null;
}

export async function checkSupabaseHealth(): Promise<{
  configured: boolean;
  connected: boolean;
  voyageTableExists: boolean;
  voyageColumnsReady: boolean;
  tablesExist: boolean;
  projectUrl: string | null;
  message: string;
}> {
  const client = getSupabaseBackendClient();
  if (!client) {
    return {
      configured: false,
      connected: false,
      voyageTableExists: false,
      voyageColumnsReady: false,
      tablesExist: false,
      projectUrl: null,
      message: 'Supabase credentials not configured in environment.'
    };
  }

  const rawUrl = process.env.SUPABASE_URL || '';
  const cleanUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

  try {
    // 1. Check if the user's 'voyage' table exists
    const { error: voyageErr } = await client.from('voyage').select('id').limit(1);
    const voyageTableExists = !voyageErr;

    // 2. Check if 'voyage' has the trip columns (e.g. title)
    let voyageColumnsReady = false;
    if (voyageTableExists) {
      const { error: colErr } = await client.from('voyage').select('title').limit(1);
      voyageColumnsReady = !colErr;
    }

    // 3. Also check if relational 'trips' table exists
    const { error: tripsErr } = await client.from('trips').select('id').limit(1);
    const tripsTableExists = !tripsErr;

    const anyReady = voyageColumnsReady || tripsTableExists;

    if (voyageTableExists && voyageColumnsReady) {
      return {
        configured: true,
        connected: true,
        voyageTableExists: true,
        voyageColumnsReady: true,
        tablesExist: true,
        projectUrl: cleanUrl,
        message: 'Connected to Supabase! The "voyage" table is active and receiving all travel plans.'
      };
    }

    if (voyageTableExists && !voyageColumnsReady) {
      return {
        configured: true,
        connected: true,
        voyageTableExists: true,
        voyageColumnsReady: false,
        tablesExist: false,
        projectUrl: cleanUrl,
        message: 'Connected to your "voyage" table in Supabase! Run the SQL schema to add all trip columns, then entries will save directly to voyage.'
      };
    }

    return {
      configured: true,
      connected: true,
      voyageTableExists: false,
      voyageColumnsReady: false,
      tablesExist: anyReady,
      projectUrl: cleanUrl,
      message: anyReady
        ? 'Connected to Supabase PostgreSQL!'
        : 'Connected to Supabase! Run the schema.sql in Supabase SQL Editor to configure the voyage table.'
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      voyageTableExists: false,
      voyageColumnsReady: false,
      tablesExist: false,
      projectUrl: cleanUrl,
      message: `Failed to connect to Supabase: ${err.message}`
    };
  }
}

// Transform database records into domain TripPlan
export async function getTripsFromSupabase(): Promise<TripPlan[]> {
  const client = getSupabaseBackendClient();
  if (!client) {
    return INITIAL_DEMO_TRIPS;
  }

  // 1. First priority: Read directly from the user's primary 'voyage' table
  try {
    const { data: voyageRows, error: voyageErr } = await client
      .from('voyage')
      .select('*')
      .order('created_at', { ascending: false });

    if (!voyageErr && voyageRows && voyageRows.length > 0) {
      const parsedVoyages: TripPlan[] = [];
      for (const row of voyageRows) {
        if (row.raw_data && row.raw_data.title) {
          parsedVoyages.push({
            ...row.raw_data,
            id: row.trip_id || row.raw_data.id || String(row.id),
            title: row.title || row.raw_data.title,
            destination: row.destination || row.raw_data.destination,
            city: row.city || row.raw_data.city,
            country: row.country || row.raw_data.country,
            startDate: row.start_date || row.raw_data.startDate,
            endDate: row.end_date || row.raw_data.endDate,
            days: row.days || row.raw_data.days || [],
            accommodations: row.accommodations || row.raw_data.accommodations || [],
            restaurants: row.restaurants || row.raw_data.restaurants || [],
            budgetItems: row.budget_items || row.raw_data.budgetItems || [],
            packingList: row.packing_items || row.raw_data.packingList || [],
            documents: row.travel_documents || row.raw_data.documents || []
          });
        } else if (row.title) {
          parsedVoyages.push({
            id: row.trip_id || String(row.id),
            title: row.title,
            destination: row.destination || 'Selected Destination',
            city: row.city || '',
            country: row.country || '',
            additionalCities: row.additional_cities || [],
            coverImage: row.cover_image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
            startDate: row.start_date || '2026-10-15',
            endDate: row.end_date || '2026-10-22',
            isFlexibleDates: Boolean(row.is_flexible_dates),
            durationDays: row.duration_days || 7,
            travelers: row.travelers || { adults: 2, children: 0, infants: 0 },
            budgetTier: row.budget_tier || 'Moderate',
            customBudgetTotal: Number(row.custom_budget_total) || 0,
            estimatedTotalCost: Number(row.estimated_total_cost) || 0,
            travelStyle: row.travel_style || 'Balanced',
            interests: [],
            preferences: row.raw_data?.preferences || {
              vegetarian: false,
              dietaryRestrictions: '',
              accessibility: false,
              preferredTransportation: 'Walking & Transit',
              hotelPreference: 'Boutique Hotel',
              walkingTolerance: 'Moderate',
              schedulePace: row.pace || 'Balanced'
            },
            overview: row.destination_guide || row.raw_data?.overview || {
              tagline: row.destination || '',
              summary: '',
              bestTimeToVisit: '',
              currency: row.currency || 'USD',
              language: 'English',
              timeZone: 'UTC',
              localEtiquette: [],
              safetyTips: [],
              packingTips: []
            },
            days: row.days || [],
            accommodations: row.accommodations || [],
            restaurants: row.restaurants || [],
            budgetItems: row.budget_items || [],
            packingList: row.packing_items || [],
            documents: row.travel_documents || [],
            status: row.status || 'Draft',
            createdAt: row.created_at,
            updatedAt: row.updated_at
          });
        }
      }
      if (parsedVoyages.length > 0) {
        return parsedVoyages;
      }
    }
  } catch (e: any) {
    console.warn('Note on fetching from voyage table:', e.message);
  }

  // 2. Secondary: Fall back to reading from 'trips' table
  const { data: tripsData, error: tripsError } = await client
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false });

  if (tripsError || !tripsData || tripsData.length === 0) {
    if (tripsError) {
      console.warn('Error querying trips from Supabase:', tripsError.message);
    }
    return INITIAL_DEMO_TRIPS;
  }

  const fullTrips: TripPlan[] = [];

  for (const t of tripsData) {
    const tripId = t.id;

    // Fetch related records in parallel
    const [daysRes, activitiesRes, accRes, restRes, budgetRes, packingRes, docsRes] = await Promise.all([
      client.from('trip_days').select('*').eq('trip_id', tripId).order('day_number', { ascending: true }),
      client.from('activities').select('*').eq('trip_id', tripId).order('day_number', { ascending: true }).order('sort_order', { ascending: true }),
      client.from('accommodations').select('*').eq('trip_id', tripId),
      client.from('restaurants').select('*').eq('trip_id', tripId),
      client.from('budget_items').select('*').eq('trip_id', tripId),
      client.from('packing_items').select('*').eq('trip_id', tripId),
      client.from('travel_documents').select('*').eq('trip_id', tripId)
    ]);

    const days: DayItinerary[] = (daysRes.data || []).map((d) => {
      const dayActivities: Activity[] = (activitiesRes.data || [])
        .filter((a) => a.day_number === d.day_number)
        .map((a) => ({
          id: a.id,
          time: a.time || '09:00',
          title: a.title,
          location: a.location || '',
          duration: a.duration || '1h 30m',
          estimatedCost: Number(a.estimated_cost) || 0,
          costCurrency: a.cost_currency || 'USD',
          distanceFromPrevious: a.distance_from_previous || '0 km',
          transportMethod: a.transport_method || 'Walk',
          shortDescription: a.short_description || '',
          category: a.category || 'sightseeing',
          coordinates: a.coordinates || undefined,
          rating: a.rating ? Number(a.rating) : undefined,
          bookingRecommended: Boolean(a.booking_recommended),
          indoorOutdoor: a.indoor_outdoor || 'mixed',
          notes: a.notes || undefined
        }));

      return {
        dayNumber: d.day_number,
        date: d.date || '',
        title: d.title,
        theme: d.theme || '',
        highlights: d.highlights || [],
        summary: d.summary || '',
        estimatedDailyCost: Number(d.estimated_daily_cost) || 0,
        weatherForecast: d.weather_forecast || undefined,
        activities: dayActivities
      };
    });

    fullTrips.push({
      id: t.id,
      title: t.title,
      destination: t.destination,
      city: t.city,
      country: t.country,
      additionalCities: t.additional_cities || [],
      coverImage: t.cover_image,
      startDate: t.start_date,
      endDate: t.end_date,
      isFlexibleDates: Boolean(t.is_flexible_dates),
      durationDays: t.duration_days || 1,
      travelers: t.travelers || { adults: 2, children: 0, infants: 0 },
      budgetTier: t.budget_tier || 'Moderate',
      customBudgetTotal: t.custom_budget_total ? Number(t.custom_budget_total) : undefined,
      estimatedTotalCost: t.estimated_total_cost ? Number(t.estimated_total_cost) : undefined,
      travelStyle: t.travel_style || 'Balanced',
      interests: t.interests || [],
      preferences: t.preferences || {
        vegetarian: false,
        dietaryRestrictions: '',
        accessibility: false,
        preferredTransportation: 'Metro',
        hotelPreference: 'Hotel',
        walkingTolerance: 'Moderate',
        schedulePace: 'Balanced'
      },
      overview: t.overview || {
        tagline: '',
        summary: '',
        bestTimeToVisit: '',
        currency: 'USD',
        language: 'English',
        timeZone: 'UTC',
        localEtiquette: [],
        safetyTips: [],
        packingTips: []
      },
      days: days.length > 0 ? days : [],
      accommodations: (accRes.data || []).map((acc) => ({
        id: acc.id,
        name: acc.name,
        type: acc.type || 'Hotel',
        location: acc.location || '',
        neighborhood: acc.neighborhood || '',
        pricePerNight: Number(acc.price_per_night) || 0,
        currency: acc.currency || 'USD',
        rating: Number(acc.rating) || 4.5,
        reviewsCount: acc.reviews_count || 0,
        imageUrl: acc.image_url || '',
        amenities: acc.amenities || [],
        distanceToCenter: acc.distance_to_center || acc.distance_from_center || '',
        description: acc.description || '',
        coordinates: acc.coordinates || undefined,
        badge: acc.badge || undefined
      })),
      restaurants: (restRes.data || []).map((r) => ({
        id: r.id,
        name: r.name,
        cuisine: r.cuisine || 'Local',
        priceRange: r.price_range || '$$',
        rating: Number(r.rating) || 4.5,
        location: r.location || '',
        description: r.description || '',
        specialtyDishes: r.specialty_dishes || [],
        mustTryDishes: r.must_try_dishes || [],
        dietaryTags: r.dietary_tags || [],
        isVegetarianFriendly: Boolean(r.is_vegetarian_friendly),
        imageUrl: r.image_url || '',
        vibe: r.vibe || 'Casual'
      })),
      budgetItems: (budgetRes.data || []).map((b) => ({
        id: b.id,
        category: b.category,
        title: b.title,
        plannedAmount: Number(b.planned_amount) || Number(b.estimated_cost) || 0,
        actualAmount: Number(b.actual_amount) || Number(b.actual_cost) || 0,
        estimatedCost: Number(b.estimated_cost) || Number(b.planned_amount) || 0,
        actualCost: Number(b.actual_cost) || Number(b.actual_amount) || 0,
        isPaid: Boolean(b.is_paid),
        notes: b.notes || undefined,
        date: b.date || undefined
      })),
      packingList: (packingRes.data || []).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category as any,
        isPacked: Boolean(p.is_packed),
        isCustom: Boolean(p.is_custom),
        quantity: p.quantity || 1
      })),
      documents: (docsRes.data || []).map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category || 'General',
        isCompleted: Boolean(doc.is_completed),
        notes: doc.notes || undefined,
        expiryDate: doc.expiry_date || undefined
      })),
      status: t.status || 'Draft',
      createdAt: t.created_at,
      updatedAt: t.updated_at
    });
  }

  return fullTrips;
}

// Upsert complete trip and all child collections
export async function saveTripToSupabase(trip: TripPlan): Promise<boolean> {
  const client = getSupabaseBackendClient();
  if (!client) {
    return false;
  }

  let voyageSaved = false;

  try {
    // 0. Primary: Upsert directly into the user's 'voyage' table
    try {
      const voyageRow = {
        trip_id: trip.id,
        title: trip.title,
        destination: trip.destination,
        city: trip.city,
        country: trip.country,
        additional_cities: trip.additionalCities || [],
        start_date: trip.startDate,
        end_date: trip.endDate,
        is_flexible_dates: Boolean(trip.isFlexibleDates),
        duration_days: trip.durationDays || 1,
        travelers: trip.travelers || { adults: 1, children: 0, type: 'Solo' },
        budget_tier: trip.budgetTier || 'moderate',
        custom_budget_total: trip.customBudgetTotal || 0,
        estimated_total_cost: trip.estimatedTotalCost || 0,
        currency: trip.overview?.currency || 'USD',
        travel_style: trip.travelStyle || 'balanced',
        pace: trip.preferences?.schedulePace || 'balanced',
        cover_image: trip.coverImage,
        status: trip.status || 'planning',
        days: trip.days || [],
        accommodations: trip.accommodations || [],
        restaurants: trip.restaurants || trip.foodRecommendations || [],
        budget_items: trip.budgetItems || [],
        packing_items: trip.packingList || [],
        travel_documents: trip.documents || [],
        destination_guide: trip.overview || null,
        raw_data: trip,
        updated_at: new Date().toISOString()
      };

      const { error: vErr } = await client
        .from('voyage')
        .upsert(voyageRow, { onConflict: 'trip_id' });

      if (!vErr) {
        voyageSaved = true;
      } else {
        console.warn('Voyage upsert note:', vErr.message);
      }
    } catch (e: any) {
      console.warn('Voyage table save note:', e.message);
    }

    // If voyage table saved successfully, we attempt relational tables as optional secondary
    if (voyageSaved) {
      try {
        await client.from('trips').upsert({
          id: trip.id,
          title: trip.title,
          destination: trip.destination,
          city: trip.city,
          country: trip.country,
          additional_cities: trip.additionalCities || [],
          cover_image: trip.coverImage,
          start_date: trip.startDate,
          end_date: trip.endDate,
          is_flexible_dates: Boolean(trip.isFlexibleDates),
          duration_days: trip.durationDays || 1,
          travelers: trip.travelers,
          budget_tier: trip.budgetTier,
          custom_budget_total: trip.customBudgetTotal || null,
          estimated_total_cost: trip.estimatedTotalCost || null,
          travel_style: trip.travelStyle,
          interests: trip.interests || [],
          preferences: trip.preferences,
          overview: trip.overview,
          status: trip.status || 'Draft',
          updated_at: new Date().toISOString()
        });
      } catch (relErr) {
        // trips table might not exist if user only created voyage table
      }
      return true;
    }

    // 1. Fallback: Upsert Trip master record if voyage wasn't used
    const { error: tripError } = await client.from('trips').upsert({
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      city: trip.city,
      country: trip.country,
      additional_cities: trip.additionalCities || [],
      cover_image: trip.coverImage,
      start_date: trip.startDate,
      end_date: trip.endDate,
      is_flexible_dates: Boolean(trip.isFlexibleDates),
      duration_days: trip.durationDays || 1,
      travelers: trip.travelers,
      budget_tier: trip.budgetTier,
      custom_budget_total: trip.customBudgetTotal || null,
      estimated_total_cost: trip.estimatedTotalCost || null,
      travel_style: trip.travelStyle,
      interests: trip.interests || [],
      preferences: trip.preferences,
      overview: trip.overview,
      status: trip.status || 'Draft',
      updated_at: new Date().toISOString()
    });

    if (tripError && !voyageSaved) {
      console.error('Failed to upsert trip:', tripError);
      return false;
    }

    // 2. Delete and replace child records for this trip
    await Promise.all([
      client.from('trip_days').delete().eq('trip_id', trip.id),
      client.from('activities').delete().eq('trip_id', trip.id),
      client.from('accommodations').delete().eq('trip_id', trip.id),
      client.from('restaurants').delete().eq('trip_id', trip.id),
      client.from('budget_items').delete().eq('trip_id', trip.id),
      client.from('packing_items').delete().eq('trip_id', trip.id),
      client.from('travel_documents').delete().eq('trip_id', trip.id)
    ]);

    // 3. Insert days
    if (trip.days && trip.days.length > 0) {
      const daysToInsert = trip.days.map((d) => ({
        id: `day-${trip.id}-${d.dayNumber}`,
        trip_id: trip.id,
        day_number: d.dayNumber,
        date: d.date || null,
        title: d.title,
        theme: d.theme || null,
        highlights: d.highlights || [],
        summary: d.summary || null,
        estimated_daily_cost: d.estimatedDailyCost || 0,
        weather_forecast: d.weatherForecast || null
      }));
      await client.from('trip_days').insert(daysToInsert);

      // Insert activities
      const activitiesToInsert: any[] = [];
      trip.days.forEach((day) => {
        (day.activities || []).forEach((act, idx) => {
          activitiesToInsert.push({
            id: act.id || `act-${trip.id}-${day.dayNumber}-${idx}`,
            trip_id: trip.id,
            day_id: `day-${trip.id}-${day.dayNumber}`,
            day_number: day.dayNumber,
            sort_order: idx,
            time: act.time || '09:00',
            title: act.title,
            location: act.location || '',
            duration: act.duration || '1h',
            estimated_cost: act.estimatedCost || 0,
            cost_currency: act.costCurrency || 'USD',
            distance_from_previous: act.distanceFromPrevious || '0 km',
            transport_method: act.transportMethod || 'Walk',
            short_description: act.shortDescription || '',
            category: act.category || 'sightseeing',
            coordinates: act.coordinates || null,
            rating: act.rating || null,
            booking_recommended: Boolean(act.bookingRecommended),
            indoor_outdoor: act.indoorOutdoor || 'mixed',
            notes: act.notes || null
          });
        });
      });

      if (activitiesToInsert.length > 0) {
        await client.from('activities').insert(activitiesToInsert);
      }
    }

    // 4. Insert Accommodations
    if (trip.accommodations && trip.accommodations.length > 0) {
      const accToInsert = trip.accommodations.map((a, idx) => ({
        id: a.id || `acc-${trip.id}-${idx}`,
        trip_id: trip.id,
        name: a.name,
        type: a.type || 'Hotel',
        location: a.location || '',
        neighborhood: a.neighborhood || '',
        price_per_night: a.pricePerNight || 0,
        currency: a.currency || 'USD',
        rating: a.rating || 4.5,
        reviews_count: a.reviewsCount || 0,
        image_url: a.imageUrl || '',
        amenities: a.amenities || [],
        distance_to_center: a.distanceToCenter || a.distanceFromCenter || '',
        description: a.description || '',
        coordinates: a.coordinates || null,
        badge: a.badge || null
      }));
      await client.from('accommodations').insert(accToInsert);
    }

    // 5. Insert Restaurants
    const restaurants = trip.restaurants || trip.foodRecommendations || [];
    if (restaurants.length > 0) {
      const restToInsert = restaurants.map((r, idx) => ({
        id: r.id || `rest-${trip.id}-${idx}`,
        trip_id: trip.id,
        name: r.name,
        cuisine: r.cuisine || 'Local',
        price_range: r.priceRange || '$$',
        rating: r.rating || 4.5,
        location: r.location || '',
        description: r.description || '',
        specialty_dishes: r.specialtyDishes || [],
        must_try_dishes: r.mustTryDishes || [],
        dietary_tags: r.dietaryTags || [],
        is_vegetarian_friendly: Boolean(r.isVegetarianFriendly),
        image_url: r.imageUrl || '',
        vibe: r.vibe || 'Casual'
      }));
      await client.from('restaurants').insert(restToInsert);
    }

    // 6. Insert Budget Items
    if (trip.budgetItems && trip.budgetItems.length > 0) {
      const budgetToInsert = trip.budgetItems.map((b, idx) => ({
        id: b.id || `budget-${trip.id}-${idx}`,
        trip_id: trip.id,
        category: b.category,
        title: b.title,
        planned_amount: b.plannedAmount ?? b.estimatedCost ?? 0,
        actual_amount: b.actualAmount ?? b.actualCost ?? 0,
        estimated_cost: b.estimatedCost ?? b.plannedAmount ?? 0,
        actual_cost: b.actualCost ?? b.actualAmount ?? 0,
        is_paid: Boolean(b.isPaid),
        notes: b.notes || null,
        date: b.date || null
      }));
      await client.from('budget_items').insert(budgetToInsert);
    }

    // 7. Insert Packing Items
    if (trip.packingList && trip.packingList.length > 0) {
      const packToInsert = trip.packingList.map((p, idx) => ({
        id: p.id || `pack-${trip.id}-${idx}`,
        trip_id: trip.id,
        name: p.name,
        category: p.category,
        is_packed: Boolean(p.isPacked),
        is_custom: Boolean(p.isCustom),
        quantity: p.quantity || 1
      }));
      await client.from('packing_items').insert(packToInsert);
    }

    // 8. Insert Documents
    if (trip.documents && trip.documents.length > 0) {
      const docToInsert = trip.documents.map((d, idx) => ({
        id: d.id || `doc-${trip.id}-${idx}`,
        trip_id: trip.id,
        title: d.title,
        category: d.category || 'General',
        is_completed: Boolean(d.isCompleted),
        notes: d.notes || null,
        expiry_date: d.expiryDate || null
      }));
      await client.from('travel_documents').insert(docToInsert);
    }

    return true;
  } catch (err) {
    console.error('Error saving trip to Supabase:', err);
    return false;
  }
}

// Delete Trip
export async function deleteTripFromSupabase(tripId: string): Promise<boolean> {
  const client = getSupabaseBackendClient();
  if (!client) return false;

  try {
    await client.from('voyage').delete().eq('trip_id', tripId);
    await client.from('trips').delete().eq('id', tripId);
    return true;
  } catch (err: any) {
    console.warn('Error deleting trip from Supabase:', err.message);
    return false;
  }
}

// User Profile Operations
export async function getUserProfileFromSupabase(userId: string): Promise<UserProfile | null> {
  const client = getSupabaseBackendClient();
  if (!client) return null;

  const { data, error } = await client.from('user_profiles').select('*').eq('id', userId).single();
  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    avatar: data.avatar || '',
    homeCity: data.home_city || '',
    preferredCurrency: data.preferred_currency || 'USD',
    savedDestinations: data.saved_destinations || [],
    passportExpiry: data.passport_expiry || undefined,
    emergencyContact: data.emergency_contact || undefined,
    preferences: data.preferences || undefined
  };
}

export async function saveUserProfileToSupabase(profile: UserProfile): Promise<boolean> {
  const client = getSupabaseBackendClient();
  if (!client) return false;

  const { error } = await client.from('user_profiles').upsert({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    home_city: profile.homeCity,
    preferred_currency: profile.preferredCurrency,
    saved_destinations: profile.savedDestinations || [],
    passport_expiry: profile.passportExpiry || null,
    emergency_contact: profile.emergencyContact || null,
    preferences: profile.preferences || {},
    updated_at: new Date().toISOString()
  });

  return !error;
}

// Seed initial data to Supabase if database is connected and empty
export async function seedInitialDataToSupabase(): Promise<{ tripsCount: number; destinationsCount: number }> {
  const client = getSupabaseBackendClient();
  if (!client) return { tripsCount: 0, destinationsCount: 0 };

  try {
    // 1. Seed destinations
    const { data: existingDest } = await client.from('destinations').select('id').limit(1);
    if (!existingDest || existingDest.length === 0) {
      const dests = POPULAR_DESTINATIONS.map((d) => ({
        id: d.id,
        name: d.name,
        country: d.country,
        tagline: d.tagline,
        category: d.category,
        image_url: d.imageUrl,
        rating: d.rating,
        reviews_count: d.reviewsCount,
        best_time_to_visit: d.bestTimeToVisit,
        avg_daily_budget: d.avgDailyBudget,
        currency: d.currency,
        popular_activities: d.popularActivities,
        trending: Boolean(d.trending),
        featured: Boolean(d.featured),
        hidden_gem: Boolean(d.hiddenGem),
        description: d.description
      }));
      await client.from('destinations').insert(dests);
    }

    // 2. Seed demo trips into voyage table
    for (const trip of INITIAL_DEMO_TRIPS) {
      await saveTripToSupabase(trip);
    }

    return {
      tripsCount: INITIAL_DEMO_TRIPS.length,
      destinationsCount: POPULAR_DESTINATIONS.length
    };
  } catch (e) {
    console.error('Error seeding data to Supabase:', e);
    return { tripsCount: 0, destinationsCount: 0 };
  }
}
