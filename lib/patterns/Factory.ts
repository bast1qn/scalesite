/**
 * Factory Pattern Implementation
 *
 * Purpose: Create objects without specifying the exact class of object that will be created
 * Use Cases: Component creation, service instantiation, OAuth providers
 *
 * SOLID Compliance:
 * - Single Responsibility: Each factory creates one type of object
 * - Open/Closed: New types can be added without modifying existing factories
 * - Dependency Inversion: Depends on abstractions (interfaces), not concrete implementations
 */

// ==================== OAuth Provider Factory ====================

/**
 * OAuth Provider Configuration Interface
 */
export interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope?: string[];
}

/**
 * OAuth Provider Interface (Abstract Product)
 */
export interface IOAuthProvider {
  name: string;
  authenticate(): Promise<OAuthUserData>;
  refreshToken(token: string): Promise<string>;
  revokeToken(token: string): Promise<void>;
}

/**
 * OAuth User Data Interface
 */
export interface OAuthUserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

/**
 * GitHub OAuth Provider (Concrete Product)
 */
export class GitHubAuthProvider implements IOAuthProvider {
  name = 'github';

  constructor(private config: OAuthProviderConfig) {}

  async authenticate(): Promise<OAuthUserData> {
    // Implementation would call GitHub's OAuth API
    // This is a simplified example
    return {
      id: 'github_user_id',
      email: 'user@example.com',
      name: 'GitHub User',
      provider: this.name,
    };
  }

  async refreshToken(token: string): Promise<string> {
    // Implementation for token refresh
    return token;
  }

  async revokeToken(token: string): Promise<void> {
    // Implementation for token revocation
  }
}

/**
 * Google OAuth Provider (Concrete Product)
 */
export class GoogleAuthProvider implements IOAuthProvider {
  name = 'google';

  constructor(private config: OAuthProviderConfig) {}

  async authenticate(): Promise<OAuthUserData> {
    // Implementation would call Google's OAuth API
    return {
      id: 'google_user_id',
      email: 'user@example.com',
      name: 'Google User',
      avatar: 'https://example.com/avatar.jpg',
      provider: this.name,
    };
  }

  async refreshToken(token: string): Promise<string> {
    return token;
  }

  async revokeToken(token: string): Promise<void> {
    // Implementation
  }
}

/**
 * LinkedIn OAuth Provider (Concrete Product)
 * Example of extending with new provider without modifying existing code
 */
export class LinkedInAuthProvider implements IOAuthProvider {
  name = 'linkedin';

  constructor(private config: OAuthProviderConfig) {}

  async authenticate(): Promise<OAuthUserData> {
    return {
      id: 'linkedin_user_id',
      email: 'user@example.com',
      name: 'LinkedIn User',
      avatar: 'https://example.com/avatar.jpg',
      provider: this.name,
    };
  }

  async refreshToken(token: string): Promise<string> {
    return token;
  }

  async revokeToken(token: string): Promise<void> {
    // Implementation
  }
}

/**
 * OAuth Provider Factory (Concrete Factory)
 *
 * This factory creates OAuth provider instances based on the provider type.
 * New providers can be added without modifying the factory logic.
 */
export class OAuthProviderFactory {
  private static providers = new Map<string, new (config: OAuthProviderConfig) => IOAuthProvider>();

  static {
    // Register built-in providers
    this.providers.set('github', GitHubAuthProvider);
    this.providers.set('google', GoogleAuthProvider);
    this.providers.set('linkedin', LinkedInAuthProvider);
  }

  /**
   * Create an OAuth provider instance
   * @param provider - Provider name (e.g., 'github', 'google')
   * @param config - Provider configuration
   */
  static createProvider(provider: string, config: OAuthProviderConfig): IOAuthProvider {
    const ProviderClass = this.providers.get(provider.toLowerCase());

    if (!ProviderClass) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    return new ProviderClass(config);
  }

