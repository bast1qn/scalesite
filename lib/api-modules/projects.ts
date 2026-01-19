/**
 * API Modules - Projects
 *
 * Project management API functions
 * Single Responsibility: Handle all project-related operations
 */

import { supabase } from '../supabase';
import { generateId } from '../utils';
import { handleSupabaseError } from './error-handling';
import { getCached, setCached, dedupeRequest, CACHE_TTL } from './cache';
import type { Project, ProjectMilestone, Service } from '../types';

/**
 * Get all projects for current user
 */
export async function getProjects() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  // Check cache first
  const cacheKey = `projects_${user.id}`;
  const cached = getCached<Project[]>(cacheKey);
  if (cached) return { data: cached, error: null };

  // Dedupe simultaneous requests
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
}

/**
 * Get a single project by ID
 */
export async function getProject(projectId: string) {
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
}

/**
 * Create a new project
 */
export async function createProject(data: {
  name: string;
  description?: string;
  industry?: string;
  service_id?: number;
  config?: Record<string, unknown>;
  content?: Record<string, unknown>;
}) {
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
    status: 'planned',
    progress: 0,
    created_at: now,
    updated_at: now
  });

  if (error) return { data: null, error: handleSupabaseError(error) };

  return { data: { id }, error: null };
}

/**
 * Update project details
 */
export async function updateProject(projectId: string, updates: {
  name?: string;
  description?: string;
  industry?: string;
  status?: string;
  progress?: number;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .eq('user_id', user.id);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Update project configuration
 */
export async function updateProjectConfig(projectId: string, config: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('projects')
    .update({
      config,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .eq('user_id', user.id);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Update project content
 */
export async function updateProjectContent(projectId: string, content: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('projects')
    .update({
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .eq('user_id', user.id);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Get project milestones
 */
export async function getProjectMilestones(projectId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('project_milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('due_date', { ascending: true });

  return { data: data || [], error: handleSupabaseError(error) };
}

/**
 * Create a milestone
 */
export async function createMilestone(projectId: string, data: {
  title: string;
  description?: string;
  due_date?: string;
  status?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const id = generateId();
  const now = new Date().toISOString();

  const { error } = await supabase.from('project_milestones').insert({
    id,
    project_id: projectId,
    title: data.title,
    description: data.description,
    due_date: data.due_date,
    status: data.status || 'pending',
    created_at: now
  });

  return { data: { id }, error: handleSupabaseError(error) };
}

/**
 * Update a milestone
 */
export async function updateMilestone(milestoneId: string, updates: {
  title?: string;
  description?: string;
  due_date?: string;
  status?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('project_milestones')
    .update(updates)
    .eq('id', milestoneId);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Delete a milestone
 */
export async function deleteMilestone(milestoneId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('project_milestones')
    .delete()
    .eq('id', milestoneId);

  return { data: null, error: handleSupabaseError(error) };
}

// Helper function
async function isTeamMember(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  return data?.role === 'team' || data?.role === 'owner';
}
