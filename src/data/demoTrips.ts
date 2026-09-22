import { TripPlan } from '../types';

export const INITIAL_DEMO_TRIPS: TripPlan[] = [
  {
    id: 'trip-tokyo-01',
    title: 'Tokyo Neon & Tradition Expedition',
    destination: 'Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    additionalCities: ['Hakone Day Trip'],
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-10-12',
    endDate: '2026-10-17',
    durationDays: 5,
    travelers: { adults: 2, children: 0, infants: 0 },
    budgetTier: 'Moderate',
    customBudgetTotal: 2400,
    travelStyle: 'Balanced',
    interests: ['Culture', 'Food', 'Photography', 'Shopping', 'Architecture'],
    preferences: {
      vegetarian: false,
      dietaryRestrictions: 'None',
      accessibility: false,
      preferredTransportation: 'Metro/Train',
      hotelPreference: 'Boutique Hotel in Shinjuku or Shibuya',
      walkingTolerance: 'High',
      schedulePace: 'Balanced'
    },
    overview: {
      tagline: '5 days bridging ultra-modern tech capitals and timeless Edo spiritual sanctuaries',
      summary: 'Explore Tokyo from the bustling crosswalks of Shibuya and futuristic digital art of teamLab to tranquil shrines like Meiji Jingu and the historic alleys of Yanaka.',
      bestTimeToVisit: 'March to May (Sakura) and October to November (Autumn foliage)',
      currency: 'JPY (Japanese Yen / 1 USD ≈ 150 JPY)',
      language: 'Japanese (English signage common in rail stations)',
      timeZone: 'JST (UTC+9)',
      localEtiquette: [
        'Keep voice low on trains and metro lines',
        'Do not eat while walking down the street; finish food near the stand or shop',
        'Tipping is not customary and can cause confusion'
      ],
      safetyTips: [
        'Tokyo is one of the safest cities worldwide with low crime rates',
        'Keep your passport on you at all times as required by law',
        'Download an offline transit map like Suica / Pasmo digital cards'
      ],
      packingTips: [
        'Comfortable slip-on walking shoes (you will remove shoes often)',
        'Compact umbrella or lightweight raincoat',
        'Portable battery pack for navigation and photos'
      ]
    },
    days: [
      {
        dayNumber: 1,
        date: '2026-10-12',
        title: 'Arrival & Shibuya Modern Energy',
        theme: 'Modern Vibe & Iconic Crossing',
        highlights: ['Shibuya Crossing', 'Shibuya Sky Observatory', 'Ramen Dining'],
        estimatedDailyCost: 110,
        weatherForecast: {
          tempC: 21,
          tempF: 70,
          condition: 'Clear & Sunny',
          rainProbability: 5,
          icon: 'Sun',
          windSpeed: '9 km/h',
          sunrise: '05:46',
          sunset: '17:08'
        },
        activities: [
          {
            id: 'act-1-1',
            time: '09:30',
            title: 'Haneda / Narita Arrival & Hotel Check-in',
            location: 'Hotel Gracery Shinjuku',
            duration: '1h 30m',
            estimatedCost: 25,
            distanceFromPrevious: '0 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Arrive via Narita Express / Keikyu line, check baggage at central boutique hotel, and collect Suica transit card.',
            category: 'accommodation',
            coordinates: { lat: 35.6953, lng: 139.7020 },
            rating: 4.6,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-1-2',
            time: '12:00',
            title: 'Welcome Ramen Feast at Afuri Harajuku',
            location: 'Afuri Harajuku',
            duration: '1 hour',
            estimatedCost: 18,
            distanceFromPrevious: '2.1 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Savor signature yuzu shio ramen served with tender chashu pork in a sleek minimalist noodle bar.',
            category: 'food',
            coordinates: { lat: 35.6702, lng: 139.7032 },
            rating: 4.7,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-1-3',
            time: '13:30',
            title: 'Meiji Jingu Shrine & Forest Walk',
            location: 'Meiji Shrine, Shibuya',
            duration: '1h 45m',
            estimatedCost: 0,
            distanceFromPrevious: '0.4 km',
            transportMethod: 'Walk',
            shortDescription: 'Pass through colossal cedar Torii gates into a tranquil 170-acre forest enclosing the historic imperial shrine.',
            category: 'culture',
            coordinates: { lat: 35.6764, lng: 139.6993 },
            rating: 4.9,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-1-4',
            time: '16:00',
            title: 'Shibuya Crossing & Hachiko Memorial',
            location: 'Shibuya Scramble Crossing',
            duration: '1 hour',
            estimatedCost: 5,
            distanceFromPrevious: '1.2 km',
            transportMethod: 'Walk',
            shortDescription: 'Experience the world-famous synchronized pedestrian surge surrounded by giant holographic video screens.',
            category: 'sightseeing',
            coordinates: { lat: 35.6595, lng: 139.7005 },
            rating: 4.8,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-1-5',
            time: '17:30',
            title: 'Sunset Views from Shibuya Sky Deck',
            location: 'Shibuya Scramble Square 47F',
            duration: '1h 30m',
            estimatedCost: 20,
            distanceFromPrevious: '0.2 km',
            transportMethod: 'Walk',
            shortDescription: 'Breathtaking 360-degree open-air glass rooftop observatory overlooking Mount Fuji and Tokyo’s glowing metropolis.',
            category: 'sightseeing',
            coordinates: { lat: 35.6585, lng: 139.7022 },
            rating: 4.95,
            bookingRecommended: true,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-1-6',
            time: '19:30',
            title: 'Dinner & Craft Yakitori in Omoide Yokocho',
            location: 'Memory Lane, Shinjuku',
            duration: '2 hours',
            estimatedCost: 35,
            distanceFromPrevious: '3.4 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Atmospheric lanterns and izakaya counter stalls grilling charcoal chicken skewers and pouring draft beer.',
            category: 'food',
            coordinates: { lat: 35.6931, lng: 139.7001 },
            rating: 4.7,
            indoorOutdoor: 'indoor'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-10-13',
        title: 'Historic Asakusa & Digital Art Wonderland',
        theme: 'Old Edo Heritage to teamLab Digital Immersion',
        highlights: ['Sensō-ji Temple', 'Nakamise Dori', 'teamLab Planets', 'Ginza Dining'],
        estimatedDailyCost: 125,
        weatherForecast: {
          tempC: 22,
          tempF: 72,
          condition: 'Partly Cloudy',
          rainProbability: 15,
          icon: 'CloudSun',
          windSpeed: '11 km/h',
          sunrise: '05:47',
          sunset: '17:07'
        },
        activities: [
          {
            id: 'act-2-1',
            time: '08:30',
            title: 'Morning Serenity at Sensō-ji Temple',
            location: 'Asakusa, Taito City',
            duration: '1h 30m',
            estimatedCost: 0,
            distanceFromPrevious: '0 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Tokyo’s oldest Buddhist sanctuary founded in 645 AD, flanked by the Thunder Gate and giant red paper lantern.',
            category: 'culture',
            coordinates: { lat: 35.7148, lng: 139.7967 },
            rating: 4.88,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-2-2',
            time: '10:30',
            title: 'Artisan Snacks along Nakamise-dori',
            location: 'Nakamise Shopping Street',
            duration: '1 hour',
            estimatedCost: 15,
            distanceFromPrevious: '0.1 km',
            transportMethod: 'Walk',
            shortDescription: 'Sample freshly made melonpan sweet bread, grilled rice crackers (senbei), and warm matcha tea.',
            category: 'food',
            coordinates: { lat: 35.7126, lng: 139.7963 },
            rating: 4.65,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-2-3',
            time: '12:30',
            title: 'Edo-Style Soba Lunch at Namiki Yabusoba',
            location: 'Namiki Yabusoba, Kaminarimon',
            duration: '1 hour',
            estimatedCost: 22,
            distanceFromPrevious: '0.3 km',
            transportMethod: 'Walk',
            shortDescription: 'Hand-kneaded buckwheat noodles served cold with dark savory dipping broth and crispy shrimp tempura.',
            category: 'food',
            coordinates: { lat: 35.7103, lng: 139.7952 },
            rating: 4.8,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-2-4',
            time: '14:30',
            title: 'teamLab Planets Immersive Digital Art',
            location: 'Toyosu, Koto City',
            duration: '2h 15m',
            estimatedCost: 38,
            distanceFromPrevious: '8.2 km',
            transportMethod: 'Taxi/Rideshare',
            shortDescription: 'Wade barefoot through water surrounded by floating infinity mirrors, cascading digital koi fish, and blooming orchids.',
            category: 'sightseeing',
            coordinates: { lat: 35.6491, lng: 139.7898 },
            rating: 4.96,
            bookingRecommended: true,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-2-5',
            time: '18:30',
            title: 'Evening Ginza Architecture Walk & Sukiyabashi Dinner',
            location: 'Ginza 6 District',
            duration: '2 hours',
            estimatedCost: 50,
            distanceFromPrevious: '3.8 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Admire luxury flagship architecture followed by elevated Edomae sushi and sake flight.',
            category: 'food',
            coordinates: { lat: 35.6719, lng: 139.7648 },
            rating: 4.9,
            indoorOutdoor: 'indoor'
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-10-14',
        title: 'Tsukiji Flavors & Imperial Gardens',
        theme: 'Culinary Heritage & Historic Green Spaces',
        highlights: ['Tsukiji Seafood', 'Hamarikyu Gardens', 'Akihabara Tech Culture'],
        estimatedDailyCost: 95,
        weatherForecast: {
          tempC: 19,
          tempF: 66,
          condition: 'Scattered Showers',
          rainProbability: 40,
          icon: 'CloudRain',
          windSpeed: '14 km/h',
          sunrise: '05:48',
          sunset: '17:05'
        },
        activities: [
          {
            id: 'act-3-1',
            time: '08:00',
            title: 'Tsukiji Outer Market Food Safari',
            location: 'Tsukiji Outer Market',
            duration: '2 hours',
            estimatedCost: 35,
            distanceFromPrevious: '0 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Freshly torched wagyu skewers, tamagoyaki sweet omelets, and bluefin tuna sashimi bowls right from the docks.',
            category: 'food',
            coordinates: { lat: 35.6655, lng: 139.7708 },
            rating: 4.85,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-3-2',
            time: '10:30',
            title: 'Hamarikyu Waterfront Tea House & Tidal Pond',
            location: 'Hamarikyu Gardens, Chuo',
            duration: '1h 30m',
            estimatedCost: 8,
            distanceFromPrevious: '0.8 km',
            transportMethod: 'Walk',
            shortDescription: 'Feudal lord retreat surrounded by shimmering Shiodome towers; sip matcha inside the Nakajima tea house.',
            category: 'relaxation',
            coordinates: { lat: 35.6599, lng: 139.7634 },
            rating: 4.75,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-3-3',
            time: '13:00',
            title: 'Akihabara Electric Town & Retro Arcades',
            location: 'Akihabara Station Area',
            duration: '2h 30m',
            estimatedCost: 20,
            distanceFromPrevious: '4.5 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Explore multi-story electronics department stores, retro Super Potato gaming archives, and quirky capsule machines.',
            category: 'shopping',
            coordinates: { lat: 35.6984, lng: 139.7731 },
            rating: 4.7,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-3-4',
            time: '18:00',
            title: 'Tonkatsu Feast at Katsukura Shinjuku',
            location: 'Takashimaya Times Square',
            duration: '1h 30m',
            estimatedCost: 32,
            distanceFromPrevious: '6.1 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Crisp panko-crusted pork cutlet served with freshly ground sesame paste and unlimited shredded cabbage.',
            category: 'food',
            coordinates: { lat: 35.6881, lng: 139.7024 },
            rating: 4.82,
            indoorOutdoor: 'indoor'
          }
        ]
      },
      {
        dayNumber: 4,
        date: '2026-10-15',
        title: 'Scenic Day Trip to Mount Fuji & Hakone',
        theme: 'Alpine Calderas, Hot Springs & Fuji Vistas',
        highlights: ['Hakone Romancecar', 'Lake Ashi Pirate Ship', 'Owakudani Black Eggs', 'Onsen Hot Spring'],
        estimatedDailyCost: 145,
        weatherForecast: {
          tempC: 17,
          tempF: 63,
          condition: 'Sunny & Clear',
          rainProbability: 0,
          icon: 'Sun',
          windSpeed: '8 km/h',
          sunrise: '05:49',
          sunset: '17:04'
        },
        activities: [
          {
            id: 'act-4-1',
            time: '07:30',
            title: 'Odakyu Romancecar Scenic Express to Hakone',
            location: 'Shinjuku to Hakone-Yumoto',
            duration: '1h 30m',
            estimatedCost: 30,
            distanceFromPrevious: '0 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Panoramic train journey winding south toward the foot of Mount Fuji through rolling Kanagawa foothills.',
            category: 'transport',
            coordinates: { lat: 35.2333, lng: 139.1067 },
            rating: 4.8,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-4-2',
            time: '10:00',
            title: 'Hakone Ropeway & Owakudani Volcanic Valley',
            location: 'Owakudani Active Caldera',
            duration: '2 hours',
            estimatedCost: 15,
            distanceFromPrevious: '12 km',
            transportMethod: 'Bus',
            shortDescription: 'Glide above bubbling sulfur vents with direct views of Mount Fuji; taste legendary mineral-boiled black eggs.',
            category: 'adventure',
            coordinates: { lat: 35.2443, lng: 139.0199 },
            rating: 4.9,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-4-3',
            time: '13:00',
            title: 'Lake Ashi Sightseeing Cruise & Floating Torii',
            location: 'Lake Ashi, Hakone Shrine',
            duration: '2 hours',
            estimatedCost: 20,
            distanceFromPrevious: '6 km',
            transportMethod: 'Ferry',
            shortDescription: 'Sail across the caldera lake on a pirate ship and photograph Hakone Shrine’s crimson Torii gate standing in the water.',
            category: 'sightseeing',
            coordinates: { lat: 35.2045, lng: 139.0258 },
            rating: 4.92,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-4-4',
            time: '16:00',
            title: 'Traditional Onsen Mineral Bath Soak',
            location: 'Tenzan Tohji-kyo Onsen',
            duration: '2 hours',
            estimatedCost: 25,
            distanceFromPrevious: '8 km',
            transportMethod: 'Taxi/Rideshare',
            shortDescription: 'Natural hot spring stone baths nestled against a forested mountain river canyon for ultimate rejuvenation.',
            category: 'relaxation',
            coordinates: { lat: 35.2289, lng: 139.0765 },
            rating: 4.95,
            indoorOutdoor: 'outdoor'
          }
        ]
      },
      {
        dayNumber: 5,
        date: '2026-10-16',
        title: 'Shinjuku Gyoen & Farewell Tokyo Sunset',
        theme: 'Botanical Respite, Souvenir Hunting & Tokyo Tower',
        highlights: ['Shinjuku Gyoen', 'Daikanyama Boutiques', 'Tokyo Tower Sunset'],
        estimatedDailyCost: 85,
        weatherForecast: {
          tempC: 20,
          tempF: 68,
          condition: 'Breezy & Fair',
          rainProbability: 10,
          icon: 'Sun',
          windSpeed: '12 km/h',
          sunrise: '05:50',
          sunset: '17:02'
        },
        activities: [
          {
            id: 'act-5-1',
            time: '09:00',
            title: 'Peaceful Stroll in Shinjuku Gyoen National Garden',
            location: 'Shinjuku Gyoen',
            duration: '2 hours',
            estimatedCost: 5,
            distanceFromPrevious: '0 km',
            transportMethod: 'Walk',
            shortDescription: 'Tranquil landscape featuring French formal, English landscape, and traditional Japanese imperial pond designs.',
            category: 'nature',
            coordinates: { lat: 35.6852, lng: 139.7101 },
            rating: 4.9,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-5-2',
            time: '11:45',
            title: 'Artisan Coffee & Stationery in Daikanyama',
            location: 'Tsutaya Books & T-Site Daikanyama',
            duration: '1h 45m',
            estimatedCost: 20,
            distanceFromPrevious: '3.6 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Tokyo’s design-forward haven; browse curated art books, handmade ceramics, and pour-over coffee.',
            category: 'shopping',
            coordinates: { lat: 35.6492, lng: 139.6996 },
            rating: 4.8,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-5-3',
            time: '15:30',
            title: 'Iconic Tokyo Tower & Shiba Park Sunset',
            location: 'Tokyo Tower, Minato City',
            duration: '2 hours',
            estimatedCost: 22,
            distanceFromPrevious: '4.8 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Ascend the classic orange and white communications tower for golden-hour views of Tokyo Bay and Roppongi Hills.',
            category: 'sightseeing',
            coordinates: { lat: 35.6586, lng: 139.7454 },
            rating: 4.75,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-5-4',
            time: '19:00',
            title: 'Celebration Wagyu Shabu-Shabu Dinner',
            location: 'Imahan Shinjuku',
            duration: '2 hours',
            estimatedCost: 65,
            distanceFromPrevious: '5.2 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Melt-in-your-mouth A5 marbled Kuroge Wagyu cooked tableside with seasonal winter vegetables and sesame tare.',
            category: 'food',
            coordinates: { lat: 35.6896, lng: 139.7006 },
            rating: 4.94,
            bookingRecommended: true,
            indoorOutdoor: 'indoor'
          }
        ]
      }
    ],
    accommodations: [
      {
        id: 'acc-tokyo-1',
        name: 'Hotel Gracery Shinjuku',
        type: 'Hotel',
        location: 'Kabukicho, Shinjuku, Tokyo',
        neighborhood: 'Shinjuku Central',
        pricePerNight: 165,
        currency: 'USD',
        rating: 4.6,
        reviewsCount: 3240,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        amenities: ['Free High-Speed Wi-Fi', 'Rainfall Shower', '24/7 Concierge', 'Direct Airport Limousine Bus', 'Godzilla Terrace View'],
        distanceFromCenter: '0.4 km from Shinjuku Station',
        coordinates: { lat: 35.6953, lng: 139.7020 },
        badge: 'Top Pick for Transit'
      },
      {
        id: 'acc-tokyo-2',
        name: 'Trunk (Hotel) Shibuya Cat Street',
        type: 'Boutique',
        location: 'Jingumae, Shibuya, Tokyo',
        neighborhood: 'Harajuku / Cat Street',
        pricePerNight: 290,
        currency: 'USD',
        rating: 4.9,
        reviewsCount: 890,
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        amenities: ['Social Lounge & Craft Cocktail Bar', 'Organic Toiletries', 'Bicycle Rentals', 'Artisan Coffee', 'Terrace Suites'],
        distanceFromCenter: '0.8 km from Shibuya Crossing',
        coordinates: { lat: 35.6644, lng: 139.7042 },
        badge: 'Design & Style Favorite'
      },
      {
        id: 'acc-tokyo-3',
        name: 'Ryokan Asakusa Shigetsu',
        type: 'Hotel',
        location: 'Asakusa, Taito City, Tokyo',
        neighborhood: 'Historic Asakusa',
        pricePerNight: 145,
        currency: 'USD',
        rating: 4.8,
        reviewsCount: 1420,
        imageUrl: 'https://images.unsplash.com/photo-1507038772120-7ffe76778f01?auto=format&fit=crop&w=800&q=80',
        amenities: ['Tatami Rooms & Futon Bedding', 'Hinoki Cypress Rooftop Bath', 'Japanese Kaiseki Breakfast', 'Quiet Courtyard'],
        distanceFromCenter: '0.1 km from Sensō-ji Temple',
        coordinates: { lat: 35.7135, lng: 139.7958 },
        badge: 'Authentic Traditional'
      }
    ],
    foodRecommendations: [
      {
        id: 'rest-1',
        name: 'Afuri Harajuku',
        cuisine: 'Japanese Ramen',
        priceRange: '$$',
        rating: 4.8,
        location: 'Harajuku, Shibuya',
        description: 'Renowned for its refreshing yuzu broth, hand-charred pork chashu, and vegan mushroom noodle alternatives.',
        specialtyDishes: ['Yuzu Shio Ramen', 'Spicy Yuzu Raitan', 'Chashu Gohan'],
        dietaryTags: ['Vegetarian Friendly', 'Vegan Options'],
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        vibe: 'Modern, fast-casual & trendy'
      },
      {
        id: 'rest-2',
        name: 'Namiki Yabusoba',
        cuisine: 'Traditional Soba',
        priceRange: '$$',
        rating: 4.85,
        location: 'Asakusa, Taito',
        description: 'Operating since 1913, this revered soba landmark serves deeply flavored dipping broth and buckwheat noodles.',
        specialtyDishes: ['Kamo Nanban Soba (Duck broth)', 'Tempura Seiro', 'Buckwheat Tea'],
        dietaryTags: ['Pescetarian Friendly'],
        imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=800&q=80',
        vibe: 'Historic tatami dining room'
      },
      {
        id: 'rest-3',
        name: 'Imahan Shinjuku',
        cuisine: 'Sukiyaki & Wagyu',
        priceRange: '$$$$',
        rating: 4.95,
        location: 'Takashimaya Shinjuku',
        description: 'Elite dining masters preparing paper-thin A5 Japanese wagyu in sweet dashi soy broth tableside in kimono.',
        specialtyDishes: ['Special Sukiyaki Course', 'Kuroge Wagyu Nigiri', 'Seasonal Matcha Sorbet'],
        dietaryTags: ['Meat Lovers', 'Luxury Dining'],
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        vibe: 'Refined, private dining booths'
      }
    ],
    budgetItems: [
      { id: 'b-1', category: 'Flights', title: 'Roundtrip Flights for 2', estimatedCost: 1100, actualCost: 1040, isPaid: true, date: '2026-08-15' },
      { id: 'b-2', category: 'Accommodation', title: 'Hotel Gracery 5 Nights', estimatedCost: 825, actualCost: 810, isPaid: true, date: '2026-08-20' },
      { id: 'b-3', category: 'Food', title: 'Daily Dining & Coffee ($60/day/person)', estimatedCost: 600, actualCost: 220, isPaid: false },
      { id: 'b-4', category: 'Transportation', title: 'Suica Cards + Hakone Romancecar Pass', estimatedCost: 140, actualCost: 120, isPaid: true },
      { id: 'b-5', category: 'Activities', title: 'teamLab Planets + Shibuya Sky + Onsen', estimatedCost: 180, actualCost: 116, isPaid: true },
      { id: 'b-6', category: 'Shopping', title: 'Souvenirs, stationery & snacks', estimatedCost: 200, actualCost: 80, isPaid: false },
      { id: 'b-7', category: 'Miscellaneous', title: 'Pocket WiFi & Travel Insurance', estimatedCost: 90, actualCost: 75, isPaid: true }
    ],
    packingList: [
      { id: 'p-1', name: 'Passport & Travel Visa', category: 'Documents', isPacked: true },
      { id: 'p-2', name: 'Printed Hotel & Flight Confirmations', category: 'Documents', isPacked: true },
      { id: 'p-3', name: 'International Driving Permit (if renting)', category: 'Documents', isPacked: false },
      { id: 'p-4', name: 'Comfortable slip-on walking shoes', category: 'Clothing', isPacked: true },
      { id: 'p-5', name: 'Lightweight layers / Cardigan for evenings', category: 'Clothing', isPacked: true },
      { id: 'p-6', name: 'Rain jacket or packable umbrella', category: 'Clothing', isPacked: false },
      { id: 'p-7', name: 'Universal power adapter (Type A / B)', category: 'Electronics', isPacked: true },
      { id: 'p-8', name: 'High-capacity power bank (10,000mAh+)', category: 'Electronics', isPacked: true },
      { id: 'p-9', name: 'Pocket WiFi unit / e-SIM activation QR', category: 'Electronics', isPacked: false },
      { id: 'p-10', name: 'Blister bandages & pain relief meds', category: 'Medical essentials', isPacked: true },
      { id: 'p-11', name: 'Hand sanitizer & pocket tissues', category: 'Toiletries', isPacked: true },
      { id: 'p-12', name: 'Quick-dry small hand towel (restrooms lack dryers)', category: 'Activity-specific', isPacked: false }
    ],
    documents: [
      { id: 'doc-1', title: 'Passport (Validity > 6 months)', category: 'Passport', isCompleted: true, expiryDate: '2029-04-10' },
      { id: 'doc-2', title: 'Visit Japan Web QR code (Customs/Immigration)', category: 'Visa', isCompleted: true },
      { id: 'doc-3', title: 'All Nippon Airways Roundtrip E-Tickets', category: 'Tickets', isCompleted: true },
      { id: 'doc-4', title: 'Hotel Gracery Shinjuku Confirmation #TYO-9821', category: 'Hotel confirmation', isCompleted: true },
      { id: 'doc-5', title: 'Allianz Comprehensive Travel Insurance Policy', category: 'Travel insurance', isCompleted: true },
      { id: 'doc-6', title: 'Credit Cards with zero foreign transaction fees', category: 'Currency', isCompleted: true }
    ],
    status: 'Upcoming',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-15T14:30:00Z'
  },
  {
    id: 'trip-paris-02',
    title: 'Parisian Art, Gastronomy & Seine Romance',
    destination: 'Paris, France',
    city: 'Paris',
    country: 'France',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-11-05',
    endDate: '2026-11-09',
    durationDays: 4,
    travelers: { adults: 2, children: 0, infants: 0 },
    budgetTier: 'Premium',
    customBudgetTotal: 3200,
    travelStyle: 'Romantic',
    interests: ['Culture', 'Food', 'Architecture', 'Museums', 'Photography'],
    preferences: {
      vegetarian: false,
      dietaryRestrictions: 'None',
      accessibility: false,
      preferredTransportation: 'Metro/Train',
      hotelPreference: 'Boutique hotel in Saint-Germain or Le Marais',
      walkingTolerance: 'Moderate',
      schedulePace: 'Balanced'
    },
    overview: {
      tagline: '4 days of world-class impressionist art, bistro terraces, and moonlit river strolls',
      summary: 'Delight in Paris at an unhurried romantic pace, savoring croissant breakfasts, secret courtyards, Louvre masterpieces, and champagne along the Seine.',
      bestTimeToVisit: 'April to June and September to November',
      currency: 'EUR (Euro / 1 USD ≈ 0.92 EUR)',
      language: 'French (Saying "Bonjour" before speaking is appreciated)',
      timeZone: 'CET (UTC+1)',
      localEtiquette: [
        'Always greet shopkeepers and waitstaff with "Bonjour Madame/Monsieur"',
        'Ask for the bill ("L\'addition s\'il vous plaît") as servers let you linger',
        'Dress smart-casual when dining out in the evening'
      ],
      safetyTips: [
        'Watch for pickpockets around Eiffel Tower, Montmartre, and crowded metro lines',
        'Avoid petition signers and shell-game hustlers on the street'
      ],
      packingTips: [
        'Stylish walking sneakers or ankle boots',
        'Wool trench coat or warm jacket for November evenings',
        'Crossbody bag with secure zip closures'
      ]
    },
    days: [
      {
        dayNumber: 1,
        date: '2026-11-05',
        title: 'Saint-Germain Cafes & River Sunset',
        theme: 'Latin Quarter & Seine Banks',
        highlights: ['Cafe de Flore', 'Jardin du Luxembourg', 'Seine River Cruise'],
        estimatedDailyCost: 140,
        weatherForecast: {
          tempC: 14,
          tempF: 57,
          condition: 'Crisp & Overcast',
          rainProbability: 20,
          icon: 'Cloud',
          windSpeed: '12 km/h',
          sunrise: '07:38',
          sunset: '17:22'
        },
        activities: [
          {
            id: 'act-p-1',
            time: '10:30',
            title: 'Croissants & Espresso at Café de Flore',
            location: 'Boulevard Saint-Germain',
            duration: '1 hour',
            estimatedCost: 22,
            distanceFromPrevious: '0 km',
            transportMethod: 'Walk',
            shortDescription: 'Historic literary cafe where Hemingway, Sartre, and Simone de Beauvoir gathered.',
            category: 'food',
            coordinates: { lat: 48.8543, lng: 2.3326 },
            rating: 4.5,
            indoorOutdoor: 'mixed'
          },
          {
            id: 'act-p-2',
            time: '12:00',
            title: 'Stroll Through Jardin du Luxembourg',
            location: 'Luxembourg Gardens, 6th Arr.',
            duration: '1h 30m',
            estimatedCost: 0,
            distanceFromPrevious: '0.6 km',
            transportMethod: 'Walk',
            shortDescription: 'Walk under manicured chestnut trees past the Medici Fountain and miniature sailboats on the grand basin.',
            category: 'nature',
            coordinates: { lat: 48.8462, lng: 2.3371 },
            rating: 4.88,
            indoorOutdoor: 'outdoor'
          },
          {
            id: 'act-p-3',
            time: '17:30',
            title: 'Sunset Seine River Cruise with Champagne',
            location: 'Pont de l\'Alma Pier',
            duration: '1h 15m',
            estimatedCost: 35,
            distanceFromPrevious: '2.8 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Gliding past the illuminated Notre-Dame, Musée d’Orsay, and the sparkling Eiffel Tower from the water.',
            category: 'sightseeing',
            coordinates: { lat: 48.8637, lng: 2.3023 },
            rating: 4.9,
            bookingRecommended: true,
            indoorOutdoor: 'outdoor'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-11-06',
        title: 'Louvre Masterpieces & Le Marais Chic',
        theme: 'Fine Arts & Historic Boutiques',
        highlights: ['Musée du Louvre', 'Place des Vosges', 'Bistro Beef Bourguignon'],
        estimatedDailyCost: 175,
        weatherForecast: {
          tempC: 13,
          tempF: 55,
          condition: 'Light Showers',
          rainProbability: 55,
          icon: 'CloudRain',
          windSpeed: '16 km/h',
          sunrise: '07:40',
          sunset: '17:20'
        },
        activities: [
          {
            id: 'act-p-4',
            time: '09:00',
            title: 'Early Access Guided Louvre Tour',
            location: 'Louvre Pyramid Courtyard',
            duration: '3 hours',
            estimatedCost: 38,
            distanceFromPrevious: '0 km',
            transportMethod: 'Metro/Train',
            shortDescription: 'Beat crowds to view Mona Lisa, Venus de Milo, Winged Victory, and grand French master galleries.',
            category: 'culture',
            coordinates: { lat: 48.8606, lng: 2.3376 },
            rating: 4.92,
            indoorOutdoor: 'indoor'
          },
          {
            id: 'act-p-5',
            time: '13:00',
            title: 'Artisan Pastries & Falafel at L\'As du Fallafel',
            location: 'Rue des Rosiers, Le Marais',
            duration: '1 hour',
            estimatedCost: 16,
            distanceFromPrevious: '1.4 km',
            transportMethod: 'Walk',
            shortDescription: 'Legendary pita packed with fried eggplant, golden chickpea balls, and tangy tahini.',
            category: 'food',
            coordinates: { lat: 48.8575, lng: 2.3592 },
            rating: 4.7,
            indoorOutdoor: 'indoor'
          }
        ]
      }
    ],
    accommodations: [
      {
        id: 'acc-paris-1',
        name: 'Hôtel Fabric Paris',
        type: 'Boutique',
        location: '11th Arrondissement, Oberkampf, Paris',
        neighborhood: 'Bastille / Oberkampf',
        pricePerNight: 230,
        currency: 'USD',
        rating: 4.9,
        reviewsCount: 1120,
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        amenities: ['Spa with Steam Bath', 'Honesty Bar', 'French Breakfast Buffet', 'Designer Interior'],
        distanceFromCenter: '1.2 km from Le Marais',
        coordinates: { lat: 48.8624, lng: 2.3737 },
        badge: 'Top Romantic Choice'
      }
    ],
    foodRecommendations: [
      {
        id: 'rest-p-1',
        name: 'Le Comptoir du Relais',
        cuisine: 'Classic French Bistro',
        priceRange: '$$$',
        rating: 4.8,
        location: 'Saint-Germain-des-Prés',
        description: 'Chef Yves Camdeborde’s quintessential French bistro serving rich terrines, roasted duck breast, and crème brûlée.',
        specialtyDishes: ['Canard Confit', 'Foie Gras Terrine', 'Grand Marnier Soufflé'],
        dietaryTags: ['Classic Dining', 'Wine Pairings'],
        imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        vibe: 'Cozy, bustling vintage bistro'
      }
    ],
    budgetItems: [
      { id: 'bp-1', category: 'Flights', title: 'Air France Flights (2 tickets)', estimatedCost: 1400, actualCost: 1350, isPaid: true },
      { id: 'bp-2', category: 'Accommodation', title: 'Boutique Hotel 4 Nights', estimatedCost: 920, actualCost: 920, isPaid: true },
      { id: 'bp-3', category: 'Food', title: 'Bistros, Wine & Cafes', estimatedCost: 550, actualCost: 180, isPaid: false },
      { id: 'bp-4', category: 'Activities', title: 'Museum Passes & River Cruise', estimatedCost: 160, actualCost: 140, isPaid: true }
    ],
    packingList: [
      { id: 'pp-1', name: 'Passport & Schengen Travel Insurance', category: 'Documents', isPacked: true },
      { id: 'pp-2', name: 'Warm wool scarf & stylish overcoat', category: 'Clothing', isPacked: true },
      { id: 'pp-3', name: 'Comfortable leather walking shoes', category: 'Clothing', isPacked: false }
    ],
    documents: [
      { id: 'pdoc-1', title: 'Passport (Valid to 2028)', category: 'Passport', isCompleted: true },
      { id: 'pdoc-2', title: 'Paris Museum Pass QR Voucher', category: 'Tickets', isCompleted: true }
    ],
    status: 'Upcoming',
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-12T11:00:00Z'
  },
  {
    id: 'trip-bali-03',
    title: 'Bali Soul Sanctuary & Coastal Sunset Surf',
    destination: 'Bali, Indonesia',
    city: 'Ubud & Seminyak',
    country: 'Indonesia',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-07-10',
    endDate: '2026-07-16',
    durationDays: 6,
    travelers: { adults: 2, children: 1, infants: 0 },
    budgetTier: 'Moderate',
    customBudgetTotal: 1800,
    travelStyle: 'Relaxed',
    interests: ['Nature', 'Culture', 'Beaches', 'Food', 'Photography'],
    preferences: {
      vegetarian: true,
      dietaryRestrictions: 'Vegetarian friendly',
      accessibility: false,
      preferredTransportation: 'Private Driver',
      hotelPreference: 'Eco-villa with infinity pool',
      walkingTolerance: 'Moderate',
      schedulePace: 'Balanced'
    },
    overview: {
      tagline: '6 tranquil days of jungle waterfalls, sacred rice terraces, and clifftop sunsets',
      summary: 'Recharge your spirit amidst Ubud’s lush rainforests and spiritual temples before unwinding on the golden sandy beaches of southern Bali.',
      bestTimeToVisit: 'April to October (Dry season)',
      currency: 'IDR (Indonesian Rupiah / 1 USD ≈ 15,800 IDR)',
      language: 'Indonesian & Balinese (English widely spoken)',
      timeZone: 'WITA (UTC+8)',
      localEtiquette: [
        'Wear a sarong and sash when visiting Hindu temples (often provided at entrance)',
        'Do not step on daily canang sari floral street offerings',
        'Use right hand when handing over money or items'
      ],
      safetyTips: [
        'Drink bottled or filtered water only',
        'Watch belongings around cheeky monkeys at Ubud Monkey Forest'
      ],
      packingTips: [
        'Biodegradable reef-safe sunscreen and mosquito repellent',
        'Breathable linen shirts and cotton clothing',
        'Sturdy sandals for waterfall steps'
      ]
    },
    days: [
      {
        dayNumber: 1,
        date: '2026-07-10',
        title: 'Arrival & Ubud Jungle Check-in',
        theme: 'Tropical Welcome',
        highlights: ['Private Villa Check-in', 'Campuhan Ridge Walk', 'Organic Balinese Dinner'],
        estimatedDailyCost: 65,
        weatherForecast: {
          tempC: 28,
          tempF: 82,
          condition: 'Tropical Sunshine',
          rainProbability: 10,
          icon: 'Sun',
          windSpeed: '8 km/h',
          sunrise: '06:28',
          sunset: '18:14'
        },
        activities: [
          {
            id: 'act-b-1',
            time: '14:00',
            title: 'Check-in to Bambu Indah Eco-Resort',
            location: 'Sayan, Ubud',
            duration: '2 hours',
            estimatedCost: 0,
            distanceFromPrevious: '0 km',
            transportMethod: 'Taxi/Rideshare',
            shortDescription: 'Settling into sustainable antique teak villas perched above the sacred Ayung River valley.',
            category: 'accommodation',
            coordinates: { lat: -8.5028, lng: 115.2443 },
            rating: 4.95,
            indoorOutdoor: 'mixed'
          },
          {
            id: 'act-b-2',
            time: '16:30',
            title: 'Campuhan Ridge Golden Hour Walk',
            location: 'Campuhan Ridge Trail, Ubud',
            duration: '1h 30m',
            estimatedCost: 0,
            distanceFromPrevious: '2.5 km',
            transportMethod: 'Walk',
            shortDescription: 'Gentle elevated hill pathway through undulating elephant grass with sweeping canyon vistas.',
            category: 'nature',
            coordinates: { lat: -8.5034, lng: 115.2536 },
            rating: 4.8,
            indoorOutdoor: 'outdoor'
          }
        ]
      }
    ],
    accommodations: [
      {
        id: 'acc-bali-1',
        name: 'Bambu Indah Eco Luxury Resort',
        type: 'Villa',
        location: 'Sayan, Ubud, Bali',
        neighborhood: 'Ayung River Valley',
        pricePerNight: 185,
        currency: 'USD',
        rating: 4.95,
        reviewsCount: 940,
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        amenities: ['Natural Spring Swimming Pools', 'Farm-to-Table Organic Restaurant', 'Open-Air Yoga Pavilion', 'River Spa'],
        distanceFromCenter: '3.5 km from Ubud Center',
        coordinates: { lat: -8.5028, lng: 115.2443 },
        badge: 'Eco-Luxury Wonder'
      }
    ],
    foodRecommendations: [
      {
        id: 'rest-b-1',
        name: 'Moksa Ubud Plant-based Cuisine',
        cuisine: 'Organic Vegan & Balinese',
        priceRange: '$$',
        rating: 4.9,
        location: 'Sayan, Ubud',
        description: 'Set within its own permaculture garden, serving raw vegan lasagnas, tempeh bowls, and fresh cold-pressed tonics.',
        specialtyDishes: ['Moksa Sampler', 'Balinese Jackfruit Curry', 'Raw Cacao Tart'],
        dietaryTags: ['100% Vegan', 'Gluten-Free', 'Farm-to-Table'],
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        vibe: 'Peaceful garden sanctuary'
      }
    ],
    budgetItems: [
      { id: 'bb-1', category: 'Flights', title: 'Roundtrip Flights to Denpasar', estimatedCost: 850, actualCost: 810, isPaid: true },
      { id: 'bb-2', category: 'Accommodation', title: 'Ubud Villa 6 Nights', estimatedCost: 720, actualCost: 700, isPaid: true },
      { id: 'bb-3', category: 'Transportation', title: 'Private Driver for 5 Days', estimatedCost: 200, actualCost: 190, isPaid: true }
    ],
    packingList: [
      { id: 'bp-1', name: 'Passport with 6+ months validity', category: 'Documents', isPacked: true },
      { id: 'bp-2', name: 'Lightweight linen shirts & shorts', category: 'Clothing', isPacked: true },
      { id: 'bp-3', name: 'Swimsuits & rashguards', category: 'Clothing', isPacked: true }
    ],
    documents: [
      { id: 'bdoc-1', title: 'Indonesia e-VOA (Visa on Arrival)', category: 'Visa', isCompleted: true },
      { id: 'bdoc-2', title: 'Electronic Customs Declaration QR Code', category: 'Important documents', isCompleted: true }
    ],
    status: 'Upcoming',
    createdAt: '2026-09-08T15:00:00Z',
    updatedAt: '2026-09-14T10:00:00Z'
  }
];
