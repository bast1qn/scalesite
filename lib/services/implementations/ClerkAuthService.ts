/**
 * Clerk Authentication Service Implementation
 *
 * Concrete implementation of IAuthService using Clerk
 */

import {
  IAuthService,
  User,
  AuthCredentials,
  AuthTokens,
  RegisterData,
  OAuthProvider,
  AuthResult,
} from '../interfaces/IAuthService';

export class ClerkAuthService implements IAuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  async login(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      // Clerk handles login through their components
      // This is a placeholder for custom email/password login if needed
      return {
        success: false,
        error: 'Please use Clerk authentication components',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  async register(data: RegisterData): Promise<AuthResult> {
    try {
      // Clerk handles registration through their components
      return {
        success: false,
        error: 'Please use Clerk registration components',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.clearToken();
    // Clerk handles the actual logout through their components
  }

  async loginWithOAuth(provider: OAuthProvider, code: string): Promise<AuthResult> {
    try {
      // Clerk handles OAuth through their components
      return {
        success: false,
        error: 'Please use Clerk OAuth components',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OAuth login failed',
      };
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthTokens | null> {
    // Clerk handles token refresh automatically
    return null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    this.currentUser = {
      ...this.currentUser,
      ...updates,
      updatedAt: new Date(),
    };

    return this.currentUser;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    // Clerk handles password changes through their components
    return false;
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    // Clerk handles password reset through their components
    return false;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    // Clerk handles password reset through their components
    return false;
  }

  async verifyEmail(token: string): Promise<boolean> {
    // Clerk handles email verification through their components
    return false;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  /**
   * Set current user (called by Clerk authentication state changes)
   */
  setUserFromClerk(clerkUser: any): User {
    this.currentUser = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      avatar: clerkUser.imageUrl,
      role: clerkUser.publicMetadata?.role || 'user',
      createdAt: new Date(clerkUser.createdAt),
      updatedAt: new Date(clerkUser.updatedAt),
    };

    return this.currentUser;
  }
}
