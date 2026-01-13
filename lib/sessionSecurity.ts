// ============================================
// SESSION SECURITY - INACTIVITY TRACKING
// OWASP A07:2021 - Identification and Authentication Failures
// ============================================

import { supabase } from './supabase';

/**
 * Session Security Configuration
 */
const SESSION_CONFIG = {
  // Auto-logout after 30 minutes of inactivity (OWASP recommendation)
  INACTIVITY_TIMEOUT_MS: 30 * 60 * 1000,

  // Warning before logout (5 minutes before)
  WARNING_TIMEOUT_MS: 25 * 60 * 1000,

  // Check interval (every 30 seconds)
  CHECK_INTERVAL_MS: 30 * 1000,

  // Storage key for last activity timestamp
  STORAGE_KEY: 'auth_last_activity'
};

/**
 * Inactivity Tracker Class
 * Monitors user activity and auto-logs out after timeout
 */
class InactivityTracker {
  private timeoutId: NodeJS.Timeout | null = null;
  private warningShown = false;
  private checkIntervalId: NodeJS.Timeout | null = null;
  private lastActivity: number = Date.now();
  private onLogoutCallback?: () => void;

  /**
   * Start tracking user activity
   */
  start(onLogout: () => void) {
    this.onLogoutCallback = onLogout;
    this.lastActivity = this.getLastActivityFromStorage();

    // Set up activity event listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, this.updateActivity, { passive: true });
    });

    // Start periodic check
    this.checkIntervalId = setInterval(() => {
      this.checkInactivity();
    }, SESSION_CONFIG.CHECK_INTERVAL_MS);

    console.log('[SESSION SECURITY] Inactivity tracking started');
  }

  /**
   * Stop tracking user activity
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }

    // Remove event listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.removeEventListener(event, this.updateActivity);
    });

    console.log('[SESSION SECURITY] Inactivity tracking stopped');
  }

  /**
   * Update last activity timestamp
   */
  private updateActivity = () => {
    this.lastActivity = Date.now();
    this.saveActivityToStorage(this.lastActivity);
    this.warningShown = false;

    // Reset timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set new timeout
    this.timeoutId = setTimeout(() => {
      this.performLogout();
    }, SESSION_CONFIG.INACTIVITY_TIMEOUT_MS);
  }

  /**
   * Check for inactivity and show warning if needed
   */
  private checkInactivity() {
    const timeSinceActivity = Date.now() - this.lastActivity;

    // Show warning before timeout
    if (timeSinceActivity >= SESSION_CONFIG.WARNING_TIMEOUT_MS &&
        timeSinceActivity < SESSION_CONFIG.INACTIVITY_TIMEOUT_MS &&
        !this.warningShown) {
      this.warningShown = true;
      this.showWarning();
    }

    // Auto-logout if timeout exceeded
    if (timeSinceActivity >= SESSION_CONFIG.INACTIVITY_TIMEOUT_MS) {
      this.performLogout();
    }
  }

  /**
   * Show inactivity warning to user
   */
  private showWarning() {
    const minutesLeft = Math.ceil(
      (SESSION_CONFIG.INACTIVITY_TIMEOUT_MS - (Date.now() - this.lastActivity)) / 60000
    );

    // Dispatch custom event for components to listen to
    const event = new CustomEvent('sessionWarning', {
      detail: { minutesLeft }
    });
    window.dispatchEvent(event);

    console.warn(`[SESSION SECURITY] User inactive. Logging out in ${minutesLeft} minutes...`);
  }

  /**
   * Perform logout
   */
  private async performLogout() {
    console.error('[SESSION SECURITY] Inactivity timeout - logging out user');

    // Stop tracking
    this.stop();

    // Clear activity from storage
    sessionStorage.removeItem(SESSION_CONFIG.STORAGE_KEY);

    // Logout from Supabase
    await supabase.auth.signOut();

    // Call logout callback
    if (this.onLogoutCallback) {
      this.onLogoutCallback();
    }
  }

  /**
   * Save activity timestamp to sessionStorage
   */
  private saveActivityToStorage(timestamp: number) {
    try {
      sessionStorage.setItem(SESSION_CONFIG.STORAGE_KEY, timestamp.toString());
    } catch (error) {
      console.error('[SESSION SECURITY] Failed to save activity:', error);
    }
  }

  /**
   * Get last activity from sessionStorage
   */
  private getLastActivityFromStorage(): number {
    try {
      const stored = sessionStorage.getItem(SESSION_CONFIG.STORAGE_KEY);
      if (stored) {
        const timestamp = parseInt(stored, 10);
        // Validate timestamp is reasonable (not in the future, not too old)
        const now = Date.now();
        if (timestamp > 0 && timestamp <= now && (now - timestamp) < SESSION_CONFIG.INACTIVITY_TIMEOUT_MS * 2) {
          return timestamp;
        }
      }
    } catch (error) {
      console.error('[SESSION SECURITY] Failed to read activity:', error);
    }
    return Date.now();
  }

  /**
   * Reset tracker (call after login)
   */
  reset() {
    this.updateActivity();
    this.warningShown = false;
    console.log('[SESSION SECURITY] Inactivity tracker reset');
  }
}

// Singleton instance
let trackerInstance: InactivityTracker | null = null;

/**
 * Initialize session security
 * Call this after successful login
 */
export const initSessionSecurity = (onLogout: () => void) => {
  if (!trackerInstance) {
    trackerInstance = new InactivityTracker();
  }
  trackerInstance.start(onLogout);
};

/**
 * Stop session security
 * Call this after logout
 */
export const stopSessionSecurity = () => {
  if (trackerInstance) {
    trackerInstance.stop();
  }
};

/**
 * Reset session security timer
 * Call this when user performs manual activity
 */
export const resetSessionSecurity = () => {
  if (trackerInstance) {
    trackerInstance.reset();
  }
};

/**
 * Hook for components to listen to session warnings
 * FIXED: Returns proper cleanup function to remove event listener
 */
export const useSessionWarning = (callback: (minutesLeft: number) => void) => {
  const handleWarning = (event: Event) => {
    const customEvent = event as CustomEvent<{ minutesLeft: number }>;
    callback(customEvent.detail.minutesLeft);
  };

  // Add event listener on mount
  window.addEventListener('sessionWarning', handleWarning);

  // Return cleanup function
  return () => {
    window.removeEventListener('sessionWarning', handleWarning);
  };
};
