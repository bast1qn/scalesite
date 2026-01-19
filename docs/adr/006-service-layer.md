# ADR 006: Service Layer Architecture

## Status
Accepted

## Date
2026-01-19

## Context
Business logic is currently embedded in components, leading to:
1. Violation of Single Responsibility Principle
2. Difficult-to-test code
3. Code duplication across components
4. Tight coupling to 3rd party services (Clerk, Google Analytics)

## Decision
Implement a Service Layer to encapsulate business logic and provide abstractions for external services.

### Architecture
```
Presentation Layer (Components/Views)
    ↓ depends on interfaces
Service Layer (IAuthService, IAnalyticsService, etc.)
    ↓ implemented by
Service Implementations (ClerkAuthService, GoogleAnalyticsService, etc.)
    ↓ uses
External Services (Clerk, GA, Supabase, etc.)
```

### Service Interfaces

#### IAnalyticsService
```typescript
// /lib/services/interfaces/IAnalyticsService.ts
export interface IAnalyticsService {
  initialize(config: AnalyticsConfig): Promise<void>;
  trackPageView(data: PageViewData): void;
  trackEvent(event: EventData): void;
  setUser(properties: UserProperties): void;
  // ... more methods
}
```

#### IAuthService
```typescript
// /lib/services/interfaces/IAuthService.ts
export interface IAuthService {
  login(credentials: AuthCredentials): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  // ... more methods
}
```

#### INotificationService
```typescript
// /lib/services/interfaces/INotificationService.ts
export interface INotificationService {
  send(userId: string, payload: NotificationPayload): Promise<string>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
  getNotifications(userId: string): Promise<Notification[]>;
  // ... more methods
}
```

### Service Implementations

#### GoogleAnalyticsService
```typescript
// /lib/services/implementations/GoogleAnalyticsService.ts
export class GoogleAnalyticsService implements IAnalyticsService {
  async initialize(config: AnalyticsConfig): Promise<void> { /* ... */ }
  trackPageView(data: PageViewData): void { /* GA4 implementation */ }
  // ... GA4-specific implementation
}
```

#### ClerkAuthService
```typescript
// /lib/services/implementations/ClerkAuthService.ts
export class ClerkAuthService implements IAuthService {
  // Wraps Clerk authentication
  setUserFromClerk(clerkUser: any): User { /* ... */ }
}
```

#### InMemoryNotificationService
```typescript
// /lib/services/implementations/InMemoryNotificationService.ts
export class InMemoryNotificationService implements INotificationService {
  // In-memory implementation for development/testing
  // Can be replaced with PushNotificationService, EmailService, etc.
}
```

### Service Factory with Dependency Injection
```typescript
// /lib/services/index.ts
export class ServiceFactory {
  static registerService(name: string, ServiceClass: new () => any): void;
  static getService<T>(name: string): Promise<T>;
}

// Usage
const analytics: IAnalyticsService = await ServiceFactory.getService('analytics');
analytics.trackEvent({ category: 'user', action: 'login' });
```

## Benefits

### 1. Separation of Concerns
- Components handle UI logic only
- Services handle business logic
- Clean architecture boundaries

### 2. Testability
```typescript
// Easy to mock services in tests
const mockAnalytics = createMockAnalyticsService();
ServiceFactory.registerInstance('analytics', mockAnalytics);
```

### 3. Flexibility
```typescript
// Easy to swap implementations
ServiceFactory.registerService('analytics', PlausibleAnalyticsService);
// No changes needed in components
```

### 4. SOLID Principles
- **SRP**: Each service has one responsibility
- **OCP**: Open for extension, closed for modification
- **LSP**: Services can be substituted with their interfaces
- **ISP**: Focused interfaces (IAnalyticsTracker, IAnalyticsUser, etc.)
- **DIP**: Components depend on abstractions, not concretions

## Implementation Status
- ✅ Service interfaces defined
- ✅ GoogleAnalyticsService
- ✅ ClerkAuthService
- ✅ InMemoryNotificationService
- ⏳ PricingService (extract from PricingCalculator component)
- ⏳ ProjectService (business logic for projects)
- ⏳ ContentGenerationService (AI integration)

## Usage Examples

### Before (Business Logic in Component)
```typescript
// PricingCalculator.tsx - 460+ lines
const calculatePrice = () => {
  // Complex pricing logic mixed with UI
  let price = basePrice;
  if (features.blog) price += 10;
  if (features.ecommerce) price += 20;
  // ... 100 lines of pricing logic
};
```

### After (Service Layer)
```typescript
// lib/services/PricingService.ts
class PricingService {
  calculatePrice(config: PricingConfig): PriceBreakdown {
    // Pure business logic
  }
}

// components/PricingCalculator.tsx
const pricingService = ServiceFactory.getServiceSync<PricingService>('pricing');
const price = pricingService.calculatePrice(config);
```

## Future Services to Implement
1. **PricingService**: Extract from PricingCalculator component
2. **ProjectService**: Business logic for projects, milestones, progress
3. **ContentGenerationService**: AI content generation abstraction
4. **ExportService**: PDF, CSV, Excel export strategies
5. **PaymentService**: Stripe, PayPal integration
6. **EmailService**: Transactional emails, newsletters

## Related Decisions
- [ADR 004: Design Patterns Implementation](./004-design-patterns-implementation.md)
- [ADR 005: Repository Pattern](./005-repository-pattern.md)
- [ADR 001: Technology Stack](./001-technology-stack.md)
