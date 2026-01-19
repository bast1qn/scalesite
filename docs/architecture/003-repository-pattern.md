# ADR 003: Repository Pattern for Data Access

## Status
Accepted

## Context
Data access logic was scattered across components, leading to:
1. **Tight Coupling**: Components directly using Supabase client
2. **Code Duplication**: Same queries in multiple places
3. **Testing Issues**: Cannot mock data layer easily
4. **Vendor Lock-in**: Direct Supabase dependencies everywhere

## Decision
Implement **Repository Pattern** with **Dependency Inversion** to abstract data access.

### Architecture
```
lib/repositories/
├── interfaces.ts        # Repository interfaces (DIP)
├── BaseRepository.ts    # Base implementation with caching
├── RepositoryFactory.ts # Factory pattern (Singleton)
├── UserProfileRepository.ts  # Concrete implementation
└── index.ts            # Barrel export
```

### Implementation

#### Interface (Dependency Inversion)
```typescript
export interface IUserProfileRepository {
  findById(id: string): Promise<UserProfile | null>;
  findByUserId(userId: string): Promise<UserProfile | null>;
  create(profile: CreateUserProfileDTO): Promise<UserProfile>;
  update(id: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  delete(id: string): Promise<boolean>;
}
```

#### Base Repository (Template Method)
```typescript
export abstract class BaseRepository<T, ID = string> {
  protected cache: Map<ID, T> = new Map();

  async findById(id: ID): Promise<T | null> {
    // Check cache first
    const cached = this.getCached(id);
    if (cached) return cached;

    // Delegate to implementation
    const entity = await this.findByIdImpl(id);

    // Cache result
    if (entity) this.setCached(id, entity);

    return entity;
  }

  // Abstract methods for concrete implementations
  protected abstract findByIdImpl(id: ID): Promise<T | null>;
}
```

#### Factory Pattern (Singleton)
```typescript
export class RepositoryFactory {
  private static instance: RepositoryFactory;

  public static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  public getUserProfileRepository(): IUserProfileRepository {
    if (!this.userProfileRepo) {
      this.userProfileRepo = new UserProfileRepository();
    }
    return this.userProfileRepo;
  }
}
```

### Key Patterns
1. **Repository Pattern**: Abstract data access
2. **Dependency Inversion**: Depend on interfaces, not implementations
3. **Template Method**: Base repository with extendable hooks
4. **Singleton Pattern**: Single factory instance
5. **Strategy Pattern**: Query builder for complex queries

### Features
1. **Caching**: Built-in cache with TTL
2. **Query Builder**: Type-safe query construction
3. **Error Handling**: Consistent error management
4. **Type Safety**: Full TypeScript support
5. **Testability**: Easy to mock for testing

### Usage Example
```typescript
// Instead of direct Supabase calls
const { data } = await supabase.from('user_profiles').select('*');

// Use repository
const factory = getRepositoryFactory();
const repo = factory.getUserProfileRepository();
const profile = await repo.findByUserId(userId);
```

### Benefits
1. **Abstraction**: Components don't know data source
2. **Testability**: Easy to mock repositories
3. **Caching**: Built-in performance optimization
4. **Vendor Independence**: Can swap Supabase without changing components
5. **Type Safety**: Compile-time type checking

## Consequences
- **Positive**: Clean separation of concerns
- **Positive**: Improved testability
- **Positive**: Easy to swap data sources
- **Negative**: More boilerplate for simple queries
- **Mitigation**: BaseRepository provides common functionality

## Best Practices
1. **One Repository Per Entity**: User, Project, Ticket, etc.
2. **Interface Segregation**: Small, focused interfaces
3. **Dependency Injection**: Pass interfaces to services/components
4. **Caching Strategy**: Set appropriate TTL for your use case

## Related
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [ADR 001: Auth Context Refactoring](./001-auth-context-refactoring.md)
