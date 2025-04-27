import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface LifeArea {
  id: string;
  user_id: string;
  type: 'mind' | 'creation' | 'learning' | 'body' | 'faith' | 'work' | 'finances';
  name: string;
  description?: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export function useLifeAreas(userId: string) {
  return useQuery({
    queryKey: ['life-areas', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('life_areas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at');
        
      if (error) throw error;
      return data as LifeArea[];
    },
    enabled: !!userId,
  });
}

export function useCreateLifeArea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId,
      type,
      name,
      description,
    }: { 
      userId: string;
      type: LifeArea['type'];
      name: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('life_areas')
        .insert({
          user_id: userId,
          type,
          name,
          description,
          progress: 0,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['life-areas', variables.userId] });
    },
  });
}

export function useUpdateLifeArea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      areaId,
      name,
      description,
      progress,
    }: { 
      areaId: string;
      name?: string;
      description?: string;
      progress?: number;
    }) => {
      const updates: Partial<LifeArea> = {};
      if (name) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (progress !== undefined) updates.progress = progress;
      
      const { data, error } = await supabase
        .from('life_areas')
        .update(updates)
        .eq('id', areaId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['life-areas', data.user_id] });
    },
  });
}
