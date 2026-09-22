import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  isSupabaseBackendConfigured,
  checkSupabaseHealth,
  getTripsFromSupabase,
  saveTripToSupabase,
  deleteTripFromSupabase,
  getUserProfileFromSupabase,
  saveUserProfileToSupabase,
  seedInitialDataToSupabase
} from './src/services/db/supabaseBackend';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy-initialized Gemini AI instance
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint with Supabase status
app.get('/api/health', (req, res) => {
  const hasSupabase = isSupabaseBackendConfigured();
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    supabase: {
      configured: hasSupabase,
      url: process.env.SUPABASE_URL ? 'Configured' : 'Missing'
    },
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get('/api/db/status', async (req, res) => {
  const health = await checkSupabaseHealth();
  res.json({
    configured: health.configured,
    connected: health.connected,
    voyageTableExists: health.voyageTableExists,
    voyageColumnsReady: health.voyageColumnsReady,
    tablesExist: health.tablesExist,
    projectUrl: health.projectUrl,
    database: health.connected ? 'Supabase PostgreSQL (voyage)' : 'Local Persistence (Active Fallback)',
    message: health.message
  });
});

// Trips endpoints
app.get('/api/db/trips', async (req, res) => {
  try {
    const trips = await getTripsFromSupabase();
    res.json({ success: true, trips, source: isSupabaseBackendConfigured() ? 'supabase' : 'local' });
  } catch (err: any) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/db/trips', async (req, res) => {
  try {
    const trip = req.body;
    if (!trip || !trip.id) {
      return res.status(400).json({ success: false, error: 'Invalid trip payload' });
    }
    const saved = await saveTripToSupabase(trip);
    res.json({ success: true, savedToSupabase: saved, tripId: trip.id });
  } catch (err: any) {
    console.error('Error saving trip:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/db/trips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTripFromSupabase(id);
    res.json({ success: true, deletedFromSupabase: deleted, tripId: id });
  } catch (err: any) {
    console.error('Error deleting trip:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Seed data migration endpoint
app.post('/api/db/seed', async (req, res) => {
  try {
    const result = await seedInitialDataToSupabase();
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Error seeding data:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// SQL Schema script endpoint
app.get('/api/db/schema', (req, res) => {
  try {
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      res.json({ success: true, sql });
    } else {
      res.status(404).json({ success: false, error: 'Schema file not found' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// User Profile endpoints
app.get('/api/db/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await getUserProfileFromSupabase(id);
    res.json({ success: true, profile });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/db/profile', async (req, res) => {
  try {
    const profile = req.body;
    const saved = await saveUserProfileToSupabase(profile);
    res.json({ success: true, savedToSupabase: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Trip Planner endpoint
app.post('/api/ai/plan-trip', async (req, res) => {
  try {
    const params = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Graceful signal to frontend fallback
      return res.status(200).json({ status: 'fallback', message: 'No Gemini key set, using local engine' });
    }

    const prompt = `
You are Voyager, a luxury travel designer. Generate a detailed, highly realistic JSON travel itinerary for:
Destination: ${params.destination}
Duration: ${params.durationDays} days (${params.startDate} to ${params.endDate})
Travelers: ${params.travelers?.adults || 1} adults, ${params.travelers?.children || 0} children
Budget: ${params.budgetTier}
Travel Style: ${params.travelStyle}
Interests: ${params.interests?.join(', ')}
Preferences: Vegetarian=${params.preferences?.vegetarian}, Walking=${params.preferences?.walkingTolerance}, Pace=${params.preferences?.schedulePace}

Strict Requirement: Return ONLY raw JSON without markdown code fences or backticks. Follow this exact structure:
{
  "title": "string",
  "city": "string",
  "country": "string",
  "overview": {
    "tagline": "string",
    "summary": "string",
    "bestTimeToVisit": "string",
    "currency": "string",
    "language": "string",
    "timeZone": "string",
    "localEtiquette": ["string", "string", "string"],
    "safetyTips": ["string", "string"],
    "packingTips": ["string", "string", "string"]
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "${params.startDate}",
      "title": "string",
      "theme": "string",
      "highlights": ["string", "string"],
      "estimatedDailyCost": 120,
      "weatherForecast": {
        "tempC": 22,
        "tempF": 72,
        "condition": "Sunny",
        "rainProbability": 10,
        "icon": "Sun",
        "windSpeed": "10 km/h",
        "sunrise": "06:00",
        "sunset": "18:00"
      },
      "activities": [
        {
          "id": "act-1",
          "time": "09:30",
          "title": "string",
          "location": "string",
          "duration": "1h 30m",
          "estimatedCost": 20,
          "distanceFromPrevious": "0 km",
          "transportMethod": "Walk",
          "shortDescription": "string",
          "category": "sightseeing",
          "coordinates": { "lat": 35.68, "lng": 139.76 },
          "rating": 4.8,
          "indoorOutdoor": "outdoor"
        }
      ]
    }
  ],
  "accommodations": [],
  "foodRecommendations": [],
  "budgetItems": [],
  "packingList": [],
  "documents": []
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const responseText = response.text || '';
    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini Trip Planning Error:', error);
    // Return fallback status so client uses heuristic generator smoothly
    return res.status(200).json({ status: 'fallback', error: error?.message });
  }
});

// AI Itinerary Optimizer endpoint
app.post('/api/ai/optimize', async (req, res) => {
  try {
    const { trip } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ status: 'fallback' });
    }

    const prompt = `
Optimize this itinerary for ${trip.destination} (${trip.durationDays} days) to reduce travel time, cluster activities geographically, and account for optimal visiting hours:
${JSON.stringify(trip.days.slice(0, 3))}

Return ONLY JSON matching:
{
  "improvedTransitMinutes": 45,
  "reducedCost": 35,
  "weatherAdjustments": ["Adjusted afternoon walking for possible rain"],
  "beforeAfterComparison": [
    { "metric": "Transit Time", "before": "35 min", "after": "18 min" },
    { "metric": "Walking Distance", "before": "12 km/day", "after": "8.5 km/day" }
  ],
  "explanation": ["Clustered attractions by district", "Reduced subway transfers"],
  "optimizedDays": []
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse((response.text || '{}').replace(/```json/g, '').replace(/```/g, '').trim());
    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Optimizer Error:', err);
    return res.status(200).json({ status: 'fallback' });
  }
});

// AI Chatbot Status endpoint
app.get('/api/ai/chat/status', (req, res) => {
  res.json({
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    supabaseConnected: isSupabaseBackendConfigured(),
    timestamp: new Date().toISOString()
  });
});

function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), ms))
  ]);
}

// AI Chatbot endpoint with Supabase & Active Trip Grounding
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, trip, history = [] } = req.body;
    const ai = getGeminiClient();

    // Fetch all stored trips from Supabase if available (with 2s timeout)
    let allStoredTrips: any[] = [];
    try {
      allStoredTrips = await withTimeout(getTripsFromSupabase(), 2000, []);
    } catch (e) {
      // Non-blocking fallback
    }

    // Prepare rich context summary of current trip
    let tripContext = 'No active trip currently selected.';
    if (trip) {
      const daysSummary = (trip.days || [])
        .map((d: any) => {
          const acts = (d.activities || [])
            .map((a: any) => `    - ${a.time || ''} ${a.title} (${a.location || 'Local'}, cost: ${a.costCurrency || trip.overview?.currency || '$'}${a.estimatedCost || 0})`)
            .join('\n');
          return `  Day ${d.dayNumber}: ${d.title} (Est Cost: ${trip.overview?.currency || '$'}${d.estimatedDailyCost || 0})\n${acts}`;
        })
        .join('\n');

      const accommodationsSummary = (trip.accommodations || [])
        .map((a: any) => `  - ${a.name} (${a.type || 'Hotel'}) in ${a.location || 'Central'}, ${trip.overview?.currency || '$'}${a.pricePerNight || 0}/night, rating: ${a.rating || 4.5}`)
        .join('\n');

      const restaurantsSummary = (trip.restaurants || trip.foodRecommendations || [])
        .map((r: any) => `  - ${r.name} (${r.cuisine || 'Local'}, price: ${r.priceRange || '$$'}, rating: ${r.rating || 4.5})${r.specialtyDishes?.length ? ` Specialties: ${r.specialtyDishes.join(', ')}` : ''}`)
        .join('\n');

      const budgetSummary = (trip.budgetItems || [])
        .map((b: any) => `  - ${b.category}: ${b.title} (Planned: ${trip.overview?.currency || '$'}${b.plannedAmount || 0}, Actual: ${trip.overview?.currency || '$'}${b.actualAmount || 0})`)
        .join('\n');

      const packingSummary = trip.packingList
        ? `Total items: ${trip.packingList.length}, Packed: ${trip.packingList.filter((p: any) => p.isPacked).length}, Unpacked: ${trip.packingList.filter((p: any) => !p.isPacked).length}`
        : 'Not generated yet';

      tripContext = `
ACTIVE TRIP DETAILS:
- Title: ${trip.title || trip.destination}
- Destination: ${trip.destination} (${trip.city || ''}, ${trip.country || ''})
- Duration: ${trip.durationDays} days (${trip.startDate || 'TBD'} to ${trip.endDate || 'TBD'})
- Travel Style: ${trip.travelStyle || 'Balanced'} (Pace: ${trip.preferences?.schedulePace || 'Balanced'})
- Travelers: ${trip.travelers?.adults || 1} adults, ${trip.travelers?.children || 0} children
- Budget Tier: ${trip.budgetTier || 'Moderate'} (Total Est: ${trip.overview?.currency || '$'}${trip.estimatedTotalCost || trip.customBudgetTotal || 0})
- Overview Tagline: ${trip.overview?.tagline || ''}

DAYS & ACTIVITIES ITINERARY:
${daysSummary || '  No specific days planned yet.'}

ACCOMMODATIONS:
${accommodationsSummary || '  None selected yet.'}

RESTAURANTS & CULINARY:
${restaurantsSummary || '  None listed yet.'}

BUDGET BREAKDOWN:
${budgetSummary || '  No budget items registered yet.'}

PACKING CHECKLIST:
${packingSummary}
`;
    }

    // Other saved trips from database
    let otherTripsContext = '';
    if (allStoredTrips && allStoredTrips.length > 0) {
      otherTripsContext = `
ALL TRIPS IN USER'S SUPABASE DATABASE:
` + allStoredTrips.map((t: any) => `- "${t.title}" to ${t.destination} (${t.durationDays} days, ${t.startDate || 'Dates TBD'}, Status: ${t.status || 'Active'})`).join('\n');
    }

    if (!ai) {
      // Return fallback status so frontend can handle smoothly
      return res.status(200).json({
        status: 'fallback',
        message: 'Gemini API not configured, using local context engine.'
      });
    }

    const systemInstruction = `
You are Voyager AI, the intelligent, luxury travel concierge for the Voyager Travel Planner system.
You have real-time access to the user's active travel itinerary and their trips stored in the Supabase PostgreSQL database.

${tripContext}
${otherTripsContext}

Instructions:
1. Answer the traveler's question directly, accurately, and politely using their actual trip data above.
2. If they ask about budget, list actual numbers from their budget or estimated costs.
3. If they ask about activities or schedule, reference their specific days, times, and locations.
4. If they ask about restaurants, recommend from their saved culinary list or give tailored destination advice.
5. If they ask to compare trips, use the trips listed in their Supabase database.
6. Keep responses clear, helpful, and concise (2-4 brief paragraphs or clean bullet points). Use Markdown bolding for places and metrics.
7. ACTION SUGGESTION: If your response relates directly to an action in the app, you may append a single action trailer at the very end of your response in this exact format on its own line:
<<<ACTION:{"type":"open-budget"|"open-packing"|"view-weather"|"apply-itinerary"|"view-map"|"view-food"|"view-accommodations","label":"Button Label"}>>>
Examples:
- If talking about budget: <<<ACTION:{"type":"open-budget","label":"Review Budget Breakdown"}>>>
- If talking about packing: <<<ACTION:{"type":"open-packing","label":"Open Packing Checklist"}>>>
- If talking about itinerary/schedule: <<<ACTION:{"type":"apply-itinerary","label":"View Detailed Itinerary"}>>>
- If talking about routes or locations: <<<ACTION:{"type":"view-map","label":"Explore Route Map"}>>>
- If talking about dining: <<<ACTION:{"type":"view-food","label":"View Restaurant Recommendations"}>>>
- If talking about weather: <<<ACTION:{"type":"view-weather","label":"View Weather Forecast"}>>>
- If talking about hotels: <<<ACTION:{"type":"view-accommodations","label":"View Hotel Bookings"}>>>
Only append ONE action trailer if relevant, otherwise omit it.
`;

    // Build multi-turn contents format
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history.slice(-6)) {
        if (msg.text) {
          contents.push({
            role: msg.sender === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    let rawText = '';
    let suggestedAction: any = null;

    if (ai) {
      try {
        const response: any = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.6
            }
          }),
          6000,
          null
        );

        rawText = response?.text || '';
        const actionRegex = /<<<ACTION:(\{.*?\})>>>/s;
        const actionMatch = rawText.match(actionRegex);
        if (actionMatch) {
          try {
            suggestedAction = JSON.parse(actionMatch[1]);
            rawText = rawText.replace(actionRegex, '').trim();
          } catch (err) {
            // Ignore JSON parse error
          }
        }
      } catch (geminiError: any) {
        console.warn('Gemini chat API error (falling back to grounded engine):', geminiError?.message);
      }
    }

    // If Gemini succeeded with text
    if (rawText.trim()) {
      return res.json({
        success: true,
        text: rawText,
        suggestedAction,
        source: 'gemini-3.8-flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    // High-precision server grounded fallback using active trip & Supabase database
    const fallback = generateServerGroundedReply(prompt, trip, allStoredTrips);
    return res.json({
      success: true,
      text: fallback.text,
      suggestedAction: fallback.suggestedAction,
      source: 'server-grounded-engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return res.status(200).json({
      status: 'fallback',
      error: err?.message
    });
  }
});

// Helper function for deterministic database-grounded response
function generateServerGroundedReply(prompt: string, trip: any, allStoredTrips: any[] = []): { text: string; suggestedAction?: any } {
  const p = (prompt || '').toLowerCase();
  const currency = trip?.overview?.currency || '$';

  if (!trip) {
    return {
      text: "I'm ready to craft and manage your voyages. You can plan a new custom trip or select an existing destination like Tokyo, Paris, or Bali.",
      suggestedAction: { type: 'apply-itinerary', label: 'Plan a New Journey' }
    };
  }

  // Budget & Financials
  if (p.includes('budget') || p.includes('cost') || p.includes('money') || p.includes('spend') || p.includes('expense')) {
    const totalEst = trip.estimatedTotalCost || trip.customBudgetTotal || 0;
    const items = trip.budgetItems || [];
    return {
      text: `Here is the financial breakdown for **${trip.title || trip.destination}**:\n\n• **Budget Category**: ${trip.budgetTier || 'Moderate'}\n• **Estimated Total Cost**: ${currency}${totalEst.toLocaleString()}\n• **Active Expenses**: ${items.length} items tracked (${items.filter((i: any) => i.isPaid).length} paid)\n\nReview the budget sheet to adjust individual expense caps or log receipts.`,
      suggestedAction: { type: 'open-budget', label: 'Review Budget Breakdown' }
    };
  }

  // Activities & Schedule
  if (p.includes('schedule') || p.includes('day 1') || p.includes('day 2') || p.includes('day 3') || p.includes('tomorrow') || p.includes('activit')) {
    let dayIdx = 0;
    if (p.includes('day 2') && trip.days?.length > 1) dayIdx = 1;
    if (p.includes('day 3') && trip.days?.length > 2) dayIdx = 2;
    const day = trip.days?.[dayIdx] || trip.days?.[0];

    if (day) {
      const acts = (day.activities || []).map((a: any) => `• **${a.time}** - ${a.title} *(${a.location || 'Local'})* - ${currency}${a.estimatedCost || 0}`).join('\n');
      return {
        text: `Schedule for **Day ${day.dayNumber}: ${day.title}** in **${trip.city || trip.destination}**:\n\n${acts || 'No activities registered yet.'}\n\nEstimated daily cost: ${currency}${day.estimatedDailyCost || 0}.`,
        suggestedAction: { type: 'apply-itinerary', label: `View Day ${day.dayNumber} Itinerary` }
      };
    }
  }

  // Hotels / Accommodations
  if (p.includes('hotel') || p.includes('stay') || p.includes('accommodation') || p.includes('room') || p.includes('resort')) {
    const accs = trip.accommodations || [];
    if (accs.length > 0) {
      const list = accs.map((a: any) => `• **${a.name}** (${a.type}) - ${currency}${a.pricePerNight}/night in ${a.location || 'Central district'}`).join('\n');
      return {
        text: `Here are the booked accommodations for **${trip.destination}**:\n\n${list}`,
        suggestedAction: { type: 'view-accommodations', label: 'View Accommodations' }
      };
    }
    return {
      text: `No hotel bookings are registered for **${trip.destination}** yet. Would you like to review boutique stays and central hotels?`,
      suggestedAction: { type: 'view-accommodations', label: 'Browse Hotels' }
    };
  }

  // Food / Restaurants
  if (p.includes('food') || p.includes('restaurant') || p.includes('dining') || p.includes('eat') || p.includes('dinner')) {
    const restos = trip.restaurants || trip.foodRecommendations || [];
    if (restos.length > 0) {
      const list = restos.slice(0, 3).map((r: any) => `• **${r.name}** (${r.cuisine}) - ${r.priceRange} (Rating: ${r.rating}★)`).join('\n');
      return {
        text: `Curated dining venues for **${trip.city || trip.destination}**:\n\n${list}`,
        suggestedAction: { type: 'view-food', label: 'Explore Dining Guide' }
      };
    }
  }

  // Packing
  if (p.includes('pack') || p.includes('luggage') || p.includes('bag') || p.includes('clothes')) {
    const items = trip.packingList || [];
    const packed = items.filter((i: any) => i.isPacked).length;
    return {
      text: `Packing status for **${trip.destination}**:\n\n• Total items: **${items.length}**\n• Packed: **${packed}**\n• Remaining: **${items.length - packed}**`,
      suggestedAction: { type: 'open-packing', label: 'Open Packing Checklist' }
    };
  }

  // Trip Comparison or Saved Trips in Supabase
  if (p.includes('compare') || p.includes('all trips') || p.includes('saved trips') || p.includes('database')) {
    if (allStoredTrips && allStoredTrips.length > 0) {
      const tripsList = allStoredTrips.map((t: any) => `• **${t.title}** (${t.destination}) - ${t.durationDays} days`).join('\n');
      return {
        text: `You currently have **${allStoredTrips.length} saved trips** stored in your Supabase database:\n\n${tripsList}`,
        suggestedAction: { type: 'view-trips', label: 'View All Saved Trips' }
      };
    }
  }

  return {
    text: `I'm actively synchronizing your **${trip.title || trip.destination}** voyage (${trip.durationDays} days, ${trip.travelStyle} style). Ask me about Day schedules, packing items, budget breakdown, hotels, or map routes.`,
    suggestedAction: { type: 'apply-itinerary', label: 'View Full Itinerary' }
  };
}

// Single activity regeneration endpoint
app.post('/api/ai/regenerate-activity', async (req, res) => {
  try {
    const { currentActivity, city, preference } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ status: 'fallback' });
    }

    const prompt = `
Suggest a fresh, exciting replacement for this activity in ${city}:
Original: "${currentActivity?.title}" (${currentActivity?.category})
User Preference: ${preference || 'Surprise me with a top-rated local experience'}

Return raw JSON for a single Activity object:
{
  "id": "act-rep-${Date.now()}",
  "time": "${currentActivity?.time || '14:00'}",
  "title": "string",
  "location": "string",
  "duration": "1h 30m",
  "estimatedCost": 25,
  "distanceFromPrevious": "0.8 km",
  "transportMethod": "Walk",
  "shortDescription": "string",
  "category": "${currentActivity?.category || 'sightseeing'}",
  "coordinates": { "lat": 35.68, "lng": 139.76 },
  "rating": 4.9,
  "indoorOutdoor": "indoor"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse((response.text || '{}').replace(/```json/g, '').replace(/```/g, '').trim());
    return res.json({ activity: parsed });
  } catch (err) {
    return res.status(200).json({ status: 'fallback' });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('sw.js')) {
          res.setHeader('Service-Worker-Allowed', '/');
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Voyager Travel Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
