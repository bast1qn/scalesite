# ScaleSite Architecture Diagrams

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                         │
│                    (React Components + UI)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│  │   Pages    │  │ Components │  │   Views    │              │
│  └────────────┘  └────────────┘  └────────────┘              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ depends on
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                         │
│                  (Services + Domain Models)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Analytics  │  │  Auth        │  │ Notifications│        │
│  │   Service    │  │  Service     │  │   Service    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Pricing    │  │  Project     │  │  Content     │        │
│  │   Service    │  │  Service     │  │  Generator   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ depends on
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                           │
│                    (Repository Pattern)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Project     │  │  Ticket      │  │  Newsletter  │        │
│  │  Repository  │  │  Repository  │  │  Repository  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   Cached     │  │    Mock      │                            │
│  │  Repository  │  │  Repository  │                            │
│  └──────────────┘  └──────────────┘                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │ accesses
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                           │
│                   (External Services)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Clerk   │  │  Neon    │  │ Google   │  │ Supabase │     │
│  │   Auth   │  │  PostgreSQL│ │   AI     │  │  Storage │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Design Patterns

### Singleton Pattern

```
┌─────────────────────────────────────────┐
│         Singleton<T> Pattern             │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Config (Singleton)         │   │
│  ├─────────────────────────────────┤   │
│  │ - apiUrl: string                │   │
│  │ - environment: 'dev' | 'prod'   │   │
│  │ - features: {...}               │   │
│  │ - limits: {...}                 │   │
│  ├─────────────────────────────────┤   │
│  │ + getConfig(): AppConfig        │   │
│  │ + isProduction(): boolean       │   │
│  │ + isFeatureEnabled(): boolean   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Usage:                                 │
│  const config = useConfig();            │
│  const isProd = Config.isProduction();  │
└─────────────────────────────────────────┘
```

### Factory Pattern

```
┌─────────────────────────────────────────────────────┐
│           Factory Pattern Architecture               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │         OAuthProviderFactory               │    │
│  ├───────────────────────────────────────────┤    │
│  │  + createProvider(type, config)           │    │
│  │  + registerProvider(name, ProviderClass)  │    │
│  └───────────────────────────────────────────┘    │
│                     │                               │
│                     ▼                               │
│  ┌──────────────┐  ┌──────────────┐              │
│  │   GitHub     │  │   Google     │              │
│  │   Provider   │  │   Provider   │              │
│  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐              │
│  │  LinkedIn    │  │   Custom     │              │
│  │   Provider   │  │   Provider   │              │
│  └──────────────┘  └──────────────┘              │
│                                                     │
│  Benefits:                                          │
│  - Decouples creation from usage                   │
│  - Easy to add new providers                       │
│  - Centralized creation logic                      │
└─────────────────────────────────────────────────────┘
```

### Observer Pattern

```
┌─────────────────────────────────────────────────────┐
│           Observer Pattern (EventBus)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │              EventBus                      │    │
│  │            (Singleton)                     │    │
│  ├───────────────────────────────────────────┤    │
│  │  + subscribe(event, handler)              │    │
│  │  + publish(event, payload)                │    │
│  │  + subscribeOnce(event, handler)          │    │
│  └───────────────────────────────────────────┘    │
│                     │                               │
│        ┌────────────┼────────────┐                │
│        ▼            ▼            ▼                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Component1│  │Component2│  │Component3│      │
│  │subscribe │  │subscribe │  │subscribe │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                     │
│  Event Flow:                                       │
│  Component1 publishes event → EventBus notifies    │
│  → Component2 & Component3 receive update          │
└─────────────────────────────────────────────────────┘
```

### Strategy Pattern

```
┌─────────────────────────────────────────────────────┐
│          Strategy Pattern (Validation)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │          ValidatorContext                  │    │
│  ├───────────────────────────────────────────┤    │
│  │  - strategy: IValidationStrategy          │    │
│  │  + setStrategy(strategy)                  │    │
│  │  + validate(value): ValidationResult       │    │
│  └───────────────────────────────────────────┘    │
│                     │                               │
│                     ▼                               │
│  ┌─────────────────────────────────────────┐      │
│  │      IValidationStrategy (Interface)     │      │
│  ├─────────────────────────────────────────┤      │
│  │  + validate(value): ValidationResult     │      │
│  └─────────────────────────────────────────┘      │
│                     ▲                               │
│         ┌───────────┼───────────┐                  │
│         │           │           │                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Email   │ │ Password │ │    URL   │        │
│  │Strategy  │ │Strategy  │ │Strategy  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                     │
│  Benefits:                                          │
│  - Interchangeable algorithms                      │
│  - Easy to add new validations                     │
│  - Open/Closed Principle                           │
└─────────────────────────────────────────────────────┘
```

---

## Repository Pattern

