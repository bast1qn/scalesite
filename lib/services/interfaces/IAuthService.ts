/**
 * Authentication Service Interface
 *
 * ⚠️ DEPRECATED: This interface violates Interface Segregation Principle (ISP)
 *
 * This interface is kept for backward compatibility but should not be used for new code.
 * Instead, use the split interfaces from './IAuthService.split':
 *
 * - IAuthenticationService: Login, logout, OAuth
 * - IRegistrationService: Registration, email verification
 * - ITokenService: Token management
 * - IUserProfileService: User profile operations
 * - IPasswordService: Password changes and resets
 *
 * Migration Guide:
 * OLD: import { IAuthService } from './IAuthService';
 * NEW: import { IAuthenticationService, ITokenService } from './IAuthService.split';
 *
 * @deprecated Use split interfaces from './IAuthService.split.ts' instead
 */

export {
  User,
  AuthCredentials,
  AuthTokens,
  RegisterData,
  OAuthProvider,
  AuthResult,
  IAuthService,
  // Split interfaces (ISP compliant)
  IAuthenticationService,
  IRegistrationService,
  ITokenService,
  IUserProfileService,
  IPasswordService,
  IAuthServiceFactory,
} from './IAuthService.split';
