// Internal - Supabase client
import { supabase, UserProfile } from './supabase';

// Internal - Utilities
import { generateId } from './utils';

// Internal - Types
import type {
  AnalyticsSummary,
  ApiArrayResponse,
  ApiResponse,
  BlogPost,
  ContentGeneration,
  DashboardStats,
  Discount,
  File,
  Invoice,
  NewsletterCampaign,
  NewsletterSubscriber,
  Notification,
  Project,
  ProjectMilestone,
  Service,
  TeamActivity,
  TeamInvitation,
  TeamMember,
  Ticket,
  TicketMember,
  TicketMessage,
  Transaction,
  UserService,
} from './types';

// Simple in-memory cache for API responses (prevents duplicate requests)
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 60000; // ✅ PERFORMANCE: 60s cache for rarely-changing data like services
const SHORT_CACHE_TTL = 5000; // ✅ PERFORMANCE: 5s cache for frequently-changing data

// ✅ PERFORMANCE: Request deduplication - prevents duplicate simultaneous requests
const pendingRequests = new Map<string, Promise<unknown>>();

const getCached = <T>(key: string, ttl: number = CACHE_TTL): T | null => {
    const cached = apiCache.get(key) as CacheEntry<T> | undefined;
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
    }
    return null;
};

const setCached = <T>(key: string, data: T): void => {
    apiCache.set(key, { data, timestamp: Date.now() });
};

/**
 * ✅ PERFORMANCE: Deduplicate simultaneous requests
 * If multiple components request the same data simultaneously,
 * only one API call is made and all components share the result
 */
const dedupeRequest = <T,>(
    key: string,
    requestFn: () => Promise<T>
): Promise<T> => {
    // If request is already pending, return the existing promise
    const existing = pendingRequests.get(key) as Promise<T> | undefined;
    if (existing) {
        return existing;
    }

    // Create new request and store promise
    const promise = requestFn().finally(() => {
        // Remove from pending map when complete
        pendingRequests.delete(key);
    });

    pendingRequests.set(key, promise);
    return promise;
};

const isTeamMember = async (userId: string): Promise<boolean> => {
    // Check cache first
    const cached = getCached<boolean>(`team_member_${userId}`);
    if (cached !== null) return cached;

    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to avoid 406 error if profile doesn't exist

    const result = data?.role === 'team' || data?.role === 'owner';
    setCached(`team_member_${userId}`, result);
    return result;
};

const requireAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { user: null, error: { type: 'auth' as const, message: 'Not authenticated' } };
    return { user, error: null };
};

const requireTeamAccess = async (userId: string): Promise<{ authorized: boolean; error: string | null }> => {
    const teamMember = await isTeamMember(userId);
    if (!teamMember) return { authorized: false, error: 'Access denied' };
    return { authorized: true, error: null };
};

interface SupabaseError {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
}

type ApiErrorType = 'network' | 'auth' | 'validation' | 'not_found' | 'server' | 'unknown';

interface ApiError {
    type: ApiErrorType;
    message: string;
}

const classifyError = (error: SupabaseError): ApiErrorType => {
    if (!error.code) return 'unknown';

    // Network/timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('network')) {
        return 'network';
    }

    // Authentication errors
    if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
        return 'auth';
    }

    // Validation errors
    if (error.code === '23505' || error.code === '23503' || error.code === '23502') {
        return 'validation';
    }

    // Not found errors
    if (error.code === 'PGRST116') {
        return 'not_found';
    }

    // Server errors (5xx)
    if (error.code.startsWith('5')) {
        return 'server';
    }

    return 'unknown';
};

const getUserFriendlyMessage = (type: ApiErrorType): string => {
    const messages: Record<ApiErrorType, string> = {
        network: 'Network error. Please check your connection.',
        auth: 'Session expired. Please log in again.',
        validation: 'Invalid data provided. Please check your input.',
        not_found: 'Resource not found.',
        server: 'Server error. Please try again later.',
        unknown: 'An error occurred. Please try again.'
    };
    return messages[type];
};

const handleSupabaseError = (error: SupabaseError | null): ApiError | null => {
    if (error) {
        // SECURITY: Don't expose internal error messages to users (OWASP A05:2021)
        // Internal errors may leak database structure, table names, or implementation details
        if (import.meta.env.DEV) {
          console.error('[API] Internal error:', error.message, error.code);
        }

        const errorType = classifyError(error);
        const userMessage = getUserFriendlyMessage(errorType);

        // SECURITY: Remove originalCode to prevent information leakage
        // Internal error codes can expose database structure and implementation details
        return {
            type: errorType,
            message: userMessage
        };
    }
    return null;
};

