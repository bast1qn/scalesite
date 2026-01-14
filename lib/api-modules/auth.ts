import { supabase } from '../supabase';
import { getCached, setCached } from './cache';

export const isTeamMember = async (userId: string): Promise<boolean> => {
  // Check cache first
  const cached = getCached<boolean>(`team_member_${userId}`);
  if (cached !== null) return cached;

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  const result = data?.role === 'team' || data?.role === 'owner';
  setCached(`team_member_${userId}`, result);
  return result;
};

export const requireAuth = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, error: { type: 'auth' as const, message: 'Not authenticated' } };
  return { user, error: null };
};

export const requireTeamAccess = async (userId: string): Promise<{ authorized: boolean; error: string | null }> => {
  const teamMember = await isTeamMember(userId);
  if (!teamMember) return { authorized: false, error: 'Access denied' };
  return { authorized: true, error: null };
};
