import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  category: 'personal' | 'focus' | 'workout' | 'spiritual';
  color?: string;
}

export const eventCategories = {
  personal: {
    label: 'Pessoal',
    color: 'bg-blue-500',
    icon: '👤',
  },
  focus: {
    label: 'Foco',
    color: 'bg-purple-500',
    icon: '🎯',
  },
  workout: {
    label: 'Treino',
    color: 'bg-green-500',
    icon: '💪',
  },
  spiritual: {
    label: 'Espiritual',
    color: 'bg-amber-500',
    icon: '✨',
  },
};

export function formatEventTime(date: Date): string {
  return format(date, 'HH:mm', { locale: ptBR });
}

export function formatEventDate(date: Date): string {
  return format(date, "dd 'de' MMMM", { locale: ptBR });
}

export function getWeekDays(): string[] {
  const weekStart = startOfWeek(new Date(), { locale: ptBR });
  
  return Array.from({ length: 7 }).map((_, index) => {
    const day = addDays(weekStart, index);
    return format(day, 'EEEEEE', { locale: ptBR });
  });
}

export function getMonthDays(month: Date): Date[] {
  const start = startOfWeek(month, { locale: ptBR });
  const days: Date[] = [];
  
  for (let i = 0; i < 42; i++) {
    days.push(addDays(start, i));
  }
  
  return days;
}

export function isToday(date: Date): boolean {
  return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
}

export function isSameMonth(date: Date, baseDate: Date): boolean {
  return format(date, 'yyyy-MM') === format(baseDate, 'yyyy-MM');
}

export function getEventsByDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );
}

export function sortEventsByTime(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function parseEventTime(timeString: string, baseDate: Date): Date {
  return parse(timeString, 'HH:mm', baseDate);
}