/**
 * Singleton Pattern Implementation
 *
 * Purpose: Ensure a class has only one instance and provide a global point of access to it.
 * Use Cases: Configuration managers, service locators, connection pools
 *
 * SOLID Compliance:
 * - Single Responsibility: Manages instance creation and access
 * - Open/Closed: Extensible through inheritance without modifying
 */

export class Singleton<T> {
  private static instances = new Map<string, Singleton<any>>();

  protected constructor() {
    // Protected constructor to prevent direct instantiation
  }

  /**
   * Get or create the singleton instance
   * @param key - Unique identifier for the singleton instance
   * @param factory - Factory function to create the instance
   */
  protected static getInstance<T>(key: string, factory: () => T): T {
    if (!this.instances.has(key)) {
      const instance = factory();
      this.instances.set(key, { instance });
    }
    return this.instances.get(key)!.instance as T;
  }

  /**
   * Reset the singleton instance (useful for testing)
   * @param key - Unique identifier for the singleton instance
   */
  protected static resetInstance(key: string): void {
    this.instances.delete(key);
  }

  /**
   * Check if a singleton instance exists
   * @param key - Unique identifier for the singleton instance
   */
  protected static hasInstance(key: string): boolean {
    return this.instances.has(key);
  }
}

/**
 * Example Usage: Configuration Manager Singleton
 */
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    analytics: boolean;
    chat: boolean;
    newsletter: boolean;
  };
  limits: {
    maxUploadSize: number;
    maxFileSize: number;
  };
}

class ConfigurationManagerInstance extends Singleton<ConfigurationManagerInstance> {
  private config: AppConfig;

  private constructor() {
    super();
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigurationManagerInstance {
    return super.getInstance('config', () => new ConfigurationManagerInstance());
  }

  private loadConfig(): AppConfig {
    // Load configuration from environment variables
    return {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
      environment: (import.meta.env.VITE_ENVIRONMENT as AppConfig['environment']) || 'development',
      features: {
        analytics: import.meta.env.VITE_FEATURE_ANALYTICS !== 'false',
        chat: import.meta.env.VITE_FEATURE_CHAT !== 'false',
        newsletter: import.meta.env.VITE_FEATURE_NEWSLETTER !== 'false',
      },
      limits: {
        maxUploadSize: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE || '10485760'), // 10MB
        maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB
      },
    };
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }
}

/**
 * Export the singleton instance accessor
 */
export const Config = ConfigurationManagerInstance.getInstance();

/**
 * Type-safe configuration accessor
 */
export function useConfig(): AppConfig {
  return Config.getConfig();
}

/**
 * Feature flag checker
 */
export function useFeatureFlag(feature: keyof AppConfig['features']): boolean {
  return Config.isFeatureEnabled(feature);
}
