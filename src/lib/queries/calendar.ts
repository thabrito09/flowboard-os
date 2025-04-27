import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export function useCalendarEvents(userId: string) {
  return useQuery({
    queryKey: ['calendar-events', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: true });
        
      if (error) throw error;
      return data as CalendarEvent[];
    },
    enabled: !!userId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      title,
      description,
      startDate,
      endDate,
    }: { 
      userId: string;
      title: string;
      description?: string;
      startDate: Date;
      endDate?: Date;
    }) => {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: userId,
          title,
          description,
          start_date: startDate.toISOString(),
          end_date: endDate?.toISOString(),
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events', variables.userId] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      eventId,
      title,
      description,
      startDate,
      endDate,
    }: { 
      eventId: string;
      title?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
    }) => {
      const updates: Record<string, any> = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (startDate) updates.start_date = startDate.toISOString();
      if (endDate) updates.end_date = endDate.toISOString();
      
      const { data, error } = await supabase
        .from('calendar_events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events', data.user_id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
  });
}