/**
 * API Modules - Tickets
 *
 * Ticket management API functions
 * Single Responsibility: Handle all ticket-related operations
 */

import { supabase } from '../supabase';
import { generateId } from '../utils';
import { handleSupabaseError } from './error-handling';
import { isTeamMember } from './auth';
import type { Ticket, TicketMessage, TicketMember } from '../types';

/**
 * Get all tickets for current user
 */
export async function getTickets() {
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
}

/**
 * Create a new support ticket
 */
export async function createTicket(subject: string, priority: string, message: string) {
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

  // Create initial message
  const { error: msgError } = await supabase.from('ticket_messages').insert({
    id: generateId(),
    ticket_id: id,
    user_id: user.id,
    text: message,
    created_at: now
  });

  if (msgError) return { data: null, error: handleSupabaseError(msgError) };

  return { data: { id }, error: null };
}

/**
 * Get all messages for a ticket
 */
export async function getTicketMessages(ticketId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('ticket_messages')
    .select('*, profiles(name, role, company)')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  return { data: data || [], error: handleSupabaseError(error) };
}

/**
 * Get team members assigned to a ticket
 */
export async function getTicketMembers(ticketId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('ticket_members')
    .select('*, profiles(name, email)')
    .eq('ticket_id', ticketId);

  return { data: data || [], error: handleSupabaseError(error) };
}
