/**
 * Refactored Authentication Context
 * Following SOLID Principles:
 * - Single Responsibility: Delegates to focused services
 * - Open/Closed: Extensible through service composition
 * - Liskov Substitution: Services implement interfaces
 * - Interface Segregation: Small, focused interfaces
 * - Dependency Inversion: Depends on abstractions
 */

import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { isClerkAvailable } from '../../lib/clerk';
import { AuthStateManager } from './AuthStateManager';
import { AuthSecurityManager } from './AuthSecurityManager';
import { ClerkAuthenticationService } from './AuthenticationService';
import { ClerkRegistrationService } from './RegistrationService';
import { AuthFacade } from './AuthFacade';
import type { AuthContextType, AppUser } from './AuthTypes';

const DEFAULT_CONTEXT: AuthContextType = {
  user: null,
  loading: false,
  login: async () => ({ success: false, error: 'AuthProvider not initialized' }),
  socialLogin: async () => ({ success: false, error: 'AuthProvider not initialized' }),
  loginWithToken: async () => false,
  logout: async () => {},
  register: async () => ({ success: false, error: 'AuthProvider not initialized', requiresConfirmation: false }),
  resendConfirmationEmail: async () => ({ success: false, error: 'AuthProvider not initialized' }),
};

export const AuthContext = createContext<AuthContextType>(DEFAULT_CONTEXT);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider with SOLID architecture
 * Uses Facade pattern to hide subsystem complexity
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const clerkAuth = useClerkAuth();

  // Extract Clerk state
  const isLoaded = isClerkAvailable ? clerkAuth.isLoaded : true;
  const isSignedIn = isClerkAvailable ? clerkAuth.isSignedIn : false;
  const clerkUser = isClerkAvailable ? clerkAuth.user : null;

  // Initialize managers
  const securityManager = useMemo(() => new AuthSecurityManager(500, 1000), []);
  const stateManager = useMemo(
    () => new AuthStateManager(clerkUser, isSignedIn, false),
    [clerkUser, isSignedIn]
  );

  // Initialize services with dependency injection
  const authService = useMemo(
    () => new ClerkAuthenticationService(
      securityManager,
      () => stateManager.getUser()
    ),
    [securityManager, stateManager]
  );

  const registrationService = useMemo(
    () => new ClerkRegistrationService(securityManager),
    [securityManager]
  );

  // Create facade for unified interface
  const authFacade = useMemo(
    () => new AuthFacade(stateManager, authService, registrationService),
    [stateManager, authService, registrationService]
  );

  // Timeout management
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Clerk loading timeout
  useEffect(() => {
    if (isClerkAvailable && !isLoaded) {
      const cleanup = securityManager.enforceTimeout(
        isLoaded,
        () => setHasTimedOut(true),
        false
      );
      return cleanup;
    } else {
      setHasTimedOut(false);
    }
  }, [isClerkAvailable, isLoaded, securityManager]);

  // Global timeout (always active)
  useEffect(() => {
    const cleanup = securityManager.enforceTimeout(
      true,
      () => {
        console.warn('[AuthContext] Global timeout - forcing loading to false');
        securityManager.logSecurityEvent('Global auth timeout');
      },
      true
    );
    return cleanup;
  }, [securityManager]);

  // Update state when Clerk user changes
  useEffect(() => {
    stateManager.updateUser(clerkUser, isSignedIn);
  }, [clerkUser, isSignedIn, stateManager]);

  // Force loading to false (emergency fix)
  const effectiveLoading = false;

  // Create context value with facade methods
  const contextValue = useMemo<AuthContextType>(() => ({
    user: authFacade.user,
    loading: effectiveLoading,
    login: authFacade.login.bind(authFacade),
    socialLogin: authFacade.socialLogin.bind(authFacade),
    loginWithToken: authFacade.loginWithToken.bind(authFacade),
    logout: authFacade.logout.bind(authFacade),
    register: authFacade.register.bind(authFacade),
    resendConfirmationEmail: authFacade.resendConfirmationEmail.bind(authFacade),
  }), [authFacade, effectiveLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types for external use
export type { AppUser, AuthContextType } from './AuthTypes';
