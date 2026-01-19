/**
 * Authentication Type Definitions
 * Following Interface Segregation Principle - Small, focused interfaces
 */

export interface AppUser {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: 'team' | 'user' | 'owner';
  referral_code: string | null;
}

// Interface Segregation: Separate interfaces for different concerns
export interface IAuthStateManager {
  getUser(): AppUser | null;
  isLoading(): boolean;
}

export interface IAuthenticationService {
  login(email: string, password: string): Promise<AuthResult>;
  socialLogin(provider: 'google' | 'github'): Promise<AuthResult>;
  loginWithToken(token: string): Promise<boolean>;
  logout(): Promise<void>;
}

export interface IRegistrationService {
  register(data: RegistrationData): Promise<RegistrationResult>;
  resendConfirmationEmail(email: string): Promise<OperationResult>;
}

export interface IAuthSecurityManager {
  logSecurityEvent(event: string, data?: Record<string, unknown>): void;
  enforceTimeout(): void;
}

export type AuthResult = {
  success: boolean;
  error: string | null;
};

export type RegistrationResult = AuthResult & {
  requiresConfirmation: boolean;
};

export type OperationResult = AuthResult;

export interface RegistrationData {
  name: string;
  company: string;
  email: string;
  password: string;
  referralCode?: string;
}
