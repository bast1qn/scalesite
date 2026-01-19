# Architecture Decision Record 003: SOLID Principles Compliance

## Status
ACCEPTED

## Date
2026-01-19 (Loop 17/Phase 5)

## Context
The codebase shows good foundation with design patterns but lacks systematic SOLID enforcement. This leads to:
- God objects (components doing too much)
- Tight coupling
- Difficult testing
- Maintenance overhead

### Current Issues Found
1. **Components with multiple responsibilities** (UI + API calls + state management)
2. **Direct dependencies on concrete implementations** (not interfaces)
3. **Open/Closed violations** (modifying existing code for new features)
4. **Interface segregation violations** (bloated context APIs)

## Decision
Enforce **SOLID principles** systematically across all modules.

### 1. Single Responsibility Principle (SRP)

**Definition**: A class/module should have one reason to change.

#### ❌ Violation Example
```typescript
// components/dashboard/Overview.tsx
export default function Overview() {
  // ❌ 1. UI rendering
  // ❌ 2. Data fetching
  // ❌ 3. State management
  // ❌ 4. Business logic
  // ❌ 5. Error handling

  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return <div>{/* complex UI */}</div>;
}
```

#### ✅ Correct Implementation
```typescript
// hooks/useDashboardData.ts (Data fetching)
export function useDashboardData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    dashboardService.getOverview()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// services/dashboardService.ts (Business logic)
class DashboardService {
  async getOverview(): Promise<DashboardData> {
    return api.get('/api/dashboard/overview');
  }
}

// components/dashboard/Overview.tsx (UI only)
export default function Overview() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <OverviewSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return <OverviewView data={data} />;
}
```

### 2. Open/Closed Principle (OCP)

**Definition**: Open for extension, closed for modification.

#### ❌ Violation Example
```typescript
// lib/pricing.ts
export function calculatePrice(type: string): number {
  if (type === 'basic') return 100;
  if (type === 'premium') return 200;
  if (type === 'enterprise') return 500;
  // ❌ Must modify this function for new plans
  return 0;
}
```

#### ✅ Correct Implementation (Strategy Pattern)
```typescript
// types/pricing.ts
export interface PricingStrategy {
  calculate(): number;
  getFeatures(): string[];
}

// strategies/BasicPricing.ts
export class BasicPricing implements PricingStrategy {
  calculate(): number { return 100; }
  getFeatures(): string[] { return ['Feature 1', 'Feature 2']; }
}

// strategies/PremiumPricing.ts
export class PremiumPricing implements PricingStrategy {
  calculate(): number { return 200; }
  getFeatures(): string[] { return ['All Basic', 'Feature 3', 'Feature 4']; }
}

// ✅ Add new plans without modifying existing code
export class EnterprisePricing implements PricingStrategy {
  calculate(): number { return 500; }
  getFeatures(): string[] { return ['All Premium', 'Feature 5', 'Feature 6']; }
}
```

### 3. Liskov Substitution Principle (LSP)

**Definition**: Subtypes must be substitutable for their base types.

#### ❌ Violation Example
```typescript
// lib/repositories/MockRepository.ts
export class MockRepository implements IRepository {
  async getAll(): Promise<Project[]> {
    return []; // ❌ Throws if called in production
  }
}
```

#### ✅ Correct Implementation
```typescript
// lib/repositories/IRepository.ts
export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(entity: Omit<T, 'id'>): Promise<T>;
}

// lib/repositories/ApiRepository.ts
export class ApiRepository<T> implements IRepository<T> {
  constructor(private endpoint: string) {}

  async getAll(): Promise<T[]> {
    const response = await fetch(this.endpoint);
    return response.json();
  }
  // ... other methods
}

// lib/repositories/MockRepository.ts
export class MockRepository<T> implements IRepository<T> {
  constructor(private data: T[]) {}

  async getAll(): Promise<T[]> {
    // ✅ Returns consistent mock data
    return this.data;
  }
  // ... other methods
}
```

### 4. Interface Segregation Principle (ISP)

**Definition**: Clients shouldn't depend on interfaces they don't use.

#### ❌ Violation Example
```typescript
// contexts/AuthContext.tsx
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: UserProfile) => Promise<void>;
  deleteAccount: () => Promise<void>;
  // ❌ Too many methods, clients only use subsets
}
```

#### ✅ Correct Implementation
```typescript
// contexts/auth/AuthReader.ts (Read operations)
export interface IAuthReader {
  getUser(): User | null;
  isAuthenticated(): boolean;
  getPermissions(): Permission[];
}

// contexts/auth/AuthWriter.ts (Write operations)
export interface IAuthWriter {
  login(credentials: Credentials): Promise<void>;
  logout(): Promise<void>;
  register(data: RegisterData): Promise<void>;
}

// contexts/auth/PasswordManager.ts (Password operations)
export interface IPasswordManager {
  resetPassword(email: string): Promise<void>;
  changePassword(old: string, new: string): Promise<void>;
}

// contexts/auth/ProfileManager.ts (Profile operations)
export interface IProfileManager {
  updateProfile(data: UserProfile): Promise<void>;
  deleteAccount(): Promise<void>;
}

// ✅ Clients depend only on what they use
function ProfileForm() {
  const profileManager = useProfileManager(); // Only profile methods
  // ...
}

function LoginForm() {
  const authWriter = useAuthWriter(); // Only auth methods
  // ...
}
```

### 5. Dependency Inversion Principle (DIP)

