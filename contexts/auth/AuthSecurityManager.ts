/**
 * Authentication Security Manager
 * Single Responsibility: Handle security logging and timeout enforcement
 */

import { securityLog } from '../../lib/secureLogger';
import type { IAuthSecurityManager } from './AuthTypes';

export class AuthSecurityManager implements IAuthSecurityManager {
  private clerkLoadingTimeout: number;
  private globalLoadingTimeout: number;
  private timeoutCallbacks: Set<() => void> = new Set();

  constructor(
    clerkLoadingTimeout: number = 500,
    globalLoadingTimeout: number = 1000
  ) {
    this.clerkLoadingTimeout = clerkLoadingTimeout;
    this.globalLoadingTimeout = globalLoadingTimeout;
  }

  /**
   * Log security-related events
   */
  logSecurityEvent(event: string, data?: Record<string, unknown>): void {
    securityLog(event, data);
  }

  /**
   * Enforce loading timeout to prevent stuck loading states
   * Returns cleanup function
   */
  enforceTimeout(
    isLoaded: boolean,
    onTimeout: () => void,
    useGlobalTimeout: boolean = false
  ): () => void {
    const timeoutMs = useGlobalTimeout
      ? this.globalLoadingTimeout
      : this.clerkLoadingTimeout;

    // Only set timeout if not already loaded
    if (!isLoaded) {
      const timer = setTimeout(() => {
        this.logSecurityEvent('Auth loading timeout', {
          timeout: timeoutMs,
          type: useGlobalTimeout ? 'global' : 'clerk'
        });
        onTimeout();
      }, timeoutMs);

      return () => clearTimeout(timer);
    }

    return () => {}; // No-op if already loaded
  }

  /**
   * Register callback for timeout events
   */
  onTimeout(callback: () => void): () => void {
    this.timeoutCallbacks.add(callback);
    return () => this.timeoutCallbacks.delete(callback);
  }

  /**
   * Trigger all registered timeout callbacks
   */
  private triggerTimeoutCallbacks(): void {
    this.timeoutCallbacks.forEach(callback => callback());
  }
}
