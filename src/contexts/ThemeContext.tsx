import { createContext, useContext, useEffect } from 'react';
import { useUser } from './UserContext';
import { getThemeStageFromLevel, type ThemeStage, themeConfigs } from '@/lib/theme';

interface ThemeContextType {
  themeStage: ThemeStage;
  colors: {
    primary: string;
    background: string;
    text: string;
    accent: string;
  };
  effects: {
    sparkle: boolean;
    microAnimations: boolean;
    refinedElements: boolean;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { userData } = useUser();
  
  const themeStage = getThemeStageFromLevel(userData?.level || 1);
  const config = themeConfigs[themeStage];
  
  useEffect(() => {
    // Apply theme stage class to root element
    document.documentElement.classList.remove('theme-explorer', 'theme-builder', 'theme-awakened', 'theme-master');
    document.documentElement.classList.add(`theme-${themeStage}`);
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--theme-primary', config.accent);
    document.documentElement.style.setProperty('--theme-background', config.background);
    document.documentElement.style.setProperty('--theme-text', config.foreground);
    document.documentElement.style.setProperty('--theme-accent', config.accent);
    document.documentElement.style.setProperty('--theme-muted', config.muted);
  }, [themeStage, config]);
  
  const value = {
    themeStage,
    colors: {
      primary: config.accent,
      background: config.background,
      text: config.foreground,
      accent: config.accent,
    },
    effects: config.effects,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}