/**
 * Authentication Service Interfaces - Split (ISP Compliant)
 *
 * PURPOSE: Interface Segregation Principle - Split broad interfaces into focused ones
 * SOLID Compliance:
 * - Interface Segregation: Clients depend only on methods they use
 * - Single Responsibility: Each interface has one clear purpose
 * - Dependency Inversion: Depend on abstractions, not concretions
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

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

// ============================================================================
// AUTHENTICATION INTERFACE (Login/Logout)
// ============================================================================

/**
 * Core authentication operations
 * RESPONSIBILITY: User authentication flow (login, logout, OAuth)
 */
export interface IAuthenticationService {
  /**
   * Authenticate user with email and password
   */
  login(credentials: AuthCredentials): Promise<AuthResult>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Authenticate with OAuth provider
   */
  loginWithOAuth(provider: OAuthProvider, code: string): Promise<AuthResult>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;
}

// ============================================================================
// REGISTRATION INTERFACE
// ============================================================================

/**
 * User registration operations
 * RESPONSIBILITY: New user account creation
 */
export interface IRegistrationService {
  /**
   * Register a new user
   */
  register(data: RegisterData): Promise<AuthResult>;

  /**
   * Verify email address
   */
  verifyEmail(token: string): Promise<boolean>;
}

// ============================================================================
// TOKEN MANAGEMENT INTERFACE
// ============================================================================

/**
 * Token lifecycle management
 * RESPONSIBILITY: JWT token handling and refresh
 */
export interface ITokenService {
  /**
   * Refresh access token
   */
  refreshAccessToken(refreshToken: string): Promise<AuthTokens | null>;

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

  /**
   * Validate token
   */
  validateToken(token: string): boolean;
}

// ============================================================================
// USER PROFILE INTERFACE
// ============================================================================

/**
 * User profile management
 * RESPONSIBILITY: User data operations
 */
export interface IUserProfileService {
  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Promise<User>;

  /**
   * Get user by ID
   */
  getUserById(id: string): Promise<User | null>;
}

// ============================================================================
// PASSWORD MANAGEMENT INTERFACE
// ============================================================================

/**
 * Password operations
 * RESPONSIBILITY: Password changes and resets
 */
export interface IPasswordService {
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
   * Validate password strength
   */
  validatePasswordStrength(password: string): boolean;
}

// ============================================================================
// COMPOSITE INTERFACE (Backward Compatibility)
// ============================================================================

/**
 * Complete authentication service
 * COMPOSED OF: All auth-related interfaces
 * USAGE: When you need full auth functionality
 */
export interface IAuthService
  extends IAuthenticationService,
    IRegistrationService,
    ITokenService,
    IUserProfileService,
    IPasswordService {}

// ============================================================================
// SERVICE FACTORY INTERFACES
// ============================================================================

/**
 * Auth Service Factory
 * Creates specialized auth services
 */
export interface IAuthServiceFactory {
  getAuthenticationService(): IAuthenticationService;
  getRegistrationService(): IRegistrationService;
  getTokenService(): ITokenService;
  getUserProfileService(): IUserProfileService;
  getPasswordService(): IPasswordService;
  getFullAuthService(): IAuthService;
}
