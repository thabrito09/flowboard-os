import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { calculateXPForLevel } from '@/lib/utils';
import * as auth from '@/lib/auth';
import Spinner from '@/components/ui/spinner';

export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface UserData {
  id: string;
  name: string;
  level: UserLevel;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  financialProgress: number;
  weeklyProgress: number;
  email?: string;
  lastLogin?: string;
  active?: boolean;
  settings?: Record<string, any>;
}

interface UserContextType {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const loadUserData = async (userId: string) => {
    try {
      const profile = await auth.getUserProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      if (!profile.active) {
        throw new Error('Profile is inactive');
      }
      setUserData(profile);
      setError(null);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      console.error('Error loading user data:', e);
      setError(e);
      setUserData(null);
      navigate('/login');
    }
  };

  const refreshUserData = async () => {
    if (!userData?.id) return;
    setIsLoading(true);
    await loadUserData(userData.id);
    setIsLoading(false);
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!userData?.id) return;
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...data,
          settings: { ...userData.settings, ...data.settings }
        })
        .eq('id', userData.id);
      if (updateError) throw updateError;
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Error updating user data:', err);
      throw err;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        const session = await auth.getCurrentSession();
        if (!session?.user) {
          setUserData(null);
          navigate('/login');
          return;
        }
        await loadUserData(session.user.id);
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        console.error('Error initializing user:', e);
        setError(e);
        setUserData(null);
        navigate('/login');
      } finally {
        setIsLoading(false);
        console.log('✅ UserContext loading finished');
      }
    };

    initializeUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoading(true);
        await loadUserData(session.user.id);
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUserData(null);
        navigate('/login');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ userData, isLoading, error, updateUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};