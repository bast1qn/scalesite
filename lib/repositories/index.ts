/**
 * Repository Pattern - Barrel Export
 *
 * PURPOSE: Clean public API for repository module
 * ARCHITECTURE: Data Access Layer abstraction
 * VERSION: Enterprise-Grade Repository Implementation
 */

// ============================================================================
// LEGACY EXPORTS (Backward Compatibility)
// ============================================================================

export {
  IRepository,
  BaseRepository,
  RepositoryFactory,
  CachedRepository,
  RepositoryError,
} from './IRepository';

export { MockRepository } from './MockRepository';

// ============================================================================
// NEW ENTERPRISE-GRADE EXPORTS
// ============================================================================

// All interfaces for dependency injection
export * from './interfaces';

// Base repository with caching and query builder
export * from './BaseRepository';

// Concrete repository implementations
export { UserProfileRepository } from './UserProfileRepository';

// Repository factory (Singleton)
export { RepositoryFactory as EnterpriseRepositoryFactory, getRepositoryFactory } from './RepositoryFactory';
