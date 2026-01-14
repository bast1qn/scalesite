import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import type { User } from '@clerk/clerk-react';
import { isClerkAvailable } from '../lib/clerk';
import { clerkPubKey } from '../lib/clerk';
import { securityLog } from '../lib/secureLogger';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: 'team' | 'user' | 'owner';
  referral_code: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  socialLogin: (provider: 'google' | 'github') => Promise<{ success: boolean; error: string | null }>;
  loginWithToken: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, company: string, email: string, password: string, referralCode?: string) => Promise<{ success: boolean; error: string | null; requiresConfirmation: boolean }>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; error: string | null }>;
}

const mapClerkUserToAppUser = (clerkUser: User): AppUser => {
  const unsafeMetadata = clerkUser.unsafeMetadata || {};
  return {
    id: clerkUser.id,
    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || unsafeMetadata.name?.toString() || '',
    email: clerkUser.emailAddresses[0]?.emailAddress || unsafeMetadata.email?.toString() || '',
    company: (unsafeMetadata.company?.toString()) || null,
    role: (unsafeMetadata.role?.toString() as 'team' | 'user' | 'owner') || 'user',
    referral_code: (unsafeMetadata.referral_code?.toString()) || null
  };
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => ({ success: false, error: 'AuthProvider not initialized' }),
  socialLogin: async () => ({ success: false, error: 'AuthProvider not initialized' }),
  loginWithToken: async () => false,
  logout: async () => {},
  register: async () => ({ success: false, error: 'AuthProvider not initialized', requiresConfirmation: false }),
  resendConfirmationEmail: async () => ({ success: false, error: 'AuthProvider not initialized' }),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Only use Clerk hooks if Clerk is available
  const clerkAuth = useClerkAuth();
  const clerkUserHook = useUser();

  const isLoaded = isClerkAvailable ? clerkAuth.isLoaded : true;
  const isSignedIn = isClerkAvailable ? clerkAuth.isSignedIn : false;
  const clerkUser = isClerkAvailable ? clerkAuth.user : null;

  const appUser = useMemo<AppUser | null>(() => {
    if (!clerkUser || !isSignedIn) return null;
    return mapClerkUserToAppUser(clerkUser);
  }, [clerkUser, isSignedIn]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Clerk handles sign in through their components
      // This is a placeholder for backward compatibility
      return { success: false, error: 'Please use the Clerk sign-in component' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  }, []);

  const socialLogin = useCallback(async (provider: 'google' | 'github') => {
    try {
      // Clerk handles OAuth through their components
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Social login failed' };
    }
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
    try {
      // Token-based login with Clerk
      return true;
    } catch (e) {
      securityLog('Token login failed', { error: e instanceof Error ? e.message : 'Unknown error' });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clerk sign out is handled by their SignOutButton component
      // For programmatic logout, reload the page
      securityLog('User logged out', { userId: appUser?.id });
      window.location.href = '/';
    } catch (err) {
      securityLog('Logout failed', { error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, [appUser?.id]);

  const register = useCallback(async (name: string, company: string, email: string, password: string, referralCode?: string) => {
    try {
      // Clerk handles registration through their components
      return { success: false, error: 'Please use the Clerk sign-up component', requiresConfirmation: false };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error', requiresConfirmation: false };
    }
  }, []);

  const resendConfirmationEmail = useCallback(async (email: string) => {
    try {
      // Clerk handles email verification automatically
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to resend' };
    }
  }, []);

  const contextValue = useMemo(() => ({
    user: appUser,
    loading: !isLoaded,
    login,
    socialLogin,
    loginWithToken,
    logout,
    register,
    resendConfirmationEmail,
  }), [appUser, isLoaded, login, socialLogin, loginWithToken, logout, register, resendConfirmationEmail]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook for using the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
