/**
 * Repository Factory
 *
 * PURPOSE: Centralized repository creation with dependency injection
 * PATTERN: Factory Pattern + Singleton Pattern
 * SOLID Compliance:
 * - Single Responsibility: Creates repository instances
 * - Open/Closed: Easy to add new repositories without modifying existing code
 * - Dependency Inversion: Returns interfaces, not concrete implementations
 */

import type {
  IRepositoryFactory,
  IUserProfileRepository,
  IProjectRepository,
  ITicketRepository,
  IInvoiceRepository,
  ITransactionRepository,
  ITeamMemberRepository,
  ITeamActivityRepository,
  ITeamInvitationRepository,
  INewsletterSubscriberRepository,
  INewsletterCampaignRepository,
  IContentGenerationRepository,
  INotificationRepository,
  IFileRepository,
  IBlogPostRepository,
  IProjectMilestoneRepository,
  IDiscountRepository,
  IServiceRepository,
} from './interfaces';

import { UserProfileRepository } from './UserProfileRepository';
// Import other repositories when implemented

// ============================================================================
// SINGLETON FACTORY
// ============================================================================

/**
 * Repository Factory Singleton
 * Ensures only one instance of each repository exists
 */
export class RepositoryFactory implements IRepositoryFactory {
  private static instance: RepositoryFactory;

  // Repository instances (lazy initialization)
  private userProfileRepo: IUserProfileRepository | null = null;
  private projectRepo: IProjectRepository | null = null;
  private ticketRepo: ITicketRepository | null = null;
  private invoiceRepo: IInvoiceRepository | null = null;
  private transactionRepo: ITransactionRepository | null = null;
  private teamMemberRepo: ITeamMemberRepository | null = null;
  private teamActivityRepo: ITeamActivityRepository | null = null;
  private teamInvitationRepo: ITeamInvitationRepository | null = null;
  private newsletterSubscriberRepo: INewsletterSubscriberRepository | null = null;
  private newsletterCampaignRepo: INewsletterCampaignRepository | null = null;
  private contentGenerationRepo: IContentGenerationRepository | null = null;
  private notificationRepo: INotificationRepository | null = null;
  private fileRepo: IFileRepository | null = null;
  private blogPostRepo: IBlogPostRepository | null = null;
  private projectMilestoneRepo: IProjectMilestoneRepository | null = null;
  private discountRepo: IDiscountRepository | null = null;
  private serviceRepo: IServiceRepository | null = null;

  private constructor() {
    // Private constructor for Singleton
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  // ==========================================================================
  // REPOSITORY GETTERS (Lazy Initialization)
  // ==========================================================================

  public getUserProfileRepository(): IUserProfileRepository {
    if (!this.userProfileRepo) {
      this.userProfileRepo = new UserProfileRepository();
    }
    return this.userProfileRepo;
  }

  public getProjectRepository(): IProjectRepository {
    // TODO: Implement ProjectRepository
    throw new Error('ProjectRepository not implemented yet');
  }

  public getTicketRepository(): ITicketRepository {
    // TODO: Implement TicketRepository
    throw new Error('TicketRepository not implemented yet');
  }

  public getInvoiceRepository(): IInvoiceRepository {
    // TODO: Implement InvoiceRepository
    throw new Error('InvoiceRepository not implemented yet');
  }

  public getTransactionRepository(): ITransactionRepository {
    // TODO: Implement TransactionRepository
    throw new Error('TransactionRepository not implemented yet');
  }

  public getTeamMemberRepository(): ITeamMemberRepository {
    // TODO: Implement TeamMemberRepository
    throw new Error('TeamMemberRepository not implemented yet');
  }

  public getTeamActivityRepository(): ITeamActivityRepository {
    // TODO: Implement TeamActivityRepository
    throw new Error('TeamActivityRepository not implemented yet');
  }

  public getTeamInvitationRepository(): ITeamInvitationRepository {
    // TODO: Implement TeamInvitationRepository
    throw new Error('TeamInvitationRepository not implemented yet');
  }

  public getNewsletterSubscriberRepository(): INewsletterSubscriberRepository {
    // TODO: Implement NewsletterSubscriberRepository
    throw new Error('NewsletterSubscriberRepository not implemented yet');
  }

  public getNewsletterCampaignRepository(): INewsletterCampaignRepository {
    // TODO: Implement NewsletterCampaignRepository
    throw new Error('NewsletterCampaignRepository not implemented yet');
  }

  public getContentGenerationRepository(): IContentGenerationRepository {
    // TODO: Implement ContentGenerationRepository
    throw new Error('ContentGenerationRepository not implemented yet');
  }

  public getNotificationRepository(): INotificationRepository {
    // TODO: Implement NotificationRepository
    throw new Error('NotificationRepository not implemented yet');
  }

  public getFileRepository(): IFileRepository {
    // TODO: Implement FileRepository
    throw new Error('FileRepository not implemented yet');
  }

  public getBlogPostRepository(): IBlogPostRepository {
    // TODO: Implement BlogPostRepository
    throw new Error('BlogPostRepository not implemented yet');
  }

  public getProjectMilestoneRepository(): IProjectMilestoneRepository {
    // TODO: Implement ProjectMilestoneRepository
    throw new Error('ProjectMilestoneRepository not implemented yet');
  }

  public getDiscountRepository(): IDiscountRepository {
    // TODO: Implement DiscountRepository
    throw new Error('DiscountRepository not implemented yet');
  }

  public getServiceRepository(): IServiceRepository {
    // TODO: Implement ServiceRepository
    throw new Error('ServiceRepository not implemented yet');
  }
}

// ============================================================================
// CONVENIENCE EXPORT
// ============================================================================

/**
 * Get repository factory instance
 */
export const getRepositoryFactory = (): RepositoryFactory => {
  return RepositoryFactory.getInstance();
};
