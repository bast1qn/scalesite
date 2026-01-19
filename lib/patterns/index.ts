/**
 * Design Patterns Barrel Export
 *
 * This module exports all implemented design patterns for enterprise-grade architecture.
 *
 * Patterns included:
 * - Singleton: Ensures only one instance of a class exists
 * - Factory: Creates objects without specifying exact classes
 * - Observer: Defines one-to-many dependencies between objects
 * - Strategy: Encapsulates interchangeable algorithms
 * - Decorator: Adds cross-cutting concerns (logging, caching, metrics)
 * - Command: Encapsulates requests as objects for undo/redo and queuing
 *
 * Usage:
 * import { Config, EventBus } from '@/lib/patterns';
 * import { ValidatorContext, EmailValidationStrategy } from '@/lib/patterns';
 * import { createDecoratedService, LoggingDecorator } from '@/lib/patterns';
 * import { useCommandHistory, createCommand } from '@/lib/patterns';
 */

// Singleton Pattern
export {
  Singleton,
  Config,
  useConfig,
  useFeatureFlag,
  ConfigurationManagerInstance,
} from './Singleton';

// Factory Pattern
export {
  OAuthProviderFactory,
  GitHubAuthProvider,
  GoogleAuthProvider,
  LinkedInAuthProvider,
  IOAuthProvider,
  OAuthProviderConfig,
  OAuthUserData,
  ComponentFactory,
  ServiceFactory,
  IService,
} from './Factory';

// Observer Pattern
export {
  IObserver,
  ISubject,
  Subject,
  EventBus,
  AppEventType,
  useEventSubscription,
  TypedEvent,
  EventHandler,
  EventData,
  userLoginEvent,
  themeChangedEvent,
  languageChangedEvent,
} from './Observer';

// Strategy Pattern
export {
  IValidationStrategy,
  ValidationResult,
  ValidatorContext,
  CompositeValidator,
  FormValidator,
  EmailValidationStrategy,
  PasswordValidationStrategy,
  URLValidationStrategy,
  PhoneValidationStrategy,
  DateValidationStrategy,
  validateStrongPassword,
  validateUserRegistration,
  createRegistrationFormValidator,
  validateField,
  validateByCountryCode,
} from './Strategy';

// Decorator Pattern
export {
  ServiceDecorator,
  LoggingDecorator,
  CachingDecorator,
  MetricsDecorator,
  CompositeDecorator,
  createDecoratedService,
  useServiceMetrics,
  type LogEntry,
  type ILogger,
  type CacheEntry,
  type ICache,
  type MetricEntry,
  type IMetricsCollector,
  InMemoryLogger,
  InMemoryCache,
  InMemoryMetricsCollector,
} from './Decorator';

// Command Pattern
export {
  ICommand,
  ICommandHistory,
  ICommandQueue,
  BaseCommand,
  CommandHistory,
  MacroCommand,
  LambdaCommand,
  PropertyChangeCommand,
  ArrayCommand,
  CommandQueue,
  useCommandHistory,
  useCommandQueue,
  createCommand,
  createPropertyCommand,
  createArrayAddCommand,
  createArrayRemoveCommand,
  createMacroCommand,
} from './Command';

// ==================== Pattern Documentation ====================

/**
 * Design Pattern Usage Guide
 *
 * SINGLETON PATTERN:
 * Use when you need exactly one instance of a class
 * Example: Configuration management, service locators
 * Usage:
 *   const config = Config.getConfig();
 *   const isProd = Config.isProduction();
 *
 * FACTORY PATTERN:
 * Use when you want to create objects without specifying their exact classes
 * Example: OAuth providers, component creation, service instantiation
 * Usage:
 *   const provider = OAuthProviderFactory.createProvider('github', config);
 *   const userData = await provider.authenticate();
 *
 * OBSERVER PATTERN:
 * Use when one-to-many dependency is needed
 * Example: Event systems, pub/sub messaging, state management
 * Usage:
 *   const eventBus = EventBus.getInstance();
 *   eventBus.subscribe(AppEventType.USER_LOGIN, (data) => console.log(data));
 *   eventBus.publish(AppEventType.USER_LOGIN, userData);
 *
 * STRATEGY PATTERN:
 * Use when you want to define interchangeable algorithms
 * Example: Validation strategies, sorting algorithms, payment processing
 * Usage:
 *   const validator = new ValidatorContext(new EmailValidationStrategy());
 *   const result = validator.validate('test@example.com');
 *
 * DECORATOR PATTERN:
 * Use when you want to add cross-cutting concerns without modifying classes
 * Example: Logging, caching, metrics, error handling
 * Usage:
 *   const service = new MyService();
 *   const decorated = createDecoratedService(service, ['logging', 'metrics']);
 *   const loggedService = new LoggingDecorator(service);
 *   await loggedService.withLogging('getData', () => fetch(), { id: 123 });
 *
 * COMMAND PATTERN:
 * Use when you want to encapsulate requests as objects
 * Example: Undo/redo functionality, command queuing, macros
 * Usage:
 *   const { executeCommand, undo, redo } = useCommandHistory();
 *   await executeCommand(createCommand('Update', async () => {
 *     await updateProject(projectId, data);
 *   }, async () => {
 *     await updateProject(projectId, oldData);
 *   }));
 *   await undo(); // Rollback
 */
