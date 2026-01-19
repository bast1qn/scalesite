/**
 * API Modules - Content & Blog
 *
 * Content management API functions
 * Single Responsibility: Handle all content-related operations
 */

import { supabase } from '../supabase';
import { generateId } from '../utils';
import { handleSupabaseError } from './error-handling';
import type { BlogPost, ContentGeneration } from '../types';

/**
 * Get all blog posts
 */
export async function getBlogPosts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  const teamMember = await isTeamMember(user.id);

  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (!teamMember) {
    query = query.eq('author_id', user.id);
  }

  const { data, error } = await query;
  return { data: data || [], error: handleSupabaseError(error) };
}

/**
 * Create a new blog post
 */
export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const id = generateId();
  const now = new Date().toISOString();

  const { error } = await supabase.from('blog_posts').insert({
    id,
    author_id: user.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt,
    published: data.published ?? false,
    featured_image: data.featured_image,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    created_at: now,
    updated_at: now
  });

  return { data: { id }, error: handleSupabaseError(error) };
}

/**
 * Update a blog post
 */
export async function updateBlogPost(postId: string, updates: {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('blog_posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', postId)
    .eq('author_id', user.id);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Get all AI content generations
 */
export async function getContentGenerations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { data, error } = await supabase
    .from('content_generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data: data || [], error: handleSupabaseError(error) };
}

/**
 * Create a new content generation request
 */
export async function createContentGeneration(data: {
  project_id?: string;
  content_type: string;
  prompt: string;
  tone?: string;
  industry?: string;
  keywords?: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const id = generateId();
  const now = new Date().toISOString();

  const { error } = await supabase.from('content_generations').insert({
    id,
    user_id: user.id,
    project_id: data.project_id,
    content_type: data.content_type,
    prompt: data.prompt,
    tone: data.tone,
    industry: data.industry,
    keywords: data.keywords,
    status: 'pending',
    created_at: now
  });

  return { data: { id }, error: handleSupabaseError(error) };
}

/**
 * Update content generation result
 */
export async function updateContentGeneration(generationId: string, updates: {
  status?: string;
  result?: string;
  error?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('content_generations')
    .update(updates)
    .eq('id', generationId)
    .eq('user_id', user.id);

  return { data: null, error: handleSupabaseError(error) };
}

/**
 * Delete a content generation
 */
export async function deleteContentGeneration(generationId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { type: 'auth' as const, message: 'Not authenticated' } };

  const { error } = await supabase
    .from('content_generations')
    .delete()
    .eq('id', generationId)
    .eq('user_id', user.id);

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
