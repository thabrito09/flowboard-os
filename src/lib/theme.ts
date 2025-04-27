import { type UserLevel } from '@/contexts/UserContext';

export type ThemeStage = 'explorer' | 'builder' | 'awakened' | 'master';

export interface ThemeConfig {
  background: string;
  foreground: string;
  accent: string;
  muted: string;
  effects: {
    sparkle: boolean;
    microAnimations: boolean;
    refinedElements: boolean;
  };
}

export function getThemeStageFromLevel(level: UserLevel | number): ThemeStage {
  if (level >= 10) return 'master';
  if (level >= 7) return 'awakened';
  if (level >= 4) return 'builder';
  return 'explorer';
}

export const themeConfigs: Record<ThemeStage, ThemeConfig> = {
  explorer: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    accent: 'hsl(221.2 83.2% 53.3%)', // Blue
    muted: 'hsl(210 40% 96.1%)',
    effects: {
      sparkle: false,
      microAnimations: false,
      refinedElements: false,
    },
  },
  builder: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    accent: 'hsl(262.1 83.3% 57.8%)', // Purple
    muted: 'hsl(210 40% 96.1%)',
    effects: {
      sparkle: false,
      microAnimations: true,
      refinedElements: true,
    },
  },
  awakened: {
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    accent: 'hsl(48 96.5% 53.3%)', // Gold
    muted: 'hsl(217.2 32.6% 17.5%)',
    effects: {
      sparkle: true,
      microAnimations: true,
      refinedElements: true,
    },
  },
  master: {
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    accent: 'hsl(48 96.5% 53.3%)', // Gold
    muted: 'hsl(217.2 32.6% 17.5%)',
    effects: {
      sparkle: true,
      microAnimations: true,
      refinedElements: true,
    },
  },
};