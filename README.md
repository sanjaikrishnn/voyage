# Voyager AI Travel Planner App ✈️🌍

A modern, responsive Progressive Web App (PWA) for intelligent travel itinerary planning, real-time map exploration, budget management, and contextual AI travel concierging.

---

## 🌟 Key Features

- **AI Trip Planner**: Tailored multi-day travel itineraries based on destination, pace, interests, budget, and travel party.
- **Voyager AI Concierge**: Grounded chatbot with context from active trip itineraries and Supabase PostgreSQL.
- **Interactive Route Map**: Leaflet & OpenStreetMap geospatial route visualizer with day-by-day activity pins.
- **Financial & Expense Tracker**: Planned vs. actual spend tracking, category breakdown, and payment status.
- **Trip Tools Suite**: Hotels & accommodations, dining guides, weather forecast, packing checklists, and document lockers.
- **Progressive Web App (PWA)**:
  - Installable on Android, iOS Safari, and Desktop (Chrome/Edge).
  - Offline-first caching with Workbox for trip itineraries, fonts, and map tiles.
  - Adaptive maskable icons and standalone display mode.
- **Dual-Layer Persistence**: Real-time Supabase PostgreSQL cloud sync with graceful local browser fallback.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4, Lucide Icons, Motion.
- **Backend / API**: Express 4, Node.js, `esbuild` server bundling.
- **AI Engine**: `@google/genai` (Gemini 2.5 Flash via server-side proxy).
- **Database**: Supabase PostgreSQL (`@supabase/supabase-js`) with schema migration script (`supabase/schema.sql`).
- **PWA**: `vite-plugin-pwa`, Workbox, Web App Manifest.

---

## 📋 Environment Variables

Create a `.env` file in the root directory modeled after `.env.example`:

```bash
# Gemini AI API Key (required for live AI generation & concierge chat)
GEMINI_API_KEY="your-gemini-api-key"

# Port (defaults to 3000 if not specified)
PORT=3000

# Application Host URL (used for absolute callbacks and links)
APP_URL="http://localhost:3000"

# Supabase PostgreSQL Configuration (optional; local persistence fallback active if omitted)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development Mode

```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 3. Build for Production

```bash
npm run build
```
This builds both:
1. The client SPA bundle with Vite into `/dist`
2. The Node.js Express server bundle into `/dist/server.cjs`

### 4. Start Production Server

```bash
npm start
```

---

## 🗄️ Database Setup (Supabase)

To connect your Supabase database:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy and run the SQL migration script located in:
   ```
   supabase/schema.sql
   ```
4. Copy your **Project URL** and **API Keys** into your production environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

---

## 🌐 Production Deployment Guides

### Option 1: Render / Railway / Fly.io

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: `>= 18.x`
- **Environment Variables**: Set `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NODE_ENV=production`.

### Option 2: Docker Container / Google Cloud Run

Build and run using the included `Dockerfile`:

```bash
# Build the Docker image
docker build -t voyager-app .

# Run container on port 3000
docker run -p 3000:3000 \
  -e GEMINI_API_KEY="your_key" \
  -e SUPABASE_URL="your_url" \
  -e SUPABASE_ANON_KEY="your_anon_key" \
  voyager-app
```

---

## 🔒 Security Best Practices

- All AI prompts and database credentials run exclusively on the server side (`/server.ts`).
- No API keys or service role secrets are bundled into client-side assets.
- Input validation and sanitized payloads on all Express `/api/*` endpoints.
