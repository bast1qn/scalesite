/**
 * Base Repository Implementation
 *
 * PURPOSE: Common repository functionality with caching and error handling
 * DESIGN PATTERN: Template Method Pattern
 * SOLID Compliance:
 * - Single Responsibility: Handles data access logic
 * - Open/Closed: Open for extension via inheritance, closed for modification
 * - Dependency Inversion: Depends on database interface (not concrete implementation)
 */

import type { IBaseRepository, IQuery } from './interfaces';
import { supabase } from '../supabase';

// ============================================================================
// QUERY IMPLEMENTATION
// ============================================================================

/**
 * Query builder implementation
 */
export class SupabaseQuery<T> implements IQuery<T> {
  private query: any;

  constructor(tableName: string) {
    this.query = supabase.from(tableName).select('*');
  }

  where(field: keyof T, operator: string, value: unknown): IQuery<T> {
    this.query = this.query.where(String(field), operator, value);
    return this;
  }

  orderBy(field: keyof T, direction: 'asc' | 'desc'): IQuery<T> {
    this.query = this.query.order(String(field), { ascending: direction === 'asc' });
    return this;
  }

  limit(count: number): IQuery<T> {
    this.query = this.query.limit(count);
    return this;
  }

  offset(count: number): IQuery<T> {
    this.query = this.query.range(count, count + 100); // Supabase uses range
    return this;
  }

  async execute(): Promise<T[]> {
    const { data, error } = await this.query;
    if (error) throw error;
    return data || [];
  }

  async first(): Promise<T | null> {
    const results = await this.limit(1).execute();
    return results[0] || null;
  }

  async count(): Promise<number> {
    const { count, error } = await this.query;
    if (error) throw error;
    return count || 0;
  }
}

// ============================================================================
// BASE REPOSITORY
// ============================================================================

/**
 * Abstract base repository with common CRUD operations
 * @template T - Entity type
 * @template ID - ID type (default: string)
 */
export abstract class BaseRepository<T, ID = string> implements IBaseRepository<T, ID> {
  protected tableName: string;
  protected cache: Map<string, { data: T; timestamp: number }> = new Map();
  protected cacheTTL: number = 60000; // 60 seconds default

  constructor(tableName: string, cacheTTL: number = 60000) {
    this.tableName = tableName;
    this.cacheTTL = cacheTTL;
  }

  // ==========================================================================
  // CACHE MANAGEMENT
  // ==========================================================================

  /**
   * Get cached value if available and not expired
   */
  protected getCached(id: ID): T | null {
    const key = this.getCacheKey(id);
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  /**
   * Set cached value
   */
  protected setCached(id: ID, data: T): void {
    const key = this.getCacheKey(id);
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Invalidate cache for specific entity
   */
  protected invalidateCache(id: ID): void {
    const key = this.getCacheKey(id);
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  protected clearCache(): void {
    this.cache.clear();
  }

  /**
   * Generate cache key
   */
  protected getCacheKey(id: ID): string {
    return `${this.tableName}_${String(id)}`;
  }

  // ==========================================================================
  // CRUD OPERATIONS
  // ==========================================================================

  /**
   * Find entity by ID
   */
  async findById(id: ID): Promise<T | null> {
    // Check cache first
    const cached = this.getCached(id);
    if (cached) return cached;

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    if (data) {
      this.setCached(id, data as T);
    }

    return data as T | null;
  }

  /**
   * Find all entities
   */
  async findAll(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');

    if (error) throw error;
    return (data || []) as T[];
  }

  /**
   * Create new entity
   */
  async create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(entity)
      .select()
      .single();

    if (error) throw error;
    return data as T;
  }

  /**
   * Update existing entity
   */
  async update(id: ID, updates: Partial<T>): Promise<T | null> {
    // Invalidate cache
    this.invalidateCache(id);

    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    if (data) {
      this.setCached(id, data as T);
    }

    return data as T | null;
  }

  /**
   * Delete entity
   */
  async delete(id: ID): Promise<boolean> {
    // Invalidate cache
    this.invalidateCache(id);

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') return false; // Not found
      throw error;
    }

    return true;
  }

  /**
   * Check if entity exists
   */
  async exists(id: ID): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }

  // ==========================================================================
  // QUERY BUILDER
  // ==========================================================================

  /**
   * Create query builder
   */
  query(): IQuery<T> {
    return new SupabaseQuery<T>(this.tableName);
  }
}
