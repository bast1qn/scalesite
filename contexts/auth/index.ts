/**
 * Authentication Module - Barrel Export
 * Clean API for the authentication subsystem
 */

// Context
export { AuthProvider, useAuth } from './AuthContext';
export type { AppUser, AuthContextType } from './AuthTypes';

// Types
export type {
  IAuthStateManager,
  IAuthenticationService,
  IRegistrationService,
  IAuthSecurityManager,
  AuthResult,
  RegistrationResult,
  OperationResult,
  RegistrationData
} from './AuthTypes';

// Services (for testing/extension)
export { AuthStateManager } from './AuthStateManager';
export { AuthSecurityManager } from './AuthSecurityManager';
export { ClerkAuthenticationService } from './AuthenticationService';
export { ClerkRegistrationService } from './RegistrationService';
export { UserMapper } from './UserMapper';
export { AuthFacade } from './AuthFacade';
