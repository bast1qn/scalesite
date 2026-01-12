// Supabase Client for ScaleSite v3 - ready for deployment
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Export flag to check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
    },
    global: {
        fetch: (url, options = {}) => {
            return fetch(url, {
                ...options,
                // Add 30 second timeout to fetch requests (increased from 10s)
                signal: AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined,
            }).catch((err) => {
                console.error('[SUPABASE] Fetch error:', err);
                throw err;
            });
        },
    },
});

// Helper to get current session
export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

// Helper to get current user
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

// Helper to get user profile with role
export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
};

// Check if user has specific role
export const hasRole = async (userId: string, roles: string[]) => {
    const { data, error } = await getUserProfile(userId);
    if (error || !data) return false;
    return roles.includes(data.role);
};

// Type definitions
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    company: string | null;
    role: 'user' | 'team' | 'owner';
    referral_code: string | null;
    created_at: string;
}

export interface Service {
    id: number;
    name: string;
    name_en: string | null;
    description: string | null;
    description_en: string | null;
    price: number | null;
    sale_price: number | null;
    price_details: string | null;
    price_details_en: string | null;
}

export interface UserService {
    id: string;
    user_id: string;
    service_id: number;
    status: string;
    progress: number;
    created_at: string;
}

export interface Ticket {
    id: string;
    user_id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
    last_update: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    amount: number | null;
    date: string;
    due_date: string | null;
    status: string;
    description: string | null;
}
