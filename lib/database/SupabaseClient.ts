/**
 * Supabase Implementation of Database Abstraction Layer
 *
 * Implements IDatabaseClient, IAuthClient, IStorageClient, IRealtimeClient
 * Follows Dependency Inversion Principle - depends on interfaces
 */

import { supabase } from '../supabase';
import type {
  IDatabaseClient,
  IAuthClient,
  IStorageClient,
  IRealtimeClient,
  IQueryBuilder,
  ITransaction,
  QueryResult,
  DatabaseError,
  PaginationOptions,
  IRepository
} from './IDatabaseClient';

/**
 * Convert Supabase error to DatabaseError
 */
function convertError(error: any): DatabaseError {
  if (!error) return null;

  return {
    message: error.message || 'Unknown database error',
    code: error.code,
    details: error.details,
    type: error.message?.toLowerCase().includes('auth')
      ? 'auth'
      : error.message?.toLowerCase().includes('not found')
      ? 'not_found'
      : error.message?.toLowerCase().includes('constraint')
      ? 'constraint'
      : 'unknown'
  };
}

/**
 * Supabase Query Builder Implementation
 * Implements fluent interface pattern
 */
export class SupabaseQueryBuilder<T = any> implements IQueryBuilder<T> {
  private query: any;
  private selectColumns: string | string[] = '*';
  private filters: any[] = [];
  private ordering: any = null;
  private limitValue?: number;
  private offsetValue?: number;

  constructor(private tableName: string) {
    this.query = supabase.from(this.tableName);
  }

  select(columns: string | string[] | { table: string; columns: string[] }[]): this {
    if (Array.isArray(columns)) {
      this.selectColumns = columns.join(', ');
    } else if (typeof columns === 'string') {
      this.selectColumns = columns;
    } else {
      // Handle nested selects: { table: 'profiles', columns: ['name', 'email'] }
      const nested = columns as { table: string; columns: string[] }[];
      this.selectColumns = nested.map(n => `${n.table}(${n.columns.join(', ')})`).join(', ');
    }
    return this;
  }

  where(column: string | any, operator?: string, value?: any): this {
    if (typeof column === 'string') {
      this.query = this.query.where(column, operator, value);
    } else {
      // Handle object filters: { id: '123', status: 'active' }
      Object.entries(column).forEach(([key, val]) => {
        this.query = this.query.eq(key, val);
      });
    }
    return this;
  }

  orWhere(column: string, operator: string, value: any): this {
    this.query = this.query.or(`${column}.${operator}.${value}`);
    return this;
  }

  join(table: string, column1: string, column2: string): this {
    // Supabase uses select with foreign key relationships
    this.selectColumns = `${this.selectColumns}, ${table}(*)`;
    return this;
  }

  leftJoin(table: string, column1: string, column2: string): this {
    // Same as join in Supabase
    return this.join(table, column1, column2);
  }

  orderBy(column: string, ascending: boolean = true): this {
    this.query = this.query.order(column, { ascending });
    return this;
  }

  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }

  offset(offset: number): this {
    this.offsetValue = offset;
    return this;
  }

  private buildQuery() {
    let q = this.query.select(this.selectColumns);

    if (this.limitValue !== undefined) {
      q = q.limit(this.limitValue);
    }

    if (this.offsetValue !== undefined) {
      q = q.range(this.offsetValue, this.offsetValue + (this.limitValue || 1000) - 1);
    }

    return q;
  }

  async single(): Promise<QueryResult<T>> {
    const { data, error } = await this.buildQuery().single();
    return {
      data,
      error: convertError(error)
    };
  }

  async maybeSingle(): Promise<QueryResult<T | null>> {
    const { data, error } = await this.buildQuery().maybeSingle();
    return {
      data,
      error: convertError(error)
    };
  }

  async many(): Promise<QueryResult<T[]>> {
    const { data, error } = await this.buildQuery();
    return {
      data: data || [],
      error: convertError(error)
    };
  }

  async count(): Promise<QueryResult<number>> {
    const { count, error } = await this.buildQuery();
    return {
      data: count || 0,
      error: convertError(error)
    };
  }
}

/**
 * Supabase Transaction Implementation
 */
class SupabaseTransaction implements ITransaction {
  constructor(private client: any) {}

  query<T>(table: string): IQueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(table);
  }

  async rollback(): Promise<void> {
    // Supabase handles rollback automatically on error
    throw new Error('Transaction rolled back');
  }

  async commit(): Promise<void> {
    // Supabase handles commit automatically
  }
}

/**
 * Supabase Database Client Implementation
 */
export class SupabaseDatabaseClient implements IDatabaseClient {
  private cacheEnabled = true;
  private cache = new Map<string, { data: any; expires: number }>();
  private defaultCacheTTL = 60000; // 1 minute

