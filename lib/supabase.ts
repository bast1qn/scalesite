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
        debug: false,
    },
    global: {
        fetch: (url, options = {}) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);

            return fetch(url, {
                ...options,
                signal: controller.signal,
            })
            .then(response => {
                clearTimeout(timeoutId);
                return response;
            })
            .catch((err) => {
                clearTimeout(timeoutId);
                throw err;
            })
            .finally(() => {
                clearTimeout(timeoutId);
            });
        },
    },
});

export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
};

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    company: string | null;
    role: 'user' | 'team' | 'owner';
    referral_code: string | null;
    phone?: string;
    timezone?: string;
    preferences?: Record<string, any>;
    onboarding_completed?: boolean;
    avatar_url?: string;
    created_at: string;
}

// ============================================
// ENHANCED TYPE DEFINITIONS
// ============================================

export interface Project {
    id: string;
    user_id: string;
    service_id?: number;
    name: string;
    description?: string;
    industry?: string;
    config: Record<string, any>;
    content: Record<string, any>;
    status: 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';
    progress: number;
    estimated_launch_date?: string;
    actual_launch_date?: string;
    preview_url?: string;
    is_live: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProjectMilestone {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    due_date?: string;
    completed_at?: string;
    order_index: number;
    created_at: string;
}

export interface ContentGeneration {
    id: string;
    user_id: string;
    project_id?: string;
    type: string;
    industry?: string;
    keywords?: string[];
    tone: string;
    prompt?: string;
    generated_content?: string;
    selected_content?: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    created_at: string;
}

export interface TeamMember {
    id: string;
    team_id: string;
    member_id: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    permissions: Record<string, any>;
    status: 'pending' | 'active' | 'inactive';
    invited_by?: string;
    invited_at: string;
}

export interface Invoice {
    id: string;
    user_id: string;
    project_id?: string;
    invoice_number: string;
    amount: number;
    currency: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issue_date: string;
    due_date: string;
    paid_at?: string;
    payment_method?: string;
    payment_id?: string;
    download_url?: string;
    line_items: any[];
    discount_code?: string;
    discount_amount: number;
    tax_amount: number;
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
    read_at?: string;
    related_entity_type?: string;
    related_entity_id?: string;
    created_at: string;
    expires_at?: string;
}

export interface AnalyticsEvent {
    id: string;
    project_id?: string;
    user_id?: string;
    event_type: string;
    event_data: Record<string, any>;
    timestamp: string;
}

// ============================================
// REALTIME CHANNEL MANAGEMENT
// ============================================

import { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js';

/**
 * Create a realtime channel with automatic cleanup
 * @param name - Channel name
 * @param config - Channel configuration
 * @returns RealtimeChannel
 */
export const createChannel = (
    name: string,
    config?: {
        presence?: { key: string };
    }
): RealtimeChannel => {
    return supabase.channel(name, config);
};

/**
 * Subscribe to a channel and handle errors
 * @param channel - Channel to subscribe
 * @param onError - Error callback
 * @returns Promise that resolves when subscribed
 */
export const subscribeToChannel = (
    channel: RealtimeChannel,
    onError?: (error: Error) => void
): Promise<RealtimeChannel> => {
    return new Promise((resolve, reject) => {
        channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                resolve(channel);
            } else if (status === 'CHANNEL_ERROR') {
                const error = new Error('Failed to subscribe to channel');
                onError?.(error);
                reject(error);
            }
        });
    });
};

/**
 * Unsubscribe from channel and clean up
 * @param channel - Channel to unsubscribe
 */
export const unsubscribeFromChannel = async (
    channel: RealtimeChannel
): Promise<void> => {
    await supabase.removeChannel(channel);
};

// ============================================
// PRESENCE TRACKING
// ============================================

/**
 * Track user presence on a channel
 * @param channel - Realtime channel
 * @param userId - User ID
 * @param presenceData - Data to track
 */
export const trackPresence = async (
    channel: RealtimeChannel,
    userId: string,
    presenceData: {
        online_at: string;
        user_id: string;
        project_id?: string;
    }
): Promise<void> => {
    await channel.track({
        ...presenceData,
        user_id: userId,
        online_at: new Date().toISOString()
    });
};

/**
 * Get presence state from channel
 * @param channel - Realtime channel
 * @returns Presence state
 */
export const getPresenceState = (
    channel: RealtimeChannel
): RealtimePresenceState => {
    return channel.presenceState();
};

