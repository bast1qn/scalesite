/**
 * Authentication Facade
 * Facade Pattern: Provides simplified interface to complex authentication subsystem
 * Dependency Inversion: High-level module depends on abstractions
 */

import type {
  AppUser,
  IAuthStateManager,
  IAuthenticationService,
  IRegistrationService
} from './AuthTypes';

/**
 * Unified facade for authentication operations
 * Hides complexity of underlying services
 */
export class AuthFacade {
  constructor(
    private stateManager: IAuthStateManager,
    private authService: IAuthenticationService,
    private registrationService: IRegistrationService
  ) {}

  // State access
  get user(): AppUser | null {
    return this.stateManager.getUser();
  }

  get loading(): boolean {
    return this.stateManager.isLoading();
  }

  // Authentication operations
  async login(email: string, password: string) {
    return this.authService.login(email, password);
  }

  async socialLogin(provider: 'google' | 'github') {
    return this.authService.socialLogin(provider);
  }

  async loginWithToken(token: string): Promise<boolean> {
    return this.authService.loginWithToken(token);
  }

  async logout(): Promise<void> {
    return this.authService.logout();
  }

  // Registration operations
  async register(data: {
    name: string;
    company: string;
    email: string;
    password: string;
    referralCode?: string;
  }) {
    return this.registrationService.register(data);
  }

  async resendConfirmationEmail(email: string) {
    return this.registrationService.resendConfirmationEmail(email);
  }
}
