import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useUpdateUserXP } from './queries';

export function useXPSystem() {
  const { userData, updateUserData } = useUser();
  const updateXPMutation = useUpdateUserXP();
  
  const addXP = async (amount: number) => {
    if (!userData?.id) return;
    
    let newXP = (userData.xp || 0) + amount;
    let newLevel = userData.level;
    let newXPToNextLevel = userData.xpToNextLevel;
    
    // Level up logic
    while (newXP >= newXPToNextLevel) {
      newXP -= newXPToNextLevel;
      newLevel = (newLevel + 1) as typeof userData.level;
      newXPToNextLevel = Math.floor(newXPToNextLevel * 1.5);
    }
    
    // Update local state
    updateUserData({
      xp: newXP,
      level: newLevel,
      xpToNextLevel: newXPToNextLevel,
      totalXp: (userData.totalXp || 0) + amount,
    });
    
    // Update database
    try {
      await updateXPMutation.mutateAsync({
        userId: userData.id,
        xp: newXP,
        level: newLevel,
      });
    } catch (error) {
      console.error('Error updating XP:', error);
    }
  };
  
  return { addXP };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });
  
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setStoredValue] as const;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}