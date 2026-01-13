/**
 * API Response Type Definitions
 * This file contains all TypeScript interfaces for API responses
 */

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  industry?: string;
  service_id?: number;
  status: 'konzeption' | 'design' | 'entwicklung' | 'review' | 'launch' | 'active';
  progress: number;
  config?: Record<string, unknown>;
  content?: Record<string, unknown>;
  estimated_launch_date?: string;
  actual_launch_date?: string;
  is_live?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  completed_at?: string;
  order_index: number;
  created_at: string;
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

export interface Service {
  id: number;
  name: string;
  description?: string;
  description_en?: string;
  price: number;
  price_details?: string;
  price_details_en?: string;
}

export interface UserService {
  id: string;
  user_id: string;
  service_id: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  progress: number;
  latest_update?: string;
  created_at: string;
  services?: Service;
}

// ============================================================================
// TICKET TYPES
// ============================================================================

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: 'Offen' | 'In Bearbeitung' | 'Wartet auf Antwort' | 'Geschlossen';
  priority: 'Niedrig' | 'Mittel' | 'Hoch';
  created_at: string;
  last_update: string;
  profiles?: {
    name: string;
    role: string;
    company?: string;
  };
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string | null;
  text: string;
  created_at: string;
  profiles?: {
    name: string;
    role: string;
  };
}

export interface TicketMember {
  id: string;
  ticket_id: string;
  user_id: string;
  added_at: string;
}

// ============================================================================
// TRANSACTION & BILLING TYPES
// ============================================================================

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  due_date: string;
  status: 'Offen' | 'Bezahlt' | 'Überfällig';
  description: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  project_id?: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  discount_code?: string;
  discount_amount: number;
  tax_amount: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// USER & PROFILE TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  role: 'team' | 'user' | 'owner';
  referral_code: string | null;
  created_at: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsEvent {
  id: string;
  project_id?: string;
  user_id: string;
  session_id: string;
  event_type: string;
  path: string;
  element?: string;
  event_data?: Record<string, unknown>;
  timestamp: number;
  created_at: string;
}

// ============================================================================
// CONTENT GENERATION TYPES
// ============================================================================

export interface ContentGeneration {
  id: string;
  user_id: string;
  project_id?: string;
  type: string;
  industry?: string;
  keywords?: string[];
  tone?: string;
  prompt: string;
  generated_content?: string;
  selected_content?: string;
  variations?: string[];
  status: 'pending' | 'generating' | 'completed' | 'failed';
  is_favorite?: boolean;
  created_at: string;
}

// ============================================================================
// TEAM TYPES
// ============================================================================

export interface TeamMember {
  id: string;
  team_id: string;
  member_id: string;
  role: string;
  status: 'pending' | 'active' | 'inactive';
  permissions?: Record<string, boolean>;
  invited_by: string;
  invited_at: string;
}

export interface TeamInvitation {
  id: string;
  team_id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'expired';
  invited_by: string;
  expires_at: string;
  created_at: string;
}

export interface TeamActivity {
  id: string;
  type: string;
  user_id: string;
  user_name: string;
  user_email: string;
  target_type?: string;
  target_id?: string;
  target_name?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  read_at?: string;
  created_at: string;
}

// ============================================================================
// NEWSLETTER TYPES
// ============================================================================

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  preferences?: Record<string, boolean>;
  subscribed_at: string;
  unsubscribed_at?: string;
  unsubscribe_reason?: string;
  unsubscribe_feedback?: string;
  last_opened?: string;
  last_clicked?: string;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  preview_text?: string;
  content: string;
  target_segment?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduled_for?: string;
  timezone?: string;
  sent_count?: number;
  open_count?: number;
  click_count?: number;
  unsubscribe_count?: number;
  created_by: string;
  created_at: string;
  sent_at?: string;
}

// ============================================================================
// FILE TYPES
// ============================================================================

export interface File {
  id: string;
  user_id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
}

// ============================================================================
// BLOG TYPES
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_name?: string;
  published?: boolean;
  created_at: string;
  updated_at?: string;
}

// ============================================================================
// DISCOUNT TYPES
// ============================================================================

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface ApiArrayResponse<T> {
  data: T[];
  error: string | null;
}

// ============================================================================
// STATS TYPES
// ============================================================================

export interface DashboardStats {
  ticketCount: number;
  serviceCount: number;
}

export interface AnalyticsSummary {
  total_events: number;
  unique_event_types: number;
  latest_event: number | null;
}
