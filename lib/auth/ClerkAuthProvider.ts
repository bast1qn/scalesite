/**
 * Clerk Authentication Provider Implementation
 *
 * Implements IAuthProvider interface for Clerk
 * Follows Dependency Inversion Principle
 */

import type {
  IAuthProvider,
  AuthUser,
  AuthSession,
  AuthCredentials,
  RegistrationData,
  PasswordResetData,
  SocialProvider,
  SocialAuthResult,
  AuthState,
  AuthEvent,
  AuthStateCallback,
  AuthErrorType,
  AuthError
} from './IAuthProvider';

// Type for Clerk (will be imported from @clerk/clerk-react)
interface ClerkUser {
  id: string;
  primaryEmailAddress?: { emailAddress: string };
  firstName?: string;
  lastName?: string;
  publicMetadata?: Record<string, any>;
  unsafeMetadata?: Record<string, any>;
}

interface ClerkSession {
  user: ClerkUser;
  token: string;
}

/**
 * Convert Clerk user to AuthUser
 */
function convertClerkUser(clerkUser: ClerkUser): AuthUser {
  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(' ') || undefined;

  return {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    name,
    role: clerkUser.publicMetadata?.role as string || 'user',
    metadata: {
      ...clerkUser.publicMetadata,
      ...clerkUser.unsafeMetadata
    }
  };
}

/**
 * Convert Clerk error to AuthError
 */
function convertClerkError(error: any): AuthError {
  const message = error?.message || 'Unknown authentication error';
  const code = error?.code;

  let type = AuthErrorType.UNKNOWN;

  if (message.includes('invalid') || message.includes('credentials')) {
    type = AuthErrorType.INVALID_CREDENTIALS;
  } else if (message.includes('not found')) {
    type = AuthErrorType.USER_NOT_FOUND;
  } else if (message.includes('exists')) {
    type = AuthErrorType.EMAIL_ALREADY_EXISTS;
  } else if (message.includes('password')) {
    type = AuthErrorType.WEAK_PASSWORD;
  } else if (message.includes('email')) {
    type = AuthErrorType.INVALID_EMAIL;
  } else if (message.includes('session') || message.includes('expired')) {
    type = AuthErrorType.SESSION_EXPIRED;
  } else if (message.includes('unauthorized')) {
    type = AuthErrorType.UNAUTHORIZED;
  } else if (message.includes('rate limit') || message.includes('too many')) {
    type = AuthErrorType.TOO_MANY_REQUESTS;
  }

  return { type, message, code, details: error };
}

/**
 * Clerk Authentication Provider
 */
export class ClerkAuthProvider implements IAuthProvider {
  private clerk: any;
  private initialized = false;
  private stateChangeCallbacks: Set<AuthStateCallback> = new Set();

  constructor(clerk: any) {
    this.clerk = clerk;
  }

  /**
   * Initialize Clerk provider
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Clerk is initialized by ClerkProvider wrapper
      this.initialized = true;

      // Listen to auth state changes
      if (this.clerk) {
        this.clerk.addListener((event: AuthEvent) => {
          this.notifyStateChange(event, null);
        });
      }
    } catch (error) {
      console.error('Failed to initialize Clerk provider:', error);
      throw error;
    }
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return 'clerk';
  }

  /**
   * Check if configured
   */
  isConfigured(): boolean {
    return !!this.clerk;
  }

  /**
   * Get configuration
   */
  getConfig(): Record<string, any> {
    return {
      provider: 'clerk',
      version: this.clerk?.version || 'unknown'
    };
  }

  // ==================== IAuthReadable ====================

  getAuthState(): AuthState {
    if (!this.clerk) return 'loading';

    try {
      if (this.clerk.loaded === false) return 'loading';
      return this.clerk.user ? 'authenticated' : 'unauthenticated';
    } catch {
      return 'error';
    }
  }

