# ADR 005: Module Organization and Barrel Exports

## Status
Accepted

## Context
The codebase needed clear module boundaries to prevent:
1. Circular dependencies
2. Deep import paths (`@/lib/component/subpath/feature`)
3. Unclear public APIs
4. Tight coupling between modules

## Decision
Implement **Barrel Export Pattern** with clear module boundaries.

### Directory Structure
```
scalesite/
├── components/          # UI components
│   ├── dashboard/      # Dashboard components
│   ├── auth/           # Auth-specific components
│   └── index.ts        # Barrel export
├── contexts/           # React contexts
│   ├── auth/          # Refactored auth module
│   ├── notifications/ # Notifications module
│   └── index.ts       # Barrel export
├── lib/               # Utilities and business logic
│   ├── patterns/      # Design patterns
│   ├── repositories/  # Data access
│   ├── routing/       # Route management
│   └── index.ts       # Barrel export
└── types/             # TypeScript types
```

### Barrel Export Pattern
```typescript
// lib/routing/index.ts
/**
 * Routing Module - Barrel Export
 * Clean public API for the routing subsystem
 */

export { RouterFactory, routerFactory } from './RouterFactory';
export { RouteRenderer, routeRenderer } from './RouteRenderer';
export type { RouteConfig, RouteContext, IRouterFactory } from './RouteTypes';
```

### Import Conventions

#### ✅ Good: Barrel exports
```typescript
import { routerFactory, routeRenderer } from '@/lib/routing';
import { AuthProvider, useAuth } from '@/contexts';
import { Layout, Hero } from '@/components';
```

#### ❌ Bad: Deep imports
```typescript
import { RouterFactory } from '@/lib/routing/RouterFactory';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { Hero } from '@/components/Hero';
```

### Module Boundary Rules
1. **Components → Contexts**: Allowed (UI depends on state)
2. **Components → Lib**: Allowed (UI depends on utilities)
3. **Contexts → Lib**: Allowed (state depends on utilities)
4. **Lib → Components**: **Forbidden** (utilities don't depend on UI)
5. **Lib → Contexts**: **Forbidden** (utilities don't depend on state)

### Dependency Graph
```
┌─────────────┐
│ Components  │ ────────┐
└─────────────┘         │
       │                │
       ▼                ▼
┌─────────────┐   ┌─────────────┐
│  Contexts   │◄──│     Lib     │
└─────────────┘   └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Database   │
                   └─────────────┘
```

### Benefits
1. **Clean Imports**: Short, clear import paths
2. **Encapsulation**: Implementation details hidden
3. **Refactoring**: Can change internal structure without breaking imports
4. **Tree Shaking**: Better dead code elimination
5. **Documentation**: Barrel files serve as module documentation

### Circular Dependency Prevention
```typescript
// Use type-only imports to break circular dependencies
import type { IUser } from '@/contexts/auth/AuthTypes';

// Or use interfaces
export interface IUserDataService {
  getUser(id: string): Promise<IUser>;
}
```

### Module Index Template
```typescript
/**
 * [Module Name] - Barrel Export
 *
 * PURPOSE: [What this module does]
 * ARCHITECTURE: [Key patterns used]
 * VERSION: [Version info]
 */

// ============================================================================
// [Category 1]
// ============================================================================

export { Item1, Item2 } from './file1';

// ============================================================================
// [Category 2]
// ============================================================================

export * from './file2';
```

## Consequences
- **Positive**: Cleaner import statements
- **Positive**: Better encapsulation
- **Positive**: Easier refactoring
- **Negative**: More files to maintain
- **Mitigation**: Clear documentation and examples

## Best Practices
1. **One Index Per Module**: Every major directory needs an index.ts
2. **Organize by Category**: Group exports logically
3. **Export Types**: Don't forget type exports
4. **Document**: Add JSDoc comments to barrel files
5. **Re-export**: Can re-export from sub-modules

## Related
- [Barrel Export Pattern](https://basarat.gitbook.io/typescript/main-1/barrel)
- [ADR 001: Auth Context Refactoring](./001-auth-context-refactoring.md)
- [ADR 002: Route Factory Pattern](./002-route-factory-pattern.md)
