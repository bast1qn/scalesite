// Mock Supabase client for backward compatibility during Neon + Clerk migration
// This file will be removed once all components are migrated to Neon

import type { SupabaseClient } from '@supabase/supabase-js';

// Mock client - does nothing but prevents build errors
const mockClient = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: new Error('Use Clerk') }),
        signInWithOAuth: async () => ({ data: null, error: new Error('Use Clerk') }),
        signUp: async () => ({ data: null, error: new Error('Use Clerk') }),
        signOut: async () => ({ error: null }),
        refreshSession: async () => ({ data: null, error: null }),
        updateUser: async () => ({ data: null, error: new Error('Use Clerk') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                single: async () => ({ data: null, error: new Error('Use Neon') }),
                maybeSingle: async () => ({ data: null, error: new Error('Use Neon') }),
            }),
            order: () => ({
                limit: async () => ({ data: [], error: new Error('Use Neon') }),
            }),
            limit: async () => ({ data: [], error: new Error('Use Neon') }),
        }),
        insert: () => ({
            select: () => ({
                single: async () => ({ data: null, error: new Error('Use Neon') }),
            }),
        }),
        update: () => ({
            eq: () => ({
                select: () => ({
                    single: async () => ({ data: null, error: new Error('Use Neon') }),
                }),
            }),
        }),
        delete: () => ({
            eq: async () => ({ error: new Error('Use Neon') }),
        }),
    }),
    storage: {
        from: () => ({
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
            upload: async () => ({ data: null, error: new Error('Use Neon') }),
            remove: async () => ({ data: null, error: new Error('Use Neon') }),
            list: async () => ({ data: null, error: new Error('Use Neon') }),
            createSignedUrl: async () => ({ data: null, error: new Error('Use Neon') }),
        }),
    },
    channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {},
    }),
    removeChannel: () => {},
} as unknown as SupabaseClient;

export const supabase = mockClient;
export const isSupabaseConfigured = false;

export const getCurrentUser = async () => {
    return { user: null, error: new Error('Use Clerk') };
};

export const getUserProfile = async (userId: string) => {
    return { data: null, error: new Error('Use Neon') };
};

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    company: string | null;
    role: 'user' | 'team' | 'owner';
    referral_code: string | null;
}

export interface Project {
    id: string;
    user_id: string;
    name: string;
    status: string;
    progress: number;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message?: string;
    link?: string;
    read: boolean;
    created_at: string;
}

// Re-export from neon
export * from './neon';