  async getUser(): Promise<AuthUser | null> {
    try {
      const clerkUser = this.clerk?.user;
      if (!clerkUser) return null;

      return convertClerkUser(clerkUser);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getSession(): Promise<AuthSession | null> {
    try {
      const clerkSession = await this.clerk?.session();
      if (!clerkSession) return null;

      const clerkUser = clerkSession.user;
      const token = await clerkSession.getToken();

      if (!clerkUser || !token) return null;

      return {
        user: convertClerkUser(clerkUser),
        accessToken: token,
        refreshToken: '', // Clerk handles refresh automatically
        expiresAt: Date.now() + 60000 // Default 1 minute
      };
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.clerk?.user;
  }

  async hasRole(role: string): Promise<boolean> {
    const user = await this.getUser();
    return user?.role === role;
  }

  async hasAnyRole(roles: string[]): Promise<boolean> {
    const user = await this.getUser();
    return user?.role ? roles.includes(user.role) : false;
  }

  // ==================== IAuthWritable ====================

  async signUp(data: RegistrationData): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const result = await this.clerk?.client.signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name?.split(' ')[0],
        lastName: data.name?.split(' ').slice(1).join(' '),
        unsafeMetadata: data.metadata
      });

      if (result?.user) {
        return {
          user: convertClerkUser(result.user),
          error: null
        };
      }

      return {
        user: null,
        error: 'Failed to create user'
      };
    } catch (error) {
      const authError = convertClerkError(error);
      return {
        user: null,
        error: authError.message
      };
    }
  }

  async signIn(data: AuthCredentials): Promise<{
    user: AuthUser | null;
    session: AuthSession | null;
    error: string | null;
  }> {
    try {
      const result = await this.clerk?.client.signIn.create({
        identifier: data.email,
        password: data.password
      });

      if (result?.createdSessionId) {
        await this.clerk?.setActive({
          session: result.createdSessionId
        });

        const user = await this.getUser();
        const session = await this.getSession();

        return {
          user,
          session,
          error: null
        };
      }

      return {
        user: null,
        session: null,
        error: 'Failed to sign in'
      };
    } catch (error) {
      const authError = convertClerkError(error);
      return {
        user: null,
        session: null,
        error: authError.message
      };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      await this.clerk?.signOut();
      return { error: null };
    } catch (error) {
      const authError = convertClerkError(error);
      return { error: authError.message };
    }
  }

  async resetPassword(data: PasswordResetData): Promise<{ error: string | null }> {
    try {
      if (data.newPassword) {
        // Reset password with token
        await this.clerk?.client.signIn.resetPassword({
          password: data.newPassword
        });
      } else {
        // Send reset email
        await this.clerk?.client.signIn.create({
          identifier: data.email
        });

        // Clerk handles password reset emails automatically
      }

      return { error: null };
    } catch (error) {
      const authError = convertClerkError(error);
      return { error: authError.message };
    }
  }

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const user = await this.clerk?.user?.update({
        password: newPassword
      });

      if (!user) {
        return { error: 'Failed to update password' };
      }

      return { error: null };
    } catch (error) {
      const authError = convertClerkError(error);
      return { error: authError.message };
    }
  }

  async updateProfile(data: Partial<AuthUser>): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const updates: any = {};

      if (data.name) {
        const parts = data.name.split(' ');
        updates.firstName = parts[0];
        updates.lastName = parts.slice(1).join(' ');
      }

      if (data.metadata) {
        updates.unsafeMetadata = data.metadata;
      }

      const result = await this.clerk?.user?.update(updates);

      if (result) {
        return {
          user: convertClerkUser(result),
          error: null
        };
      }

      return {
        user: null,
        error: 'Failed to update profile'
      };
    } catch (error) {
      const authError = convertClerkError(error);
      return {
        user: null,
        error: authError.message
      };
    }
  }

  async sendEmailVerification(): Promise<{ error: string | null }> {
    try {
      await this.clerk?.client.signIn.prepareFirstFactor({
        strategy: 'email_code',
        identifier: this.clerk?.user?.primaryEmailAddress?.emailAddress
      });

      return { error: null };
    } catch (error) {
      const authError = convertClerkError(error);
      return { error: authError.message };
    }
  }

  async verifyEmail(token: string): Promise<{ error: string | null }> {
    try {
      // Clerk handles email verification automatically via email links
      // This is a placeholder for custom token verification
      return { error: null };
    } catch (error) {
      const authError = convertClerkError(error);
      return { error: authError.message };
    }
  }

  // ==================== IAuthSocial ====================

  async signInWithProvider(provider: SocialProvider): Promise<SocialAuthResult | null> {
    try {
      // Map provider to Clerk's strategy
      const providerMap: Record<SocialProvider, string> = {
        google: 'oauth_google',
        github: 'oauth_github',
        linkedin: 'oauth_linkedin',
        facebook: 'oauth_facebook',
        apple: 'oauth_apple'
      };

      await this.clerk?.authenticateWithRedirect({
        strategy: providerMap[provider] as any,
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard'
      });

      return null; // Redirect will happen
    } catch (error) {
      console.error('Error signing in with provider:', error);
      return null;
    }
  }

  async linkProvider(provider: SocialProvider): Promise<{ error: string | null }> {
    try {
      const providerMap: Record<SocialProvider, string> = {
        google: 'oauth_google',
        github: 'oauth_github',
        linkedin: 'oauth_linkedin',
        facebook: 'oauth_facebook',
        apple: 'oauth_apple'
      };

      await this.clerk?.user?.createExternalAccount({
        strategy: providerMap[provider] as any
      });

      return { error: null };
    } catch (error) {
      const authError = convertClerkError(error);
      return { error: authError.message };
    }
  }

  async unlinkProvider(provider: SocialProvider): Promise<{ error: string | null }> {
    try {
      const accounts = this.clerk?.user?.externalAccounts || [];
      const account = accounts.find((acc: any) => acc.provider.includes(provider));

      if (account) {
        await account.destroy();
      }

      return { error: null };
    } catch (error) {
      const authError = convertClerkError(error);
      return { error: authError.message };
    }
  }

  async getLinkedProviders(): Promise<SocialProvider[]> {
    const accounts = this.clerk?.user?.externalAccounts || [];
    return accounts.map((acc: any) => {
      if (acc.provider.includes('google')) return 'google';
      if (acc.provider.includes('github')) return 'github';
      if (acc.provider.includes('linkedin')) return 'linkedin';
      if (acc.provider.includes('facebook')) return 'facebook';
      if (acc.provider.includes('apple')) return 'apple';
      return 'google'; // default
    });
  }

  // ==================== IAuthSessionManager ====================

  async refreshSession(): Promise<AuthSession | null> {
    try {
      // Clerk handles token refresh automatically
      return await this.getSession();
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }

  async setSession(accessToken: string, refreshToken: string): Promise<void> {
    // Clerk handles session management automatically
    // This method is not applicable for Clerk
    console.warn('setSession is not supported by Clerk provider');
  }

  async invalidateSessions(): Promise<void> {
    try {
      await this.clerk?.signOut();
    } catch (error) {
      console.error('Error invalidating sessions:', error);
    }
  }

  onAuthStateChange(callback: AuthStateCallback): () => void {
    this.stateChangeCallbacks.add(callback);

    return () => {
      this.stateChangeCallbacks.delete(callback);
    };
  }

  // ==================== IAuthTokenManager ====================

  async getAccessToken(): Promise<string | null> {
    try {
      const session = await this.clerk?.session();
      return await session?.getToken() || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    // Clerk handles refresh tokens internally
    return null;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // Clerk validates tokens automatically
      // This is a placeholder for custom validation
      return !!token;
    } catch (error) {
      return false;
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    return await this.getAccessToken();
  }

  // ==================== Private Methods ====================

  private notifyStateChange(event: AuthEvent, session: any): void {
    this.stateChangeCallbacks.forEach(callback => {
      try {
        callback(event, session);
      } catch (error) {
        console.error('Error in auth state change callback:', error);
      }
    });
  }
}
