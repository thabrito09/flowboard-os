import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface SpaceBlock {
  id: string;
  type: 'text' | 'checklist';
  content: {
    text?: string;
    items?: Array<{
      id: string;
      text: string;
      checked: boolean;
    }>;
  };
  order: number;
  created_at: string;
  updated_at: string;
}

export function useSpaceBlocks(userId: string) {
  return useQuery({
    queryKey: ['space-blocks', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('space_blocks')
        .select('*')
        .eq('user_id', userId)
        .order('order');
        
      if (error) throw error;
      return data as SpaceBlock[];
    },
    enabled: !!userId,
  });
}

export function useCreateBlock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      type, 
      content,
      order 
    }: { 
      userId: string;
      type: SpaceBlock['type'];
      content: SpaceBlock['content'];
      order: number;
    }) => {
      const { data, error } = await supabase
        .from('space_blocks')
        .insert({
          user_id: userId,
          type,
          content,
          order,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['space-blocks', variables.userId] });
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      blockId, 
      userId,
      updates 
    }: { 
      blockId: string;
      userId: string;
      updates: Partial<SpaceBlock>;
    }) => {
      const { data, error } = await supabase
        .from('space_blocks')
        .update(updates)
        .eq('id', blockId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['space-blocks', variables.userId] });
    },
  });
}