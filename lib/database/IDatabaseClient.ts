/**
 * Database Abstraction Layer - Core Interfaces
 *
 * SOLID Principles Applied:
 * - Interface Segregation: Separate interfaces for different capabilities
 * - Dependency Inversion: High-level modules depend on these abstractions
 * - Single Responsibility: Each interface has one clear purpose
 */

/**
 * Base query result wrapper
 */
export interface QueryResult<T = any> {
  data: T | null;
  error: DatabaseError | null;
  count?: number;
}

/**
 * Database error structure
 */
export interface DatabaseError {
  message: string;
  code?: string;
  details?: any;
  type: 'auth' | 'validation' | 'not_found' | 'constraint' | 'unknown';
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
  page?: number;
}

/**
 * Ordering options
 */
export interface OrderOptions {
  column: string;
  ascending?: boolean;
  nullsFirst?: boolean;
}

/**
 * Filter options
 */
export interface FilterOptions {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
  value: any;
}

/**
 * Read-only database operations interface
 * Follows Interface Segregation Principle
 */
export interface IReadable<T = any> {
  /**
   * Find a single record by ID
   */
  findById(id: string | number): Promise<QueryResult<T>>;

  /**
   * Find a single record matching filters
   */
  findOne(filters: Record<string, any>): Promise<QueryResult<T>>;

  /**
   * Find all records matching filters
   */
  findMany(filters?: Record<string, any>): Promise<QueryResult<T[]>>;

  /**
   * Find records with pagination
   */
  findWithPagination(
    filters: Record<string, any>,
    pagination: PaginationOptions
  ): Promise<QueryResult<T[]>>;

  /**
   * Check if a record exists
   */
  exists(filters: Record<string, any>): Promise<boolean>;
}

/**
 * Write-only database operations interface
 * Follows Interface Segregation Principle
 */
export interface IWritable<T = any> {
  /**
   * Create a new record
   */
  create(data: Partial<T>): Promise<QueryResult<T>>;

  /**
   * Create multiple records
   */
  createMany(data: Partial<T>[]): Promise<QueryResult<T[]>>;

  /**
   * Update a record by ID
   */
  update(id: string | number, data: Partial<T>): Promise<QueryResult<T>>;

  /**
   * Update records matching filters
   */
  updateMany(filters: Record<string, any>, data: Partial<T>): Promise<QueryResult<T[]>>;

  /**
   * Delete a record by ID
   */
  delete(id: string | number): Promise<QueryResult<void>>;

  /**
   * Delete records matching filters
   */
  deleteMany(filters: Record<string, any>): Promise<QueryResult<void>>;

  /**
   * Soft delete a record (if supported)
   */
  softDelete?(id: string | number): Promise<QueryResult<T>>;
}

/**
 * Query builder interface for complex queries
 * Follows Fluent Interface Pattern
 */
export interface IQueryBuilder<T = any> {
  select(columns?: string | string[]): IQueryBuilder<T>;
  select(columns: { table: string; columns: string[] }[]): IQueryBuilder<T>;

  where(column: string, operator: string, value: any): IQueryBuilder<T>;
  where(filters: Record<string, any>): IQueryBuilder<T>;

  orWhere(column: string, operator: string, value: any): IQueryBuilder<T>;

  join(table: string, column1: string, column2: string): IQueryBuilder<T>;
  leftJoin(table: string, column1: string, column2: string): IQueryBuilder<T>;

  orderBy(column: string, ascending?: boolean): IQueryBuilder<T>;

  limit(limit: number): IQueryBuilder<T>;
  offset(offset: number): IQueryBuilder<T>;

  single(): Promise<QueryResult<T>>;
  maybeSingle(): Promise<QueryResult<T | null>>;
  many(): Promise<QueryResult<T[]>>;

  count(): Promise<QueryResult<number>>;
}

/**
 * Cacheable operations interface
 * Follows Interface Segregation Principle
 */
export interface ICacheable {
  /**
   * Enable caching for this query
   */
  withCache(ttl?: number): this;

