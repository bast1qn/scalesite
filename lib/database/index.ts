/**
 * Database Abstraction Layer - Barrel Export
 *
 * Enterprise-grade database abstraction following SOLID principles
 * Single entry point for all database operations
 */

// Core Interfaces
export * from './IDatabaseClient';

// Supabase Implementation
export * from './SupabaseClient';

// Re-export default service
export { databaseService, db, auth, storage, realtime } from './SupabaseClient';
