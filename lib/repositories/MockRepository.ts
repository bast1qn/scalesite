/**
 * Mock Repository Implementation
 *
 * Purpose: In-memory repository for testing and development
 * Useful for prototyping and unit testing without a real database
 *
 * This can be replaced with real implementations (Neon, PostgreSQL, etc.)
 */

import {
  BaseRepository,
  IRepository,
  RepositoryError,
} from './IRepository';
import {
  QueryOptions,
  PaginatedResult,
} from '../services/interfaces/IDataService';

export class MockRepository<T extends { id: string }>
  extends BaseRepository<T>
  implements IRepository<T>
{
  protected tableName: string;
  private data: Map<string, T> = new Map();
  private idCounter = 1;

  constructor(tableName: string, initialData: T[] = []) {
    super();
    this.tableName = tableName;
    initialData.forEach((item) => {
      this.data.set(item.id, item);
    });
  }

  async getById(id: string): Promise<T | null> {
    return this.data.get(id) || null;
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    let results = Array.from(this.data.values());

    if (options?.filters) {
      results = this.applyFilters(results, options.filters);
    }

    if (options?.orderBy) {
      results = this.applySorting(results, options.orderBy, options.order);
    }

    if (options?.limit) {
      const offset = options.offset || 0;
      results = results.slice(offset, offset + options.limit);
    }

    return results;
  }

  async getPaginated(options: QueryOptions): Promise<PaginatedResult<T>> {
    const limit = options.limit || 10;
    const offset = options.offset || 0;

    let results = Array.from(this.data.values());

    if (options.filters) {
      results = this.applyFilters(results, options.filters);
    }

    const total = results.length;
    const data = results.slice(offset, offset + limit);

    return {
      data,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async create(data: Partial<T>): Promise<T> {
    const id = this.generateId();
    const newEntity = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    this.data.set(id, newEntity);
    return newEntity;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const existing = this.data.get(id);
    if (!existing) {
      throw new RepositoryError(
        `Entity with id ${id} not found`,
        this.tableName,
        'update'
      );
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    } as T;

    this.data.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  async find(criteria: Partial<T>, options?: QueryOptions): Promise<T[]> {
    let results = Array.from(this.data.values()).filter((item) =>
      this.matchesCriteria(item, criteria)
    );

    if (options?.orderBy) {
      results = this.applySorting(results, options.orderBy, options.order);
    }

    if (options?.limit) {
      const offset = options.offset || 0;
      results = results.slice(offset, offset + options.limit);
    }

    return results;
  }

  async count(criteria?: Partial<T>): Promise<number> {
    if (!criteria) {
      return this.data.size;
    }

    return Array.from(this.data.values()).filter((item) =>
      this.matchesCriteria(item, criteria)
    ).length;
  }

  async exists(id: string): Promise<boolean> {
    return this.data.has(id);
  }

  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    const created = await Promise.all(
      data.map((item) => this.create(item))
    );
    return created;
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    const updated = await Promise.all(
      updates.map((update) => this.update(update.id, update.data))
    );
    return updated;
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    let allDeleted = true;
    for (const id of ids) {
      const deleted = this.data.delete(id);
      if (!deleted) {
        allDeleted = false;
      }
    }
    return allDeleted;
  }

  private generateId(): string {
    return `${this.tableName}_${this.idCounter++}_${Date.now()}`;
  }

  private matchesCriteria(item: T, criteria: Partial<T>): boolean {
    return Object.entries(criteria).every(([key, value]) => {
      const itemValue = (item as any)[key];
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(itemValue) === JSON.stringify(value);
      }
      return itemValue === value;
    });
  }

  private applyFilters(results: T[], filters: Record<string, any>): T[] {
    return results.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        const itemValue = (item as any)[key];
        if (typeof value === 'object' && value !== null) {
          // Handle operators like { $eq: 1, $gt: 0 }
          return this.applyOperator(itemValue, value);
        }
        return itemValue === value;
      });
    });
  }

  private applyOperator(itemValue: any, filterValue: any): boolean {
    if (filterValue.$eq !== undefined) {
      return itemValue === filterValue.$eq;
    }
    if (filterValue.$ne !== undefined) {
      return itemValue !== filterValue.$ne;
    }
    if (filterValue.$gt !== undefined) {
      return itemValue > filterValue.$gt;
    }
    if (filterValue.$gte !== undefined) {
      return itemValue >= filterValue.$gte;
    }
    if (filterValue.$lt !== undefined) {
      return itemValue < filterValue.$lt;
    }
    if (filterValue.$lte !== undefined) {
      return itemValue <= filterValue.$lte;
    }
    if (filterValue.$in !== undefined) {
      return filterValue.$in.includes(itemValue);
    }
    if (filterValue.$nin !== undefined) {
      return !filterValue.$nin.includes(itemValue);
    }
    return itemValue === filterValue;
  }

  private applySorting(
    results: T[],
    orderBy: string,
    order?: 'asc' | 'desc'
  ): T[] {
    return [...results].sort((a, b) => {
      const aValue = (a as any)[orderBy];
      const bValue = (b as any)[orderBy];

      if (aValue < bValue) {
        return order === 'desc' ? 1 : -1;
      }
      if (aValue > bValue) {
        return order === 'desc' ? -1 : 1;
      }
      return 0;
    });
  }

  /**
   * Clear all data (useful for testing)
   */
  clear(): void {
    this.data.clear();
  }

  /**
   * Get current data size
   */
  size(): number {
    return this.data.size;
  }
}
