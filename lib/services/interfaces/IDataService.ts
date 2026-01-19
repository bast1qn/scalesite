/**
 * Data Service Interface
 *
 * Abstraction layer for data operations
 * Follows Repository Pattern and Dependency Inversion Principle
 */

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface IDataService<T> {
  /**
   * Get a single entity by ID
   */
  getById(id: string): Promise<T | null>;

  /**
   * Get all entities with optional filtering
   */
  getAll(options?: QueryOptions): Promise<T[]>;

  /**
   * Get paginated results
   */
  getPaginated(options: QueryOptions): Promise<PaginatedResult<T>>;

  /**
   * Create a new entity
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Update an existing entity
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete an entity
   */
  delete(id: string): Promise<boolean>;

  /**
   * Find entities matching criteria
   */
  find(criteria: Partial<T>, options?: QueryOptions): Promise<T[]>;

  /**
   * Count entities matching criteria
   */
  count(criteria?: Partial<T>): Promise<number>;

  /**
   * Check if entity exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Bulk create entities
   */
  bulkCreate(data: Partial<T>[]): Promise<T[]>;

  /**
   * Bulk update entities
   */
  bulkUpdate(updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]>;

  /**
   * Bulk delete entities
   */
  bulkDelete(ids: string[]): Promise<boolean>;
}

/**
 * Specialized data service interfaces
 */

export interface IProjectService extends IDataService<Project> {
  getByStatus(status: ProjectStatus): Promise<Project[]>;
  getByUser(userId: string): Promise<Project[]>;
  updateMilestone(projectId: string, milestoneId: string, status: string): Promise<void>;
}

export interface ITicketService extends IDataService<Ticket> {
  getByStatus(status: TicketStatus): Promise<Ticket[]>;
  getByPriority(priority: TicketPriority): Promise<Ticket[]>;
  assignToUser(ticketId: string, userId: string): Promise<void>;
  addMessage(ticketId: string, message: TicketMessage): Promise<void>;
}

export interface INewsletterService extends IDataService<Campaign> {
  sendCampaign(campaignId: string): Promise<void>;
  scheduleCampaign(campaignId: string, date: Date): Promise<void>;
  getSubscribers(segment?: string): Promise<Subscriber[]>;
  addSubscriber(email: string, data?: Partial<Subscriber>): Promise<Subscriber>;
  unsubscribeSubscriber(email: string): Promise<void>;
}

// Type definitions
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'on_hold';
export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  userId: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  attachment?: string;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  segments?: string[];
  subscribedAt: Date;
}
