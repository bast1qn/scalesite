/**
 * Repository Pattern Type Definitions
 * Dependency Inversion: High-level modules depend on abstractions
 */

import type { AppUser } from '../../contexts/auth/AuthTypes';

// Generic repository interface
export interface IRepository<T, K = string> {
  findById(id: K): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: K, updates: Partial<T>): Promise<T | null>;
  delete(id: K): Promise<boolean>;
}

// Query specifications for complex queries
export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  toQuery(): Record<string, unknown>;
}

// User repository interface
export interface IUserRepository extends IRepository<AppUser> {
  findByEmail(email: string): Promise<AppUser | null>;
  findByReferralCode(code: string): Promise<AppUser | null>;
  findByRole(role: AppUser['role']): Promise<AppUser[]>;
  updateLastLogin(id: string): Promise<void>;
}

// Generic result type for operations
export type RepositoryResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Paginated result
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