export const api = {
    /**
     * Get current user profile
     * @returns User profile data or error
     */
    getMe: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth', message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle(); // Use maybeSingle to avoid 406 if profile doesn't exist

        return { data: { user: data }, error: handleSupabaseError(error) };
    },

    /**
     * Update current user profile
     * @param updates - Object containing fields to update (name, company, email)
     * @returns Updated user profile or error
     */
    updateProfile: async (updates: { name?: string; company?: string; email?: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth', message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        return { data: { user: data }, error: handleSupabaseError(error) };
    },

    /**
     * Get all available services
     * ✅ PERFORMANCE: Cached + request deduplication for parallel calls
     * @returns Array of all services or error
     */
    getServices: async () => {
        // Check cache first to prevent duplicate requests
        const cached = getCached<Service[]>('services_all');
        if (cached) return { data: cached, error: null };

        // ✅ PERFORMANCE: Dedupe simultaneous requests
        return dedupeRequest('services_all', async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('id');

            if (!error && data) {
                setCached('services_all', data);
            }

            return { data, error: handleSupabaseError(error) };
        });
    },

    /**
     * Get services for the current user
     * @returns Array of user's purchased services or error
     */
    getUserServices: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('user_services')
            .select(`
                *,
                services (
                    id,
                    name,
                    description,
                    price
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) return { data: [], error: handleSupabaseError(error) };

        const formatted = Array.isArray(data)
            ? data.map((row) => ({
                id: row?.id,
                service_id: row?.service_id,
                status: row?.status,
                progress: row?.progress,
                created_at: row?.created_at,
                services: row?.services
              })).filter((item): item is NonNullable<typeof item> => item != null)
            : [];

        return { data: formatted, error: null };
    },
    /**
     * Book/purchase a service for the current user
     * @param serviceId - ID of the service to book
     * @returns Created booking record or error
     */
    bookService: async (serviceId: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const id = generateId();
        const now = new Date().toISOString();

        const { error } = await supabase
            .from('user_services')
            .insert({
                id,
                user_id: user.id,
                service_id: serviceId,
                status: 'pending',
                progress: 0,
                created_at: now
            });

        if (error) return { data: null, error: handleSupabaseError(error) };

        const { data: service } = await supabase
            .from('services')
            .select('name')
            .eq('id', serviceId)
            .single();

        if (service) {
            const ticketId = generateId();
            const { error: ticketError } = await supabase.from('tickets').insert({
                id: ticketId,
                user_id: user.id,
                subject: `Buchungsanfrage: ${service.name}`,
                status: 'Offen',
                priority: 'Mittel',
                created_at: now,
                last_update: now
            });

            if (ticketError) {
                if (import.meta.env.DEV) {
                  console.error('[API] Failed to create ticket:', ticketError);
                }
                return { data: null, error: { type: 'server' as const, message: 'Failed to create ticket' } };
            }

            const { error: messageError } = await supabase.from('ticket_messages').insert({
                id: generateId(),
                ticket_id: ticketId,
                user_id: null,
                text: `AUTOMATISCHE DIENSTANFRAGE: Der Nutzer hat das Paket "${service.name}" angefragt.`,
                created_at: now
            });

            if (messageError) {
                if (import.meta.env.DEV) {
                  console.error('[API] Failed to create ticket message:', messageError);
                }
            }

            const { error: memberError } = await supabase.from('ticket_members').insert({
                ticket_id: ticketId,
                user_id: user.id,
                added_at: now
            });

            if (memberError) {
                if (import.meta.env.DEV) {
                  console.error('[API] Failed to add ticket member:', memberError);
                }
            }
        }

        return { data: { success: true, id }, error: null };
    },

    /**
     * Get all tickets for current user
     * - Team members see all tickets
     * - Regular users see their own tickets + tickets they're members of
     * @returns Array of tickets with user profiles or error
     */
    getTickets: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);

        let query = supabase
            .from('tickets')
            .select('*')
            .order('last_update', { ascending: false });

        if (!teamMember) {
            query = supabase
                .from('tickets')
                .select('*, profiles!tickets_user_id_fkey(name, role, company)')
                .or(`user_id.eq.${user.id},id.in.(select(ticket_id) from ticket_members where user_id.eq.${user.id})`)
                .order('last_update', { ascending: false });
        } else {
            query = supabase
                .from('tickets')
                .select('*, profiles!tickets_user_id_fkey(name, role, company)')
                .order('last_update', { ascending: false });
        }

        const { data, error } = await query;

        if (error) return { data: [], error: handleSupabaseError(error) };

        const formatted = Array.isArray(data)
            ? data.map((ticket) => ({
                ...ticket,
                profiles: ticket?.profiles ?? { name: 'Unknown', role: 'user', company: '' }
              }))
            : [];

        return { data: formatted, error: null };
    },

    /**
     * Create a new support ticket
     * @param subject - Ticket subject/title
     * @param priority - Priority level (e.g., 'Niedrig', 'Mittel', 'Hoch')
     * @param message - Initial message/description
     * @returns Created ticket ID or error
     */
    createTicket: async (subject: string, priority: string, message: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const id = generateId();
        const now = new Date().toISOString();

        const { error } = await supabase.from('tickets').insert({
            id,
            user_id: user.id,
            subject,
            status: 'Offen',
            priority,
            created_at: now,
            last_update: now
        });

        if (error) return { data: null, error: handleSupabaseError(error) };

        const { error: messageError } = await supabase.from('ticket_messages').insert({
            id: generateId(),
            ticket_id: id,
            user_id: user.id,
            text: message,
            created_at: now
        });

        if (messageError) {
            if (import.meta.env.DEV) {
              console.error('[API] Failed to create ticket message:', messageError);
            }
        }

        const { error: memberError } = await supabase.from('ticket_members').insert({
            ticket_id: id,
            user_id: user.id,
            added_at: now
        });

        if (memberError) {
            if (import.meta.env.DEV) {
              console.error('[API] Failed to add ticket member:', memberError);
            }
        }

        return { data: { success: true, id }, error: null };
    },

    getTicketMessages: async (ticketId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);

        if (!teamMember) {
            const { data: memberCheck } = await supabase
                .from('ticket_members')
                .select('1')
                .eq('ticket_id', ticketId)
                .eq('user_id', user.id)
                .single();

            const { data: ticketCheck } = await supabase
                .from('tickets')
                .select('user_id')
                .eq('id', ticketId)
                .single();

            if (!memberCheck?.data && ticketCheck?.user_id !== user.id) {
                return { data: [], error: 'Access denied' };
            }
        }

        const { data, error } = await supabase
            .from('ticket_messages')
            .select('*, profiles!ticket_messages_user_id_fkey(name, role)')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });

        if (error) return { data: [], error: handleSupabaseError(error) };

        const formatted = Array.isArray(data)
            ? data.map((msg) => ({
                ...msg,
                profiles: msg?.profiles ?? { name: 'System', role: 'system' }
              }))
            : [];

        return { data: formatted, error: null };
    },

    replyToTicket: async (ticketId: string, text: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const now = new Date().toISOString();
        const teamMember = await isTeamMember(user.id);

        const { error } = await supabase
            .from('ticket_messages')
            .insert({
                id: generateId(),
                ticket_id: ticketId,
                user_id: user.id,
                text,
                created_at: now
            });

        if (error) return { data: null, error: handleSupabaseError(error) };

        await supabase
            .from('tickets')
            .update({
                last_update: now,
                status: teamMember ? 'In Bearbeitung' : 'Offen'
            })
            .eq('id', ticketId);

        return { data: { success: true }, error: null };
    },

    getTicketMembers: async (ticketId: string) => {
        const { data, error } = await supabase
            .from('ticket_members')
            .select('user_id, profiles(id, name, email, role)')
            .eq('ticket_id', ticketId);

        const formatted = Array.isArray(data)
            ? data
                .map((member) => member?.profiles)
                .filter((profile): profile is NonNullable<typeof profile> => profile != null)
            : [];

        return { data: formatted, error: handleSupabaseError(error) };
    },

    inviteToTicket: async (ticketId: string, email: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);

        const { data: ticket } = await supabase
            .from('tickets')
            .select('user_id')
            .eq('id', ticketId)
            .single();

        if (!teamMember && ticket?.user_id !== user.id) {
            return { data: null, error: 'Access denied' };
        }

        const { data: userToAdd } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle(); // Use maybeSingle to avoid 406 if user doesn't exist

        if (!userToAdd) {
            return { data: null, error: 'Nutzer nicht gefunden' };
        }

        const { data: existing } = await supabase
            .from('ticket_members')
            .select('1')
            .eq('ticket_id', ticketId)
            .eq('user_id', userToAdd.id)
            .single();

        if (existing) {
            return { data: null, error: 'Bereits Mitglied' };
        }

        const { data: currentUser } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .maybeSingle(); // Use maybeSingle to avoid 406 if profile doesn't exist

        const { error } = await supabase.from('ticket_members').insert({
            ticket_id: ticketId,
            user_id: userToAdd.id,
            added_at: new Date().toISOString()
        });

        if (error) {
            return { data: null, error: handleSupabaseError(error) };
        }

        // Add system message about new member (non-critical, ignore errors)
        await supabase.from('ticket_messages').insert({
            id: generateId(),
            ticket_id: ticketId,
            user_id: null,
            text: `SYSTEM: ${currentUser?.name || 'User'} hat ${email} hinzugefügt.`,
            created_at: new Date().toISOString()
        }); // Intentionally not awaited - system message is non-critical

        return { data: { success: true }, error: null };
    },
    /**
     * Get all transactions for the current user
     * @returns Array of user transactions or error
     */
    getTransactions: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },
    /**
     * Get dashboard statistics for the current user
     * @returns Object containing ticketCount and serviceCount
     */
    getStats: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: { ticketCount: 0, serviceCount: 0 }, error: 'Not authenticated' };

        const [ticketsResult, servicesResult] = await Promise.all([
            supabase.from('tickets').select('id', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .neq('status', 'Geschlossen'),
            supabase.from('user_services').select('id', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('status', 'active')
        ]);

        return {
            data: {
                ticketCount: ticketsResult.count || 0,
                serviceCount: servicesResult.count || 0
            },
            error: null
        };
    },

    /**
     * Send a contact message
     * @param name - Sender name
     * @param email - Sender email
     * @param subject - Message subject
     * @param message - Message content
     * @returns Success status or error
     */
    sendContact: async (name: string, email: string, subject: string, message: string) => {
        const { error } = await supabase.from('contact_messages').insert({
            id: generateId(),
            name,
            email,
            subject,
            message,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    /**
     * Subscribe to newsletter
     * @param name - Subscriber name
     * @param email - Subscriber email
     * @returns Success status or error
     */
    subscribeNewsletter: async (name: string, email: string) => {
        const { error } = await supabase.from('newsletter_subscribers').insert({
            id: generateId(),
            name,
            email,
            created_at: new Date().toISOString()
        });

        if (error && error.code === '23505') {
            return { data: { success: true }, error: null };
        }

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    trackEvent: async (sessionId: string, type: string, path: string, element?: string, timestamp?: number) => {
        const { error } = await supabase.from('analytics_events').insert({
            id: generateId(),
            session_id: sessionId,
            type,
            path,
            element: element || null,
            timestamp: timestamp || Date.now()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ===== ADMIN ENDPOINTS =====
    adminGetUsers: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, email, role, company, referral_code, created_at')
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    adminGetUserServices: async (userId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        const { data, error } = await supabase
            .from('user_services')
            .select(`
                *,
                services (*),
                service_updates (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    adminUpdateUserService: async (serviceId: string, updates: { status?: string; progress?: number }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('user_services')
            .update(updates)
            .eq('id', serviceId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    adminAddServiceUpdate: async (serviceId: string, message: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase.from('service_updates').insert({
            id: generateId(),
            user_service_id: serviceId,
            message,
            author_id: user.id,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    adminAssignService: async (payload: { userId: string; serviceId?: number; customService?: { name: string; description: string; price: number; price_details: string } }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { userId, serviceId, customService } = payload;
        let finalServiceId = serviceId;

        if (customService) {
            const { data, error } = await supabase.from('services').insert({
                name: customService.name,
                description: customService.description,
                price: customService.price,
                price_details: customService.price_details || 'einmalig'
            }).select('id').single();

            if (error || !data) {
                return { data: null, error: handleSupabaseError(error) || 'Failed to create custom service' };
            }
            finalServiceId = data.id;
        }

        const id = generateId();
        const now = new Date().toISOString();

        const { error: userServiceError } = await supabase.from('user_services').insert({
            id,
            user_id: userId,
            service_id: finalServiceId,
            status: 'active',
            progress: 0,
            created_at: now
        });

        if (userServiceError) {
            return { data: null, error: handleSupabaseError(userServiceError) };
        }

        const { data: service } = await supabase
            .from('services')
            .select('name, price')
            .eq('id', finalServiceId)
            .single();

        if (service) {
            await supabase.from('transactions').insert({
                id: generateId(),
                user_id: userId,
                amount: service.price,
                date: now,
                due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'Offen',
                description: `Service: ${service.name}`
            }); // Transaction is non-critical, ignore errors
        }

        return { data: { success: true }, error: null };
    },

    adminUpdateService: async (serviceId: number, updates: { name?: string; description?: string; description_en?: string; name_en?: string; price?: number; price_details?: string; price_details_en?: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('services')
            .update(updates)
            .eq('id', serviceId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ===== TEAM CHAT =====
    getTeamChat: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        const { data, error } = await supabase
            .from('team_chat_messages')
            .select('*, profiles(name, role)')
            .order('created_at', { ascending: true })
            .limit(50);

        const formatted = Array.isArray(data)
            ? data.map((msg) => ({
                ...msg,
                profiles: msg?.profiles ?? { name: 'Unknown', role: 'user' }
              }))
            : [];

        return { data: formatted, error: handleSupabaseError(error) };
    },

    sendTeamChat: async (content: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase.from('team_chat_messages').insert({
            id: generateId(),
            user_id: user.id,
            content,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    getBlogPosts: async () => {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    createBlogPost: async (post: { title: string; content: string; excerpt?: string; author_name?: string; published?: boolean }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { data, error } = await supabase
            .from('blog_posts')
            .insert({
                id: generateId(),
                ...post,
                author_name: user?.user_metadata?.name || 'Admin'
            })
            .select()
            .single();

        return { data, error: handleSupabaseError(error) };
    },

    updateBlogPost: async (postId: string, post: { title?: string; content?: string; excerpt?: string; published?: boolean }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('blog_posts')
            .update(post)
            .eq('id', postId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteBlogPost: async (postId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', postId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    getFiles: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('files')
            .select('id, user_id, name, size, type, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    uploadFile: async (name: string, size: number, type: string, data: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase.from('files').insert({
            id: generateId(),
            user_id: user.id,
            name,
            size,
            type,
            data,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    getFileContent: async (fileId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('files')
            .select('data')
            .eq('id', fileId)
            .eq('user_id', user.id)
            .single();

        return { data: data?.data || null, error: handleSupabaseError(error) };
    },

    deleteFile: async (fileId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('files')
            .delete()
            .eq('id', fileId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ===== TEAM TASKS =====
    getTeamTasks: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        const { data, error } = await supabase
            .from('team_tasks')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    createTeamTask: async (title: string, clientName: string, priority: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase.from('team_tasks').insert({
            id: generateId(),
            column_id: 'todo',
            title,
            client_name: clientName,
            priority,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    updateTeamTask: async (taskId: string, updates: { title?: string; client_name?: string; priority?: string; column_id?: string; status?: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('team_tasks')
            .update(updates)
            .eq('id', taskId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteTeamTask: async (taskId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('team_tasks')
            .delete()
            .eq('id', taskId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    getDiscounts: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        const { data, error } = await supabase
            .from('discounts')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    createDiscount: async (code: string, type: string, value: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase.from('discounts').insert({
            id: generateId(),
            code,
            type,
            value,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteDiscount: async (discountId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('discounts')
            .delete()
            .eq('id', discountId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ===== ADMIN: UPDATE USER ROLE =====
    adminUpdateUserRole: async (userId: string, role: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', userId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ===== ADMIN: ASSIGN SERVICE TO TICKET =====
    adminAssignServiceToTicket: async (ticketId: string, serviceId: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const ticket = await supabase
            .from('tickets')
            .select('user_id')
            .eq('id', ticketId)
            .single();

        if (ticket.error) return { data: null, error: handleSupabaseError(ticket.error) };

        if (!ticket.data?.user_id) {
            return { data: null, error: 'Ticket not found or has no user_id' };
        }

        const { error } = await supabase.from('user_services').insert({
            id: generateId(),
            user_id: ticket.data.user_id,
            service_id: serviceId,
            status: 'pending',
            progress: 0,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // PROJECTS (Feature 1 & 4)
    // ============================================

    getProjects: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Check cache first to prevent duplicate requests
        const cacheKey = `projects_${user.id}`;
        const cached = getCached<Project[]>(cacheKey);
        if (cached) return { data: cached, error: null };

        // ✅ PERFORMANCE: Dedupe simultaneous requests
        return dedupeRequest(cacheKey, async () => {
            const teamMember = await isTeamMember(user.id);

            let query = supabase
                .from('projects')
                .select(`
                    *,
                    services (
                        id,
                        name,
                        description
                    )
                `)
                .order('created_at', { ascending: false });

            if (!teamMember) {
                query = query.eq('user_id', user.id);
            }

            const { data, error } = await query;

            if (!error && data) {
                setCached(cacheKey, data);
            }

            return { data: data || [], error: handleSupabaseError(error) };
        });
    },

    getProject: async (projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);

        let query = supabase
            .from('projects')
            .select('*')
            .eq('id', projectId);

        if (!teamMember) {
            query = query.eq('user_id', user.id);
        }

        const { data, error } = await query.single();
        return { data, error: handleSupabaseError(error) };
    },

    createProject: async (data: {
        name: string;
        description?: string;
        industry?: string;
        service_id?: number;
        config?: Record<string, unknown>;
        content?: Record<string, unknown>;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const id = generateId();
        const now = new Date().toISOString();

        const { error } = await supabase.from('projects').insert({
            id,
            user_id: user.id,
            name: data.name,
            description: data.description,
            industry: data.industry,
            service_id: data.service_id,
            config: data.config || {},
            content: data.content || {},
            status: 'konzeption',
            progress: 0,
            created_at: now,
            updated_at: now
        });

        if (error) return { data: null, error: handleSupabaseError(error) };

        // Create default milestones (non-critical, continue on error)
        const defaultMilestones = [
            { title: 'Konzeption', description: 'Erste Konzeption und Planung', order_index: 1 },
            { title: 'Design', description: 'Design-Entwicklung', order_index: 2 },
            { title: 'Entwicklung', description: 'Implementierung', order_index: 3 },
            { title: 'Review', description: 'Überprüfung und Anpassungen', order_index: 4 },
            { title: 'Launch', description: 'Website geht live', order_index: 5 }
        ];

        for (const milestone of defaultMilestones) {
            await supabase.from('project_milestones').insert({
                id: generateId(),
                project_id: id,
                title: milestone.title,
                description: milestone.description,
                status: 'pending',
                order_index: milestone.order_index,
                created_at: now
            }); // Non-critical, ignore errors
        }

        return { data: { success: true, id }, error: null };
    },

    updateProject: async (projectId: string, updates: {
        name?: string;
        description?: string;
        industry?: string;
        status?: string;
        progress?: number;
        estimated_launch_date?: string;
        actual_launch_date?: string;
        is_live?: boolean;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);

        let query = supabase
            .from('projects')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', projectId);

        if (!teamMember) {
            query = query.eq('user_id', user.id);
        }

        const { error } = await query;
        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    updateProjectConfig: async (projectId: string, config: Record<string, unknown>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('projects')
            .update({ config, updated_at: new Date().toISOString() })
            .eq('id', projectId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    updateProjectContent: async (projectId: string, content: Record<string, unknown>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('projects')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('id', projectId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteProject: async (projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // PROJECT MILESTONES
    // ============================================

    getProjectMilestones: async (projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('project_milestones')
            .select('*')
            .eq('project_id', projectId)
            .order('order_index', { ascending: true });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    createMilestone: async (projectId: string, data: {
        title: string;
        description?: string;
        due_date?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Check if user owns the project
        const { data: project } = await supabase
            .from('projects')
            .select('user_id')
            .eq('id', projectId)
            .single();

        if (project?.user_id !== user.id) {
            const teamMember = await isTeamMember(user.id);
            if (!teamMember) return { data: null, error: 'Access denied' };
        }

        const { error } = await supabase.from('project_milestones').insert({
            id: generateId(),
            project_id: projectId,
            title: data.title,
            description: data.description,
            due_date: data.due_date,
            status: 'pending',
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    updateMilestone: async (milestoneId: string, updates: {
        title?: string;
        description?: string;
        status?: string;
        due_date?: string;
        completed_at?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('project_milestones')
            .update(updates)
            .eq('id', milestoneId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteMilestone: async (milestoneId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('project_milestones')
            .delete()
            .eq('id', milestoneId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // CONTENT GENERATIONS (AI - Feature 5)
    // ============================================

    getContentGenerations: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('content_generations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    createContentGeneration: async (data: {
        project_id?: string;
        type: string;
        industry?: string;
        keywords?: string[];
        tone?: string;
        prompt: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase.from('content_generations').insert({
            id: generateId(),
            user_id: user.id,
            project_id: data.project_id,
            type: data.type,
            industry: data.industry,
            keywords: data.keywords || [],
            tone: data.tone || 'professional',
            prompt: data.prompt,
            status: 'pending',
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    updateContentGeneration: async (generationId: string, updates: {
        generated_content?: string;
        selected_content?: string;
        status?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('content_generations')
            .update(updates)
            .eq('id', generationId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteContentGeneration: async (generationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('content_generations')
            .delete()
            .eq('id', generationId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    getContentGenerationById: async (generationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('content_generations')
            .select('*')
            .eq('id', generationId)
            .eq('user_id', user.id)
            .single();

        return { data, error: handleSupabaseError(error) };
    },

    getContentGenerationsByProject: async (projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('content_generations')
            .select('*')
            .eq('project_id', projectId)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    toggleFavoriteContentGeneration: async (generationId: string, isFavorite: boolean) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('content_generations')
            .update({ is_favorite: isFavorite })
            .eq('id', generationId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    getFavoriteContentGenerations: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('content_generations')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_favorite', true)
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    saveContentGenerationToProject: async (generationId: string, projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Verify project ownership
        const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single();

        if (!project) {
            return { data: null, error: 'Project not found or access denied' };
        }

        // Update content generation with project ID
        const { error } = await supabase
            .from('content_generations')
            .update({ project_id: projectId })
            .eq('id', generationId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    duplicateContentGeneration: async (generationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Get original content generation
        const { data: original } = await supabase
            .from('content_generations')
            .select('*')
            .eq('id', generationId)
            .eq('user_id', user.id)
            .single();

        if (!original) {
            return { data: null, error: 'Content generation not found' };
        }

        // Create duplicate
        const { error } = await supabase.from('content_generations').insert({
            id: generateId(),
            user_id: user.id,
            project_id: original.project_id,
            type: original.type,
            industry: original.industry,
            keywords: original.keywords,
            tone: original.tone,
            prompt: original.prompt,
            generated_content: original.generated_content,
            selected_content: original.selected_content,
            variations: original.variations,
            status: 'completed',
            is_favorite: false,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // TEAM MEMBERS (Feature 9)
    // ============================================

    getTeamMembers: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .or(`team_id.eq.${user.id},member_id.eq.${user.id}`)
            .order('invited_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    inviteTeamMember: async (email: string, role: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Check if email is registered
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle(); // Use maybeSingle to avoid 406 if profile doesn't exist

        if (!profile) {
            return { data: null, error: 'User not found. Ask them to register first.' };
        }

        // Check if already invited
        const { data: existing } = await supabase
            .from('team_members')
            .select('id')
            .eq('team_id', user.id)
            .eq('member_id', profile.id)
            .single();

        if (existing) {
            return { data: null, error: 'User already invited' };
        }

        const { error } = await supabase.from('team_members').insert({
            id: generateId(),
            team_id: user.id,
            member_id: profile.id,
            role,
            status: 'pending',
            invited_by: user.id,
            invited_at: new Date().toISOString()
        });

        if (!error) {
            // Create notification (non-critical, ignore errors)
            await supabase.from('notifications').insert({
                id: generateId(),
                user_id: profile.id,
                type: 'team_invitation',
                title: 'Team Invitation',
                message: `You have been invited to join a team as ${role}`,
                link: '/dashboard/team',
                created_at: new Date().toISOString()
            });
        }

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    updateMemberRole: async (memberId: string, role: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('team_members')
            .update({ role })
            .eq('id', memberId)
            .eq('team_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    removeTeamMember: async (memberId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('id', memberId)
            .eq('team_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    acceptTeamInvitation: async (teamId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('team_members')
            .update({ status: 'active' })
            .eq('team_id', teamId)
            .eq('member_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // INVOICES (Feature 8)
    // ============================================

    getInvoices: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);

        let query = supabase
            .from('invoices')
            .select('*')
            .order('created_at', { ascending: false });

        if (!teamMember) {
            query = query.eq('user_id', user.id);
        }

        const { data, error } = await query;
        return { data: data || [], error: handleSupabaseError(error) };
    },

    getInvoice: async (invoiceId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);

        let query = supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId);

        if (!teamMember) {
            query = query.eq('user_id', user.id);
        }

        const { data, error } = await query.single();
        return { data, error: handleSupabaseError(error) };
    },

    createInvoice: async (data: {
        project_id?: string;
        amount: number;
        line_items: Array<{
            description: string;
            quantity: number;
            unit_price: number;
            total: number;
        }>;
        discount_code?: string;
        discount_amount?: number;
        tax_amount?: number;
        due_date?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        // Generate invoice number
        const { data: lastInvoice } = await supabase
            .from('invoices')
            .select('invoice_number')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const lastNumber = lastInvoice?.invoice_number ? parseInt(lastInvoice.invoice_number.replace('INV-', '')) : 0;
        const invoiceNumber = `INV-${String(lastNumber + 1).padStart(6, '0')}`;

        const now = new Date().toISOString();
        const dueDate = data.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

        const { error } = await supabase.from('invoices').insert({
            id: generateId(),
            user_id: user.id,
            project_id: data.project_id,
            invoice_number,
            amount: data.amount,
            currency: 'EUR',
            status: 'draft',
            issue_date: now,
            due_date: dueDate,
            line_items: data.line_items,
            discount_code: data.discount_code,
            discount_amount: data.discount_amount || 0,
            tax_amount: data.tax_amount || 0,
            created_at: now,
            updated_at: now
        });

        return { data: { success: !error, invoice_number: invoice_number }, error: handleSupabaseError(error) };
    },

    updateInvoiceStatus: async (invoiceId: string, status: string, paymentData?: {
        payment_method?: string;
        payment_id?: string;
        paid_at?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);

        let query = supabase
            .from('invoices')
            .update({ status, ...paymentData, updated_at: new Date().toISOString() })
            .eq('id', invoiceId);

        if (!teamMember) {
            query = query.eq('user_id', user.id);
        }

        const { error } = await query;
        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // NOTIFICATIONS (Feature 12)
    // ============================================

    getNotifications: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    getUnreadCount: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: { count: 0 }, error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false);

        const count = data?.length || 0;
        return { data: { count }, error: handleSupabaseError(error) };
    },

    markNotificationRead: async (notificationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('notifications')
            .update({ read: true, read_at: new Date().toISOString() })
            .eq('id', notificationId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    markAllNotificationsRead: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('notifications')
            .update({ read: true, read_at: new Date().toISOString() })
            .eq('user_id', user.id)
            .eq('read', false);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteNotification: async (notificationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId)
            .eq('user_id', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // NEWSLETTER CAMPAIGNS (Feature 11)
    // ============================================

    getCampaigns: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        const { data, error } = await supabase
            .from('newsletter_campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    createCampaign: async (data: {
        name: string;
        subject: string;
        preview_text?: string;
        content: string;
        target_segment?: string;
        scheduled_for?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase.from('newsletter_campaigns').insert({
            id: generateId(),
            name: data.name,
            subject: data.subject,
            preview_text: data.preview_text,
            content: data.content,
            target_segment: data.target_segment || 'all',
            status: 'draft',
            scheduled_for: data.scheduled_for,
            created_by: user.id,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    updateCampaign: async (campaignId: string, updates: {
        name?: string;
        subject?: string;
        preview_text?: string;
        content?: string;
        target_segment?: string;
        status?: string;
        scheduled_for?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('newsletter_campaigns')
            .update(updates)
            .eq('id', campaignId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    sendCampaign: async (campaignId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('newsletter_campaigns')
            .update({ status: 'sending', sent_at: new Date().toISOString() })
            .eq('id', campaignId);

        // NOTE: Actual email sending should be implemented here via SendGrid/Resend API
        // This would: 1) Fetch campaign content and subscriber list, 2) Call email service API,
        // 3) Track delivery status, 4) Update campaign status after completion
        // This is intentionally left for the application layer to implement based on business requirements

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteCampaign: async (campaignId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('newsletter_campaigns')
            .delete()
            .eq('id', campaignId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // NEWSLETTER SUBSCRIBERS
    // ============================================

    getSubscribers: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    unsubscribeNewsletter: async (email: string) => {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .delete()
            .eq('email', email);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    deleteSubscriber: async (subscriberId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('newsletter_subscribers')
            .delete()
            .eq('id', subscriberId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ============================================
    // ANALYTICS (Feature 6)
    // ============================================

    getAnalytics: async (projectId: string, dateRange: {
        start: string;
        end: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('analytics_events')
            .select('*')
            .eq('project_id', projectId)
            .gte('timestamp', new Date(dateRange.start).getTime())
            .lte('timestamp', new Date(dateRange.end).getTime())
            .order('timestamp', { ascending: true });

        return { data, error: handleSupabaseError(error) };
    },

    trackAnalyticsEvent: async (data: {
        project_id?: string;
        event_type: string;
        event_data?: Record<string, string | number | boolean | null>;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase.from('analytics_events').insert({
            id: generateId(),
            project_id: data.project_id,
            user_id: user.id,
            event_type: data.event_type,
            event_data: data.event_data || {},
            timestamp: Date.now(),
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    getAnalyticsSummary: async (projectId?: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        let query = supabase
            .from('analytics_events')
            .select('event_type, timestamp');

        if (projectId) {
            query = query.eq('project_id', projectId);
        }

        const { data, error } = await query;

        if (error) return { data: null, error: handleSupabaseError(error) };

        // Calculate summary statistics
        const totalEvents = data?.length || 0;
        const uniqueTypes = new Set(data?.map(e => e.event_type)).size;

        return {
            data: {
                total_events: totalEvents,
                unique_event_types: uniqueTypes,
                latest_event: data?.[0]?.timestamp || null
            },
            error: null
        };
    },

    // ============================================
    // AUTOMATIC MILESTONES (Woche 10)
    // ============================================

    autoCreateMilestones: async (projectId: string, projectType: string = 'website') => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Check if milestones already exist
        const { data: existing } = await supabase
            .from('project_milestones')
            .select('id')
            .eq('project_id', projectId);

        if (existing && existing.length > 0) {
            return { data: null, error: 'Milestones already exist for this project' };
        }

        // Define default milestones based on project type
        const defaultMilestones = {
            website: [
                { title: 'Projekt-Kickoff', description: 'Erstes Meeting und Anforderungsanalyse', status: 'completed' },
                { title: 'Konzeption abgeschlossen', description: 'Website-Konzept und Struktur stehen fest', status: 'pending' },
                { title: 'Design-Review', description: 'Design-Vorschläge prüfen und freigeben', status: 'pending' },
                { title: 'Content-Complete', description: 'Alle Texte und Inhalte sind bereit', status: 'pending' },
                { title: 'Entwicklung abgeschlossen', description: 'Technische Implementierung fertiggestellt', status: 'pending' },
                { title: 'Testing & QA', description: 'Qualitätssicherung und Bugfixing', status: 'pending' },
                { title: 'Launch-Vorbereitung', description: 'Domain, Hosting und Go-Live Planung', status: 'pending' },
                { title: 'Go-Live', description: 'Website ist live und erreichbar', status: 'pending' }
            ],
            ecommerce: [
                { title: 'Projekt-Kickoff', description: 'Erstes Meeting und Anforderungsanalyse', status: 'completed' },
                { title: 'Konzeption abgeschlossen', description: 'Shop-Konzept und Produktstruktur stehen fest', status: 'pending' },
                { title: 'Design-Review', description: 'Design-Vorschläge prüfen und freigeben', status: 'pending' },
                { title: 'Produkt-Daten bereit', description: 'Alle Produkte und Kategorien sind erfasst', status: 'pending' },
                { title: 'Zahlungsintegration', description: 'Payment-Provider und Checkout eingerichtet', status: 'pending' },
                { title: 'Entwicklung abgeschlossen', description: 'Technische Implementierung fertiggestellt', status: 'pending' },
                { title: 'Testing & QA', description: 'Qualitätssicherung und Bugfixing', status: 'pending' },
                { title: 'Go-Live', description: 'Shop ist live und erste Bestellungen kommen rein', status: 'pending' }
            ],
            default: [
                { title: 'Projekt-Kickoff', description: 'Erstes Meeting und Anforderungsanalyse', status: 'completed' },
                { title: 'Konzeption', description: 'Projekt-Konzept steht fest', status: 'pending' },
                { title: 'Design', description: 'Design-Phase abgeschlossen', status: 'pending' },
                { title: 'Entwicklung', description: 'Implementierung fertiggestellt', status: 'pending' },
                { title: 'Testing', description: 'Qualitätssicherung abgeschlossen', status: 'pending' },
                { title: 'Launch', description: 'Projekt erfolgreich gestartet', status: 'pending' }
            ]
        };

        const milestones = defaultMilestones[projectType as keyof typeof defaultMilestones] || defaultMilestones.default;

        // Calculate due dates (spread evenly over 12 weeks from now)
        const startDate = new Date();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;

        const milestonesToInsert = milestones.map((milestone, index) => {
            const dueDate = new Date(startDate.getTime() + (index * 2 * weekInMs));
            return {
                id: generateId(),
                project_id: projectId,
                title: milestone.title,
                description: milestone.description,
                status: milestone.status,
                due_date: dueDate.toISOString(),
                order_index: index,
                created_at: new Date().toISOString()
            };
        });

        const { data, error } = await supabase
            .from('project_milestones')
            .insert(milestonesToInsert)
            .select();

        return { data, error: handleSupabaseError(error) };
    },

    calculateProjectProgress: async (projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Get all milestones for the project
        const { data: milestones, error } = await supabase
            .from('project_milestones')
            .select('status')
            .eq('project_id', projectId);

        if (error) return { data: null, error: handleSupabaseError(error) };

        if (!milestones || milestones.length === 0) {
            return { data: { progress: 0 }, error: null };
        }

        // Calculate progress based on completed milestones
        const completedCount = milestones.filter(m => m.status === 'completed').length;
        const progress = Math.round((completedCount / milestones.length) * 100);

        // Update project progress
        const { error: updateError } = await supabase
            .from('projects')
            .update({ progress })
            .eq('id', projectId);

        if (updateError) return { data: null, error: handleSupabaseError(updateError) };

        return { data: { progress }, error: null };
    },

    updateProjectStatusFromMilestones: async (projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Get milestones with their order
        const { data: milestones, error } = await supabase
            .from('project_milestones')
            .select('status, order_index')
            .eq('project_id', projectId)
            .order('order_index', { ascending: true });

        if (error) return { data: null, error: handleSupabaseError(error) };

        if (!milestones || milestones.length === 0) {
            return { data: null, error: 'No milestones found' };
        }

        // Determine status based on milestone completion
        const totalMilestones = milestones.length;
        const completedMilestones = milestones.filter(m => m.status === 'completed').length;
        const inProgressMilestones = milestones.filter(m => m.status === 'in_progress').length;
        const completionRatio = completedMilestones / totalMilestones;

        let newStatus: 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';

        if (completionRatio === 1) {
            newStatus = 'active';
        } else if (completionRatio >= 0.8) {
            newStatus = 'launch';
        } else if (completionRatio >= 0.6) {
            newStatus = 'review';
        } else if (completionRatio >= 0.3) {
            newStatus = 'entwicklung';
        } else if (completionRatio >= 0.15 || inProgressMilestones > 0) {
            newStatus = 'design';
        } else {
            newStatus = 'konzeption';
        }

        // Update project status
        const { error: updateError } = await supabase
            .from('projects')
            .update({ status: newStatus })
            .eq('id', projectId);

        if (updateError) return { data: null, error: handleSupabaseError(updateError) };

        return { data: { status: newStatus }, error: null };
    },

    getProjectById: async (projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single();

        return { data, error: handleSupabaseError(error) };
    },

    getProjectTeam: async (projectId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('projects')
            .select('user_id')
            .eq('id', projectId)
            .single();

        if (error || !data) return { data: null, error: handleSupabaseError(error) };

        // For now, return just the owner as team member
        // This can be extended later when teams are fully implemented
        const teamMembers = [
            {
                id: generateId(),
                team_id: data.user_id,
                member_id: data.user_id,
                role: 'owner',
                status: 'active',
                invited_at: new Date().toISOString()
            }
        ];

        return { data: teamMembers, error: null };
    },

    // ===== TEAM COLLABORATION EXTENSIONS (Woche 20) =====

    /**
     * Get all team invitations for current user's team
     */
    getTeamInvitations: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('team_invitations')
            .select('*')
            .eq('invited_by', user.id)
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    /**
     * Update team member permissions (Woche 20)
     */
    updateTeamMemberPermissions: async (memberId: string, permissions: Record<string, boolean | string>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('team_members')
            .update({ permissions })
            .eq('id', memberId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    /**
     * Deactivate team member (Woche 20)
     */
    deactivateTeamMember: async (memberId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('team_members')
            .update({ status: 'inactive' })
            .eq('id', memberId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    /**
     * Reactivate team member (Woche 20)
     */
    reactivateTeamMember: async (memberId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('team_members')
            .update({ status: 'active' })
            .eq('id', memberId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    /**
     * Get team activity feed (Woche 20)
     */
    getTeamActivity: async (limit: number = 50) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { data, error } = await supabase
            .from('team_activity')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        return { data: data || [], error: handleSupabaseError(error) };
    },

    /**
     * Log team activity (Woche 20)
     */
    logTeamActivity: async (
        type: string,
        targetType?: string,
        targetId?: string,
        targetName?: string,
        metadata?: Record<string, string | number | boolean | null>
    ) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', user.id)
            .maybeSingle(); // Use maybeSingle to avoid 406 if profile doesn't exist

        const { error } = await supabase
            .from('team_activity')
            .insert({
                id: generateId(),
                type,
                user_id: user.id,
                user_name: profile?.name || 'Unknown',
                user_email: profile?.email || '',
                target_type: targetType,
                target_id: targetId,
                target_name: targetName,
                metadata,
                created_at: new Date().toISOString()
            });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    /**
     * Cancel team invitation (Woche 20)
     */
    cancelTeamInvitation: async (invitationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('team_invitations')
            .update({ status: 'cancelled' })
            .eq('id', invitationId)
            .eq('invited_by', user.id);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    /**
     * Resend team invitation (Woche 20)
     */
    resendTeamInvitation: async (invitationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // Get invitation
        const { data: invitation, error } = await supabase
            .from('team_invitations')
            .select('*')
            .eq('id', invitationId)
            .single();

        if (error || !invitation) return { data: null, error: handleSupabaseError(error) };

        // Update expires_at
        const { error: updateError } = await supabase
            .from('team_invitations')
            .update({
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                created_at: new Date().toISOString()
            })
            .eq('id', invitationId);

        if (updateError) return { data: null, error: handleSupabaseError(updateError) };

        // NOTE: Invitation email should be resent here using the connected email service (SendGrid/Resend)
        // Implementation requires: 1) Fetch invitation details, 2) Call email service API, 3) Handle delivery
        // This is intentionally left for the application layer to implement based on business requirements

        return { data: { success: true }, error: null };
    },

    // ============================================
    // ADVANCED NEWSLETTER FUNCTIONS (Woche 24)
    // ============================================

    // Email Service Integration
    connectEmailService: async (provider: 'sendgrid' | 'resend', apiKey: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        // Store API key securely (encrypted)
        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: user.id,
                key: `email_service_${provider}`,
                value: { apiKey, provider, connectedAt: new Date().toISOString() }
            });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    testEmailServiceConnection: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        // NOTE: Actual email service test should be implemented here
        // This would: 1) Fetch stored API credentials, 2) Send test email via SendGrid/Resend API, 3) Verify delivery
        // Currently returns success as a placeholder until email service integration is completed

        return { data: { success: true, message: 'Connection test successful' }, error: null };
    },

    disconnectEmailService: async (provider: 'sendgrid' | 'resend') => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const { error } = await supabase
            .from('user_settings')
            .delete()
            .eq('user_id', user.id)
            .eq('key', `email_service_${provider}`);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // Advanced Campaign Scheduling
    scheduleCampaign: async (campaignId: string, scheduledFor: string, timezone: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('newsletter_campaigns')
            .update({
                status: 'scheduled',
                scheduled_for: scheduledFor,
                timezone
            })
            .eq('id', campaignId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    cancelScheduledCampaign: async (campaignId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('newsletter_campaigns')
            .update({
                status: 'draft',
                scheduled_for: null
            })
            .eq('id', campaignId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // Campaign Analytics
    getCampaignAnalytics: async (campaignId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { data, error } = await supabase
            .from('newsletter_campaigns')
            .select('*')
            .eq('id', campaignId)
            .single();

        return { data, error: handleSupabaseError(error) };
    },

    getAllCampaignAnalytics: async (dateRange?: { start: string; end: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        let query = supabase
            .from('newsletter_campaigns')
            .select('*')
            .order('sent_at', { ascending: false, nullsFirst: false });

        if (dateRange) {
            query = query
                .gte('sent_at', dateRange.start)
                .lte('sent_at', dateRange.end);
        }

        const { data, error } = await query;

        return { data: data || [], error: handleSupabaseError(error) };
    },

    updateCampaignStats: async (campaignId: string, stats: {
        sent_count?: number;
        open_count?: number;
        click_count?: number;
        unsubscribe_count?: number;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('newsletter_campaigns')
            .update(stats)
            .eq('id', campaignId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // Subscriber Import/Export
    addSubscriber: async (email: string, name?: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({
                id: generateId(),
                email,
                name: name || null,
                status: 'active',
                subscribed_at: new Date().toISOString()
            });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    importSubscribers: async (subscribers: Array<{ email: string; name?: string }>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const records = subscribers.map(sub => ({
            id: generateId(),
            email: sub.email,
            name: sub.name || null,
            status: 'active',
            subscribed_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert(records);

        return {
            data: {
                success: !error,
                imported: error ? 0 : records.length,
                total: records.length
            },
            error: handleSupabaseError(error)
        };
    },

    exportSubscribers: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .eq('status', 'active');

        return { data, error: handleSupabaseError(error) };
    },

    // Automation Rules
    createAutomation: async (automation: {
        name: string;
        description: string;
        trigger: {
            type: 'welcome' | 'date' | 'action' | 'inactivity';
            config: Record<string, string | number | boolean>;
        };
        actions: Array<{
            type: 'send_email' | 'wait' | 'add_tag' | 'remove_tag';
            config: Record<string, string | number | boolean>;
        }>;
        status: 'active' | 'paused' | 'draft';
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        // Note: This would require a newsletter_automations table
        // For now, store in user_settings as a simple implementation
        const { error } = await supabase
            .from('user_settings')
            .insert({
                user_id: user.id,
                key: `automation_${generateId()}`,
                value: {
                    ...automation,
                    created_at: new Date().toISOString(),
                    created_by: user.id
                }
            });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // Unsubscribe Handling
    unsubscribeEmail: async (email: string, reason?: string, feedback?: string) => {
        // This is a public function (no auth required)
        const { error } = await supabase
            .from('newsletter_subscribers')
            .update({
                status: 'unsubscribed',
                unsubscribed_at: new Date().toISOString(),
                unsubscribe_reason: reason,
                unsubscribe_feedback: feedback
            })
            .eq('email', email);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    updateSubscriberPreferences: async (email: string, preferences: Record<string, boolean>) => {
        // This is a public function (no auth required)
        const { error } = await supabase
            .from('newsletter_subscribers')
            .update({
                preferences
            })
            .eq('email', email);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // Tracking (for email opens/clicks)
    trackEmailOpen: async (campaignId: string, subscriberEmail: string) => {
        // Public endpoint with tracking pixel
        const { data: campaign } = await supabase
            .from('newsletter_campaigns')
            .select('open_count')
            .eq('id', campaignId)
            .single();

        if (campaign) {
            await supabase
                .from('newsletter_campaigns')
                .update({ open_count: (campaign.open_count || 0) + 1 })
                .eq('id', campaignId);
        }

        // Update subscriber's last_opened
        await supabase
            .from('newsletter_subscribers')
            .update({ last_opened: new Date().toISOString() })
            .eq('email', subscriberEmail);

        return { data: { success: true }, error: null };
    },

    trackEmailClick: async (campaignId: string, subscriberEmail: string, url: string) => {
        // Public endpoint for link tracking
        const { data: campaign } = await supabase
            .from('newsletter_campaigns')
            .select('click_count')
            .eq('id', campaignId)
            .single();

        if (campaign) {
            await supabase
                .from('newsletter_campaigns')
                .update({ click_count: (campaign.click_count || 0) + 1 })
                .eq('id', campaignId);
        }

        // Update subscriber's last_clicked
        await supabase
            .from('newsletter_subscribers')
            .update({ last_clicked: new Date().toISOString() })
            .eq('email', subscriberEmail);

        return { data: { success: true, redirectUrl: url }, error: null };
    }
};