/**
 * Untrack user presence
 * @param channel - Realtime channel
 */
export const untrackPresence = async (
    channel: RealtimeChannel
): Promise<void> => {
    await channel.untrack();
};

// ============================================
// AUTH HELPERS
// ============================================

/**
 * Get current authenticated user
 * @returns User data or null
 */
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
};

/**
 * Get current session
 * @returns Session data or null
 */
export const getCurrentSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
};

/**
 * Refresh auth token
 * @returns Refreshed session
 */
export const refreshToken = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    return { data, error };
};

/**
 * Sign out user
 * @returns Sign out result
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

/**
 * Update user metadata
 * @param metadata - Metadata to update
 * @returns Updated user
 */
export const updateUserMetadata = async (metadata: Record<string, any>) => {
    const { data, error } = await supabase.auth.updateUser({
        data: metadata
    });
    return { data, error };
};

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Get public URL for a file
 * @param bucket - Bucket name
 * @param path - File path
 * @returns Public URL
 */
export const getPublicUrl = (bucket: string, path: string): string => {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * Get signed URL for a private file
 * @param bucket - Bucket name
 * @param path - File path
 * @param expiresIn - Expiry time in seconds (default: 60)
 * @returns Signed URL
 */
export const getSignedUrl = async (
    bucket: string,
    path: string,
    expiresIn: number = 60
): Promise<{ url: string | null; error: any }> => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

    return { url: data?.signedUrl || null, error };
};

/**
 * Upload file to storage
 * @param bucket - Bucket name
 * @param path - File path
 * @param file - File to upload
 * @param options - Upload options
 * @returns Upload result
 */
export const uploadFile = async (
    bucket: string,
    path: string,
    file: File,
    options: {
        cacheControl?: string;
        upsert?: boolean;
    } = {}
) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, options);

    return { data, error };
};

/**
 * Delete file from storage
 * @param bucket - Bucket name
 * @param paths - File paths to delete
 * @returns Delete result
 */
export const deleteFile = async (bucket: string, paths: string[]) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .remove(paths);

    return { data, error };
};

/**
 * List files in a bucket/path
 * @param bucket - Bucket name
 * @param path - Path to list
 * @param options - List options
 * @returns List result
 */
export const listFiles = async (
    bucket: string,
    path?: string,
    options?: {
        limit?: number;
        offset?: number;
        sortBy?: {
            column: 'name' | 'updated_at' | 'created_at' | 'last_accessed_at';
            order: 'asc' | 'desc';
        };
    }
) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, options);

    return { data, error };
};

// ============================================
// DATABASE QUERY HELPERS
// ============================================

/**
 * Execute a query with automatic error handling
 * @param queryBuilder - Supabase query builder
 * @returns Query result
 */
