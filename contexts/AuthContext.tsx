import { createContext, useState, useEffect, useRef, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase, getUserProfile, UserProfile } from '../lib/supabase';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: 'team' | 'user' | 'owner';
  referral_code: string | null;
}

const mapSessionToAppUser = (session: Session): AppUser => ({
  id: session.user.id,
  name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
  email: session.user.email || '',
  company: session.user.user_metadata?.company || null,
  role: session.user.user_metadata?.role || 'user',
  referral_code: session.user.user_metadata?.referral_code || null
});

const mapProfileToAppUser = (profile: UserProfile): AppUser => ({
  id: profile.id,
  name: profile.name || '',
  email: profile.email || '',
  company: profile.company,
  role: profile.role as 'team' | 'user' | 'owner',
  referral_code: profile.referral_code
});

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error: string | null }>;
  socialLogin: (provider: 'google' | 'github') => Promise<{ success: boolean; error: string | null }>;
  loginWithToken: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, company: string, email: string, pass: string, referralCode?: string) => Promise<{ success: boolean; error: string | null, requiresConfirmation: boolean }>;
  resendConfirmationEmail: (email: string) => Promise<{ success: boolean; error: string | null }>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
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
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  const loadingRef = useRef(true);
  const profileLoadPromiseRef = useRef<Map<string, Promise<UserProfile | null>>>(new Map());

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    let isMounted = true;
    let safetyTimeout: ReturnType<typeof setTimeout> | null = null;
    let abortController = new AbortController();

    safetyTimeout = setTimeout(() => {
      if (isMounted && loadingRef.current) {
        console.error('[AUTH] Safety timeout triggered - check Supabase configuration');
        setLoading(false);
        setSessionChecked(true);
      }
    }, 30000);

    const stopLoading = () => {
      if (isMounted) {
        setLoading(false);
        setSessionChecked(true);
        if (safetyTimeout) clearTimeout(safetyTimeout);
      }
    };

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted || abortController.signal.aborted) return;

        if (error) {
          console.error('[AUTH] Error getting session:', error.message);
          stopLoading();
          return;
        }

        if (session?.user) {
          setUser(mapSessionToAppUser(session));
          setLoading(false);
        } else {
          stopLoading();
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          stopLoading();
          return;
        }
        console.error('[AUTH] Exception getting session:', err instanceof Error ? err.message : err);
        stopLoading();
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted || abortController.signal.aborted) return;

      setSessionChecked(true);

      if (session?.user) {
        setUser(mapSessionToAppUser(session));
        setLoading(false);

        getUserProfile(session.user.id).then(({ data }) => {
          if (data && isMounted && !abortController.signal.aborted) {
            setUser(mapProfileToAppUser(data));
          }
        }).catch((err) => {
          console.error('[AUTH] Error loading user profile from auth state change:', err instanceof Error ? err.message : err);
        });
      } else {
        setUser(null);
        stopLoading();
      }
    });

    return () => {
      isMounted = false;
      abortController.abort();
      if (safetyTimeout) clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = useCallback(async (userId: string) => {
    let isMounted = true;
    const abortController = new AbortController();

    try {
      // Request deduplication: Check if there's already a pending request for this user
      const existingPromise = profileLoadPromiseRef.current.get(userId);
      if (existingPromise) {
        const data = await existingPromise;
        if (data && isMounted && !abortController.signal.aborted) {
          setUser(mapProfileToAppUser(data));
          setLoading(false);
        }
        return;
      }

      // Create new request and store it
      const profilePromise = getUserProfile(userId).then(({ data }) => data);
      profileLoadPromiseRef.current.set(userId, profilePromise);

      const { data, error } = await getUserProfile(userId);

      // Check if component is still mounted before updating state
      if (!isMounted || abortController.signal.aborted) return;

      // Clean up the promise cache
      profileLoadPromiseRef.current.delete(userId);

      if (error) {
        console.error('[AUTH] Error loading profile from DB:', error.message);
        if (error.message?.includes('PGRST') || error.message?.includes('JWT') || error.code === 'PGRST116') {
          setLoading(false);
          return;
        }
      }

      if (data && !abortController.signal.aborted) {
        setUser(mapProfileToAppUser(data));
        setLoading(false);
      } else if (!abortController.signal.aborted) {
        setLoading(false);
      }
    } catch (e) {
      if (!abortController.signal.aborted) {
        console.error('[AUTH] Exception loading user profile:', e instanceof Error ? e.message : e);
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
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
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  }, [loadUserProfile]);

  const socialLogin = useCallback(async (provider: 'google' | 'github') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login',
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Social login failed' };
    }
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
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
  }, [loadUserProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const register = useCallback(async (name: string, company: string, email: string, pass: string, referralCode?: string) => {
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
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login',
        },
      });

      if (error) {
        return { success: false, error: error.message, requiresConfirmation: false };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: false,
          error: 'Please confirm your email',
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

      return { success: false, error: 'Registration failed', requiresConfirmation: false };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error', requiresConfirmation: false };
    }
  }, [loadUserProfile]);

  const resendConfirmationEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to resend confirmation email' };
    }
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    socialLogin,
    loginWithToken,
    logout,
    register,
    resendConfirmationEmail,
  }), [user, loading, login, socialLogin, loginWithToken, logout, register, resendConfirmationEmail]);

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
