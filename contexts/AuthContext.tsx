
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

// Define the custom User type
export interface AppUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'team' | 'user' | 'owner';
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

  // Central function to verify session
  const checkSession = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const { data } = await api.get('/auth/me');
            if (data && data.user) {
                setUser(data.user);
            } else {
                localStorage.removeItem('auth_token');
                setUser(null);
            }
        } catch (e) {
            console.error("Session check failed", e);
            localStorage.removeItem('auth_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
        const { data } = await api.post('/auth/login', { email, password: pass });
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            setUser(data.user);
            return { success: true, error: null };
        }
        return { success: false, error: 'Kein Token erhalten' };
    } catch (err: any) {
        return { success: false, error: err.message || 'Login fehlgeschlagen' };
    }
  };

  // Used when redirecting back from OAuth provider
  const loginWithToken = async (token: string) => {
      localStorage.setItem('auth_token', token);
      setLoading(true);
      try {
          const { data } = await api.get('/auth/me');
          if (data && data.user) {
              setUser(data.user);
              return true;
          }
          return false;
      } catch (e) {
          localStorage.removeItem('auth_token');
          return false;
      } finally {
          setLoading(false);
      }
  };

  const socialLogin = async (provider: 'google' | 'github') => {
    try {
      // 1. Request Redirect URL from Backend to keep secrets safe
      const { data } = await api.get(`/auth/${provider}/url`);
      if (data && data.url) {
          // 2. Redirect Browser
          window.location.href = data.url;
          return { success: true, error: null }; 
      }
      return { success: false, error: 'Konnte Redirect-URL nicht laden.' };

    } catch (err: any) {
      return { success: false, error: err.message || 'Social Login fehlgeschlagen' };
    }
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const register = async (name: string, company: string, email: string, pass: string) => {
    try {
      const { data } = await api.post('/auth/register', { name, company, email, password: pass });
      if (data.token) {
          localStorage.setItem('auth_token', data.token);
          setUser(data.user);
          return { success: true, error: null, requiresConfirmation: false };
      }
       return { success: false, error: "Registrierung fehlgeschlagen", requiresConfirmation: false };
    } catch (err: any) {
      return { success: false, error: err.message || "Ein unbekannter Fehler ist aufgetreten.", requiresConfirmation: false };
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, socialLogin, loginWithToken, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