```
┌─────────────────────────────────────────────────────┐
│            Repository Pattern Layers                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │         Service Layer                      │    │
│  │  (Business Logic)                          │    │
│  ├───────────────────────────────────────────┤    │
│  │  projectService.getProjects(userId)       │    │
│  └────────────────────┬──────────────────────┘    │
│                       │ depends on interface       │
│                       ▼                            │
│  ┌───────────────────────────────────────────┐    │
│  │      IRepository<Project> Interface       │    │
│  ├───────────────────────────────────────────┤    │
│  │  + getById(id)                            │    │
│  │  + getAll(options)                        │    │
│  │  + create(data)                           │    │
│  │  + update(id, data)                       │    │
│  │  + delete(id)                             │    │
│  └────────────────────┬──────────────────────┘    │
│                       │ implemented by             │
│                       ▼                            │
│  ┌───────────────────────────────────────────┐    │
│  │    Concrete Repository Implementations    │    │
│  ├───────────────────────────────────────────┤    │
│  │  ┌─────────────┐  ┌─────────────┐        │    │
│  │  │    Mock     │  │  Supabase   │        │    │
│  │  │ Repository  │  │ Repository  │        │    │
│  │  │ (Testing)   │  │ (Production)│        │    │
│  │  └─────────────┘  └─────────────┘        │    │
│  │  ┌─────────────┐                         │    │
│  │  │    Cached   │                         │    │
│  │  │ Repository  │                         │    │
│  │  │  (Decorator)│                         │    │
│  │  └─────────────┘                         │    │
│  └────────────────────┬──────────────────────┘    │
│                       │ accesses                  │
│                       ▼                            │
│  ┌───────────────────────────────────────────┐    │
│  │         Database                          │    │
│  │  (PostgreSQL / Supabase / Neon)           │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  Benefits:                                          │
│  - Decouples data access from business logic       │
│  - Easy to test with mock repository              │
│  - Can swap database implementations              │
│  - Caching layer with decorator                   │
└─────────────────────────────────────────────────────┘
```

---

