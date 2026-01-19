/**
 * Repository Barrel Export
 *
 * Exports all repository-related interfaces and implementations
 */

// Core repository interfaces and base classes
export {
  IRepository,
  BaseRepository,
  RepositoryFactory,
  CachedRepository,
  RepositoryError,
} from './IRepository';

// Mock repository for testing
export { MockRepository } from './MockRepository';
