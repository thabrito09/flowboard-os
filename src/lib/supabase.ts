import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserMissions(userId: string) {
  const { data, error } = await supabase
    .from('daily_missions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function updateMissionStatus(missionId: string, isCompleted: boolean) {
  const { data, error } = await supabase
    .from('daily_missions')
    .update({ 
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null
    })
    .eq('id', missionId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function createMission(userId: string, title: string) {
  const { data, error } = await supabase
    .from('daily_missions')
    .insert([
      { 
        user_id: userId, 
        title, 
        is_completed: false,
        xp_reward: 50 
      }
    ])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}