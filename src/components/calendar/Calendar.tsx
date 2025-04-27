import { useState } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, isSameMonth, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/queries/calendar';

interface CalendarProps {
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
}

export default function Calendar({ events, onDateClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Get array of weekday names in Portuguese
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startOfWeek(new Date(), { locale: ptBR }), i);
    return format(date, 'EEEEEE', { locale: ptBR }).toUpperCase();
  });
  
  // Get array of days for the current month view
  const getDaysInMonth = () => {
    const start = startOfWeek(currentMonth, { locale: ptBR });
    const days: Date[] = [];
    
    for (let i = 0; i < 42; i++) {
      days.push(addDays(start, i));
    }
    
    return days;
  };
  
  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_date);
      return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };
  
  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">
          {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week Days */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {getDaysInMonth().map((date, idx) => {
          const dayEvents = getEventsForDay(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isCurrentDay = isToday(date);
          
          return (
            <div
              key={idx}
              className={cn(
                "min-h-[100px] p-2 border rounded-md transition-colors",
                isCurrentMonth ? "bg-card" : "bg-muted/50",
                isCurrentDay && "border-primary",
                "hover:bg-accent cursor-pointer"
              )}
              onClick={() => onDateClick?.(date)}
            >
              <div className="flex flex-col h-full">
                {/* Day Number */}
                <span className={cn(
                  "text-sm font-medium",
                  !isCurrentMonth && "text-muted-foreground",
                  isCurrentDay && "text-primary"
                )}>
                  {format(date, 'd')}
                </span>
                
                {/* Events */}
                <div className="flex-1 space-y-1 mt-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 bg-primary/10 text-primary rounded truncate"
                      title={event.title}
                    >
                      {format(new Date(event.start_date), 'HH:mm')} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <Badge variant="outline" className="w-full justify-center">
                      +{dayEvents.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}