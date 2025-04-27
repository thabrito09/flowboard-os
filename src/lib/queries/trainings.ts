import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Training {
  id: string;
  user_id: string;
  exercise_name: string;
  weight: number;
  reps: number;
  created_at: string;
}

export function useTrainings(userId: string) {
  return useQuery({
    queryKey: ['trainings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_trainings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Training[];
    },
    enabled: !!userId,
  });
}

export function useCreateTraining() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId,
      exerciseName,
      weight,
      reps,
    }: { 
      userId: string;
      exerciseName: string;
      weight: number;
      reps: number;
    }) => {
      const { data, error } = await supabase
        .from('user_trainings')
        .insert({
          user_id: userId,
          exercise_name: exerciseName,
          weight,
          reps,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trainings', variables.userId] });
    },
  });
}