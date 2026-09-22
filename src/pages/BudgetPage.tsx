import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  AlertCircle,
  PieChart,
  CheckCircle2,
  X,
  CreditCard,
  Plane,
  Hotel,
  Utensils,
  Car,
  Compass,
  ShoppingBag,
  ShieldAlert
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { BudgetItem, BudgetCategory } from '../types';

export const BudgetPage: React.FC = () => {
  const { activeTrip, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useTrip();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // New item form state
  const [category, setCategory] = useState<BudgetCategory>('food');
  const [title, setTitle] = useState('');
  const [plannedAmount, setPlannedAmount] = useState<number>(50);
  const [actualAmount, setActualAmount] = useState<number>(0);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Totals calculations
  const totalPlanned = activeTrip.budgetItems.reduce((acc, item) => acc + item.plannedAmount, 0);
  const totalActual = activeTrip.budgetItems.reduce((acc, item) => acc + item.actualAmount, 0);
  const targetBudget = activeTrip.estimatedTotalCost || totalPlanned || 2000;
  const remainingBudget = Math.max(0, targetBudget - totalActual);
  const percentUsed = Math.min(100, Math.round((totalActual / targetBudget) * 100));

  // Category aggregations
  const categoryTotals = activeTrip.budgetItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { planned: 0, actual: 0 };
    }
    acc[item.category].planned += item.plannedAmount;
    acc[item.category].actual += item.actualAmount;
    return acc;
  }, {} as Record<BudgetCategory, { planned: number; actual: number }>);

  const getCategoryIcon = (cat: BudgetCategory) => {
    switch (cat) {
      case 'flights':
        return <Plane className="w-4 h-4 text-sky-500" />;
      case 'accommodation':
        return <Hotel className="w-4 h-4 text-indigo-500" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'transport':
        return <Car className="w-4 h-4 text-teal-500" />;
      case 'activities':
        return <Compass className="w-4 h-4 text-emerald-500" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      case 'misc':
      default:
        return <ShieldAlert className="w-4 h-4 text-purple-500" />;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addBudgetItem({
      category,
      title: title.trim(),
      plannedAmount,
      actualAmount,
      isPaid
    });
    setIsAddModalOpen(false);
    setTitle('');
    setPlannedAmount(50);
    setActualAmount(0);
    setIsPaid(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateBudgetItem(editingItem.id, editingItem);
    setEditingItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Trip Budget & Expense Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
            {activeTrip.city || activeTrip.destination} Expenses
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-4 py-3 sm:py-2.5 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Target Budget
          </span>
          <p className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            ${targetBudget.toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">
            ${Math.round(targetBudget / activeTrip.durationDays)} / day avg
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Total Planned
          </span>
          <p className="text-lg sm:text-2xl font-extrabold text-teal-600 dark:text-teal-400">
            ${totalPlanned.toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">
            Scheduled across {activeTrip.budgetItems.length} lines
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Actual Spent
          </span>
          <p className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            ${totalActual.toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">
            {percentUsed}% of target utilized
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Remaining Funds
          </span>
          <p className="text-lg sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ${remainingBudget.toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1">
            Available for activities & dining
          </p>
        </div>
      </div>

      {/* Progress & Category Distribution */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-6 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-gray-700 dark:text-zinc-300">Overall Budget Consumption</span>
            <span className="text-teal-600 dark:text-teal-400">{percentUsed}% spent</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                percentUsed > 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown Horizontal Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {(['accommodation', 'food', 'activities', 'transport'] as BudgetCategory[]).map((cat) => {
            const data = categoryTotals[cat] || { planned: 0, actual: 0 };
            const catPercent = totalPlanned > 0 ? Math.round((data.planned / totalPlanned) * 100) : 0;
            return (
              <div
                key={cat}
                className="p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(cat)}
                    <span className="text-xs font-bold capitalize text-gray-800 dark:text-zinc-200">
                      {cat}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                    ${data.actual} / ${data.planned}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, (data.actual / Math.max(1, data.planned)) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-between">
                  <span>{catPercent}% of total plan</span>
                  <span>{data.actual >= data.planned ? 'Cap reached' : 'Under cap'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Expense Table (Desktop & Tablet) & Cards (Mobile) */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Expense Breakdown & Tracking
          </h3>
          <span className="text-xs text-gray-400">
            {activeTrip.budgetItems.length} listed items
          </span>
        </div>

        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-gray-100 dark:divide-zinc-800">
          {activeTrip.budgetItems.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => updateBudgetItem(item.id, { isPaid: !item.isPaid })}
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 min-h-[32px] active:scale-95 transition-all ${
                    item.isPaid
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.isPaid ? 'Paid' : 'Unpaid'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs bg-gray-50/80 dark:bg-zinc-800/50 p-2.5 rounded-xl">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase block">Planned</span>
                  <span className="font-mono font-medium text-gray-700 dark:text-zinc-300">
                    ${item.plannedAmount}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] uppercase block">Actual Spent</span>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                    ${item.actualAmount}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingItem(item)}
                  className="px-3 py-2 min-h-[40px] rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-zinc-300 flex items-center space-x-1.5 active:bg-gray-100 dark:active:bg-zinc-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteBudgetItem(item.id)}
                  className="px-3 py-2 min-h-[40px] rounded-lg border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-1.5 active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop & Tablet View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Item & Category</th>
                <th className="py-3 px-4">Planned</th>
                <th className="py-3 px-4">Actual Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {activeTrip.budgetItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      {getCategoryIcon(item.category)}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-gray-700 dark:text-zinc-300">
                    ${item.plannedAmount}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                    ${item.actualAmount}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateBudgetItem(item.id, { isPaid: !item.isPaid })}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.isPaid
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.isPaid ? 'Paid' : 'Unpaid'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteBudgetItem(item.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Add New Expense
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Expense Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shinkansen Bullet Train Ticket"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BudgetCategory)}
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="accommodation">Accommodation</option>
                  <option value="food">Food & Dining</option>
                  <option value="flights">Flights & Rail</option>
                  <option value="transport">Local Transit & Taxis</option>
                  <option value="activities">Activities & Tours</option>
                  <option value="shopping">Shopping</option>
                  <option value="misc">Miscellaneous</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Planned ($)
                  </label>
                  <input
                    type="number"
                    value={plannedAmount}
                    onChange={(e) => setPlannedAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Actual Spent ($)
                  </label>
                  <input
                    type="number"
                    value={actualAmount}
                    onChange={(e) => setActualAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 pt-1 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-gray-700 dark:text-zinc-300">Mark as already paid</span>
              </label>

              <div className="pt-3 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-3 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs active:scale-95 transition-all"
                >
                  Save Expense
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 min-h-[44px] rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-600 dark:text-zinc-300 active:bg-gray-100 dark:active:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EXPENSE MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Edit Expense
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Planned ($)
                  </label>
                  <input
                    type="number"
                    value={editingItem.plannedAmount}
                    onChange={(e) => setEditingItem({ ...editingItem, plannedAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Actual Spent ($)
                  </label>
                  <input
                    type="number"
                    value={editingItem.actualAmount}
                    onChange={(e) => setEditingItem({ ...editingItem, actualAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-base sm:text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 pt-1 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.isPaid}
                  onChange={(e) => setEditingItem({ ...editingItem, isPaid: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span className="text-gray-700 dark:text-zinc-300">Mark as paid</span>
              </label>

              <div className="pt-3 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-3 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs active:scale-95 transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-3 min-h-[44px] rounded-xl border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-600 dark:text-zinc-300 active:bg-gray-100 dark:active:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
