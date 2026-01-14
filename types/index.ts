/**
 * Type Definitions Index
 * Central export point for all type definitions
 */

// Export all type modules
export * from './seo';
export * from './dashboard';
export * from './billing';
export * from './team';
export * from './config';
export * from './common';

// Re-export commonly used types from lib/types.ts for backward compatibility
export type {
  Project,
  ProjectMilestone,
  Service,
  UserService,
  Ticket,
  TicketMessage,
  TicketMember,
  Transaction,
  Invoice,
  UserProfile,
  AnalyticsEvent,
  ContentGeneration,
  TeamMember,
  TeamInvitation,
  TeamActivity,
  Notification,
  NewsletterSubscriber,
  NewsletterCampaign,
  File,
  BlogPost,
  Discount,
  ApiResponse,
  ApiArrayResponse,
  DashboardStats,
  AnalyticsSummary,
} from '../lib/types';
