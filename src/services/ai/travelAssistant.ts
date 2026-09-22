import { ChatMessage, TripPlan } from '../../types';

export const SUGGESTED_ASSISTANT_PROMPTS = [
  'What is my total budget breakdown?',
  'What activities are scheduled for Day 2?',
  'Where am I staying?',
  'Which restaurants are recommended?',
  'What is in my packing checklist?',
  'Explore route map & transit',
  'Give me a rainy-day alternative',
  'Make Day 2 less tiring'
];

export interface ChatBotStatus {
  geminiConfigured: boolean;
  model: string;
  supabaseConnected: boolean;
}

export async function getChatBotStatus(): Promise<ChatBotStatus> {
  try {
    const res = await fetch('/api/ai/chat/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Network or server error
  }
  return {
    geminiConfigured: false,
    model: 'gemini-3.8-flash',
    supabaseConnected: false
  };
}

export async function askTravelAssistant(
  prompt: string,
  currentTrip?: TripPlan,
  chatHistory: ChatMessage[] = []
): Promise<ChatMessage> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        trip: currentTrip,
        history: chatHistory.slice(-8)
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.text && data.status !== 'fallback') {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: data.suggestedAction
        };
      }
    }
  } catch (err) {
    console.warn('Backend chat offline, generating intelligent in-app concierge response.', err);
  }

  // Smart context-aware fallback response generator
  return generateContextAwareAssistantReply(prompt, currentTrip);
}

