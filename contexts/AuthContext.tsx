
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase, getUserProfile, hasRole, UserProfile } from '../lib/supabase';

// Define the custom User type
export interface AppUser {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: 'team' | 'user' | 'owner';
  referral_code: string | null;
}

// Define the shape of the context
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error: string | null }>;
  socialLogin: (provider: 'google' | 'github') => Promise<{ success: boolean; error: string | null }>;
  loginWithToken: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, company: string, email: string, pass: string, referralCode?: string) => Promise<{ success: boolean; error: string | null, requiresConfirmation: boolean }>;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false, error: 'AuthProvider not initialized' }),
  socialLogin: async () => ({ success: false, error: 'AuthProvider not initialized' }),
  loginWithToken: async () => false,
  logout: async () => {},
  register: async () => ({ success: false, error: 'AuthProvider not initialized', requiresConfirmation: false }),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Load user session on mount
  useEffect(() => {
    let isMounted = true;
    let safetyTimeout: NodeJS.Timeout | null = null;

    // Safety timeout: stop loading after 10 seconds even if auth hasn't completed
    safetyTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('[AUTH] Safety timeout triggered - stopping loading after 10s');
        setLoading(false);
        setSessionChecked(true);
      }
    }, 10000);

    // Immediately check if we should stop loading
    const stopLoading = () => {
      if (isMounted) {
        setLoading(false);
        setSessionChecked(true);
        if (safetyTimeout) clearTimeout(safetyTimeout);
      }
    };

    // Get initial session with better error handling
    const checkSession = async () => {
      try {
        console.log('[AUTH] Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('[AUTH] Error getting session:', error.message);
          // Don't stop loading here - let onAuthStateChange handle it
          return;
        }

        console.log('[AUTH] Session check result:', session ? 'Found session' : 'No session');

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          stopLoading();
        }
      } catch (err: any) {
        console.error('[AUTH] Exception getting session:', err?.message || err);
        // Don't stop loading here - let onAuthStateChange handle it
      }
    };

    checkSession();

    // Listen for auth changes - this is the PRIMARY way we track auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] Auth state changed:', event, 'Has user:', !!session?.user);
      if (!isMounted) return;

      setSessionChecked(true);

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        stopLoading();
      }
    });

    return () => {
      isMounted = false;
      if (safetyTimeout) clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('[AUTH] Loading user profile for:', userId);
      const { data, error } = await getUserProfile(userId);

      if (error) {
        console.error('[AUTH] Error loading profile from DB:', error);
        // Create a basic user from auth data if profile doesn't exist yet
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('[AUTH] Creating basic user from auth data');
          setUser({
            id: user.id,
            name: user.user_metadata?.name || '',
            email: user.email || '',
            company: user.user_metadata?.company || null,
            role: 'user',
            referral_code: null
          });
        }
        setLoading(false);
        return;
      }

      if (data) {
        console.log('[AUTH] Profile loaded successfully:', data.email);
        setUser({
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          company: data.company,
          role: data.role as 'team' | 'user' | 'owner',
          referral_code: data.referral_code
        });
      } else {
        console.error('[AUTH] No profile data found');
      }
    } catch (e) {
      console.error('[AUTH] Exception loading user profile:', e);
    } finally {
      setLoading(false);
      console.log('[AUTH] Loading complete, user state:', user);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return { success: true, error: null };
      }

      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login fehlgeschlagen' };
    }
  };

  const socialLogin = async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Social Login fehlgeschlagen' };
    }
  };

  const loginWithToken = async (token: string) => {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '', // Will be handled by Supabase
      });

      if (error || !data.user) {
        return false;
      }

      await loadUserProfile(data.user.id);
      return true;
    } catch (e) {
      console.error('Token login failed:', e);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (name: string, company: string, email: string, pass: string, referralCode?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            name,
            company,
            referred_by: referralCode,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        return { success: false, error: error.message, requiresConfirmation: false };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: false,
          error: 'Bitte bestätige deine E-Mail-Adresse.',
          requiresConfirmation: true
        };
      }

      if (data.user) {
        // Update profile with company (trigger creates profile, but we need to update company)
        if (data.user.id) {
          await supabase
            .from('profiles')
            .update({ company })
            .eq('id', data.user.id);
        }

        await loadUserProfile(data.user.id);
        return { success: true, error: null, requiresConfirmation: false };
      }

      return { success: false, error: 'Registrierung fehlgeschlagen', requiresConfirmation: false };
    } catch (err: any) {
      return { success: false, error: err.message || 'Ein unbekannter Fehler ist aufgetreten.', requiresConfirmation: false };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, socialLogin, loginWithToken, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
