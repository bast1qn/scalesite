/**
 * Authentication State Manager
 * Single Responsibility: Manage authentication state only
 */

import { useMemo } from 'react';
import type { User } from '@clerk/clerk-react';
import type { AppUser, IAuthStateManager } from './AuthTypes';
import { UserMapper } from './UserMapper';

export class AuthStateManager implements IAuthStateManager {
  private user: AppUser | null = null;
  private loading: boolean = false;

  constructor(clerkUser: User | null, isSignedIn: boolean, initialLoading: boolean) {
    this.loading = initialLoading;
    this.updateUser(clerkUser, isSignedIn);
  }

  /**
   * Update user state based on Clerk authentication
   */
  updateUser(clerkUser: User | null, isSignedIn: boolean): void {
    if (clerkUser && isSignedIn) {
      this.user = UserMapper.mapClerkUserToAppUser(clerkUser);
    } else {
      this.user = null;
    }
  }

  /**
   * Get current user
   */
  getUser(): AppUser | null {
    return this.user;
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Update loading state
   */
  setLoadingState(loading: boolean): void {
    this.loading = loading;
  }

  /**
   * Create React hook for state access
   */
  static createHook(manager: AuthStateManager) {
    return () => ({
      user: useMemo(() => manager.getUser(), [manager]),
      loading: manager.isLoading()
    });
  }
}
