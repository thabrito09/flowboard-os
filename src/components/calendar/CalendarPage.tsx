import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalendarEvents } from '@/lib/queries/calendar';
import { useUser } from '@/contexts/UserContext';

export default function CalendarPage() {
  const { userData } = useUser();
  const userId = userData?.id;
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: events = [] } = useCalendarEvents(userId || '');

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Meu Calendário</CardTitle>
          <CardDescription>Gerencie e visualize seus eventos.</CardDescription>
        </CardHeader>

        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow"
          />

          <div className="mt-4">
            {events.map(event => (
              <div key={event.id}>
                <span>{event.title}</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
