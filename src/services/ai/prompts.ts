export const SYSTEM_TRAVEL_EXPERT_PROMPT = `
You are Voyager, a world-class luxury AI travel architect and master concierge.
You design meticulously curated, culturally authentic, logistically sound travel itineraries for travelers worldwide.
Always balance pacing, realistic transit durations, opening hours, local culinary secrets, safety, and personalized traveler interests.
Output valid, structured JSON without conversational fluff when requested.
`;

export function buildTripGenerationPrompt(params: {
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: { adults: number; children: number; infants: number };
  budgetTier: string;
  customBudgetTotal?: number;
  travelStyle: string;
  interests: string[];
  preferences: {
    vegetarian: boolean;
    dietaryRestrictions: string;
    accessibility: boolean;
    preferredTransportation: string;
    hotelPreference: string;
    walkingTolerance: string;
    schedulePace: string;
  };
}) {
  return `
Create a complete, highly realistic ${params.durationDays}-day travel itinerary for "${params.destination}".
Details:
- Dates: ${params.startDate} to ${params.endDate} (${params.durationDays} days)
- Travelers: ${params.travelers.adults} Adults, ${params.travelers.children} Children, ${params.travelers.infants} Infants
- Budget: ${params.budgetTier} ${params.customBudgetTotal ? `($${params.customBudgetTotal} total)` : ''}
- Travel Style: ${params.travelStyle}
- Interests: ${params.interests.join(', ')}
- Preferences: Vegetarian=${params.preferences.vegetarian}, Dietary=${params.preferences.dietaryRestrictions}, Accessibility=${params.preferences.accessibility}, Transport=${params.preferences.preferredTransportation}, Hotel=${params.preferences.hotelPreference}, Walking=${params.preferences.walkingTolerance}, Schedule=${params.preferences.schedulePace}

Return ONLY a JSON object matching this schema:
{
  "title": "string (evocative, inspiring title)",
  "city": "string",
  "country": "string",
  "overview": {
    "tagline": "string",
    "summary": "string (2-3 sentences)",
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
      "estimatedDailyCost": number,
      "weatherForecast": {
        "tempC": number,
        "tempF": number,
        "condition": "string",
        "rainProbability": number,
        "icon": "Sun|CloudSun|Cloud|CloudRain",
        "windSpeed": "string",
        "sunrise": "HH:MM",
        "sunset": "HH:MM"
      },
      "activities": [
        {
          "id": "string",
          "time": "HH:MM",
          "title": "string",
          "location": "string",
          "duration": "string",
          "estimatedCost": number,
          "distanceFromPrevious": "string",
          "transportMethod": "Walk|Metro/Train|Taxi/Rideshare|Bus|Ferry|Bicycle",
          "shortDescription": "string",
          "category": "sightseeing|food|transport|accommodation|culture|adventure|relaxation|shopping|nightlife|nature",
          "coordinates": { "lat": number, "lng": number },
          "rating": number,
          "indoorOutdoor": "indoor|outdoor|mixed"
        }
      ]
    }
  ],
  "accommodations": [
    {
      "id": "string",
      "name": "string",
      "type": "Hotel|Resort|Boutique|Apartment|Villa|Hostel",
      "location": "string",
      "neighborhood": "string",
      "pricePerNight": number,
      "currency": "USD",
      "rating": number,
      "reviewsCount": number,
      "imageUrl": "string",
      "amenities": ["string", "string"],
      "distanceFromCenter": "string",
      "coordinates": { "lat": number, "lng": number },
      "badge": "string"
    }
  ],
  "foodRecommendations": [
    {
      "id": "string",
      "name": "string",
      "cuisine": "string",
      "priceRange": "$|$$|$$$|$$$$",
      "rating": number,
      "location": "string",
      "description": "string",
      "specialtyDishes": ["string", "string"],
      "dietaryTags": ["string"],
      "imageUrl": "string",
      "vibe": "string"
    }
  ],
  "budgetItems": [
    {
      "id": "string",
      "category": "Flights|Accommodation|Food|Transportation|Activities|Shopping|Miscellaneous",
      "title": "string",
      "estimatedCost": number,
      "actualCost": number,
      "isPaid": boolean
    }
  ],
  "packingList": [
    {
      "id": "string",
      "name": "string",
      "category": "Clothing|Electronics|Documents|Toiletries|Medical essentials|Activity-specific",
      "isPacked": false
    }
  ]
}
`;
}

export function buildOptimizationPrompt(currentTrip: any) {
  return `
Analyze and optimize this itinerary for ${currentTrip.destination} (${currentTrip.durationDays} days):
Current schedule summary:
${currentTrip.days.map((d: any) => `Day ${d.dayNumber} (${d.title}): ${d.activities.map((a: any) => `${a.time} ${a.title} (${a.location})`).join(', ')}`).join('\n')}

Goals:
1. Reorganize activities by geographic proximity to minimize transit time and backtracking.
2. Group morning/afternoon/evening flows smoothly according to optimal visiting hours.
3. Account for user pace (${currentTrip.preferences?.schedulePace || 'Balanced'}) and fatigue level.
4. If outdoor activities clash with forecasted rain, suggest rescheduling them to dry periods or indoor alternates.

Return JSON with:
{
  "summaryOfChanges": "2-3 bullet points describing what was improved (e.g. reduced transit by 45 mins, grouped Asakusa sights together)",
  "optimizedDays": [ ...array of days with reordered or refreshed activities in identical format ... ]
}
`;
}
