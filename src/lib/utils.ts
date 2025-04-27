import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('pt-BR').format(number);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function calculateLevelProgress(xp: number, xpToNextLevel: number): number {
  return Math.min(Math.round((xp / xpToNextLevel) * 100), 100);
}

export function calculateTimeLeft(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expirado';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const levelThresholds = {
  1: 1000,
  2: 1500,
  3: 2250,
  4: 3375,
  5: 5063,
  6: 7594,
  7: 11391,
  8: 17087,
  9: 25630,
};

export function calculateXPForLevel(level: number): number {
  return levelThresholds[level as keyof typeof levelThresholds] || 1000;
}