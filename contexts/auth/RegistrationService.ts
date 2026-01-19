/**
 * Registration Service
 * Single Responsibility: Handle user registration operations
 */

import type { IRegistrationService, RegistrationData } from './AuthTypes';
import type { IAuthSecurityManager } from './AuthTypes';

export class ClerkRegistrationService implements IRegistrationService {
  constructor(
    private securityManager: IAuthSecurityManager
  ) {}

  /**
   * Register new user
   */
  async register(data: RegistrationData): Promise<{
    success: boolean;
    error: string | null;
    requiresConfirmation: boolean;
  }> {
    try {
      this.securityManager.logSecurityEvent('Registration attempted', {
        email: data.email,
        company: data.company
      });

      // Clerk handles registration through their components
      return {
        success: false,
        error: 'Please use the Clerk sign-up component',
        requiresConfirmation: false
      };
    } catch (err) {
      this.securityManager.logSecurityEvent('Registration failed', {
        email: data.email,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        requiresConfirmation: false
      };
    }
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(email: string): Promise<{
    success: boolean;
    error: string | null;
  }> {
    try {
      this.securityManager.logSecurityEvent('Confirmation email requested', { email });
      // Clerk handles email verification automatically
      return { success: true, error: null };
    } catch (err) {
      this.securityManager.logSecurityEvent('Failed to resend confirmation', {
        email,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to resend'
      };
    }
  }
}
