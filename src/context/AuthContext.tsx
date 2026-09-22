import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { saveUserProfileToApi } from '../services/db/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleSavedDestination: (id: string) => void;
  isDestinationSaved: (id: string) => boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-01',
  name: 'Alex Rivera',
  email: 'alex.rivera@voyager.travel',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  homeCity: 'San Francisco, USA',
  preferredCurrency: 'USD',
  savedDestinations: ['tokyo-japan', 'santorini-greece', 'swiss-alps'],
  passportExpiry: '2029-08-15',
  emergencyContact: '+1 (555) 234-5678'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('voyager_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('voyager_user', JSON.stringify(user));
      const timer = setTimeout(() => {
        saveUserProfileToApi(user);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem('voyager_user');
    }
  }, [user]);

  const login = async (email: string) => {
    const demoUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    };
    setUser(demoUser);
    return true;
  };

  const signup = async (name: string, email: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      id: `usr-${Date.now()}`,
      name,
      email,
      savedDestinations: ['tokyo-japan']
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const toggleSavedDestination = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const isSaved = prev.savedDestinations.includes(id);
      const newSaved = isSaved
        ? prev.savedDestinations.filter((d) => d !== id)
        : [...prev.savedDestinations, id];
      return { ...prev, savedDestinations: newSaved };
    });
  };

  const isDestinationSaved = (id: string) => {
    return Boolean(user?.savedDestinations.includes(id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        updateProfile,
        toggleSavedDestination,
        isDestinationSaved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
