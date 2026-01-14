// Neon Database Client for ScaleSite
import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL || '';

// Export flag to check if Neon is configured
export const isNeonConfigured = !!databaseUrl;

if (!databaseUrl && import.meta.env.DEV) {
    console.warn('[Neon] Database URL not configured. Set VITE_NEON_DATABASE_URL environment variable.');
}

// Create Neon SQL client
export const sql = databaseUrl ? neon(databaseUrl) : null;

/**
 * Execute a SQL query
 * @param query - SQL query string
 * @param params - Query parameters
 * @returns Query results
 */
export const query = async <T = unknown>(
    queryTemplate: TemplateStringsArray,
    ...params: (string | number | boolean | null)[]
): Promise<T[]> => {
    if (!sql) {
        console.error('[Neon] Database not configured');
        return [];
    }

    try {
        const result = await sql(queryTemplate, ...params);
        return result as T[];
    } catch (error) {
        console.error('[Neon] Query error:', error);
        throw error;
    }
};

/**
 * User Profile Interface
 */
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    company: string | null;
    role: 'user' | 'team' | 'owner';
    referral_code: string | null;
    phone?: string;
    timezone?: string;
    preferences?: Record<string, unknown>;
    onboarding_completed?: boolean;
    avatar_url?: string;
    created_at: string;
}

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<{ data: UserProfile | null; error: Error | null }> => {
    if (!sql) {
        return { data: null, error: new Error('Database not configured') };
    }

    try {
        const result = await sql<UserProfile[]>`
            SELECT * FROM profiles
            WHERE id = ${userId}
            LIMIT 1
        `;

        return { data: result[0] || null, error: null };
    } catch (err) {
        console.error('[Neon] Error fetching profile:', err);
        return { data: null, error: err as Error };
    }
};

/**
 * Create or update user profile
 */
export const upsertUserProfile = async (profile: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: Error | null }> => {
    if (!sql) {
        return { data: null, error: new Error('Database not configured') };
    }

    try {
        const result = await sql<UserProfile[]>`
            INSERT INTO profiles (id, name, email, company, role, referral_code, created_at)
            VALUES (${profile.id}, ${profile.name}, ${profile.email}, ${profile.company || null}, ${profile.role || 'user'}, ${profile.referral_code || null}, ${new Date().toISOString()})
            ON CONFLICT (id) DO UPDATE
            SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                company = EXCLUDED.company,
                role = EXCLUDED.role,
                referral_code = EXCLUDED.referral_code
            RETURNING *
        `;

        return { data: result[0] || null, error: null };
    } catch (err) {
        console.error('[Neon] Error upserting profile:', err);
        return { data: null, error: err as Error };
    }
};

/**
 * Project Interface
 */
export interface Project {
    id: string;
    user_id: string;
    service_id?: number;
    name: string;
    description?: string;
    industry?: string;
    config: Record<string, unknown>;
    content: Record<string, unknown>;
    status: 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';
    progress: number;
    estimated_launch_date?: string;
    actual_launch_date?: string;
    preview_url?: string;
    is_live: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Get all projects for a user
 */
export const getUserProjects = async (userId: string): Promise<{ data: Project[] | null; error: Error | null }> => {
    if (!sql) {
        return { data: null, error: new Error('Database not configured') };
    }

    try {
        const result = await sql<Project[]>`
            SELECT * FROM projects
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;

        return { data: result, error: null };
    } catch (err) {
        console.error('[Neon] Error fetching projects:', err);
        return { data: null, error: err as Error };
    }
};
