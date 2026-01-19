/**
 * Repository Pattern Implementation
 *
 * Purpose: Abstract data access logic from business logic
 * Follows Dependency Inversion Principle (DIP) and Single Responsibility Principle (SRP)
 *
 * Benefits:
 * - Decouples application from database implementation
 * - Enables easy testing with mock repositories
 * - Centralizes data access logic
 * - Provides a clean API for data operations
 */

import {
  IDataService,
  QueryOptions,
  PaginatedResult,
} from '../services/interfaces/IDataService';

/**
 * Base Repository Interface
 * All repositories must implement this interface
 */
export interface IRepository<T> extends IDataService<T> {
  /**
   * Find first entity matching criteria
   */
  findFirst(criteria: Partial<T>): Promise<T | null>;

  /**
   * Check if any entity matches criteria
   */
  any(criteria?: Partial<T>): Promise<boolean>;

  /**
   * Get entity count with filters
   */
  countWithFilters(filters?: Record<string, any>): Promise<number>;

  /**
   * Transaction support
   */
  transaction<R>(callback: (repo: this) => Promise<R>): Promise<R>;
}

/**
 * Abstract Base Repository
 * Provides common functionality for all repositories
 */
export abstract class BaseRepository<T> implements IRepository<T> {
  protected abstract tableName: string;

  /**
   * Get a single entity by ID
   */
  abstract getById(id: string): Promise<T | null>;

  /**
   * Get all entities with optional filtering
   */
  abstract getAll(options?: QueryOptions): Promise<T[]>;

  /**
   * Get paginated results
   */
  abstract getPaginated(options: QueryOptions): Promise<PaginatedResult<T>>;

  /**
   * Create a new entity
   */
  abstract create(data: Partial<T>): Promise<T>;

  /**
   * Update an existing entity
   */
  abstract update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete an entity
   */
  abstract delete(id: string): Promise<boolean>;

  /**
   * Find entities matching criteria
   */
  abstract find(criteria: Partial<T>, options?: QueryOptions): Promise<T[]>;

  /**
   * Count entities matching criteria
   */
  abstract count(criteria?: Partial<T>): Promise<number>;

  /**
   * Check if entity exists
   */
  abstract exists(id: string): Promise<boolean>;

  /**
   * Bulk create entities
   */
  abstract bulkCreate(data: Partial<T>[]): Promise<T[]>;

  /**
   * Bulk update entities
   */
  abstract bulkUpdate(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]>;

  /**
   * Bulk delete entities
   */
  abstract bulkDelete(ids: string[]): Promise<boolean>;

  /**
   * Find first entity matching criteria
   */
  async findFirst(criteria: Partial<T>): Promise<T | null> {
    const results = await this.find(criteria, { limit: 1 });
    return results[0] || null;
  }

  /**
   * Check if any entity matches criteria
   */
  async any(criteria?: Partial<T>): Promise<boolean> {
    const count = await this.count(criteria);
    return count > 0;
  }

  /**
   * Get entity count with filters
   */
  async countWithFilters(filters?: Record<string, any>): Promise<number> {
    return this.count(filters as Partial<T>);
  }

  /**
   * Transaction support (default implementation)
   * Override in specific repository for actual transaction support
   */
  async transaction<R>(callback: (repo: this) => Promise<R>): Promise<R> {
    return callback(this);
  }

  /**
   * Build query from options
   */
  protected buildQuery(options?: QueryOptions): Record<string, any> {
    const query: Record<string, any> = {};

    if (options?.limit) {
      query.limit = options.limit;
    }

    if (options?.offset) {
      query.offset = options.offset;
    }

    if (options?.orderBy) {
      query.orderBy = { column: options.orderBy, order: options.order || 'asc' };
    }

    if (options?.filters) {
      query.filters = options.filters;
    }

    return query;
  }
}

/**
 * Repository Factory
 * Creates repository instances based on type
 */
export class RepositoryFactory {
  private static repositories = new Map<string, IRepository<any>>();

  /**
   * Register a repository
   */
  static register<T>(name: string, repository: IRepository<T>): void {
    this.repositories.set(name, repository);
  }

  /**
   * Get a repository by name
   */
  static get<T>(name: string): IRepository<T> {
    const repository = this.repositories.get(name);
    if (!repository) {
      throw new Error(`Repository "${name}" not found`);
    }
    return repository as IRepository<T>;
  }

  /**
   * Check if repository exists
   */
  static has(name: string): boolean {
    return this.repositories.has(name);
  }

  /**
   * Get all registered repository names
   */
  static getRegisteredRepositories(): string[] {
    return Array.from(this.repositories.keys());
  }
}

/**
 * Caching Repository Decorator
 * Adds caching functionality to any repository
 */
export class CachedRepository<T> implements IRepository<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private cacheTimeout: number;

  constructor(
    private repository: IRepository<T>,
    cacheTimeout: number = 60000 // 1 minute default
  ) {
    this.cacheTimeout = cacheTimeout;
  }

  async getById(id: string): Promise<T | null> {
    const cached = this.getFromCache(id);
    if (cached) {
      return cached;
    }

    const data = await this.repository.getById(id);
    if (data) {
      this.setCache(id, data);
    }
    return data;
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    // Don't cache queries with filters
    if (options?.filters) {
      return this.repository.getAll(options);
    }

    const cacheKey = 'all';
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return [cached] as any;
    }

    const data = await this.repository.getAll(options);
    this.setCache(cacheKey, data as any);
    return data;
  }

  async getPaginated(options: QueryOptions): Promise<PaginatedResult<T>> {
    return this.repository.getPaginated(options);
  }

  async create(data: Partial<T>): Promise<T> {
    this.clearCache();
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    this.clearCache(id);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    this.clearCache(id);
    return this.repository.delete(id);
  }

  async find(criteria: Partial<T>, options?: QueryOptions): Promise<T[]> {
    return this.repository.find(criteria, options);
  }

  async count(criteria?: Partial<T>): Promise<number> {
    return this.repository.count(criteria);
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id);
  }

  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    this.clearCache();
    return this.repository.bulkCreate(data);
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    this.clearCache();
    return this.repository.bulkUpdate(updates);
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    this.clearCache();
    return this.repository.bulkDelete(ids);
  }

  async findFirst(criteria: Partial<T>): Promise<T | null> {
    return this.repository.findFirst(criteria);
  }

  async any(criteria?: Partial<T>): Promise<boolean> {
    return this.repository.any(criteria);
  }

  async countWithFilters(filters?: Record<string, any>): Promise<number> {
    return this.repository.countWithFilters(filters);
  }

  async transaction<R>(callback: (repo: this) => Promise<R>): Promise<R> {
    return this.repository.transaction(callback);
  }

  private getFromCache(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

/**
 * Repository Error
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public repository: string,
    public operation: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}