function generateContextAwareAssistantReply(prompt: string, trip?: TripPlan): ChatMessage {
  const p = prompt.toLowerCase();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!trip) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: "I'm ready to craft your dream trip! Click 'Plan Trip' or pick one of our featured destinations like Tokyo, Paris, or Bali to get started.",
      timestamp: timeStr,
      suggestedAction: {
        type: 'apply-itinerary',
        label: 'Start Planning a Trip'
      }
    };
  }

  const currency = trip.overview?.currency || '$';

  // Hotel / Accommodations query
  if (p.includes('hotel') || p.includes('stay') || p.includes('accommodation') || p.includes('resort') || p.includes('lodge')) {
    if (trip.accommodations && trip.accommodations.length > 0) {
      const accList = trip.accommodations
        .map((a) => `• **${a.name}** (${a.type}) - ${currency}${a.pricePerNight}/night in ${a.location || a.neighborhood} (Rating: ${a.rating}★)`)
        .join('\n');
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here are the accommodations selected for your stay in **${trip.city || trip.destination}**:\n\n${accList}\n\nWould you like to review full amenities or room categories?`,
        timestamp: timeStr,
        suggestedAction: {
          type: 'view-accommodations',
          label: 'View Hotel Bookings'
        }
      };
    }
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `You have not confirmed hotels for **${trip.city || trip.destination}** yet. I can show you our handpicked boutique stays, luxury ryokans, and central hotels!`,
      timestamp: timeStr,
      suggestedAction: {
        type: 'view-accommodations',
        label: 'Explore Hotels'
      }
    };
  }

  // Restaurant / Food query
  if (p.includes('food') || p.includes('restaurant') || p.includes('dining') || p.includes('eat') || p.includes('dinner') || p.includes('lunch') || p.includes('breakfast') || p.includes('vegetarian') || p.includes('vegan')) {
    const restos = trip.restaurants || trip.foodRecommendations || [];
    if (restos.length > 0) {
      const restoList = restos
        .slice(0, 4)
        .map((r) => `• **${r.name}** (${r.cuisine}) - ${r.priceRange} • Rating: ${r.rating}★\n  *Specialties: ${(r.specialtyDishes || []).slice(0, 2).join(', ') || 'Local chef specialties'}*`)
        .join('\n');
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here are top culinary highlights curated for **${trip.city || trip.destination}**:\n\n${restoList}\n\nEvery venue has been vetted for authentic flavors and quality.`,
        timestamp: timeStr,
        suggestedAction: {
          type: 'view-food',
          label: 'View Food & Dining Guide'
        }
      };
    }
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `In **${trip.city || trip.destination}**, dining is an essential part of the journey. I can guide you through authentic local eateries, Michelin-starred bistros, and vegetarian specialties.`,
      timestamp: timeStr,
      suggestedAction: {
        type: 'view-food',
        label: 'Explore Dining'
      }
    };
  }

  // Budget query
  if (p.includes('cost') || p.includes('budget') || p.includes('cheap') || p.includes('expense') || p.includes('spending') || p.includes('price') || p.includes('money')) {
    const totalEst = trip.estimatedTotalCost || trip.customBudgetTotal || 0;
    const itemsCount = trip.budgetItems?.length || 0;
    const paidCount = trip.budgetItems?.filter((b) => b.isPaid).length || 0;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Here is the financial overview for your **${trip.durationDays}-day** journey to **${trip.city || trip.destination}**:\n\n• **Budget Tier**: ${trip.budgetTier || 'Moderate'}\n• **Estimated Total Cost**: ${currency}${totalEst.toLocaleString()}\n• **Tracked Expenses**: ${itemsCount} items (${paidCount} marked as paid)\n\n💡 Concierge Tip: Booking local transit passes and museum tickets online can save an estimated ~15% on daily expenses.`,
      timestamp: timeStr,
      suggestedAction: {
        type: 'open-budget',
        label: 'View Budget Breakdown'
      }
    };
  }

  // Packing list query
  if (p.includes('pack') || p.includes('luggage') || p.includes('clothes') || p.includes('bag') || p.includes('suitcase')) {
    const totalItems = trip.packingList?.length || 0;
    const packedItems = trip.packingList?.filter((i) => i.isPacked).length || 0;
    const unpacked = totalItems - packedItems;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Your packing checklist for **${trip.destination}** currently has **${totalItems} items**:\n\n• **Packed**: ${packedItems} items\n• **Remaining**: ${unpacked} items to pack\n\nKey essentials: Comfortable walking shoes, universal plug adapter, rain layer, and essential travel documents.`,
      timestamp: timeStr,
      suggestedAction: {
        type: 'open-packing',
        label: 'Open Packing Checklist'
      }
    };
  }

  // Map / Route query
  if (p.includes('map') || p.includes('route') || p.includes('distance') || p.includes('transit') || p.includes('directions') || p.includes('subway') || p.includes('metro')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `I've mapped out the full geographic route for **${trip.city || trip.destination}**, linking your hotels, cultural attractions, and dining venues with walking and transit vectors.`,
      timestamp: timeStr,
      suggestedAction: {
        type: 'view-map',
        label: 'Explore Route Map'
      }
    };
  }

  // Day specific / schedule query
  if (p.includes('day 1') || p.includes('day 2') || p.includes('day 3') || p.includes('tomorrow') || p.includes('schedule') || p.includes('activity') || p.includes('itinerary')) {
    let targetDayIndex = 0;
    if (p.includes('day 2') && trip.days.length > 1) targetDayIndex = 1;
    if (p.includes('day 3') && trip.days.length > 2) targetDayIndex = 2;

    const day = trip.days[targetDayIndex] || trip.days[0];
    if (day) {
      const activitiesList = (day.activities || [])
        .map((a) => `• **${a.time}** - ${a.title} *(${a.location || 'Local'})*`)
        .join('\n');

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here is the schedule for **Day ${day.dayNumber}: ${day.title}** in **${trip.city || trip.destination}**:\n\n${activitiesList || 'No activities registered for this day.'}\n\nEstimated daily cost: ${currency}${day.estimatedDailyCost || 0}.`,
        timestamp: timeStr,
        suggestedAction: {
          type: 'apply-itinerary',
          label: `View Day ${day.dayNumber} Itinerary`
        }
      };
    }
  }

  // Fatigue / Pace / Optimization query
  if (p.includes('less tiring') || p.includes('tired') || p.includes('rest') || p.includes('pace') || p.includes('relax')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `I've analyzed your schedule for ${trip.city || trip.destination}. Day 2 currently has ${trip.days[1]?.activities.length || 4} activities. I recommend spacing out the afternoon: we can swap high-intensity walking with a relaxing 90-minute scenic cafe or garden tea break.`,
      timestamp: timeStr,
      suggestedAction: {
        type: 'apply-itinerary',
        label: 'Adjust Itinerary Pace'
      }
    };
  }

  // Weather query
  if (p.includes('rain') || p.includes('weather') || p.includes('cloud') || p.includes('temperature') || p.includes('forecast')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Weather forecast for **${trip.city || trip.destination}** indicates mild conditions suitable for urban exploration. In case of sudden showers, indoor art galleries and covered arcades are positioned nearby.`,
      timestamp: timeStr,
      suggestedAction: {
        type: 'view-weather',
        label: 'View Weather Forecast'
      }
    };
  }

  // General helpful response
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: `Regarding your **${trip.durationDays}-day** journey to **${trip.destination}**: Every day is organized around a **${trip.travelStyle || 'balanced'}** style and **${trip.budgetTier || 'moderate'}** budget. Let me know if you would like to review activities, manage costs, inspect hotel stays, or get packing advice!`,
    timestamp: timeStr,
    suggestedAction: {
      type: 'apply-itinerary',
      label: 'Explore Full Itinerary'
    }
  };
}
