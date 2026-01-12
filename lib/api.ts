
// Supabase API Client for ScaleSite
import { supabase, UserProfile } from './supabase';

// Helper to check if user has team role
const isTeamMember = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
    return data?.role === 'team' || data?.role === 'owner';
};

// Generate UUID for new records
const generateId = () => crypto.randomUUID();

// Supabase error type
interface SupabaseError {
    message?: string;
    code?: string;
}

// Error wrapper
const handleSupabaseError = (error: SupabaseError | null): string | null => {
    if (error) {
        console.error('Supabase error:', error);
        return error.message || 'An error occurred';
    }
    return null;
};

export const api = {
    // ===== AUTH ENDPOINTS (handled by AuthContext) =====
    // Login, Register, Logout are now in AuthContext using Supabase Auth

    // ===== USER ENDPOINTS =====
    getMe: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return { data: { user: data }, error: handleSupabaseError(error) };
    },

    updateProfile: async (updates: { name?: string; company?: string; email?: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        return { data: { user: data }, error: handleSupabaseError(error) };
    },

    // ===== SERVICES =====
    getServices: async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id');
        return { data, error: handleSupabaseError(error) };
    },

    // ===== USER SERVICES =====
    getUserServices: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: 'Not authenticated' };

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

        // Format data to match expected structure
        const formatted = data?.map((row) => ({
            id: row.id,
            service_id: row.service_id,
            status: row.status,
            progress: row.progress,
            created_at: row.created_at,
            services: row.services
        })) || [];

        return { data: formatted, error: null };
    },

    bookService: async (serviceId: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

        const id = generateId();
        const now = new Date().toISOString();

        // Create user service
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

        // Get service details for ticket
        const { data: service } = await supabase
            .from('services')
            .select('name')
            .eq('id', serviceId)
            .single();

        // Create ticket
        if (service) {
            const ticketId = generateId();
            await supabase.from('tickets').insert({
                id: ticketId,
                user_id: user.id,
                subject: `Buchungsanfrage: ${service.name}`,
                status: 'Offen',
                priority: 'Mittel',
                created_at: now,
                last_update: now
            });

            await supabase.from('ticket_messages').insert({
                id: generateId(),
                ticket_id: ticketId,
                user_id: null,
                text: `AUTOMATISCHE DIENSTANFRAGE: Der Nutzer hat das Paket "${service.name}" angefragt.`,
                created_at: now
            });

            await supabase.from('ticket_members').insert({
                ticket_id: ticketId,
                user_id: user.id,
                added_at: now
            });
        }

        return { data: { success: true, id }, error: null };
    },

    // ===== TICKETS =====
    getTickets: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: 'Not authenticated' };

        // Check if user is team member
        const teamMember = await isTeamMember(user.id);

        let query = supabase
            .from('tickets')
            .select('*')
            .order('last_update', { ascending: false });

        if (!teamMember) {
            // Non-team users only see their own tickets or tickets they're members of
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

        // Format to match expected structure with profiles
        const formatted = data?.map((ticket) => ({
            ...ticket,
            profiles: ticket.profiles || { name: 'Unknown', role: 'user', company: '' }
        })) || [];

        return { data: formatted, error: null };
    },

    createTicket: async (subject: string, priority: string, message: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

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

        await supabase.from('ticket_messages').insert({
            id: generateId(),
            ticket_id: id,
            user_id: user.id,
            text: message,
            created_at: now
        });

        await supabase.from('ticket_members').insert({
            ticket_id: id,
            user_id: user.id,
            added_at: now
        });

        return { data: { success: true, id }, error: null };
    },

    getTicketMessages: async (ticketId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: 'Not authenticated' };

        const teamMember = await isTeamMember(user.id);

        // Check access
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

            if (!memberCheck && ticketCheck?.user_id !== user.id) {
                return { data: [], error: 'Access denied' };
            }
        }

        const { data, error } = await supabase
            .from('ticket_messages')
            .select('*, profiles!ticket_messages_user_id_fkey(name, role)')
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });

        if (error) return { data: [], error: handleSupabaseError(error) };

        const formatted = data?.map((msg) => ({
            ...msg,
            profiles: msg.profiles || { name: 'System', role: 'system' }
        })) || [];

        return { data: formatted, error: null };
    },

    replyToTicket: async (ticketId: string, text: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

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

        // Update ticket status and last_update
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

        const formatted = data?.map((member) => member.profiles) || [];

        return { data: formatted, error: handleSupabaseError(error) };
    },

    inviteToTicket: async (ticketId: string, email: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

        // Check if user is team member or ticket owner
        const teamMember = await isTeamMember(user.id);

        const { data: ticket } = await supabase
            .from('tickets')
            .select('user_id')
            .eq('id', ticketId)
            .single();

        if (!teamMember && ticket?.user_id !== user.id) {
            return { data: null, error: 'Access denied' };
        }

        // Find user by email
        const { data: userToAdd } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (!userToAdd) {
            return { data: null, error: 'Nutzer nicht gefunden' };
        }

        // Check if already member
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
            .single();

        const { error } = await supabase.from('ticket_members').insert({
            ticket_id: ticketId,
            user_id: userToAdd.id,
            added_at: new Date().toISOString()
        });

        if (error) {
            return { data: null, error: handleSupabaseError(error) };
        }

        await supabase.from('ticket_messages').insert({
            id: generateId(),
            ticket_id: ticketId,
            user_id: null,
            text: `SYSTEM: ${currentUser?.name || 'User'} hat ${email} hinzugefügt.`,
            created_at: new Date().toISOString()
        });

        return { data: { success: true }, error: null };
    },

    // ===== TRANSACTIONS =====
    getTransactions: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    // ===== STATS =====
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

    // ===== CONTACT =====
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

    // ===== NEWSLETTER =====
    subscribeNewsletter: async (name: string, email: string) => {
        const { error } = await supabase.from('newsletter_subscribers').insert({
            id: generateId(),
            name,
            email,
            created_at: new Date().toISOString()
        });

        // Ignore duplicate errors
        if (error && error.code === '23505') {
            return { data: { success: true }, error: null };
        }

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ===== ANALYTICS =====
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
        if (!user) return { data: [], error: 'Not authenticated' };

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
        if (!user) return { data: [], error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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

        await supabase.from('user_services').insert({
            id,
            user_id: userId,
            service_id: finalServiceId,
            status: 'active',
            progress: 0,
            created_at: now
        });

        // Get service details for transaction
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
            });
        }

        return { data: { success: true }, error: null };
    },

    adminUpdateService: async (serviceId: number, updates: { name?: string; description?: string; description_en?: string; name_en?: string; price?: number; price_details?: string; price_details_en?: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: [], error: 'Not authenticated' };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: [], error: 'Access denied' };

        const { data, error } = await supabase
            .from('team_chat_messages')
            .select('*, profiles(name, role)')
            .order('created_at', { ascending: true })
            .limit(50);

        const formatted = data?.map((msg) => ({
            ...msg,
            profiles: msg.profiles || { name: 'Unknown', role: 'user' }
        })) || [];

        return { data: formatted, error: handleSupabaseError(error) };
    },

    sendTeamChat: async (content: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

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

    // ===== BLOG =====
    getBlogPosts: async () => {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    createBlogPost: async (post: { title: string; content: string; excerpt?: string; author_name?: string; published?: boolean }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', postId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ===== FILES =====
    getFiles: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('files')
            .select('id, user_id, name, size, type, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        return { data: data || [], error: handleSupabaseError(error) };
    },

    uploadFile: async (name: string, size: number, type: string, data: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: [], error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const { error } = await supabase
            .from('team_tasks')
            .delete()
            .eq('id', taskId);

        return { data: { success: !error }, error: handleSupabaseError(error) };
    },

    // ===== DISCOUNTS =====
    getDiscounts: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { data: [], error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

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
        if (!user) return { data: null, error: 'Not authenticated' };

        const teamMember = await isTeamMember(user.id);
        if (!teamMember) return { data: null, error: 'Access denied' };

        const ticket = await supabase
            .from('tickets')
            .select('user_id')
            .eq('id', ticketId)
            .single();

        if (ticket.error) return { data: null, error: handleSupabaseError(ticket.error) };

        const { error } = await supabase.from('user_services').insert({
            id: generateId(),
            user_id: ticket.data!.user_id,
            service_id: serviceId,
            status: 'pending',
            progress: 0,
            created_at: new Date().toISOString()
        });

        return { data: { success: !error }, error: handleSupabaseError(error) };
    }
};
