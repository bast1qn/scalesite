/**
 * User Profile Repository Implementation
 *
 * PURPOSE: Data access for user profiles
 * PATTERN: Repository Pattern + Active Record Pattern
 */

import type { UserProfile } from '../types';
import type { IUserProfileRepository } from './interfaces';
import { BaseRepository } from './BaseRepository';

export class UserProfileRepository
  extends BaseRepository<UserProfile, string>
  implements IUserProfileRepository
{
  constructor() {
    super('profiles', 60000); // 60s cache for profile data
  }

  /**
   * Find user profile by email
   */
  async findByEmail(email: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<UserProfile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('role', role);

    if (error) throw error;
    return data || [];
  }

  /**
   * Update user role
   */
  async updateRole(userId: string, role: string): Promise<UserProfile | null> {
    return this.update(userId, { role } as Partial<UserProfile>);
  }

  /**
   * Check if user is team member
   */
  async isTeamMember(userId: string): Promise<boolean> {
    // Check cache first
    const cached = this.getCached(userId);
    if (cached) {
      return cached.role === 'team' || cached.role === 'owner';
    }

    const profile = await this.findById(userId);
    return profile?.role === 'team' || profile?.role === 'owner';
  }
}
