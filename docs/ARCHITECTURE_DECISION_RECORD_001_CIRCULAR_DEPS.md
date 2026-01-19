# Architecture Decision Record 001: Circular Dependencies

## Status
ACCEPTED

## Date
2026-01-19 (Loop 17/Phase 5)

## Context
The codebase analysis revealed **42 circular dependencies**, which is a critical architectural anti-pattern that causes:
- Tight coupling between modules
- Difficult testing and mocking
- Potential runtime errors
- Bundle size inflation
- Maintenance nightmare

### Root Causes Identified
1. **Self-referencing barrel exports**: Components import from their own `index.ts`
2. **Bidirectional dependencies**: `DashboardLayout` ←→ `DashboardPage`
3. **Missing abstraction layers**: Direct component-to-component dependencies

## Decision
Implement **Dependency Inversion Principle** with clean module boundaries.

### Solution Strategy

#### 1. Eliminate Self-Referencing Imports
**BEFORE (Anti-pattern):**
```tsx
// components/AfterHandoverSection.tsx
import { AnimatedSection } from './index';
```

**AFTER (Correct):**
```tsx
// components/AfterHandoverSection.tsx
import { AnimatedSection } from './AnimatedSection';
```

#### 2. Create Shared Types Module
Extract shared types to break circular dependencies:

```typescript
// types/dashboard.ts
export type DashboardView = 'übersicht' | 'ticket-support' | ...;

// components/dashboard/DashboardLayout.tsx
import type { DashboardView } from '../../../types/dashboard';

// pages/DashboardPage.tsx
import type { DashboardView } from '../types/dashboard';
```

#### 3. Implement Facade Pattern
Create a clean API layer:

```typescript
// lib/dashboard/index.ts (Facade)
export const dashboardViews = {
  overview: () => import('../components/dashboard/Overview'),
  support: () => import('../components/dashboard/TicketSupport'),
  // ...
};

export type { DashboardView } from '../../types/dashboard';
```

#### 4. Module Boundary Rules
```
┌─────────────────────────────────────────┐
│              pages/                     │
│  (Orchestrators, no logic)              │
└──────────────┬──────────────────────────┘
               │
               │ imports types only
               │
┌──────────────▼──────────────────────────┐
│           types/                        │
│  (Shared contracts, no deps)            │
└──────────────┬──────────────────────────┘
               │
               │ imports
               │
┌──────────────▼──────────────────────────┐
│         components/                     │
│  (UI logic, no page deps)               │
└─────────────────────────────────────────┘
```

## Implementation Steps

### Phase 1: Extract Types (HIGH PRIORITY)
1. Move all shared types to `/types` directory
2. Update imports across codebase
3. Verify with TypeScript compiler

### Phase 2: Fix Self-References
1. Find all `from './index'` imports in component files
2. Replace with direct imports
3. Keep barrel exports for external consumers only

### Phase 3: Break Bidirectional Dependencies
1. Identify circular pairs (DashboardLayout ↔ DashboardPage)
2. Extract shared logic to separate services
3. Use dependency injection

### Phase 4: Validation
1. Run `npx madge --circular` to verify zero circular deps
2. Update linting rules to prevent future circular deps
3. Add pre-commit hook

## Consequences

### Positive
- **Zero circular dependencies**
- **Better testability** (easy to mock dependencies)
- **Smaller bundle sizes** (better tree-shaking)
- **Faster builds** (TypeScript compiler optimizations)
- **Clearer architecture** (explicit dependency flow)

### Negative
- **Initial refactoring cost** (~2-3 days)
- **Learning curve** for team members
- **More files** (additional type modules)

### Migration Plan
1. **Week 1**: Extract types, fix self-references (20 files/day)
2. **Week 2**: Break bidirectional dependencies, add validation
3. **Week 3**: Documentation, team training, code review

## Alternatives Considered

### Alternative 1: Barrel Files Only
**Rejected**: Doesn't solve the root cause, just hides it

### Alternative 2: Monorepo with Separate Packages
**Rejected**: Overkill for current project size, adds complexity

### Alternative 3: Dynamic Imports Everywhere
**Rejected**: Hides dependencies at runtime, breaks TypeScript advantages

## References
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Madge - Circular Dependency Checker](https://github.com/pahen/madge)

## Authors
Senior Software Architect (Loop 17/Phase 5)

## Related Decisions
- ADR-002: Module Organization Strategy
- ADR-003: Testing Architecture
