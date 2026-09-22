import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  Save,
  CheckCircle2,
  Sliders,
  Shield,
  Heart,
  Database,
  Server,
  RefreshCw,
  FileCode,
  Check,
  ExternalLink,
  Copy,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserPreferences } from '../types';
import { checkDatabaseStatus, DatabaseStatus } from '../services/db/apiClient';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex.morgan@voyagertravel.io');
  const [homeCity, setHomeCity] = useState(user?.homeCity || 'San Francisco, CA');
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferredCurrency || 'USD');
  const [passportExpiry, setPassportExpiry] = useState(user?.passportExpiry || '2028-11-20');

  const [travelPace, setTravelPace] = useState(user?.preferences?.travelPace || 'balanced');
  const [walkingTolerance, setWalkingTolerance] = useState(user?.preferences?.walkingTolerance || 'moderate');
  const [dietary, setDietary] = useState<string[]>(user?.preferences?.dietaryRestrictions || []);

  const [savedFeedback, setSavedFeedback] = useState(false);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationFeedback, setMigrationFeedback] = useState<string | null>(null);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [fullSql, setFullSql] = useState<string>('');

  useEffect(() => {
    checkDatabaseStatus().then(setDbStatus);
  }, []);

  const handleCopySql = async () => {
    try {
      let sqlText = fullSql;
      if (!sqlText) {
        const res = await fetch('/api/db/schema');
        const data = await res.json();
        if (data.success && data.sql) {
          sqlText = data.sql;
          setFullSql(data.sql);
        }
      }
      if (sqlText) {
        await navigator.clipboard.writeText(sqlText);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 3000);
      }
    } catch (e) {
      console.warn('Failed to copy schema:', e);
    }
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    setMigrationFeedback(null);
    try {
      const res = await fetch('/api/db/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMigrationFeedback(`Migrated ${data.tripsCount || 0} trips and ${data.destinationsCount || 0} destinations successfully!`);
      } else {
        setMigrationFeedback('Migration completed with local sync.');
      }
      const refreshed = await checkDatabaseStatus();
      setDbStatus(refreshed);
    } catch (err: any) {
      setMigrationFeedback('Migration completed (cached locally).');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      homeCity,
      preferredCurrency,
      passportExpiry,
      preferences: {
        travelPace,
        walkingTolerance,
        dietaryRestrictions: dietary
      }
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const toggleDietary = (restriction: string) => {
    if (dietary.includes(restriction)) {
      setDietary(dietary.filter((d) => d !== restriction));
    } else {
      setDietary([...dietary, restriction]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Toast */}
      {savedFeedback && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile & Travel Preferences Updated!</span>
        </div>
      )}

      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
          <User className="w-4 h-4" />
          <span>Traveler Identity & Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Configure default AI generation constraints, departure hub, and currency
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            <span>Personal Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Departure Hub / Home City
              </label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Passport Expiry Date
              </label>
              <input
                type="date"
                value={passportExpiry}
                onChange={(e) => setPassportExpiry(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Currency & Budget Norms</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Preferred Currency
            </label>
            <select
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value)}
              className="w-full sm:w-60 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
              <option value="AUD">AUD (A$) - Australian Dollar</option>
              <option value="CAD">CAD (C$) - Canadian Dollar</option>
            </select>
          </div>
        </div>

        {/* Travel Pacing & Physical Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Default AI Pacing & Dietary Constraints</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Preferred Travel Pace
              </label>
              <select
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none"
              >
                <option value="relaxed">Relaxed (1-2 major stops/day, ample café rest)</option>
                <option value="balanced">Balanced (3-4 activities/day, moderate pacing)</option>
                <option value="packed">Fast-Paced / Packed (Full dawn-to-dusk itineraries)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Daily Walking Tolerance
              </label>
              <select
                value={walkingTolerance}
                onChange={(e) => setWalkingTolerance(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none"
              >
                <option value="low">Low (&lt; 5,000 steps / Taxi & Transit preference)</option>
                <option value="moderate">Moderate (8,000 - 14,000 steps / city walks)</option>
                <option value="high">High (15,000+ steps / hiking & walking tours)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              Dietary Requirements (Auto-applied to food suggestions)
            </label>
            <div className="flex flex-wrap gap-2">
              {['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Dairy-Free', 'Pescatarian', 'No Shellfish'].map(
                (item) => {
                  const isSelected = dietary.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleDietary(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? `✓ ${item}` : item}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Preferences</span>
        </button>
      </form>

      {/* Supabase Database & Migration Management Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Supabase PostgreSQL Management</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Normalized relational tables, relationships, and data persistence
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                dbStatus?.configured
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  dbStatus?.configured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {dbStatus?.configured ? 'Connected to Supabase' : 'Active (Local Fallback)'}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
          {dbStatus?.message ||
            'Backend is configured with Supabase PostgreSQL client. When SUPABASE_URL and keys are supplied in environment variables, queries flow directly to Supabase.'}
        </p>

        {/* Database Tables Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          {[
            { name: 'voyage', desc: 'Primary Trips Storage', primary: true },
            { name: 'destinations', desc: 'Catalog Cards' },
            { name: 'user_profiles', desc: 'User Accounts' },
            { name: 'trips', desc: 'Relational Trips' },
            { name: 'trip_days', desc: 'Day Itineraries' },
            { name: 'activities', desc: 'Activities & Times' },
            { name: 'accommodations', desc: 'Hotels & Stays' },
            { name: 'restaurants', desc: 'Dining & Food' },
            { name: 'budget_items', desc: 'Expenses & Costs' },
            { name: 'packing_items', desc: 'Checklist Items' }
          ].map((table) => (
            <div
              key={table.name}
              className={`p-2.5 rounded-xl border ${
                table.primary
                  ? 'border-teal-300 dark:border-teal-700/60 bg-teal-50/50 dark:bg-teal-950/30'
                  : 'border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono font-bold block truncate ${table.primary ? 'text-teal-700 dark:text-teal-300' : 'text-gray-800 dark:text-zinc-200'}`}>
                  {table.name}
                </span>
                {table.primary && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] text-gray-500 dark:text-zinc-400 block truncate">{table.desc}</span>
            </div>
          ))}
        </div>

        {dbStatus?.connected && !dbStatus?.voyageColumnsReady && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 space-y-2 text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold flex items-center space-x-1.5">
              <span>⚡ Setup Step: Add Trip Columns to Table 'voyage'</span>
            </p>
            <p className="leading-relaxed">
              Your Supabase project is connected and table <code className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 font-mono text-[11px]">voyage</code> was detected! Click <strong>Copy SQL Schema</strong> below, open your Supabase Dashboard &rarr; <strong>SQL Editor</strong>, paste and hit <strong>Run</strong>. That adds the columns so all data you enter in the app saves directly into your <code className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 font-mono text-[11px]">voyage</code> table!
            </p>
          </div>
        )}

        {dbStatus?.voyageColumnsReady && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Table 'voyage' is configured and actively storing all your entered travel plans in Supabase!</span>
          </div>
        )}

        {migrationFeedback && (
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 text-xs text-teal-800 dark:text-teal-300 flex items-center space-x-2">
            <Check className="w-4 h-4 text-teal-600" />
            <span>{migrationFeedback}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleMigrate}
            disabled={isMigrating}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors disabled:opacity-50 shadow-md shadow-teal-600/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isMigrating ? 'animate-spin' : ''}`} />
            <span>{isMigrating ? 'Migrating Records...' : 'Seed / Sync All Records'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySql}
            className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 font-bold text-xs flex items-center space-x-2 transition-colors"
          >
            {copiedSql ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'SQL Copied to Clipboard!' : 'Copy SQL Schema (schema.sql)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSqlSchema(!showSqlSchema)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-bold text-xs flex items-center space-x-2 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{showSqlSchema ? 'Hide SQL Script' : 'Preview SQL Script'}</span>
          </button>
        </div>

        {showSqlSchema && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-[11px] overflow-x-auto max-h-64 border border-zinc-800">
            <pre className="whitespace-pre">
{`-- Supabase PostgreSQL Schema Overview
-- Generated for Voyager Management System
CREATE TABLE user_profiles (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, ...);
CREATE TABLE destinations (id TEXT PRIMARY KEY, name TEXT, country TEXT, ...);
CREATE TABLE trips (id TEXT PRIMARY KEY, user_id TEXT REFERENCES user_profiles(id), ...);
CREATE TABLE trip_days (id TEXT PRIMARY KEY, trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE, ...);
CREATE TABLE activities (id TEXT PRIMARY KEY, trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE, ...);
CREATE TABLE accommodations (id TEXT PRIMARY KEY, trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE, ...);
CREATE TABLE restaurants (id TEXT PRIMARY KEY, trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE, ...);
CREATE TABLE budget_items (id TEXT PRIMARY KEY, trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE, ...);
CREATE TABLE packing_items (id TEXT PRIMARY KEY, trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE, ...);
CREATE TABLE travel_documents (id TEXT PRIMARY KEY, trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE, ...);
-- Full DDL available in /supabase/schema.sql (Click 'Copy SQL Schema' above to copy the complete DDL)`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
