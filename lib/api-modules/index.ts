/**
 * API Modules - Barrel Export
 *
 * Centralized exports for all API modules
 * Implements Facade Pattern for clean public API
 *
 * @module lib/api-modules
 */

// ==================== Core Utilities ====================
export * from './types';
export * from './cache';
export * from './error-handling';
export * from './auth';

// ==================== Domain Modules ====================

/**
 * Tickets Module
 * @example
 * import { getTickets, createTicket } from '@/lib/api-modules';
 */
export {
  getTickets,
  createTicket,
  getTicketMessages,
  getTicketMembers,
} from './tickets';

/**
 * Projects Module
 * @example
 * import { getProjects, createProject } from '@/lib/api-modules';
 */
export {
  getProjects,
  getProject,
  createProject,
  updateProject,
  updateProjectConfig,
  updateProjectContent,
  deleteProject,
  getProjectMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from './projects';

/**
 * Billing Module
 * @example
 * import { getTransactions, createDiscount } from '@/lib/api-modules';
 */
export {
  getTransactions,
  getDiscounts,
  createDiscount,
  deleteDiscount,
  getInvoices,
  getInvoice,
} from './billing';

/**
 * Content Module
 * @example
 * import { getBlogPosts, createBlogPost } from '@/lib/api-modules';
 */
export {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getContentGenerations,
  createContentGeneration,
  updateContentGeneration,
  deleteContentGeneration,
} from './content';

// ==================== Re-exports for Convenience ====================

// Error handling
export type { ApiError, ApiErrorType } from './error-handling';
export { classifyError, getUserFriendlyMessage, handleSupabaseError } from './error-handling';

// Cache
export { getCached, setCached, clearCache, invalidateCache, dedupeRequest, CACHE_TTL, SHORT_CACHE_TTL } from './cache';

// Auth
export { isTeamMember, requireAuth, requireTeamAccess } from './auth';