  /**
   * Disable caching for this query
   */
  withoutCache(): this;

  /**
   * Invalidate cache for a specific key
   */
  invalidateCache(key: string): Promise<void>;

  /**
   * Clear all cache
   */
  clearCache(): Promise<void>;
}

/**
 * Transactional operations interface
 */
export interface ITransactional {
  /**
   * Execute multiple operations in a transaction
   */
  transaction<T>(
    callback: (trx: ITransaction) => Promise<T>
  ): Promise<QueryResult<T>>;
}

/**
 * Transaction interface
 */
export interface ITransaction {
  query<T>(table: string): IQueryBuilder<T>;
  rollback(): Promise<void>;
  commit(): Promise<void>;
}

/**
 * Complete database client interface
 * Combines all capabilities
 * Follows Dependency Inversion Principle
 */
export interface IDatabaseClient
  extends IReadable, IWritable, ICacheable, ITransactional {

  /**
   * Get a query builder for a specific table
   */
  from<T = any>(table: string): IQueryBuilder<T>;

  /**
   * Get a repository for a specific entity
   */
  repository<T extends IRepository<any>>(entity: string): T;

  /**
   * Raw SQL query (use sparingly)
   */
  raw<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;

  /**
   * Health check
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Base repository interface
 * Combines read and write operations
 */
export interface IRepository<T> extends IReadable<T>, IWritable<T> {
  tableName: string;
  model: { new (): T };
}

/**
 * Auth client interface
 * Separated for auth-specific operations
 */
export interface IAuthClient {
  /**
   * Get current user
   */
  getUser(): Promise<{ data: { user: any } | null; error: any }>;

  /**
   * Sign up a new user
   */
  signUp(email: string, password: string, metadata?: any): Promise<any>;

  /**
   * Sign in a user
   */
  signIn(email: string, password: string): Promise<any>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Reset password
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Update password
   */
  updatePassword(newPassword: string): Promise<void>;

  /**
   * Get session
   */
  getSession(): Promise<any>;

  /**
   * Set session
   */
  setSession(accessToken: string, refreshToken: string): Promise<void>;

  /**
   * Refresh session
   */
  refreshSession(): Promise<any>;

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void): {
    data: { subscription: { unsubscribe: () => void } };
  };
}

/**
 * Storage client interface
 */
export interface IStorageClient {
  /**
   * Upload a file
   */
  upload(path: string, file: File | Blob, options?: any): Promise<any>;

  /**
   * Download a file
   */
  download(path: string): Promise<Blob>;

  /**
   * Get a public URL
   */
  getPublicUrl(path: string): string;

  /**
   * Get a signed URL
   */
  getSignedUrl(path: string, expiresIn?: number): Promise<string>;

  /**
   * Delete a file
   */
  delete(path: string | string[]): Promise<any>;

  /**
   * List files in a bucket/prefix
   */
  list(path?: string): Promise<any>;
}

/**
 * Realtime subscription interface
 */
export interface IRealtimeClient {
  /**
   * Subscribe to database changes
   */
  subscribe(
    table: string,
    filter: { event: string; schema?: string; filter?: string },
    callback: (payload: any) => void
  ): { unsubscribe: () => void };

  /**
   * Subscribe to a channel
   */
  channel(channelName: string): any;
}

/**
 * Complete database service interface
 * Includes all auxiliary services
 */
export interface IDatabaseService {
  db: IDatabaseClient;
  auth: IAuthClient;
  storage: IStorageClient;
  realtime: IRealtimeClient;
}

/**
 * Repository factory interface
 */
export interface IRepositoryFactory {
  /**
   * Get a repository for an entity
   */
  getRepository<T extends IRepository<any>>(entity: string): T;

  /**
   * Register a custom repository
   */
  registerRepository<T extends IRepository<any>>(
    entity: string,
    repository: T
  ): void;

  /**
   * Check if a repository exists
   */
  hasRepository(entity: string): boolean;
}
