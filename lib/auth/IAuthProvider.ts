/**
 * Authentication Provider Abstraction
 *
 * SOLID Principles:
 * - Dependency Inversion: High-level modules depend on this abstraction
 * - Interface Segregation: Separate interfaces for different auth capabilities
 * - Open/Closed: Can extend with new providers without modifying existing code
 */

/**
 * User session information
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  metadata?: Record<string, any>;
}

/**
 * Authentication session
 */
export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegistrationData extends AuthCredentials {
  name?: string;
  metadata?: Record<string, any>;
}

/**
 * Password reset data
 */
export interface PasswordResetData {
  email: string;
  newPassword?: string;
  token?: string;
}

/**
 * Social auth provider types
 */
export type SocialProvider = 'google' | 'github' | 'linkedin' | 'facebook' | 'apple';

/**
 * Social auth result
 */
export interface SocialAuthResult {
  user: AuthUser;
  session: AuthSession;
  provider: SocialProvider;
}

/**
 * Authentication state
 */
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

/**
 * Authentication events
 */
export type AuthEvent =
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'TOKEN_REFRESHED'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFIED';

/**
 * Authentication state callback
 */
export type AuthStateCallback = (event: AuthEvent, session: AuthSession | null) => void;

/**
 * Read-only authentication operations
 * Follows Interface Segregation Principle
 */
export interface IAuthReadable {
  /**
   * Get current authentication state
   */
  getAuthState(): AuthState;

  /**
   * Get current user
   */
  getUser(): Promise<AuthUser | null>;

  /**
   * Get current session
   */
  getSession(): Promise<AuthSession | null>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Check if user has specific role
   */
  hasRole(role: string): Promise<boolean>;

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): Promise<boolean>;
}

/**
 * Write authentication operations
 * Follows Interface Segregation Principle
 */
export interface IAuthWritable {
  /**
   * Sign up a new user
   */
  signUp(data: RegistrationData): Promise<{ user: AuthUser | null; error: string | null }>;

  /**
   * Sign in with credentials
   */
  signIn(data: AuthCredentials): Promise<{ user: AuthUser | null; session: AuthSession | null; error: string | null }>;

  /**
   * Sign out current user
   */
  signOut(): Promise<{ error: string | null }>;

  /**
   * Reset password
   */
  resetPassword(data: PasswordResetData): Promise<{ error: string | null }>;

  /**
   * Update password
   */
  updatePassword(newPassword: string): Promise<{ error: string | null }>;

  /**
   * Update user profile
   */
  updateProfile(data: Partial<AuthUser>): Promise<{ user: AuthUser | null; error: string | null }>;

  /**
   * Send email verification
   */
  sendEmailVerification(): Promise<{ error: string | null }>;

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Promise<{ error: string | null }>;
}

/**
 * Social authentication operations
 */
export interface IAuthSocial {
  /**
   * Sign in with social provider
   */
  signInWithProvider(provider: SocialProvider): Promise<SocialAuthResult | null>;

  /**
   * Link social provider to account
   */
  linkProvider(provider: SocialProvider): Promise<{ error: string | null }>;

  /**
   * Unlink social provider
   */
  unlinkProvider(provider: SocialProvider): Promise<{ error: string | null }>;

  /**
   * Get linked social providers
   */
  getLinkedProviders(): Promise<SocialProvider[]>;
}

/**
 * Session management operations
 */
export interface IAuthSessionManager {
  /**
   * Refresh session
   */
  refreshSession(): Promise<AuthSession | null>;

  /**
   * Set session manually
   */
  setSession(accessToken: string, refreshToken: string): Promise<void>;

  /**
   * Invalidate all sessions
   */
  invalidateSessions(): Promise<void>;

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: AuthStateCallback): () => void;
}

/**
 * Token management operations
 */
export interface IAuthTokenManager {
  /**
   * Get access token
   */
  getAccessToken(): Promise<string | null>;

  /**
   * Get refresh token
   */
  getRefreshToken(): Promise<string | null>;

  /**
   * Validate token
   */
  validateToken(token: string): Promise<boolean>;

  /**
   * Refresh access token
   */
  refreshAccessToken(): Promise<string | null>;
}

/**
 * Complete authentication provider interface
 * Combines all auth capabilities
 * Follows Dependency Inversion Principle
 */
export interface IAuthProvider
  extends IAuthReadable,
    IAuthWritable,
    IAuthSocial,
    IAuthSessionManager,
    IAuthTokenManager {

  /**
   * Initialize authentication provider
   */
  initialize(): Promise<void>;

  /**
   * Get provider name
   */
  getProviderName(): string;

  /**
   * Check if provider is configured
   */
  isConfigured(): boolean;

  /**
   * Get provider configuration
   */
  getConfig(): Record<string, any>;
}

/**
 * Authentication provider factory interface
 */
export interface IAuthProviderFactory {
  /**
   * Create authentication provider
   */
  createProvider(type: string): IAuthProvider;

  /**
   * Register custom provider
   */
  registerProvider(type: string, provider: IAuthProvider): void;

  /**
   * Get available providers
   */
  getAvailableProviders(): string[];
}

/**
 * Authentication context type
 * Used in React context
 */
export interface IAuthContext {
  state: AuthState;
  user: AuthUser | null;
  session: AuthSession | null;
  provider: IAuthProvider;
  signIn: (data: AuthCredentials) => Promise<void>;
  signUp: (data: RegistrationData) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: SocialProvider) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Authentication error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Authentication error
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  code?: string;
  details?: any;
}
