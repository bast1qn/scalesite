
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
  register: (name: string, company: string, email: string, pass: string) => Promise<{ success: boolean; error: string | null, requiresConfirmation: boolean }>;
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
    let timeoutId: NodeJS.Timeout | null = null;

    // Immediately check if we should stop loading
    const stopLoading = () => {
      if (isMounted) {
        setLoading(false);
        setSessionChecked(true);
      }
    };

    // Fallback timeout: stop loading after 5 seconds even if Supabase hasn't responded
    timeoutId = setTimeout(() => {
      if (!sessionChecked) {
        console.warn('[AUTH] Session check timeout - proceeding without auth');
        stopLoading();
      }
    }, 5000);

    // Get initial session with better error handling
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (timeoutId) clearTimeout(timeoutId);

        if (!isMounted) return;

        if (error) {
          console.error('[AUTH] Error getting session:', error);
          stopLoading();
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          stopLoading();
        }
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        console.error('[AUTH] Exception getting session:', err);
        if (isMounted) stopLoading();
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'INITIAL_SESSION') {
        setSessionChecked(true);
      }

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await getUserProfile(userId);
      if (data) {
        setUser({
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          company: data.company,
          role: data.role as 'team' | 'user' | 'owner',
          referral_code: data.referral_code
        });
      } else {
        console.error('Error loading profile:', error);
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    } finally {
      setLoading(false);
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

  const register = async (name: string, company: string, email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            name,
            company,
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