  /**
   * Register a custom OAuth provider
   * @param name - Provider name
   * @param ProviderClass - Provider class constructor
   */
  static registerProvider(
    name: string,
    ProviderClass: new (config: OAuthProviderConfig) => IOAuthProvider
  ): void {
    this.providers.set(name.toLowerCase(), ProviderClass);
  }

  /**
   * Get list of supported providers
   */
  static getSupportedProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// ==================== Component Factory ====================

/**
 * Component Configuration Interface
 */
export interface ComponentConfig {
  type: string;
  props?: Record<string, any>;
  children?: ComponentConfig[];
}

/**
 * Component Factory for dynamic component creation
 */
export class ComponentFactory {
  private static componentRegistry = new Map<string, React.ComponentType<any>>();

  /**
   * Register a component
   * @param type - Component type identifier
   * @param component - React component
   */
  static registerComponent(type: string, component: React.ComponentType<any>): void {
    this.componentRegistry.set(type, component);
  }

  /**
   * Create a component instance
   * @param config - Component configuration
   */
  static createComponent(config: ComponentConfig): React.ReactElement | null {
    const Component = this.componentRegistry.get(config.type);

    if (!Component) {
      console.warn(`Component type "${config.type}" not registered in factory`);
      return null;
    }

    const children = config.children?.map(child => this.createComponent(child)).filter(Boolean);

    return React.createElement(Component, {
      ...config.props,
      children: children && children.length > 0 ? children : undefined,
    });
  }

  /**
   * Create multiple components
   * @param configs - Array of component configurations
   */
  static createComponents(configs: ComponentConfig[]): React.ReactElement[] {
    return configs
      .map(config => this.createComponent(config))
      .filter((element): element is React.ReactElement => element !== null);
  }
}

// ==================== Service Factory ====================

/**
 * Service Interface (Abstract Product)
 */
export interface IService {
  name: string;
  initialize(): Promise<void>;
  destroy(): void;
}

/**
 * Service Factory for managing application services
 */
export class ServiceFactory {
  private static services = new Map<string, IService>();
  private static serviceRegistry = new Map<string, new () => IService>();

  /**
   * Register a service class
   */
  static registerService(name: string, ServiceClass: new () => IService): void {
    this.serviceRegistry.set(name, ServiceClass);
  }

  /**
   * Get or create a service instance (Singleton pattern for services)
   */
  static async getService<T extends IService>(name: string): Promise<T> {
    if (!this.services.has(name)) {
      const ServiceClass = this.serviceRegistry.get(name);
      if (!ServiceClass) {
        throw new Error(`Service "${name}" not registered`);
      }
      const service = new ServiceClass();
      await service.initialize();
      this.services.set(name, service);
    }
    return this.services.get(name) as T;
  }

  /**
   * Destroy a service instance
   */
  static destroyService(name: string): void {
    const service = this.services.get(name);
    if (service) {
      service.destroy();
      this.services.delete(name);
    }
  }

  /**
   * Destroy all services
   */
  static destroyAll(): void {
    this.services.forEach(service => service.destroy());
    this.services.clear();
  }
}

// ==================== Usage Examples ====================

/**
 * Example: Using the OAuth Provider Factory
 */
export async function authenticateWithOAuth(provider: string, config: OAuthProviderConfig) {
  const oauthProvider = OAuthProviderFactory.createProvider(provider, config);
  const userData = await oauthProvider.authenticate();
  return userData;
}

/**
 * Example: Registering a custom OAuth provider
 */
export function registerCustomOAuthProvider() {
  // Define a custom provider
  class CustomAuthProvider implements IOAuthProvider {
    name = 'custom';

    constructor(private config: OAuthProviderConfig) {}

    async authenticate(): Promise<OAuthUserData> {
      // Custom authentication logic
      return {
        id: 'custom_id',
        email: 'user@custom.com',
        name: 'Custom User',
        provider: this.name,
      };
    }

    async refreshToken(token: string): Promise<string> {
      return token;
    }

    async revokeToken(token: string): Promise<void> {
      // Custom revocation logic
    }
  }

  // Register the custom provider
  OAuthProviderFactory.registerProvider('custom', CustomAuthProvider);
}
