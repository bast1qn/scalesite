/**
 * Service Layer Barrel Export
 *
 * This module exports all service interfaces and implementations.
 * Services are abstracted to follow the Dependency Inversion Principle.
 *
 * Architecture:
 * - High-level modules depend on these interfaces (abstractions)
 * - Low-level modules (implementations) depend on these interfaces
 * - Concrete implementations can be swapped without affecting business logic
 */

// Service Interfaces
export * from './interfaces/IAuthService';
export * from './interfaces/IDataService';
export * from './interfaces/INotificationService';
export * from './interfaces/IAnalyticsService';

// Service Implementations
export { GoogleAnalyticsService } from './implementations/GoogleAnalyticsService';
export { ClerkAuthService } from './implementations/ClerkAuthService';
export {
  InMemoryNotificationService,
} from './implementations/InMemoryNotificationService';

/**
 * Service Layer Documentation
 *
 * DEPENDENCY INVERSION PRINCIPLE (DIP):
 * - High-level modules should not depend on low-level modules
 * - Both should depend on abstractions (interfaces)
 * - Abstractions should not depend on details
 * - Details should depend on abstractions
 *
 * BENEFITS:
 * 1. Loose coupling: Components are not tightly coupled to implementations
 * 2. Easy testing: Mock implementations can be injected for testing
 * 3. Flexibility: Implementations can be swapped without changing business logic
 * 4. Maintainability: Changes in implementation don't affect dependent code
 *
 * USAGE EXAMPLE:
 *
 * // Instead of directly depending on a concrete implementation:
 * import { AuthService } from './services/AuthService'; // BAD
 *
 * // Depend on the abstraction instead:
 * import { IAuthService } from './services'; // GOOD
 *
 * class UserController {
 *   constructor(private authService: IAuthService) {}
 *
 *   async login(email: string, password: string) {
 *     return this.authService.login({ email, password });
 *   }
 * }
 *
 * // Inject the concrete implementation at runtime:
 * const authService: IAuthService = new AuthServiceImpl();
 * const controller = new UserController(authService);
 */

/**
 * Service Factory
 * Factory for creating service instances with singleton lifecycle
 * Useful for dependency injection
 */
export class ServiceFactory {
  private static services = new Map<string, any>();
  private static serviceRegistry = new Map<string, new () => any>();

  /**
   * Register a service class
   */
  static registerService(name: string, ServiceClass: new () => any): void {
    this.serviceRegistry.set(name, ServiceClass);
  }

  /**
   * Register a service instance directly
   */
  static registerInstance<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  /**
   * Get or create a service instance (Singleton pattern for services)
   */
  static async getService<T>(name: string): Promise<T> {
    if (!this.services.has(name)) {
      const ServiceClass = this.serviceRegistry.get(name);
      if (!ServiceClass) {
        throw new Error(`Service "${name}" not registered`);
      }
      const service = new ServiceClass();

      // Initialize if service has initialize method
      if (typeof service.initialize === 'function') {
        await service.initialize();
      }

      this.services.set(name, service);
    }
    return this.services.get(name) as T;
  }

  /**
   * Get a service instance synchronously (must already be registered)
   */
  static getServiceSync<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service "${name}" not initialized. Call getService first.`);
    }
    return service as T;
  }

  /**
   * Clear all registered services
   */
  static clearServices(): void {
    this.services.clear();
    this.serviceRegistry.clear();
  }
}

/**
 * Service Locator Pattern
 * Provides global access to services while maintaining loose coupling
 */
export class ServiceLocator {
  private static container = new Map<string, any>();

  static register<T>(key: string | symbol, instance: T): void {
    this.container.set(key.toString(), instance);
  }

  static resolve<T>(key: string | symbol): T | null {
    return this.container.get(key.toString()) || null;
  }

  static has(key: string | symbol): boolean {
    return this.container.has(key.toString());
  }

  static clear(): void {
    this.container.clear();
  }
}

/**
 * Dependency Injection Container
 * Simple DI container for managing service dependencies
 */
export class DIContainer {
  private dependencies = new Map<string, any>();
  private factories = new Map<string, () => any>();

  /**
   * Register a singleton dependency
   */
  registerSingleton<T>(key: string, instance: T): void {
    this.dependencies.set(key, instance);
  }

  /**
   * Register a factory function for lazy instantiation
   */
  registerFactory(key: string, factory: () => any): void {
    this.factories.set(key, factory);
  }

  /**
   * Resolve a dependency
   */
  resolve<T>(key: string): T | null {
    // Check if instance already exists
    if (this.dependencies.has(key)) {
      return this.dependencies.get(key);
    }

    // Check if factory exists
    if (this.factories.has(key)) {
      const factory = this.factories.get(key);
      const instance = factory();
      this.dependencies.set(key, instance);
      return instance;
    }

    return null;
  }

  /**
   * Clear all dependencies
   */
  clear(): void {
    this.dependencies.clear();
    this.factories.clear();
  }
}
