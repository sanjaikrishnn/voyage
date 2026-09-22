import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Shirt,
  Smartphone,
  FileText,
  HeartPulse,
  Sparkle,
  Compass
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { PackingItem } from '../types';

export const PackingPage: React.FC = () => {
  const { activeTrip, togglePackingItem, addPackingItem, deletePackingItem } = useTrip();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('Clothing');

  const items = activeTrip.packingList || [];
  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addPackingItem(newItemName.trim(), newItemCategory);
    setNewItemName('');
  };

  const getCategoryIcon = (cat: PackingItem['category']) => {
    switch (cat) {
      case 'Clothing':
        return <Shirt className="w-4 h-4 text-sky-500" />;
      case 'Electronics':
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'Documents':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'Toiletries':
        return <Sparkles className="w-4 h-4 text-pink-500" />;
      case 'Medical essentials':
        return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'Activity-specific':
      default:
        return <Compass className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>AI Gear & Packing Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
            Packing List for {activeTrip.city || activeTrip.destination}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Calibrated for {activeTrip.durationDays} days of {activeTrip.travelStyle} travel
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Packed Status</span>
            <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
              {packedCount} / {totalCount} Items ({progressPercent}%)
            </span>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-gray-100 dark:border-zinc-800 flex items-center justify-center relative">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-200 dark:text-zinc-800"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="138"
                strokeDashoffset={138 - (138 * progressPercent) / 100}
                strokeLinecap="round"
                className="text-teal-500 transition-all duration-500"
                fill="none"
              />
            </svg>
            <span className="absolute text-[11px] font-extrabold font-mono text-gray-900 dark:text-white">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Add Custom Item Bar */}
      <form
        onSubmit={handleAddItem}
        className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center gap-3"
      >
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add custom item (e.g. Travel adapter, Noise-canceling headphones)..."
          className="flex-1 w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/60 dark:bg-zinc-800/60 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as any)}
          className="w-full sm:w-48 px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 focus:outline-none"
        >
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Toiletries">Toiletries</option>
          <option value="Medical essentials">Medical</option>
          <option value="Activity-specific">Specialty / Gear</option>
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </form>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'Clothing', label: 'Clothing' },
          { id: 'Electronics', label: 'Electronics' },
          { id: 'Documents', label: 'Documents' },
          { id: 'Toiletries', label: 'Toiletries' },
          { id: 'Medical essentials', label: 'Medical' },
          { id: 'Activity-specific', label: 'Activity Gear' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeCategory === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => togglePackingItem(item.id)}
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer select-none transition-all ${
              item.isPacked
                ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-gray-400 dark:text-zinc-500 line-through'
                : 'border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-teal-300 dark:hover:border-teal-700 text-gray-800 dark:text-zinc-200'
            }`}
          >
            <div className="flex items-center space-x-3 truncate mr-2">
              <button
                type="button"
                className="shrink-0 text-teal-600 dark:text-teal-400"
                aria-label="Toggle item packed"
              >
                {item.isPacked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </button>

              <div className="flex items-center space-x-2 truncate">
                {getCategoryIcon(item.category)}
                <span className="font-medium truncate">{item.name}</span>
              </div>
            </div>

            {item.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePackingItem(item.id);
                }}
                className="p-1 text-gray-400 hover:text-rose-500 shrink-0"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
