/**
 * Repository Pattern Interfaces
 *
 * PURPOSE: Data Access Layer abstraction
 * SOLID Compliance:
 * - Dependency Inversion: High-level modules depend on interfaces, not concrete implementations
 * - Interface Segregation: Focused, specific interfaces for each domain
 * - Single Responsibility: Each repository handles one entity type
 */

import type {
  BlogPost,
  ContentGeneration,
  Discount,
  File,
  Invoice,
  NewsletterCampaign,
  NewsletterSubscriber,
  Notification,
  Project,
  ProjectMilestone,
  Service,
  TeamActivity,
  TeamInvitation,
  TeamMember,
  Ticket,
  TicketMessage,
  Transaction,
  UserProfile,
} from '../types';

// ============================================================================
// BASE REPOSITORY INTERFACE
// ============================================================================

/**
 * Base repository interface with CRUD operations
 * @template T - Entity type
 * @template ID - ID type (default: string)
 */
export interface IBaseRepository<T, ID = string> {
  /**
   * Find entity by ID
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Create new entity
   */
  create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;

  /**
   * Update existing entity
   */
  update(id: ID, updates: Partial<T>): Promise<T | null>;

  /**
   * Delete entity
   */
  delete(id: ID): Promise<boolean>;

  /**
   * Check if entity exists
   */
  exists(id: ID): Promise<boolean>;
}

// ============================================================================
// QUERY INTERFACE
// ============================================================================

/**
 * Query builder interface for complex queries
 */
export interface IQuery<T> {
  where(field: keyof T, operator: string, value: unknown): IQuery<T>;
  orderBy(field: keyof T, direction: 'asc' | 'desc'): IQuery<T>;
  limit(count: number): IQuery<T>;
  offset(count: number): IQuery<T>;
  execute(): Promise<T[]>;
  first(): Promise<T | null>;
  count(): Promise<number>;
}

// ============================================================================
// DOMAIN REPOSITORY INTERFACES
// ============================================================================

/**
 * User Profile Repository
 */
export interface IUserProfileRepository extends IBaseRepository<UserProfile, string> {
  findByEmail(email: string): Promise<UserProfile | null>;
  findByRole(role: string): Promise<UserProfile[]>;
  updateRole(userId: string, role: string): Promise<UserProfile | null>;
}

/**
 * Project Repository
 */
export interface IProjectRepository extends IBaseRepository<Project, string> {
  findByUserId(userId: string): Promise<Project[]>;
  findByStatus(status: string): Promise<Project[]>;
  findRecent(limit: number): Promise<Project[]>;
  query(): IQuery<Project>;
}

/**
 * Ticket Repository
 */
export interface ITicketRepository extends IBaseRepository<Ticket, string> {
  findByProjectId(projectId: string): Promise<Ticket[]>;
  findByUserId(userId: string): Promise<Ticket[]>;
  findByStatus(status: string): Promise<Ticket[]>;
  findWithMessages(ticketId: string): Promise<Ticket & { messages: TicketMessage[] } | null>;
}

/**
 * Invoice Repository
 */
export interface IInvoiceRepository extends IBaseRepository<Invoice, string> {
  findByUserId(userId: string): Promise<Invoice[]>;
  findByStatus(status: string): Promise<Invoice[]>;
  findPaid(): Promise<Invoice[]>;
  findUnpaid(): Promise<Invoice[]>;
  findOverdue(): Promise<Invoice[]>;
}

/**
 * Transaction Repository
 */
export interface ITransactionRepository extends IBaseRepository<Transaction, string> {
  findByUserId(userId: string): Promise<Transaction[]>;
  findByInvoiceId(invoiceId: string): Promise<Transaction[]>;
  findRecent(limit: number): Promise<Transaction[]>;
}

/**
 * Team Member Repository
 */
export interface ITeamMemberRepository extends IBaseRepository<TeamMember, string> {
  findByTeamId(teamId: string): Promise<TeamMember[]>;
  findByUserId(userId: string): Promise<TeamMember[]>;
  findByRole(role: string): Promise<TeamMember[]>;
  isTeamMember(userId: string): Promise<boolean>;
}

/**
 * Team Activity Repository
 */
export interface ITeamActivityRepository extends IBaseRepository<TeamActivity, string> {
  findByTeamId(teamId: string): Promise<TeamActivity[]>;
  findRecent(limit: number): Promise<TeamActivity[]>;
  findByType(type: string): Promise<TeamActivity[]>;
}

/**
 * Team Invitation Repository
 */
export interface ITeamInvitationRepository extends IBaseRepository<TeamInvitation, string> {
  findByEmail(email: string): Promise<TeamInvitation[]>;
  findByTeamId(teamId: string): Promise<TeamInvitation[]>;
  findPending(): Promise<TeamInvitation[]>;
  findByToken(token: string): Promise<TeamInvitation | null>;
}