## Service Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│              Service Layer Architecture              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │         Components                         │    │
│  │  (Presentation Layer)                      │    │
│  ├───────────────────────────────────────────┤    │
│  │  - UI logic only                           │    │
│  │  - No business logic                       │    │
│  │  - Depends on service interfaces          │    │
│  └────────────────────┬──────────────────────┘    │
│                       │                           │
│                       ▼                           │
│  ┌───────────────────────────────────────────┐    │
│  │      Service Interfaces (Abstractions)     │    │
│  ├───────────────────────────────────────────┤    │
│  │  ┌───────────────────────────────────┐   │    │
│  │  │ IAnalyticsService                 │   │    │
│  │  │ + trackEvent()                    │   │    │
│  │  │ + trackPageView()                 │   │    │
│  │  └───────────────────────────────────┘   │    │
│  │  ┌───────────────────────────────────┐   │    │
│  │  │ IAuthService                      │   │    │
│  │  │ + login()                         │   │    │
│  │  │ + logout()                        │   │    │
│  │  └───────────────────────────────────┘   │    │
│  │  ┌───────────────────────────────────┐   │    │
│  │  │ INotificationService              │   │    │
│  │  │ + send()                          │   │    │
│  │  │ + getNotifications()              │   │    │
│  │  └───────────────────────────────────┘   │    │
│  └────────────────────┬──────────────────────┘    │
│                       │ implemented by             │
│                       ▼                            │
│  ┌───────────────────────────────────────────┐    │
│  │    Service Implementations                 │    │
│  ├───────────────────────────────────────────┤    │
│  │  ┌─────────────────────────────────────┐ │    │
│  │  │ GoogleAnalyticsService              │ │    │
│  │  │ - GA4 integration                   │ │    │
│  │  │ - Event tracking                    │ │    │
│  │  └─────────────────────────────────────┘ │    │
│  │  ┌─────────────────────────────────────┐ │    │
│  │  │ ClerkAuthService                   │ │    │
│  │  │ - Clerk wrapper                    │ │    │
│  │  │ - User management                  │ │    │
│  │  └─────────────────────────────────────┘ │    │
│  │  ┌─────────────────────────────────────┐ │    │
│  │  │ InMemoryNotificationService        │ │    │
│  │  │ - In-memory storage                │ │    │
│  │  │ - Multi-channel support            │ │    │
│  │  └─────────────────────────────────────┘ │    │
│  └────────────────────┬──────────────────────┘    │
│                       │                           │
│                       ▼                           │
│  ┌───────────────────────────────────────────┐    │
│  │      External Services                     │    │
│  │  (Infrastructure Layer)                    │    │
│  ├───────────────────────────────────────────┤    │
│  │  Google Analytics  │  Clerk  │  Push API  │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  Dependency Injection via ServiceFactory:          │
│  const analytics = await ServiceFactory             │
│    .getService<IAnalyticsService>('analytics');    │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│                  Data Flow Diagram                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  User Action                                        │
│      │                                              │
│      ▼                                              │
│  ┌──────────────┐                                  │
│  │  Component   │                                  │
│  └──────┬───────┘                                  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────┐                                  │
│  │ Custom Hook  │ (useAsyncOperation, useFormState)│
│  └──────┬───────┘                                  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────┐                                  │
│  │   Service    │ (Business Logic)                 │
│  └──────┬───────┘                                  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────┐                                  │
│  │  Repository  │ (Data Access)                    │
│  └──────┬───────┘                                  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────┐                                  │
│  │   Database   │ (PostgreSQL / Neon)              │
│  └──────────────┘                                  │
│         │                                           │
│         ▼ (returns data)                            │
│  ┌──────────────┐                                  │
│  │  Repository  │ (Transforms to domain model)     │
│  └──────┬───────┘                                  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────┐                                  │
│  │   Service    │ (Applies business logic)         │
│  └──────┬───────┘                                  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────┐                                  │
│  │ Custom Hook  │ (Manages state)                  │
│  └──────┬───────┘                                  │
│         │                                           │
│         ▼                                           │
│  ┌──────────────┐                                  │
│  │  Component   │ (Renders UI)                     │
│  └──────────────┘                                  │
│                                                     │
│  Key Points:                                        │
│  - Unidirectional data flow                         │
│  - Clear separation of concerns                    │
│  - Each layer has single responsibility            │
│  - Easy to test at each layer                      │
└─────────────────────────────────────────────────────┘
```

---

## State Management

```
┌─────────────────────────────────────────────────────┐
│              State Management Strategy               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │        Global State (Context)            │      │
│  ├─────────────────────────────────────────┤      │
│  │  ┌────────────┐  ┌────────────┐        │      │
│  │  │   Auth     │  │   Theme    │        │      │
│  │  │  Context   │  │  Context   │        │      │
│  │  └────────────┘  └────────────┘        │      │
│  │  ┌────────────┐  ┌────────────┐        │      │
│  │  │  Language  │  │  Currency  │        │      │
│  │  │  Context   │  │  Context   │        │      │
│  │  └────────────┘  └────────────┘        │      │
│  │  ┌────────────┐                        │      │
│  │  │ Notification│                        │      │
│  │  │  Context   │                        │      │
│  │  └────────────┘                        │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │         Local State (useState)           │      │
│  ├─────────────────────────────────────────┤      │
│  │  Component-specific state               │      │
│  │  Form inputs, modals, toggles           │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │       Server State (Custom Hooks)        │      │
│  ├─────────────────────────────────────────┤      │
│  │  ┌─────────────────────────────────┐   │      │
│  │  │ useAsyncOperation()             │   │      │
│  │  │ - data                           │   │      │
│  │  │ - loading                        │   │      │
│  │  │ - error                          │   │      │
│  │  └─────────────────────────────────┘   │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │          Event Bus (Observer)            │      │
│  ├─────────────────────────────────────────┤      │
│  │  Cross-component communication          │      │
│  │  Replaces prop drilling                 │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │         URL State (Router)               │      │
│  ├─────────────────────────────────────────┤      │
│  │  Route params, query params             │      │
│  │  Navigation state                       │      │
│  └─────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘
```

---

## SOLID Principles Compliance

```
┌─────────────────────────────────────────────────────┐
│           SOLID Principles Scorecard                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │  S - Single Responsibility Principle      │    │
│  │  Score: 8/10                              │    │
│  │  ✓ Repository pattern separates data     │    │
│  │  ✓ Service layer separates business      │    │
│  │  ✓ Hooks separate reusable logic         │    │
│  │  ✗ Large components need splitting       │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │  O - Open/Closed Principle                │    │
│  │  Score: 8/10                              │    │
│  │  ✓ Factory pattern for extensibility     │    │
│  │  ✓ Strategy pattern for algorithms       │    │
│  │  ✓ Event bus for subscribers             │    │
│  │  ✗ Some hard-coded values                │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │  L - Liskov Substitution Principle        │    │
│  │  Score: 9/10                              │    │
│  │  ✓ All services interchangeable          │    │
│  │  ✓ All repositories interchangeable      │    │
│  │  ✓ All strategies interchangeable        │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │  I - Interface Segregation Principle      │    │
│  │  Score: 8/10                              │    │
│  │  ✓ Focused service interfaces            │    │
│  │  ✓ Separated contexts                    │    │
│  │  ✗ Some fat interfaces remain            │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │  D - Dependency Inversion Principle      │    │
│  │  Score: 9/10                              │    │
│  │  ✓ Components use service interfaces     │    │
│  │  ✓ Services use repository interfaces    │    │
│  │  ✓ Dependency injection via Factory      │    │
│  │  ✗ Some direct 3rd party deps            │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  Overall SOLID Score: 8.5/10 ⬆️ (+1.7)            │
└─────────────────────────────────────────────────────┘
```

---

**Document Version**: 1.0
**Last Updated**: January 19, 2026
**Architecture Version**: v2.0.1 (Enterprise-Grade)