export const executeQuery = async <T>(
    queryBuilder: any
): Promise<{ data: T | null; error: any }> => {
    try {
        const { data, error } = await queryBuilder;
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

/**
 * Get a single record by ID
 * @param table - Table name
 * @param id - Record ID
 * @param columns - Columns to select (default: *)
 * @returns Record or null
 */
export const getById = async <T>(
    table: string,
    id: string,
    columns: string = '*'
): Promise<{ data: T | null; error: any }> => {
    return executeQuery<T>(
        supabase
            .from(table)
            .select(columns)
            .eq('id', id)
            .single()
    );
};

/**
 * Get all records for a user
 * @param table - Table name
 * @param userId - User ID
 * @param columns - Columns to select (default: *)
 * @param orderBy - Order by column
 * @returns Records array or null
 */
export const getByUserId = async <T>(
    table: string,
    userId: string,
    columns: string = '*',
    orderBy?: { column: string; ascending?: boolean }
): Promise<{ data: T[] | null; error: any }> => {
    let query = supabase
        .from(table)
        .select(columns)
        .eq('user_id', userId);

    if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
    }

    return executeQuery<T[]>(query);
};

/**
 * Insert a single record
 * @param table - Table name
 * @param record - Record to insert
 * @returns Inserted record or null
 */
export const insertRecord = async <T>(
    table: string,
    record: Record<string, any>
): Promise<{ data: T | null; error: any }> => {
    return executeQuery<T>(
        supabase
            .from(table)
            .insert(record)
            .select()
            .single()
    );
};

/**
 * Insert multiple records
 * @param table - Table name
 * @param records - Records to insert
 * @returns Inserted records or null
 */
export const insertRecords = async <T>(
    table: string,
    records: Record<string, any>[]
): Promise<{ data: T[] | null; error: any }> => {
    return executeQuery<T[]>(
        supabase
            .from(table)
            .insert(records)
            .select()
    );
};

/**
 * Update a record by ID
 * @param table - Table name
 * @param id - Record ID
 * @param updates - Fields to update
 * @returns Updated record or null
 */
export const updateRecord = async <T>(
    table: string,
    id: string,
    updates: Record<string, any>
): Promise<{ data: T | null; error: any }> => {
    return executeQuery<T>(
        supabase
            .from(table)
            .update(updates)
            .eq('id', id)
            .select()
            .single()
    );
};

/**
 * Delete a record by ID
 * @param table - Table name
 * @param id - Record ID
 * @returns Delete result
 */
export const deleteRecord = async (
    table: string,
    id: string
): Promise<{ error: any }> => {
    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

    return { error };
};

/**
 * Count records in a table
 * @param table - Table name
 * @param filters - Optional filters
 * @returns Count or null
 */
export const countRecords = async (
    table: string,
    filters?: Record<string, any>
): Promise<{ count: number | null; error: any }> => {
    let query = supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

    if (filters) {
        Object.entries(filters).forEach(([column, value]) => {
            query = query.eq(column, value);
        });
    }

    const { count, error } = await query;
    return { count, error };
};

// ============================================
// REALTIME SUBSCRIPTION HELPERS
// ============================================

/**
 * Subscribe to table changes
 * @param table - Table name
 * @param filter - Filter object (column: value)
 * @param callbacks - Event callbacks
 * @returns Channel name
 */
export const subscribeToTable = (
    table: string,
    filter: { column: string; value: any } | null,
    callbacks: {
        onInsert?: (payload: any) => void;
        onUpdate?: (payload: any) => void;
        onDelete?: (payload: any) => void;
        onError?: (error: Error) => void;
    }
): RealtimeChannel => {
    const channelName = `${table}-${Date.now()}`;

    const channel = supabase.channel(channelName);

    if (filter) {
        channel.on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table,
                filter: `${filter.column}=eq.${filter.value}`
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.(newRecord);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        );
    } else {
        channel.on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table
            },
            (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                switch (eventType) {
                    case 'INSERT':
                        callbacks.onInsert?.(newRecord);
                        break;
                    case 'UPDATE':
                        callbacks.onUpdate?.(newRecord);
                        break;
                    case 'DELETE':
                        callbacks.onDelete?.(oldRecord);
                        break;
                }
            }
        );
    }

    channel.subscribe((status) => {
        if (status === 'SUBSCRIPTION_ERROR') {
            callbacks.onError?.(new Error(`Failed to subscribe to ${table}`));
        }
    });

    return channel;
};

/**
 * Subscribe to broadcast messages
 * @param channel - Channel name
 * @param event - Event name
 * @param callback - Message callback
 * @returns RealtimeChannel
 */
export const subscribeToBroadcast = (
    channel: string,
    event: string,
    callback: (payload: any) => void
): RealtimeChannel => {
    const ch = supabase.channel(channel);

    ch.on('broadcast', { event }, (payload) => {
        callback(payload.payload);
    });

    ch.subscribe();

    return ch;
};

/**
 * Send broadcast message
 * @param channel - RealtimeChannel
 * @param event - Event name
 * @param payload - Message payload
 */
export const sendBroadcast = async (
    channel: RealtimeChannel,
    event: string,
    payload: any
): Promise<void> => {
    await channel.send({
        type: 'broadcast',
        event,
        payload
    });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user is authenticated
 * @returns Boolean indicating auth status
 */
export const isAuthenticated = async (): Promise<boolean> => {
    const { session } = await getCurrentSession();
    return !!session;
};

/**
 * Get user ID from current session
 * @returns User ID or null
 */
export const getCurrentUserId = async (): Promise<string | null> => {
    const { user } = await getCurrentUser();
    return user?.id || null;
};

/**
 * Check if user has specific role
 * @param role - Role to check
 * @returns Boolean
 */
export const hasRole = async (role: 'user' | 'team' | 'owner'): Promise<boolean> => {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { data } = await getUserProfile(userId);
    return data?.role === role;
};

/**
 * Check if user is team member or owner
 * @returns Boolean
 */
export const isTeamMember = async (): Promise<boolean> => {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const { data } = await getUserProfile(userId);
    return data?.role === 'team' || data?.role === 'owner';
};