  /**
   * Get query builder for a table
   */
  from<T = any>(table: string): IQueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(table);
  }

  /**
   * Get repository for entity
   */
  repository<T extends IRepository<any>>(entity: string): T {
    throw new Error(`Repository ${entity} not implemented. Use custom repositories.`);
  }

  /**
   * Raw SQL query
   */
  async raw<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    const { data, error } = await supabase.rpc('exec_sql', { sql, params });
    return {
      data,
      error: convertError(error)
    };
  }

  /**
   * Find by ID
   */
  async findById<T>(id: string | number): Promise<QueryResult<T>> {
    // This needs a table context, so delegate to from()
    throw new Error('Use from(table).where("id", id).single() instead');
  }

  /**
   * Find one by filters
   */
  async findOne<T>(filters: Record<string, any>): Promise<QueryResult<T>> {
    throw new Error('Use from(table).where(filters).single() instead');
  }

  /**
   * Find many by filters
   */
  async findMany<T>(filters?: Record<string, any>): Promise<QueryResult<T[]>> {
    throw new Error('Use from(table).where(filters).many() instead');
  }

  /**
   * Find with pagination
   */
  async findWithPagination<T>(
    filters: Record<string, any>,
    pagination: PaginationOptions
  ): Promise<QueryResult<T[]>> {
    throw new Error('Use from(table).where(filters).limit().offset().many() instead');
  }

  /**
   * Check if record exists
   */
  async exists(filters: Record<string, any>): Promise<boolean> {
    throw new Error('Use from(table).where(filters).count() instead');
  }

  /**
   * Create record
   */
  async create<T>(data: Partial<T>): Promise<QueryResult<T>> {
    throw new Error('Use from(table).insert(data).single() instead');
  }

  /**
   * Create many records
   */
  async createMany<T>(data: Partial<T>[]): Promise<QueryResult<T[]>> {
    throw new Error('Use from(table).insert(data).many() instead');
  }

  /**
   * Update record
   */
  async update<T>(id: string | number, data: Partial<T>): Promise<QueryResult<T>> {
    throw new Error('Use from(table).update(data).eq("id", id).single() instead');
  }

  /**
   * Update many records
   */
  async updateMany<T>(
    filters: Record<string, any>,
    data: Partial<T>
  ): Promise<QueryResult<T[]>> {
    throw new Error('Use from(table).update(data).where(filters).many() instead');
  }

  /**
   * Delete record
   */
  async delete(id: string | number): Promise<QueryResult<void>> {
    throw new Error('Use from(table).delete().eq("id", id) instead');
  }

  /**
   * Delete many records
   */
  async deleteMany(filters: Record<string, any>): Promise<QueryResult<void>> {
    throw new Error('Use from(table).delete().where(filters) instead');
  }

  /**
   * Enable caching
   */
  withCache(ttl: number = this.defaultCacheTTL): this {
    this.cacheEnabled = true;
    this.defaultCacheTTL = ttl;
    return this;
  }

  /**
   * Disable caching
   */
  withoutCache(): this {
    this.cacheEnabled = false;
    return this;
  }

  /**
   * Invalidate cache
   */
  async invalidateCache(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Execute transaction
   */
  async transaction<T>(
    callback: (trx: ITransaction) => Promise<T>
  ): Promise<QueryResult<T>> {
    try {
      const trx = new SupabaseTransaction(supabase);
      const result = await callback(trx);
      return { data: result, error: null };
    } catch (error) {
      return {
        data: null,
        error: convertError(error)
      };
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await supabase.from('_health_check').select('*').limit(1);
      return !error || error.message.includes('does not exist'); // Table doesn't exist is ok
    } catch {
      return false;
    }
  }
}

/**
 * Supabase Auth Client Implementation
 */
export class SupabaseAuthClient implements IAuthClient {
  private auth = supabase.auth;

  async getUser() {
    return await this.auth.getUser();
  }

  async signUp(email: string, password: string, metadata?: any) {
    return await this.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  }

  async signIn(email: string, password: string) {
    return await this.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut() {
    await this.auth.signOut();
  }

  async resetPassword(email: string) {
    await this.auth.resetPasswordForEmail(email);
  }

  async updatePassword(newPassword: string) {
    await this.auth.updateUser({ password: newPassword });
  }

  async getSession() {
    return await this.auth.getSession();
  }

  async setSession(accessToken: string, refreshToken: string) {
    await this.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  }

  async refreshSession() {
    return await this.auth.refreshSession();
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.auth.onAuthStateChange((_event, session) => {
      callback(_event, session);
    });
  }
}

/**
 * Supabase Storage Client Implementation
 */
export class SupabaseStorageClient implements IStorageClient {
  async upload(path: string, file: File | Blob, options?: any) {
    return await supabase.storage.from(options?.bucket || 'uploads').upload(path, file, options);
  }

  async download(path: string) {
    const { data, error } = await supabase.storage.from('uploads').download(path);
    if (error) throw error;
    return data;
  }

  getPublicUrl(path: string): string {
    const { data } = supabase.storage.from('uploads').getPublicUrl(path);
    return data.publicUrl;
  }

  async getSignedUrl(path: string, expiresIn: number = 60): Promise<string> {
    const { data, error } = await supabase.storage.from('uploads').createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  }

  async delete(path: string | string[]) {
    return await supabase.storage.from('uploads').remove(Array.isArray(path) ? path : [path]);
  }

  async list(path?: string) {
    return await supabase.storage.from('uploads').list(path || '');
  }
}

/**
 * Supabase Realtime Client Implementation
 */
export class SupabaseRealtimeClient implements IRealtimeClient {
  subscribe(
    table: string,
    filter: { event: string; schema?: string; filter?: string },
    callback: (payload: any) => void
  ) {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: filter.event as any,
          schema: filter.schema || 'public',
          table: table,
          filter: filter.filter
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return {
      unsubscribe: () => subscription.unsubscribe()
    };
  }

  channel(channelName: string) {
    return supabase.channel(channelName);
  }
}

/**
 * Complete Database Service
 * Exports all services as a single object
 */
export const databaseService = {
  db: new SupabaseDatabaseClient(),
  auth: new SupabaseAuthClient(),
  storage: new SupabaseStorageClient(),
  realtime: new SupabaseRealtimeClient()
};

/**
 * Convenience exports
 */
export const db = databaseService.db;
export const auth = databaseService.auth;
export const storage = databaseService.storage;
export const realtime = databaseService.realtime;