/**
 * Newsletter Subscriber Repository
 */
export interface INewsletterSubscriberRepository extends IBaseRepository<NewsletterSubscriber, string> {
  findByEmail(email: string): Promise<NewsletterSubscriber | null>;
  findActive(): Promise<NewsletterSubscriber[]>;
  findUnsubscribed(): Promise<NewsletterSubscriber[]>;
  findByStatus(status: 'active' | 'unsubscribed' | 'bounced'): Promise<NewsletterSubscriber[]>;
}

/**
 * Newsletter Campaign Repository
 */
export interface INewsletterCampaignRepository extends IBaseRepository<NewsletterCampaign, string> {
  findByStatus(status: string): Promise<NewsletterCampaign[]>;
  findRecent(limit: number): Promise<NewsletterCampaign[]>;
  findSent(): Promise<NewsletterCampaign[]>;
  findDrafts(): Promise<NewsletterCampaign[]>;
}

/**
 * Content Generation Repository
 */
export interface IContentGenerationRepository extends IBaseRepository<ContentGeneration, string> {
  findByProjectId(projectId: string): Promise<ContentGeneration[]>;
  findByType(type: string): Promise<ContentGeneration[]>;
  findByUserId(userId: string): Promise<ContentGeneration[]>;
  findRecent(limit: number): Promise<ContentGeneration[]>;
}

/**
 * Notification Repository
 */
export interface INotificationRepository extends IBaseRepository<Notification, string> {
  findByUserId(userId: string): Promise<Notification[]>;
  findUnread(userId: string): Promise<Notification[]>;
  findByType(userId: string, type: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
}

/**
 * File Repository
 */
export interface IFileRepository extends IBaseRepository<File, string> {
  findByUserId(userId: string): Promise<File[]>;
  findByProjectId(projectId: string): Promise<File[]>;
  findByType(type: string): Promise<File[]>;
  findRecent(limit: number): Promise<File[]>;
}

/**
 * Blog Post Repository
 */
export interface IBlogPostRepository extends IBaseRepository<BlogPost, string> {
  findBySlug(slug: string): Promise<BlogPost | null>;
  findPublished(): Promise<BlogPost[]>;
  findDrafts(): Promise<BlogPost[]>;
  findByCategory(category: string): Promise<BlogPost[]>;
  findRecent(limit: number): Promise<BlogPost[]>;
  search(query: string): Promise<BlogPost[]>;
}

/**
 * Project Milestone Repository
 */
export interface IProjectMilestoneRepository extends IBaseRepository<ProjectMilestone, string> {
  findByProjectId(projectId: string): Promise<ProjectMilestone[]>;
  findByStatus(status: string): Promise<ProjectMilestone[]>;
  findUpcoming(limit: number): Promise<ProjectMilestone[]>;
  findOverdue(): Promise<ProjectMilestone[]>;
}

/**
 * Discount Repository
 */
export interface IDiscountRepository extends IBaseRepository<Discount, string> {
  findByCode(code: string): Promise<Discount | null>;
  findActive(): Promise<Discount[]>;
  findByServiceId(serviceId: number): Promise<Discount[]>;
  findValid(): Promise<Discount[]>;
  findExpired(): Promise<Discount[]>;
}

/**
 * Service Repository (read-only cacheable)
 */
export interface IServiceRepository {
  findAll(): Promise<Service[]>;
  findById(id: number): Promise<Service | null>;
  findByCategory(category: string): Promise<Service[]>;
  findPopular(limit: number): Promise<Service[]>;
}

// ============================================================================
// REPOSITORY FACTORY INTERFACE
// ============================================================================

/**
 * Repository Factory
 * Creates repository instances with proper dependency injection
 */
export interface IRepositoryFactory {
  getUserProfileRepository(): IUserProfileRepository;
  getProjectRepository(): IProjectRepository;
  getTicketRepository(): ITicketRepository;
  getInvoiceRepository(): IInvoiceRepository;
  getTransactionRepository(): ITransactionRepository;
  getTeamMemberRepository(): ITeamMemberRepository;
  getTeamActivityRepository(): ITeamActivityRepository;
  getTeamInvitationRepository(): ITeamInvitationRepository;
  getNewsletterSubscriberRepository(): INewsletterSubscriberRepository;
  getNewsletterCampaignRepository(): INewsletterCampaignRepository;
  getContentGenerationRepository(): IContentGenerationRepository;
  getNotificationRepository(): INotificationRepository;
  getFileRepository(): IFileRepository;
  getBlogPostRepository(): IBlogPostRepository;
  getProjectMilestoneRepository(): IProjectMilestoneRepository;
  getDiscountRepository(): IDiscountRepository;
  getServiceRepository(): IServiceRepository;
}
