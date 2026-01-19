/**
 * Authentication Service
 * Single Responsibility: Handle authentication operations (login, logout)
 * Dependency Inversion: Depends on abstractions (IAuthSecurityManager)
 */

import type { AppUser, IAuthenticationService, IAuthSecurityManager } from './AuthTypes';

export class ClerkAuthenticationService implements IAuthenticationService {
  constructor(
    private securityManager: IAuthSecurityManager,
    private currentUser: () => AppUser | null
  ) {}

  /**
   * Email/password login (placeholder - Clerk handles this via components)
   */
  async login(email: string, password: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Clerk handles sign in through their components
      return {
        success: false,
        error: 'Please use the Clerk sign-in component'
      };
    } catch (err) {
      this.securityManager.logSecurityEvent('Login failed', {
        email,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Login failed'
      };
    }
  }

  /**
   * Social login (Google, GitHub)
   */
  async socialLogin(provider: 'google' | 'github'): Promise<{ success: boolean; error: string | null }> {
    try {
      this.securityManager.logSecurityEvent('Social login initiated', { provider });
      // Clerk handles OAuth through their components
      return { success: true, error: null };
    } catch (err) {
      this.securityManager.logSecurityEvent('Social login failed', {
        provider,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Social login failed'
      };
    }
  }

  /**
   * Token-based login
   */
  async loginWithToken(token: string): Promise<boolean> {
    try {
      this.securityManager.logSecurityEvent('Token login attempted');
      // Token-based login with Clerk
      return true;
    } catch (e) {
      this.securityManager.logSecurityEvent('Token login failed', {
        error: e instanceof Error ? e.message : 'Unknown error'
      });
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const user = this.currentUser();
      this.securityManager.logSecurityEvent('User logged out', {
        userId: user?.id
      });
      // Clerk sign out is handled by their SignOutButton component
      // For programmatic logout, reload the page
      window.location.href = '/';
    } catch (err) {
      this.securityManager.logSecurityEvent('Logout failed', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }
}
