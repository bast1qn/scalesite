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

// Service implementations can be added here
// export * from './implementations/AuthService';
// export * from './implementations/DataService';
// export * from './implementations/NotificationService';
// export * from './implementations/AnalyticsService';

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
 * Factory for creating service instances
 * Useful for dependency injection
 */
export class ServiceFactory {
  private static services = new Map<string, any>();

  /**
   * Register a service implementation
   */
  static registerService<T>(interfaceName: string, implementation: T): void {
    this.services.set(interfaceName, implementation);
  }

  /**
   * Get a service implementation
   */
  static getService<T>(interfaceName: string): T | null {
    return this.services.get(interfaceName) || null;
  }

  /**
   * Clear all registered services
   */
  static clearServices(): void {
    this.services.clear();
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
