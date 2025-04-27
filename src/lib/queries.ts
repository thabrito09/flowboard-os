import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as supabase from './supabase';

export interface Mission {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  user_id: string;
  completed_at?: string;
  xp_reward: number;
}

export interface Area {
  id: string;
  name: string;
  progress: number;
  category: string;
  description?: string;
  user_id: string;
}

export interface Metric {
  id: string;
  weekly_progress: number;
  million_progress: number;
  total_missions_completed: number;
  user_id: string;
}

// User Profile Queries
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => supabase.getUserProfile(userId),
    enabled: !!userId,
  });
}

// Mission Queries
export function useUserMissions(userId: string) {
  return useQuery({
    queryKey: ['missions', userId],
    queryFn: () => supabase.getUserMissions(userId),
    enabled: !!userId,
  });
}

export function useUserDailyMissions(userId: string) {
  return useQuery({
    queryKey: ['daily-missions', userId],
    queryFn: () => supabase.getUserDailyMissions(userId),
    enabled: !!userId,
  });
}

// Area Queries
export function useUserAreas(userId: string) {
  return useQuery({
    queryKey: ['areas', userId],
    queryFn: () => supabase.getUserAreas(userId),
    enabled: !!userId,
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ areaId, progress }: { areaId: string; progress: number }) => {
      const { data, error } = await supabase.supabase
        .from('areas')
        .update({ progress })
        .eq('id', areaId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      if (data.user_id) {
        queryClient.invalidateQueries({ queryKey: ['metrics', data.user_id] });
      }
    },
  });
}

// Metrics Queries
export function useUserMetrics(userId: string) {
  return useQuery({
    queryKey: ['metrics', userId],
    queryFn: () => supabase.getUserMetrics(userId),
    enabled: !!userId,
  });
}

export function useUpdateMetrics() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      weeklyProgress, 
      millionProgress 
    }: { 
      userId: string; 
      weeklyProgress?: number; 
      millionProgress?: number; 
    }) => {
      const updates: Record<string, any> = {};
      if (weeklyProgress !== undefined) updates.weekly_progress = weeklyProgress;
      if (millionProgress !== undefined) updates.million_progress = millionProgress;
      
      const { data, error } = await supabase.supabase
        .from('metrics')
        .upsert({ user_id: userId, ...updates })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

// Mission Mutations
export function useMissionMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ missionId, isCompleted }: { missionId: string; isCompleted: boolean }) => {
      const mission = await supabase.updateMissionStatus(missionId, isCompleted);
      return { mission, xpGained: isCompleted ? mission.xp_reward : -mission.xp_reward };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['daily-missions'] });
      if (data.mission.user_id) {
        queryClient.invalidateQueries({ queryKey: ['profile', data.mission.user_id] });
        queryClient.invalidateQueries({ queryKey: ['metrics', data.mission.user_id] });
      }
    },
  });
}

export function useCreateMission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, title }: { userId: string; title: string }) =>
      supabase.createMission(userId, title),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      queryClient.invalidateQueries({ queryKey: ['daily-missions'] });
      if (data.user_id) {
        queryClient.invalidateQueries({ queryKey: ['metrics', data.user_id] });
      }
    },
  });
}

// XP and Level Mutations
export function useUpdateUserXP() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, xp, level }: { userId: string; xp: number; level: number }) =>
      supabase.updateUserXP(userId, xp, level),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    },
  });
}