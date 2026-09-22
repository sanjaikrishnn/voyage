import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@voyager.travel');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    setTimeout(async () => {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'signup') {
        await signup(name, email, password);
        onClose();
      } else {
        setSuccessMessage(`Password recovery link sent to ${email}`);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3 border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">
            {mode === 'login' && 'Welcome Back to Voyager'}
            {mode === 'signup' && 'Create Your Traveler Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            {mode === 'login' && 'Sync your personalized AI itineraries and saved trips'}
            {mode === 'signup' && 'Unlock AI trip planning, cloud syncing, and custom budgets'}
            {mode === 'forgot' && "Enter your email and we'll send a secure login link"}
          </p>
        </div>

        {successMessage ? (
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-teal-600 mx-auto" />
            <p className="text-sm font-semibold text-teal-900 dark:text-teal-200">{successMessage}</p>
            <button
              onClick={() => setMode('login')}
              className="text-xs font-semibold text-teal-600 underline pt-2"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  placeholder="traveler@example.com"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-md shadow-teal-600/25 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Free Account'}
                    {mode === 'forgot' && 'Send Recovery Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Toggle Mode */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-center text-xs text-gray-500 dark:text-zinc-400">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
