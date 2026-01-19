# ScaleSite - Enterprise API Documentation

**Version**: 2.0.1
**Last Updated**: 2026-01-19 (Loop 17/Phase 5)
**Status**: Production Ready

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Patterns API](#design-patterns-api)
3. [Service Layer API](#service-layer-api)
4. [Component API](#component-api)
5. [Context API](#context-api)
6. [Utility API](#utility-api)
7. [Type Definitions](#type-definitions)
8. [Usage Examples](#usage-examples)
9. [Migration Guide](#migration-guide)

---

## Architecture Overview

### Layer Architecture

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (pages/*Page.tsx, components/)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Business Logic Layer           │
│  (lib/services/, lib/patterns/)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Data Layer                  │
│  (lib/api-modules/, contexts/)      │
└─────────────────────────────────────┘
```

### Dependency Flow

```typescript
// Import hierarchy (top to bottom)
pages → components → services → api-modules
  ↓        ↓           ↓          ↓
types ←───────────────────────────┘
```

---

## Design Patterns API

### Singleton Pattern

#### Configuration Manager

```typescript
import { Config, useConfig, useFeatureFlag } from '@/lib/patterns';

// Get full configuration
const config = Config.getConfig();
console.log(config.apiUrl); // 'http://localhost:3001'

// Check environment
Config.isProduction(); // boolean
Config.isDevelopment(); // boolean

// Feature flags
Config.isFeatureEnabled('analytics'); // boolean

// React hook
function MyComponent() {
  const config = useConfig();
  const analyticsEnabled = useFeatureFlag('analytics');
  // ...
}
```

**Type Definition:**
```typescript
interface AppConfig {
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
```

---

### Factory Pattern

#### OAuth Provider Factory

```typescript
import {
  OAuthProviderFactory,
  IOAuthProvider,
  OAuthProviderConfig
} from '@/lib/patterns';

// Create provider instance
const config: OAuthProviderConfig = {
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  callbackUrl: 'https://example.com/callback',
  scope: ['read', 'write']
};

const githubProvider = OAuthProviderFactory.createProvider('github', config);
const userData = await githubProvider.authenticate();

// Register custom provider
class CustomAuthProvider implements IOAuthProvider {
  name = 'custom';
  async authenticate(): Promise<OAuthUserData> { /* ... */ }
  async refreshToken(token: string): Promise<string> { /* ... */ }
  async revokeToken(token: string): Promise<void> { /* ... */ }
}

OAuthProviderFactory.registerProvider('custom', CustomAuthProvider);

// List supported providers
const providers = OAuthProviderFactory.getSupportedProviders();
// ['github', 'google', 'linkedin', 'custom']
```

**Type Definitions:**
```typescript
interface IOAuthProvider {
  name: string;
  authenticate(): Promise<OAuthUserData>;
  refreshToken(token: string): Promise<string>;
  revokeToken(token: string): Promise<void>;
}

interface OAuthUserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}
```

#### Component Factory

```typescript
import { ComponentFactory, ComponentConfig } from '@/lib/patterns';

// Register component
ComponentFactory.registerComponent('Button', Button);
ComponentFactory.registerComponent('Card', Card);

// Create component from config
const config: ComponentConfig = {
  type: 'Button',
  props: { variant: 'primary', children: 'Click me' }
};

const button = ComponentFactory.createComponent(config);

// Create multiple components
const components = ComponentFactory.createComponents([
  { type: 'Button', props: { children: 'OK' } },
  { type: 'Button', props: { children: 'Cancel' } }
]);
```

#### Service Factory

```typescript
import { ServiceFactory, IService } from '@/lib/patterns';

// Register service
class AnalyticsService implements IService {
  name = 'analytics';
  async initialize(): Promise<void> { /* ... */ }
  destroy(): void { /* ... */ }
}

ServiceFactory.registerService('analytics', AnalyticsService);

// Get service instance (singleton)
const analytics = await ServiceFactory.getService<AnalyticsService>('analytics');

// Destroy service
ServiceFactory.destroyService('analytics');
ServiceFactory.destroyAll();
```

---

### Observer Pattern (Event Bus)

#### EventBus API

```typescript
import {
  EventBus,
  AppEventType,
  useEventSubscription,
  TypedEvent
} from '@/lib/patterns';

// Get singleton instance
const eventBus = EventBus.getInstance();

// Subscribe to event
const unsubscribe = eventBus.subscribe(
  AppEventType.USER_LOGIN,
  (payload) => {
    console.log('User logged in:', payload);
  }
);

// Subscribe once
eventBus.subscribeOnce(AppEventType.SESSION_EXPIRED, () => {
  // Show login modal
});

// Publish event
eventBus.publish(
  AppEventType.USER_LOGIN,
  { userId: '123', email: 'user@example.com' },
  'AuthService'
);

// Unsubscribe
unsubscribe();

// Clear all subscribers for event
eventBus.clear(AppEventType.USER_LOGIN);

// Clear all subscribers
eventBus.clearAll();

// Get subscriber count
const count = eventBus.getSubscriberCount(AppEventType.USER_LOGIN);
```

#### React Hook

```typescript
import { useEventSubscription } from '@/lib/patterns';

function LoginComponent() {
  const [status, setStatus] = useState('idle');

  useEventSubscription(
    AppEventType.USER_LOGIN,
    (userData) => {
      setStatus('authenticated');
      console.log('User:', userData);
    },
    [] // Dependencies
  );

  return <div>Status: {status}</div>;
}
```

#### Typed Events

```typescript
import { TypedEvent } from '@/lib/patterns';

// Create typed event
const userLoginEvent = new TypedEvent<{
  userId: string;
  email: string;
  name: string;
}>(AppEventType.USER_LOGIN);

// Subscribe with type safety
userLoginEvent.subscribe((data) => {
  console.log(data.userId); // TypeScript knows this exists
});

// Publish with type checking
userLoginEvent.publish({
  userId: '123',
  email: 'user@example.com',
  name: 'John Doe'
});
```

**Available Event Types:**
```typescript
enum AppEventType {
  // Auth events
  USER_LOGIN = 'user:login',
  USER_LOGOUT = 'user:logout',
  USER_REGISTER = 'user:register',
  SESSION_EXPIRED = 'session:expired',

  // Data events
  DATA_CHANGED = 'data:changed',
  DATA_SAVED = 'data:saved',
  DATA_DELETED = 'data:deleted',

  // UI events
  THEME_CHANGED = 'ui:theme:changed',
  LANGUAGE_CHANGED = 'ui:language:changed',
  NOTIFICATION = 'ui:notification',

  // Network events
  REQUEST_START = 'network:request:start',
  REQUEST_ERROR = 'network:request:error',
}
```

---

### Strategy Pattern (Validation)

#### Validator Context

```typescript
import {
  ValidatorContext,
  EmailValidationStrategy,
  PasswordValidationStrategy,
  URLValidationStrategy,
  PhoneValidationStrategy
} from '@/lib/patterns';

// Create validator with strategy
const emailValidator = new ValidatorContext(new EmailValidationStrategy());
const result = emailValidator.validate('test@example.com');

if (result.isValid) {
  console.log('Valid email');
} else {
  console.error('Errors:', result.errors);
  console.warn('Warnings:', result.warnings);
}
```

**Validation Result:**
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
```

#### Built-in Validators

```typescript
// Email validation
const emailValidator = new EmailValidationStrategy();
emailValidator.validate('test@example.com');
// { isValid: true, errors: [], warnings: [] }

// Password validation
const passwordValidator = new PasswordValidationStrategy({
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
});
passwordValidator.validate('MyP@ssw0rd123');
// { isValid: true, errors: [], warnings: [] }

// URL validation
const urlValidator = new URLValidationStrategy({
  allowRelative: false,
  allowedProtocols: ['http:', 'https:']
});
urlValidator.validate('https://example.com');
// { isValid: true, errors: [] }

// Phone validation
const phoneValidator = new PhoneValidationStrategy('DE');
phoneValidator.validate('+49123456789');
// { isValid: true, errors: [] }

// Date validation
const dateValidator = new DateValidationStrategy({
  minDate: new Date('2024-01-01'),
  maxDate: new Date('2025-12-31')
});
dateValidator.validate('2024-06-15');
// { isValid: true, errors: [] }
```

#### Composite Validator

```typescript
import { CompositeValidator } from '@/lib/patterns';

const composite = new CompositeValidator();

// Add multiple validators
composite.addValidator('email', new EmailValidationStrategy());
composite.addValidator('password', new PasswordValidationStrategy());

// Validate all
const result = composite.validate('test@example.com');
```

#### Form Validator

```typescript
import { FormValidator } from '@/lib/patterns';

const formValidator = new FormValidator();

formValidator.addFieldValidator('email', new EmailValidationStrategy());
formValidator.addFieldValidator('password', new PasswordValidationStrategy());
formValidator.addFieldValidator('phone', new PhoneValidationStrategy('DE'));

// Validate entire form
const formData = {
  email: 'test@example.com',
  password: 'MyP@ssw0rd',
  phone: '+49123456789'
};

const results = formValidator.validateForm(formData);
// {
//   email: { isValid: true, errors: [] },
//   password: { isValid: true, errors: [] },
//   phone: { isValid: true, errors: [] }
// }

// Check if form is valid
const isValid = formValidator.isFormValid(formData);

// Get all errors
const errors = formValidator.getFormErrors(formData);
// [] if valid, ['email: Invalid email', ...] if invalid
```

#### Utility Functions

```typescript
import {
  validateEmail,
  validateStrongPassword,
  validateUserRegistration,
  createRegistrationFormValidator,
  validateField,
  validateByCountryCode
} from '@/lib/patterns';

// Quick validators
validateEmail('test@example.com');
validateStrongPassword('MyP@ssw0rd123');

// Multi-field validation
validateUserRegistration({
  email: 'test@example.com',
  password: 'MyP@ssw0rd',
  phone: '+49123456789'
});

// Create form validator
const validator = createRegistrationFormValidator();

// Dynamic field validation
validateField('email', 'test@example.com');

// Context-aware validation
validateByCountryCode('+49123456789', 'DE');
```

---

## Service Layer API

### Repository Pattern

```typescript
import { IRepository, ApiRepository, MockRepository } from '@/lib/repositories';

// Define entity type
interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed';
}

// Use repository
const repository: IRepository<Project> = new ApiRepository<Project>('/api/projects');

const projects = await repository.getAll();
const project = await repository.getById('123');
const newProject = await repository.create({ name: 'New Project', status: 'active' });
await repository.update('123', { status: 'completed' });
await repository.delete('123');
```

**Repository Interface:**
```typescript
interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  query(criteria: QueryCriteria): Promise<T[]>;
}

interface QueryCriteria {
  where?: Record<string, any>;
  orderBy?: string;
  limit?: number;
  offset?: number;
}
```

---

## Component API

### Barrel Exports

```typescript
// Import from barrel
import {
  // Layout
  Layout,
  Header,
  Footer,

  // Animation
  AnimatedSection,
  PageTransition,

  // UI
  Button,
  Card,
  Input,

  // Dashboard
  DashboardLayout,
  Overview,

  // Features
  ChatWidget,
  OfferCalculator,
  PricingCalculator
} from '@/components';

// Feature-specific imports
import * as Dashboard from '@/components/dashboard';
import * as Billing from '@/components/billing';
import * as Newsletter from '@/components/newsletter';
```

### Component Props Types

All components export their props interfaces:

```typescript
import type { DashboardProps } from '@/components/dashboard/DashboardLayout';
import type { PricingCalculatorProps } from '@/components/pricing/PricingCalculator';
```

---

## Context API

### Available Contexts

```typescript
import {
  // Auth Context
  AuthContext,
  AuthProvider,
  useAuth,
  type AppUser,

  // Language Context
  LanguageContext,
  LanguageProvider,
  useLanguage,
  type Language,

  // Currency Context
  CurrencyContext,
  CurrencyProvider,
  useCurrency,
  type Currency,

  // Notification Context
  NotificationContext,
  NotificationProvider,
  useNotifications,
  type AppNotification,

  // Theme Context
  ThemeContext,
  ThemeProvider,
  useTheme,
  getCurrentTheme
} from '@/contexts';
```

### Usage Examples

```typescript
// Auth Context
function LoginButton() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <button onClick={logout}>Logout</button>;
  }

  return <button onClick={() => login(email, password)}>Login</button>;
}

// Language Context
function LocalizedText() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <p>{t('welcome')}</p>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="de">Deutsch</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

// Notification Context
function NotifyButton() {
  const { showNotification } = useNotifications();

  return (
    <button onClick={() => showNotification('Success!', 'success')}>
      Notify
    </button>
  );
}

// Theme Context
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

---

## Utility API

### Performance Utilities

```typescript
import {
  // Debounce
  useDebounce,

  // Optimistic updates
  useOptimistic,

  // Lazy loading
  useLazyImage,

  // List filtering
  useListFiltering,

  // Relative time
  useRelativeTime
} from '@/lib/hooks';

// Debounce input
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Search with debounced value
    search(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

// Optimistic updates
function LikeButton({ postId }) {
  const [likes, setLikes] = useState(0);
  const optimisticLikes = useOptimistic(likes, {
    pending: (current) => current + 1,
    error: (current) => current - 1
  });

  return (
    <button onClick={() => setLikes(likes + 1)}>
      Likes: {optimisticLikes}
    </button>
  );
}
```

### Analytics Utilities

```typescript
import {
  trackEvent,
  trackPageView,
  trackConversion,
  trackError
} from '@/lib/analytics';

// Track custom event
trackEvent('button_click', {
  buttonId: 'cta-primary',
  page: '/home'
});

// Track page view
trackPageView('/dashboard/overview');

// Track conversion
trackConversion('signup_completed', {
  plan: 'premium',
  value: 199
});

// Track error
trackError(new Error('API timeout'), {
  context: 'dashboard_load'
});
```

### Date Utilities

```typescript
import {
  formatDate,
  formatRelativeTime,
  formatDuration,
  isInPast,
  isInFuture,
  addDays,
  subtractDays
} from '@/lib/date-utils';

// Format date
formatDate(new Date(), 'de-DE'); // '19. Januar 2026'

// Relative time
formatRelativeTime(new Date(Date.now() - 3600000)); // 'vor 1 Stunde'

// Duration
formatDuration(3600000); // '1h 0m'

// Date comparisons
isInPast(new Date('2024-01-01')); // true
isInFuture(new Date('2027-01-01')); // true

// Date math
addDays(new Date(), 7); // Date + 7 days
subtractDays(new Date(), 7); // Date - 7 days
```

---

## Type Definitions

### Common Types

```typescript
// types/common.ts
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: Error;
}
```

### Dashboard Types

```typescript
// types/dashboard.ts
export type DashboardView =
  | 'übersicht'
  | 'ticket-support'
  | 'dienstleistungen'
  | 'transaktionen'
  | 'einstellungen'
  | 'analytics'
  | 'user-management'
  | 'discount-manager'
  | 'newsletter-manager';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingTickets: number;
  monthlyRevenue: number;
}

export interface DashboardActivity {
  id: string;
  type: 'project' | 'ticket' | 'payment' | 'user';
  action: string;
  timestamp: Date;
  userId: string;
}
```

---

## Usage Examples

### Complete Component with All Patterns

```typescript
import { useState, useEffect } from 'react';
import {
  ValidatorContext,
  EmailValidationStrategy,
  PasswordValidationStrategy,
  EventBus,
  AppEventType,
  useEventSubscription
} from '@/lib/patterns';
import { useAuth } from '@/contexts';
import type { AppUser } from '@/contexts';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Listen for auth events
  useEventSubscription(AppEventType.USER_LOGIN, (user: AppUser) => {
    console.log('User logged in:', user);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailValidator = new ValidatorContext(new EmailValidationStrategy());
    const emailResult = emailValidator.validate(formData.email);

    // Validate password
    const passwordValidator = new ValidatorContext(new PasswordValidationStrategy());
    const passwordResult = passwordValidator.validate(formData.password);

    // Collect errors
    const newErrors: Record<string, string> = {};
    if (!emailResult.isValid) {
      newErrors.email = emailResult.errors[0];
    }
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.errors[0];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Attempt login
    try {
      await login(formData.email, formData.password);

      // Publish event
      EventBus.getInstance().publish(
        AppEventType.USER_LOGIN,
        { email: formData.email },
        'LoginForm'
      );
    } catch (error) {
      setErrors({ form: 'Login failed' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Migration Guide

### Migrating from Direct Imports to Pattern-Based APIs

#### Before (Anti-pattern)
```typescript
// Direct API call in component
function Dashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(setProjects);
  }, []);

  return <ProjectList projects={projects} />;
}
```

#### After (Pattern-based)
```typescript
// Using Repository pattern + Service layer
function Dashboard() {
  const projectService = useService(ProjectService);
  const { data: projects, loading, error } = useDashboardData(projectService);

  if (loading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return <ProjectList projects={projects} />;
}
```

### Breaking Changes

#### v1.x → v2.0

1. **Circular dependencies removed**
   - Replace `from './index'` with direct imports
   - Move shared types to `/types` directory

2. **Context API simplified**
   - Split large contexts into smaller, focused ones
   - Use composition instead of monolithic context

3. **Component props explicit**
   - All props exported as interfaces
   - Use type imports: `import type { ComponentProps }`

---

## Best Practices

### 1. Always Use Types
```typescript
// ✅ Good
import type { DashboardProps } from '@/components/dashboard/DashboardLayout';

// ❌ Bad
import { DashboardProps } from '@/components/dashboard/DashboardLayout';
```

### 2. Dependency Injection
```typescript
// ✅ Good
function Component({ service }: { service: IService }) { ... }

// ❌ Bad
function Component() {
  const service = new Service(); // Hard to test
}
```

### 3. Error Handling
```typescript
// ✅ Good
try {
  await service.doSomething();
} catch (error) {
  EventBus.getInstance().publish(AppEventType.REQUEST_ERROR, error);
}

// ❌ Bad
await service.doSomething(); // Unhandled error
```

### 4. Event-Driven Architecture
```typescript
// ✅ Good
EventBus.getInstance().publish(AppEventType.DATA_CHANGED, data);

// ❌ Bad
// Direct coupling between components
otherComponent.updateData(data);
```

---

## Support & Documentation

- **Architecture Decisions**: See `/docs/ARCHITECTURE_DECISION_RECORD_*.md`
- **Type Definitions**: See `/types/*.ts`
- **Examples**: See `/docs/examples/`
- **Changelog**: See `CHANGELOG.md`

---

**Document Version**: 1.0.0
**Last Reviewed**: 2026-01-19
**Next Review**: 2026-02-19
