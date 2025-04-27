import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Habit {
  id: string;
  user_id: string;
  area_id: string;
  name: string;
  description?: string;
  frequency: string[];
  streak: number;
  total_completions: number;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  notes?: string;
}

export function useHabits(userId: string, areaId?: string) {
  return useQuery({
    queryKey: ['habits', userId, areaId],
    queryFn: async () => {
      let query = supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId);
        
      if (areaId) {
        query = query.eq('area_id', areaId);
      }
      
      const { data, error } = await query.order('created_at');
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!userId,
  });
}

export function useHabitLogs(habitId: string) {
  return useQuery({
    queryKey: ['habit-logs', habitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId)
        .order('completed_at', { ascending: false });
        
      if (error) throw error;
      return data as HabitLog[];
    },
    enabled: !!habitId,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId,
      areaId,
      name,
      description,
      frequency,
    }: { 
      userId: string;
      areaId: string;
      name: string;
      description?: string;
      frequency: string[];
    }) => {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: userId,
          area_id: areaId,
          name,
          description,
          frequency,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits', variables.userId] });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      habitId,
      name,
      description,
      frequency,
    }: { 
      habitId: string;
      name?: string;
      description?: string;
      frequency?: string[];
    }) => {
      const updates: Partial<Habit> = {};
      if (name) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (frequency) updates.frequency = frequency;
      
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['habits', data.user_id] });
    },
  });
}

export function useLogHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      habitId,
      notes,
    }: { 
      habitId: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('habit_logs')
        .insert({
          habit_id: habitId,
          notes,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs', variables.habitId] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}