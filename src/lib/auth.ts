import { supabase } from './supabase';
import { UserData } from '@/contexts/UserContext';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await wait(RETRY_DELAY);
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

async function ensureUserProfile(userId: string) {
  if (!userId) throw new Error('User ID is required');

  try {
    const operation = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: 'Explorador Inicial',
              avatar_url: null,
              xp: 0,
              level: 1,
              active: true,
              settings: {},
            })
            .select('*')
            .single();

          if (insertError) {
            throw new Error(`Failed to create profile: ${insertError.message}`);
          }

          return newProfile;
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      return profile;
    };

    return await retryOperation(operation);
  } catch (error) {
    console.error('Profile error:', error);
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
      throw error;
    }
    throw new Error('Erro inesperado ao acessar perfil');
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Ensure user profile exists
    const profile = await ensureUserProfile(authData.user?.id);

    if (!profile) {
      throw new Error('Erro ao criar ou recuperar perfil');
    }

    if (!profile.active) {
      throw new Error('Conta desativada. Entre em contato com o suporte.');
    }

    // Update last login
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id);

    return { user: authData.user, profile };
  } catch (error) {
    console.error('Sign in error:', error);
    if (error instanceof Error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos');
      } else if (error.message.includes('network')) {
        throw new Error('Erro de conexão. Verifique sua internet');
      }
    }
    throw error;
  }
}

export async function signOut() {
  try {
    // Clear local storage
    localStorage.clear();
    
    // Clear query cache if using React Query
    window.queryClient?.clear();
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
}

export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserData | null> {
  try {
    // First ensure profile exists
    const profile = await ensureUserProfile(userId);
    if (!profile) return null;

    const xpToNextLevel = calculateXPForLevel(profile.level);

    return {
      id: profile.id,
      name: profile.name || 'Explorador Inicial',
      level: profile.level || 1,
      xp: profile.xp || 0,
      xpToNextLevel,
      totalXp: profile.xp || 0,
      financialProgress: profile.settings?.financialProgress || 0,
      weeklyProgress: profile.settings?.weeklyProgress || 0,
      email: profile.email,
      lastLogin: profile.last_login,
      active: profile.active,
      settings: profile.settings || {},
      avatar_url: profile.avatar_url,
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}