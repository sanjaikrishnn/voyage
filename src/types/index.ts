export type TravelStyle =
  | 'Relaxed'
  | 'Balanced'
  | 'Packed'
  | 'Adventure'
  | 'Luxury'
  | 'Backpacking'
  | 'Family'
  | 'Romantic'
  | 'Business'
  | 'Business & Leisure';

export type BudgetTier = 'Budget' | 'Moderate' | 'Premium' | 'Luxury' | 'Custom';

export type ActivityCategory =
  | 'sightseeing'
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'culture'
  | 'adventure'
  | 'relaxation'
  | 'shopping'
  | 'nightlife'
  | 'nature';

export interface Activity {
  id: string;
  time: string; // e.g. "09:30"
  title: string;
  location: string;
  duration: string; // e.g. "2 hours"
  estimatedCost: number;
  costCurrency?: string;
  distanceFromPrevious?: string; // e.g. "1.4 km"
  transportMethod?: 'Walk' | 'Metro/Train' | 'Taxi/Rideshare' | 'Bus' | 'Ferry' | 'Bicycle' | string;
  shortDescription: string;
  category: ActivityCategory;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  bookingRecommended?: boolean;
  notes?: string;
  indoorOutdoor?: 'indoor' | 'outdoor' | 'mixed';
}

export interface DayItinerary {
  dayNumber: number;
  date?: string;
  title: string;
  theme: string;
  highlights?: string[];
  summary?: string;
  weatherForecast?: {
    tempC: number;
    tempF: number;
    condition: string;
    rainProbability: number;
    icon: string;
    windSpeed: string;
    sunrise: string;
    sunset: string;
  };
  activities: Activity[];
  estimatedDailyCost?: number;
}

export interface AccommodationOption {
  id: string;
  name: string;
  type: string;
  location: string;
  neighborhood?: string;
  pricePerNight: number;
  currency?: string;
  rating: number;
  reviewsCount?: number;
  imageUrl: string;
  amenities: string[];
  distanceToCenter?: string;
  distanceFromCenter?: string;
  description?: string;
  coordinates?: { lat: number; lng: number };
  badge?: string;
}

export type Accommodation = AccommodationOption;

export interface RestaurantOption {
  id: string;
  name: string;
  cuisine: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  priceLevel?: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  location: string;
  description: string;
  specialtyDishes?: string[];
  mustTryDishes?: string[];
  dietaryTags?: string[];
  isVegetarianFriendly?: boolean;
  imageUrl: string;
  vibe: string;
}

export type Restaurant = RestaurantOption;

export type BudgetCategory =
  | 'Flights'
  | 'Accommodation'
  | 'Food'
  | 'Transportation'
  | 'Activities'
  | 'Shopping'
  | 'Miscellaneous'
  | 'flights'
  | 'accommodation'
  | 'food'
  | 'transport'
  | 'activities'
  | 'shopping'
  | 'misc';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  title: string;
  plannedAmount?: number;
  actualAmount?: number;
  estimatedCost?: number;
  actualCost?: number;
  isPaid: boolean;
  notes?: string;
  date?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Clothing' | 'Electronics' | 'Documents' | 'Toiletries' | 'Medical essentials' | 'Activity-specific';
  isPacked: boolean;
  isCustom?: boolean;
  quantity?: number;
}

export interface TravelDocument {
  id: string;
  title: string;
  category?: string;
  isCompleted: boolean;
  notes?: string;
  expiryDate?: string;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  city: string;
  country: string;
  additionalCities?: string[];
  coverImage: string;
  startDate: string;
  endDate: string;
  isFlexibleDates?: boolean;
  durationDays: number;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  budgetTier: BudgetTier;
  customBudgetTotal?: number;
  estimatedTotalCost?: number;
  travelStyle: TravelStyle;
  interests: string[];
  preferences: {
    vegetarian: boolean;
    dietaryRestrictions: string;
    accessibility: boolean;
    preferredTransportation: string;
    hotelPreference: string;
    walkingTolerance: 'Low' | 'Moderate' | 'High' | string;
    schedulePace: 'Early Riser' | 'Balanced' | 'Night Owl' | string;
  };
  overview: {
    tagline: string;
    summary: string;
    bestTimeToVisit: string;
    currency: string;
    language: string;
    timeZone: string;
    localEtiquette: string[];
    safetyTips: string[];
    packingTips: string[];
  };
  days: DayItinerary[];
  accommodations: AccommodationOption[];
  restaurants?: RestaurantOption[];
  foodRecommendations?: RestaurantOption[];
  budgetItems: BudgetItem[];
  packingList: PackingItem[];
  documents: TravelDocument[];
  status: 'Draft' | 'Upcoming' | 'Active' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface DestinationCard {
  id: string;
  name: string;
  country: string;
  tagline: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  bestTimeToVisit: string;
  avgDailyBudget: number;
  currency: string;
  popularActivities: string[];
  trending?: boolean;
  featured?: boolean;
  hiddenGem?: boolean;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type:
      | 'apply-itinerary'
      | 'open-budget'
      | 'open-packing'
      | 'view-weather'
      | 'replace-activity'
      | 'view-map'
      | 'view-food'
      | 'view-accommodations'
      | 'view-documents'
      | 'view-trips';
    label: string;
    payload?: any;
  };
}

export interface UserPreferences {
  travelPace?: 'relaxed' | 'balanced' | 'packed';
  walkingTolerance?: 'low' | 'moderate' | 'high';
  dietaryRestrictions?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  homeCity: string;
  preferredCurrency: string;
  savedDestinations: string[];
  passportExpiry?: string;
  emergencyContact?: string;
  preferences?: UserPreferences;
}

export type InterestCategory =
  | 'Culture'
  | 'Food'
  | 'History'
  | 'Nature'
  | 'Photography'
  | 'Architecture'
  | 'Shopping'
  | 'Nightlife'
  | 'Beaches'
  | 'Museums'
  | 'Adventure'
  | 'Wildlife'
  | 'Sports';

export type OptimizationGoal =
  | 'reduce_travel_time'
  | 'group_nearby'
  | 'avoid_backtracking'
  | 'balance_fatigue'
  | 'weather_shift';

export interface TripPlannerInput {
  destination: string;
  additionalDestinations?: string[];
  additionalCities?: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
  isFlexibleDates?: boolean;
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  budgetTier: BudgetTier;
  customBudget?: number;
  customTotalBudget?: number;
  customBudgetTotal?: number;
  currency?: string;
  travelStyle: TravelStyle;
  interests: (InterestCategory | string)[];
  preferences: {
    isVegetarian?: boolean;
    vegetarian?: boolean;
    dietaryNotes?: string;
    dietaryRestrictions?: string;
    accessibilityRequired?: boolean;
    accessibility?: boolean;
    preferredTransport?: string;
    preferredTransportation?: string;
    hotelPreference?: string;
    walkingPace?: 'Low' | 'Moderate' | 'High' | string;
    walkingTolerance?: 'Low' | 'Moderate' | 'High' | string;
    scheduleRhythm?: 'Early Riser' | 'Balanced' | 'Night Owl' | string;
    schedulePace?: 'Early Riser' | 'Balanced' | 'Night Owl' | string;
  };
}
