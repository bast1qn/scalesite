# ADR 002: Design Patterns Implementation Strategy

## Status
Accepted

## Context
Scalesite verwendet mehrere **Gang of Four Design Patterns**. Wir müssen dokumentieren:
- Welche Patterns wo und warum verwendet werden
- Wie diese Patterns zusammenarbeiten
- Wann neue Patterns hinzugefügt werden sollen

## Decision

### 1. Singleton Pattern
**Verwendung an folgenden Orten:**
- `/lib/patterns/Singleton.ts` - Generic Singleton Base Class
- `/lib/repositories/RepositoryFactory.ts` - Repository Instances
- `/lib/services/index.ts` - ServiceFactory, ServiceLocator, DIContainer
- `/lib/patterns/Observer.ts` - EventBus
- `/lib/errorHandler.ts` - globalErrorHandler

**Wann Singleton verwenden:**
✅ **Ja:**
- Globaler State (Configuration, Event Bus)
- Resource-intensive Objects (Database Connections)
- Logging Services
- Cache Manager

❌ **Nein:**
- User-specific Data
- Request-specific Objects
- Test Data

**Implementation Template:**
```typescript
export class MySingleton {
  private static instance: MySingleton;
  private constructor() {}

  static getInstance(): MySingleton {
    if (!MySingleton.instance) {
      MySingleton.instance = new MySingleton();
    }
    return MySingleton.instance;
  }
}
```

### 2. Factory Pattern
**Verwendung an folgenden Orten:**
- `/lib/patterns/Factory.ts` - ComponentFactory, OAuthProviderFactory, ServiceFactory
- `/lib/repositories/RepositoryFactory.ts` - Repository Creation
- `/lib/errorHandler.ts` - ErrorFactory

**Wann Factory verwenden:**
✅ **Ja:**
- Objekt-Erstellung mit komplexer Logik
- Runtime Object Creation
- Condition-based Creation
- Testability (easily mockable)

❌ **Nein:**
- Einfache Objekte (POJOs)
- Konstanten
- Immutable Data

**Implementation Template:**
```typescript
export class MyFactory {
  private static registry = new Map<string, AnyConstructor>();

  static register(key: string, constructor: AnyConstructor) {
    this.registry.set(key, constructor);
  }

  static create(key: string, ...args: unknown[]) {
    const Constructor = this.registry.get(key);
    if (!Constructor) throw new Error(`Unknown key: ${key}`);
    return new Constructor(...args);
  }
}
```

### 3. Observer Pattern
**Verwendung an folgenden Orten:**
- `/lib/patterns/Observer.ts` - EventBus, TypedEventBus
- React Components via `useEventBus` Hook

**Wann Observer verwenden:**
✅ **Ja:**
- Event-driven Architecture
- Real-time Updates
- Decoupled Communication
- Multiple Subscribers

❌ **Nein:**
- Single Subscriber (use Callback)
- Synchronous Operations (use direct function calls)
- Simple State (use React Context)

**Implementation Template:**
```typescript
export interface IObserver<T> {
  update(data: T): void;
}

export interface ISubject<T> {
  subscribe(observer: IObserver<T>): void;
  unsubscribe(observer: IObserver<T>): void;
  notify(data: T): void;
}
```

### 4. Strategy Pattern
**Verwendung an folgenden Orten:**
- `/lib/patterns/Strategy.ts` - Validation Strategies
- `/lib/errorHandler.ts` - Error Handler Strategies

**Wann Strategy verwenden:**
✅ **Ja:**
- Interchangeable Algorithms
- Runtime Algorithm Selection
- Multiple Implementations of Same Interface

❌ **Nein:**
- Fixed Algorithm (use simple function)
- Single Implementation (no need for abstraction)

**Implementation Template:**
```typescript
export interface IStrategy<T> {
  execute(data: T): Result;
}

export class Context<T> {
  constructor(private strategy: IStrategy<T>) {}

  setStrategy(strategy: IStrategy<T>) {
    this.strategy = strategy;
  }

  executeStrategy(data: T): Result {
    return this.strategy.execute(data);
  }
}
```

### 5. Repository Pattern
**Verwendung an folgenden Orten:**
- `/lib/repositories/BaseRepository.ts` - Generic Repository
- 16+ Domain-Specific Repositories

**Wann Repository verwenden:**
✅ **Ja:**
- Data Access Layer Abstraction
- Caching Logic
- Query Building
- Testability (Mock Database)

❌ **Nein:**
- Simple API Calls (use fetch/axios directly)
- Local Operations (use plain functions)

**Implementation Template:**
```typescript
export interface IRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}
```

## Pattern Combinations

### Common Combinations:
1. **Singleton + Factory**: ServiceFactory (Singleton Factory)
2. **Observer + Singleton**: EventBus (Singleton Subject)
3. **Strategy + Factory**: ValidationStrategyFactory
4. **Repository + Factory**: RepositoryFactory

## Anti-Patterns to Avoid

❌ **Singleton Abuse:**
```typescript
// DON'T: Everything as Singleton
class UserPreferences extends Singleton {} // Bad: User-specific!
```

❌ **Factory Overkill:**
```typescript
// DON'T: Factory for simple objects
const user = UserFactory.create({ name: 'John' }); // Over-engineered
// BETTER:
const user = { name: 'John' };
```

❌ **Observer Spaghetti:**
```typescript
// DON'T: Event chains
eventBus.emit('A') -> eventBus.emit('B') -> eventBus.emit('C')
// Hard to debug!
```

## Decision Guide

| Use Case | Pattern | Example |
|----------|---------|---------|
| Global Config | Singleton | ConfigurationManager |
| Object Creation | Factory | ComponentFactory |
| Algorithm Selection | Strategy | ValidationStrategy |
| Event Communication | Observer | EventBus |
| Data Access | Repository | UserRepository |
| Complex Object Building | Builder | RequestBuilder |

## References
- [Gang of Four Design Patterns](https://refactoring.guru/design-patterns)
- [Patterns in TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

## Date
2026-01-19

## Author
Senior Software Architect (Loop 20/Phase 5)
