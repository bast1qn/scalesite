/**
 * ProtectedRoute Component - Security Critical
 *
 * Wraps protected pages and ensures user authentication + authorization
 * Prevents unauthorized access to dashboard, admin panels, and sensitive data
 *
 * OWASP: A01:2021 - Broken Access Control (FIXED)
 */

import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../contexts/RouterContext';
import { BorderSpinner } from '../components';
import { securityLog } from '../lib/secureLogger';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireTeam?: boolean;
  requireRole?: 'user' | 'team' | 'owner';
}

export const ProtectedRoute = ({
  children,
  fallback = null,
  requireTeam = false,
  requireRole
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // SECURITY: Check authorization once auth loading completes
    if (!loading) {
      if (!user) {
        securityLog('Unauthorized access attempt - no user found', { path: window.location.pathname });
        setIsAuthorized(false);
        setIsChecking(false);

        // Redirect to login after short delay
        const redirectTimer = setTimeout(() => {
          navigate('login');
        }, 100);

        return () => clearTimeout(redirectTimer);
      }

      // Role-based access control
      if (requireRole && user.role !== requireRole) {
        securityLog('Access denied - insufficient role', {
          requiredRole: requireRole,
          userRole: user.role,
          userId: user.id
        });
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Team member check
      if (requireTeam && user.role !== 'team' && user.role !== 'owner') {
        securityLog('Access denied - team access required', {
          userRole: user.role,
          userId: user.id
        });
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // All checks passed
      setIsAuthorized(true);
      setIsChecking(false);
    }
  }, [user, loading, requireTeam, requireRole, navigate]);

  // Loading state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <BorderSpinner size="md" color="blue" className="mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Verifying access...
        </p>
      </div>
    );
  }

  // Not authorized - show fallback or access denied
  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default access denied screen
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You don't have permission to access this page. Please log in with an authorized account.
          </p>
          <button
            onClick={() => navigate('login')}
            className="w-full bg-gradient-to-r from-primary-600 to-violet-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
};

/**
 * Higher-order component for wrapping pages
 * Usage: withAuth(MyPage, { requireTeam: true })
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  return (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
