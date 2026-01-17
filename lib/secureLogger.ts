// ============================================
// SECURE LOGGING - OWASP COMPLIANT
// Prevents information disclosure via console logs
// ============================================

/**
 * Secure logging utility that only logs in development
 * In production, logs are sent to remote logging service (optional)
 *
 * OWASP A04:2021 - Insecure Design (Information Disclosure)
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
    data?: unknown;
}

class SecureLogger {
    private isDev: boolean;
    private remoteLoggingUrl: string | null = null;

    constructor() {
        this.isDev = import.meta.env.DEV;
        // Optional: Set up remote logging URL for production
        this.remoteLoggingUrl = import.meta.env.VITE_REMOTE_LOGGING_URL || null;
    }

    /**
     * Core logging method - only logs to console in development
     * In production, sends to remote logging service (if configured)
     */
    private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            data: this.isDev ? data : undefined // Only include data in dev
        };

        // Development: Log to console with context
        if (this.isDev) {
            const prefix = context ? `[${context}]` : '';
            const messageWithPrefix = prefix ? `${prefix} ${message}` : message;

            switch (level) {
                case 'error':
                    console.error(messageWithPrefix, data || '');
                    break;
                case 'warn':
                    console.warn(messageWithPrefix, data || '');
                    break;
                case 'info':
                    console.info(messageWithPrefix, data || '');
                    break;
                case 'debug':
                    console.debug(messageWithPrefix, data || '');
                    break;
                default:
                    console.log(messageWithPrefix, data || '');
            }
        } else {
            // Production: Send to remote logging service (if configured)
            // Filter out sensitive information before sending
            if (this.remoteLoggingUrl) {
                this.sendToRemoteLogging(entry).catch(err => {
                    // Silently fail to prevent infinite loops
                    console.error('Failed to send logs to remote service:', err);
                });
            }
        }
    }

    /**
     * Send log to remote logging service
     * Implement this based on your logging service (e.g., Sentry, LogRocket, CloudWatch)
     */
    private async sendToRemoteLogging(entry: LogEntry): Promise<void> {
        if (!this.remoteLoggingUrl) return;

        try {
            // Remove sensitive data before sending
            const sanitizedEntry = this.sanitizeLogEntry(entry);

            await fetch(this.remoteLoggingUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedEntry),
            });
        } catch (error) {
            // Silently fail to prevent application crashes
            console.error('Remote logging failed:', error);
        }
    }

    /**
     * Sanitize log entry to remove sensitive information
     */
    private sanitizeLogEntry(entry: LogEntry): LogEntry {
        // Remove data field in production
        const { data, ...safeEntry } = entry;
        return safeEntry;
    }

    // Public API methods

    /** Log general information */
    publicLog(message: string, context?: string, data?: unknown): void {
        this.log('log', message, context, data);
    }

    /** Log warning */
    warn(message: string, context?: string, data?: unknown): void {
        this.log('warn', message, context, data);
    }

    /** Log error */
    error(message: string, context?: string, data?: unknown): void {
        this.log('error', message, context, data);
    }

    /** Log info */
    info(message: string, context?: string, data?: unknown): void {
        this.log('info', message, context, data);
    }

    /** Log debug (development only) */
    debug(message: string, context?: string, data?: unknown): void {
        if (this.isDev) {
            this.log('debug', message, context, data);
        }
    }

    /**
     * Security-specific logging for authentication attempts
     * These are always logged (with sanitization) for security monitoring
     */
    securityLog(message: string, data?: Record<string, unknown>): void {
        const entry: LogEntry = {
            level: 'warn',
            message: `[SECURITY] ${message}`,
            timestamp: new Date().toISOString(),
            context: 'security',
            // In production, only log non-sensitive data
            data: this.isDev ? data : this.sanitizeSecurityData(data)
        };

        if (this.isDev) {
            console.warn(entry.message, entry.data);
        } else if (this.remoteLoggingUrl) {
            this.sendToRemoteLogging(entry).catch(() => {});
        }
    }

    /**
     * Sanitize security log data to remove sensitive information
     */
    private sanitizeSecurityData(data?: Record<string, unknown>): Record<string, unknown> | undefined {
        if (!data) return undefined;

        const safeData: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
            // Redact sensitive fields
            if (['password', 'token', 'secret', 'apiKey', 'session'].some(k =>
                key.toLowerCase().includes(k)
            )) {
                safeData[key] = '[REDACTED]';
            } else {
                safeData[key] = value;
            }
        }

        return safeData;
    }
}

// Singleton instance
const logger = new SecureLogger();

// Export convenience methods
export const secureLog = (message: string, context?: string, data?: unknown) => logger.publicLog(message, context, data);
export const secureWarn = (message: string, context?: string, data?: unknown) => logger.warn(message, context, data);
export const secureError = (message: string, context?: string, data?: unknown) => logger.error(message, context, data);
export const secureInfo = (message: string, context?: string, data?: unknown) => logger.info(message, context, data);
export const secureDebug = (message: string, context?: string, data?: unknown) => logger.debug(message, context, data);
export const securityLog = (message: string, data?: Record<string, unknown>) => logger.securityLog(message, data);

// Export default logger instance
export default logger;
