
import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { supabase, getUserProfile, hasRole, UserProfile } from '../lib/supabase';
import { translations } from '../lib/translations';

const getT = () => {
  const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('app_language')) || 'en';
  const langKey = lang === 'de' || lang === 'en' ? lang : 'en';
  return (key: string): string => {
    const keys = key.split('.');
    let current: unknown = translations[langKey];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof current === 'string' ? current : key;
  };
};

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
  login: (email: string, pass: string) => Promise<{ success: boolean; error: string | null }>;
  socialLogin: (provider: 'google' | 'github') => Promise<{ success: boolean; error: string | null }>;
  loginWithToken: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, company: string, email: string, pass: string, referralCode?: string) => Promise<{ success: boolean; error: string | null, requiresConfirmation: boolean }>;
}

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

  const loadingRef = useRef(true);

  useEffect(() => {
    loadingRef.current = loading;
    console.log('[AUTH] Loading state changed to:', loading);
  }, [loading]);

  useEffect(() => {
    let isMounted = true;
    let safetyTimeout: NodeJS.Timeout | null = null;

    safetyTimeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.error('[AUTH] Safety timeout triggered after 30s - Supabase connection may be failing');
        console.error('[AUTH] Check your Supabase configuration in .env file');
        setLoading(false);
        setSessionChecked(true);
      }
    }, 30000);

    const stopLoading = () => {
      if (isMounted) {
        console.log('[AUTH] stopLoading called');
        setLoading(false);
        setSessionChecked(true);
        if (safetyTimeout) clearTimeout(safetyTimeout);
      }
    };

    const checkSession = async () => {
      try {
        console.log('[AUTH] Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('[AUTH] Error getting session:', error.message);
          stopLoading();
          return;
        }

        console.log('[AUTH] Session check result:', session ? 'Session found' : 'No session');

        if (session?.user) {
          const authUser: AppUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
            email: session.user.email || '',
            company: session.user.user_metadata?.company || null,
            role: session.user.user_metadata?.role || 'user',
            referral_code: session.user.user_metadata?.referral_code || null
          };
          setUser(authUser);
          console.log('[AUTH] User set from auth metadata (checkSession):', authUser.email);
          setLoading(false);
        } else {
          stopLoading();
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('[AUTH] Session request aborted (timeout or cancelled)');
          stopLoading();
          return;
        }
        console.error('[AUTH] Exception getting session:', err instanceof Error ? err.message : err);
        stopLoading();
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] Auth state changed:', event, 'Has user:', !!session?.user);
      if (!isMounted) return;

      setSessionChecked(true);

      if (session?.user) {
        const authUser: AppUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
          email: session.user.email || '',
          company: session.user.user_metadata?.company || null,
          role: session.user.user_metadata?.role || 'user',
          referral_code: session.user.user_metadata?.referral_code || null
        };
        setUser(authUser);
        console.log('[AUTH] User set from auth metadata:', authUser.email);
        setLoading(false);

        getUserProfile(session.user.id).then(({ data }) => {
          if (data && isMounted) {
            console.log('[AUTH] Background profile update:', data.email);
            setUser({
              id: data.id,
              name: data.name || '',
              email: data.email || '',
              company: data.company,
              role: data.role as 'team' | 'user' | 'owner',
              referral_code: data.referral_code
            });
          }
        }).catch(() => {
        });
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
      console.log('[AUTH] Loading profile for user:', userId);
      const { data, error } = await getUserProfile(userId);

      if (error) {
        console.error('[AUTH] Error loading profile from DB:', error.message);
        if (error.message?.includes('PGRST') || error.message?.includes('JWT') || error.code === 'PGRST116') {
          console.log('[AUTH] RLS/JWT error - waiting for auth to settle');
          setLoading(false);
          return;
        }
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          company: data.company,
          role: data.role as 'team' | 'user' | 'owner',
          referral_code: data.referral_code
        });
        console.log('[AUTH] Profile loaded successfully:', data.email);
        setLoading(false);
      } else {
        console.log('[AUTH] No profile data - using minimal user info');
        setLoading(false);
      }
    } catch (e) {
      console.error('[AUTH] Exception loading user profile:', e instanceof Error ? e.message : e);
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    const t = getT();
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

      return { success: false, error: t('auth.login_failed') };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : t('auth.login_failed') };
    }
  };

  const socialLogin = async (provider: 'google' | 'github') => {
    const t = getT();
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
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : t('auth.social_login_failed') };
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
    const t = getT();
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
          error: t('auth.please_confirm_email'),
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

      return { success: false, error: t('auth.register_failed'), requiresConfirmation: false };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : t('auth.unknown_error'), requiresConfirmation: false };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, socialLogin, loginWithToken, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
