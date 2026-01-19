/**
 * API Modules - Billing & Transactions
 *
 * Billing and transaction management API functions
 * Single Responsibility: Handle all billing-related operations
 */

import { supabase } from '../supabase';
import { handleSupabaseError } from './error-handling';
import { isTeamMember } from './auth';
import type { Transaction, Discount, Invoice } from '../types';

/**
 * Get all transactions for current user
 */
export async function getTransactions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  const teamMember = await isTeamMember(user.id);

  let query = supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (!teamMember) {
    query = query.eq('user_id', user.id);
  }

  const { data, error } = await query;
  return { data: data || [], error: handleSupabaseError(error) };
}

/**
 * Get all discounts (admin/team only)
 */
export async function getDiscounts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: data || [], error: handleSupabaseError(error) };
}

/**
 * Create a new discount code (admin/team only)
 */
export async function createDiscount(data: {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  max_uses?: number;
  expires_at?: string;
  services?: number[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const id = generateId();
  const now = new Date().toISOString();

  const { error } = await supabase.from('discounts').insert({
    id,
    code: data.code.toUpperCase(),
    type: data.type,
    value: data.value,
    max_uses: data.max_uses,
    expires_at: data.expires_at,
    services: data.services,
    uses: 0,
    active: true,
    created_at: now
  });

  return { data: { id }, error: handleSupabaseError(error) };
}

/**
 * Delete a discount code (admin/team only)
 */
export async function deleteDiscount(discountId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('discounts')
    .delete()
    .eq('id', discountId);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Get invoices for current user
 */
export async function getInvoices() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data: data || [], error: handleSupabaseError(error) };
}

/**
 * Get a specific invoice
 */
export async function getInvoice(invoiceId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .eq('user_id', user.id)
    .single();

  return { data, error: handleSupabaseError(error) };
}

// Helper function
import { generateId } from '../utils';
