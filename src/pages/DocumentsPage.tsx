import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Plane,
  Hotel,
  CreditCard,
  CheckSquare,
  Square,
  ExternalLink
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export const DocumentsPage: React.FC = () => {
  const { activeTrip, toggleDocumentItem } = useTrip();
  const { user } = useAuth();

  const documents = activeTrip.documents || [];
  const completedCount = documents.filter((d) => d.isCompleted).length;
  const totalCount = documents.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Border & Safety Readiness</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
            Travel Documents & Clearances
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Essential entry requirements and pre-flight checks for {activeTrip.country || activeTrip.destination}
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center space-x-3">
          <span className="text-xs font-bold text-gray-500">Readiness:</span>
          <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
            {completedCount} / {totalCount} Verified ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Passport Validity Advisory Card */}
      <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start space-x-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <h4 className="font-bold text-amber-900 dark:text-amber-200">
            International 6-Month Passport Rule Reminder
          </h4>
          <p className="text-amber-800/90 dark:text-amber-300/80">
            Most international customs authorities (including Japan, Schengen Area, and Southeast Asia) mandate that your passport remain valid for at least 6 months beyond your scheduled return date ({activeTrip.endDate}).
            {user?.passportExpiry && ` Your recorded expiry is ${user.passportExpiry}.`}
          </p>
        </div>
      </div>

      {/* Documents Grid Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => toggleDocumentItem(doc.id)}
            className={`p-5 rounded-2xl border cursor-pointer select-none transition-all flex items-start space-x-3.5 ${
              doc.isCompleted
                ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                : 'border-gray-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-teal-300 dark:hover:border-teal-700'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-teal-600 dark:text-teal-400 shrink-0"
            >
              {doc.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${
                  doc.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'
                }`}>
                  {doc.title}
                </h4>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  doc.isCompleted
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                    : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                }`}>
                  {doc.isCompleted ? 'Verified' : 'Pending Action'}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                {doc.notes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
