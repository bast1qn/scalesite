# ADR 005: Repository Pattern for Data Access

## Status
Accepted

## Date
2026-01-19

## Context
Currently, components directly call Supabase APIs, creating tight coupling between the presentation layer and the data layer. This violates the Dependency Inversion Principle and makes testing difficult.

### Problems
1. **Tight Coupling**: Components depend directly on Supabase implementation
2. **Testing Difficulties**: Hard to mock Supabase calls in unit tests
3. **Code Duplication**: Similar data access logic scattered across components
4. **Vendor Lock-in**: Difficult to switch from Supabase to another provider
5. **Mixed Concerns**: Business logic mixed with data access logic

## Decision
Implement the Repository Pattern to abstract data access logic.

### Architecture
```
Presentation Layer (Components)
    ↓ depends on interfaces
Repository Layer (IRepository<T>)
    ↓ implemented by
Data Access Layer (SupabaseRepository, MockRepository)
    ↓ accesses
Database (Supabase/Neon/PostgreSQL)
```

### Implementation

#### Base Repository Interface
```typescript
// /lib/repositories/IRepository.ts
export interface IRepository<T> {
  getById(id: string): Promise<T | null>;
  getAll(options?: QueryOptions): Promise<T[]>;
  getPaginated(options: QueryOptions): Promise<PaginatedResult<T>>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  find(criteria: Partial<T>): Promise<T[]>;
  count(criteria?: Partial<T>): Promise<number>;
  // ... more methods
}
```

#### Mock Repository for Testing
```typescript
// /lib/repositories/MockRepository.ts
export class MockRepository<T> implements IRepository<T> {
  // In-memory implementation for testing
  // No database required
}
```

#### Repository Factory
```typescript
// /lib/repositories/IRepository.ts
export class RepositoryFactory {
  static register<T>(name: string, repository: IRepository<T>): void;
  static get<T>(name: string): IRepository<T>;
}
```

### Usage Examples

**Before (Direct Supabase Calls)**:
```typescript
// Component directly calls Supabase
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId);
```

**After (Repository Pattern)**:
```typescript
// Component depends on abstraction
const projectRepository = RepositoryFactory.get<IProject>('project');
const projects = await projectRepository.getByUser(userId);
```

### Benefits
1. ✅ **Decoupling**: Components don't depend on concrete database implementation
2. ✅ **Testing**: Easy to use MockRepository for unit tests
3. ✅ **Flexibility**: Can swap Supabase for Neon, PostgreSQL, etc.
4. ✅ **Consistency**: Standardized data access API
5. ✅ **Caching**: Can add caching layer with CachedRepository decorator
6. ✅ **DIP Adherence**: High-level modules depend on abstractions

### Caching Support
```typescript
const cachedRepo = new CachedRepository(projectRepo, 60000);
const projects = await cachedRepo.getAll(); // Cached for 1 minute
```

## Consequences
**Positive**:
- ✅ Reduced coupling
- ✅ Improved testability
- ✅ Better separation of concerns
- ✅ Easier migration between database providers
- ✅ Consistent data access API

**Negative**:
- ⚠️ Additional abstraction layer
- ⚠️ More boilerplate code
- ⚠️ Initial development overhead

## Migration Strategy
1. ✅ Create repository interfaces and base classes
2. ✅ Implement MockRepository for testing
3. ⏳ Create SupabaseRepository for production
4. ⏳ Migrate components one module at a time
5. ⏳ Add caching where beneficial
6. ⏳ Remove direct Supabase calls from components

## Implementation Status
- ✅ Base repository interface
- ✅ Mock repository implementation
- ✅ Repository factory
- ✅ Cached repository decorator
- ⏳ Supabase/Neon repository implementations
- ⏳ Domain-specific repositories (Project, Ticket, etc.)

## Related Decisions
- [ADR 004: Design Patterns Implementation](./004-design-patterns-implementation.md)
- [ADR 006: Service Layer Architecture](./006-service-layer.md)
- [ADR 003: Database Strategy](./003-database-strategy.md)
