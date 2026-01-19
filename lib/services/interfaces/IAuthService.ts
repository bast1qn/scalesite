/**
 * Authentication Service Interface
 *
 * Abstraction layer for authentication operations
 * Follows Dependency Inversion Principle (high-level modules depend on abstractions)
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  company?: string;
}

export interface OAuthProvider {
  name: 'github' | 'google' | 'linkedin';
  clientId: string;
  redirectUri: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  tokens?: AuthTokens;
  error?: string;
}

export interface IAuthService {
  /**
   * Authenticate user with email and password
   */
  login(credentials: AuthCredentials): Promise<AuthResult>;

  /**
   * Register a new user
   */
  register(data: RegisterData): Promise<AuthResult>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Authenticate with OAuth provider
   */
  loginWithOAuth(provider: OAuthProvider, code: string): Promise<AuthResult>;

  /**
   * Refresh access token
   */
  refreshAccessToken(refreshToken: string): Promise<AuthTokens | null>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Promise<User>;

  /**
   * Change password
   */
  changePassword(oldPassword: string, newPassword: string): Promise<boolean>;

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Promise<boolean>;

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<boolean>;

  /**
   * Verify email address
   */
  verifyEmail(token: string): Promise<boolean>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Get authentication token
   */
  getToken(): string | null;

  /**
   * Set authentication token
   */
  setToken(token: string): void;

  /**
   * Clear authentication token
   */
  clearToken(): void;
}