**Definition**: Depend on abstractions, not concretions.

#### ❌ Violation Example
```typescript
// components/dashboard/Overview.tsx
import { supabase } from '../../lib/supabase'; // ❌ Concrete dependency

export default function Overview() {
  useEffect(() => {
    supabase.from('projects').select('*').then(setData);
  }, []);
}
```

#### ✅ Correct Implementation
```typescript
// services/interfaces/IProjectService.ts
export interface IProjectService {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project>;
}

// services/ProjectService.ts
export class ProjectService implements IProjectService {
  constructor(private dataSource: DataSource) {}

  async getProjects(): Promise<Project[]> {
    return this.dataSource.query('projects');
  }
}

// components/dashboard/Overview.tsx
import type { IProjectService } from '@/services/interfaces/IProjectService';

interface OverviewProps {
  projectService: IProjectService; // ✅ Abstract dependency
}

export default function Overview({ projectService }: OverviewProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectService.getProjects().then(setProjects);
  }, [projectService]);

  return <ProjectList projects={projects} />;
}
```

### Dependency Injection Pattern

#### Constructor Injection
```typescript
export class DashboardController {
  constructor(
    private projectService: IProjectService,
    private analyticsService: IAnalyticsService,
    private notificationService: INotificationService
  ) {}
}
```

#### Hook Injection (React)
```typescript
// hooks/useService.ts
export function useService<T>(
  ServiceClass: new (...args: any[]) => T,
  dependencies?: any[]
): T {
  return useMemo(() => new ServiceClass(), dependencies);
}

// Usage
const projectService = useService(ProjectService, [userId]);
```

#### Context Injection
```typescript
// contexts/ServiceContext.tsx
interface ServiceContextValue {
  projectService: IProjectService;
  billingService: IBillingService;
}

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const projectService = useMemo(() => new ProjectService(api), []);
  const billingService = useMemo(() => new BillingService(api), []);

  return (
    <ServiceContext.Provider value={{ projectService, billingService }}>
      {children}
    </ServiceContext.Provider>
  );
};
```

## Compliance Checklist

### Component Level
- [ ] Single responsibility (UI only)
- [ ] Props interface defined separately
- [ ] No direct API calls (use hooks/services)
- [ ] Dependency injection for services

### Service Level
- [ ] Interface defined for every service
- [ ] Single responsibility per service
- [ ] Error handling abstracted
- [ ] Logging abstracted

### Type Level
- [ ] Shared types in `/types`
- [ ] No circular type dependencies
- [ ] Explicit over `any`
- [ ] Proper generics usage

## Testing Strategy

### Unit Tests (Isolated)
```typescript
// __tests__/services/ProjectService.test.ts
describe('ProjectService', () => {
  it('should fetch projects', async () => {
    const mockDataSource = {
      query: jest.fn().mockResolvedValue([mockProject])
    };

    const service = new ProjectService(mockDataSource as any);
    const projects = await service.getProjects();

    expect(projects).toEqual([mockProject]);
  });
});
```

### Integration Tests (Real dependencies)
```typescript
// __tests__/integration/dashboard.test.tsx
describe('Dashboard Integration', () => {
  it('should display overview', async () => {
    render(
      <ServiceProvider services={realServices}>
        <DashboardPage />
      </ServiceProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });
  });
});
```

## Metrics & KPIs

### Code Quality Metrics
- **SRP Score**: Average methods per class (< 10)
- **OCP Score**: New features without modifications (> 80%)
- **LSP Score**: Substitutable interfaces (> 95%)
- **ISP Score**: Average interface methods (< 5)
- **DIP Score**: Abstract dependencies (> 90%)

### Measurement Tools
```bash
# Complexity analysis
npx cr /components

# Dependency analysis
npx madge --image deps.svg

# Circular dependency check
npx madge --circular
```

## Refactoring Strategy

### Phase 1: Interface Extraction (Week 1)
```typescript
// Extract interfaces for all services
export interface IXService { ... }
export interface IYService { ... }
```

### Phase 2: Service Layer Creation (Week 2)
```typescript
// Move business logic from components to services
class XService implements IXService { ... }
```

### Phase 3: Component Refactoring (Week 3)
```typescript
// Components use injected services
function Component({ service }: { service: IXService }) { ... }
```

### Phase 4: Testing & Validation (Week 4)
```typescript
// Add tests for all services and components
describe('XService', () => { ... });
```

## Consequences

### Positive
- **Maintainability**: Each change has local impact
- **Testability**: Easy to mock dependencies
- **Scalability**: Add features without breaking existing code
- **Code reviews**: Clear standards to evaluate

### Negative
- **Initial refactoring**: 3-4 weeks of migration
- **More files**: Interfaces add file count
- **Learning curve**: Team must understand SOLID
- **Overhead**: May feel like "boilerplate" initially

## Examples from Codebase

### Good Examples (Keep)
- `/lib/patterns/`: All design patterns follow SOLID
- `/types/`: Clean type definitions
- `/contexts/`: Well-separated contexts

### Needs Improvement
- Components with API calls → Move to services
- Direct Supabase/Neon imports → Use repository pattern
- Large component files → Split into smaller units

## References
- [SOLID Principles by Robert C. Martin](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Refactoring Guru](https://refactoring.guru/design-patterns/solid)

## Authors
Senior Software Architect (Loop 17/Phase 5)

## Related Decisions
- ADR-001: Circular Dependencies
- ADR-002: Module Organization
- ADR-004: Barrel Export Strategy
