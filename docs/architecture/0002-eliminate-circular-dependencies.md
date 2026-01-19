# ADR 0002: Elimination of Circular Dependencies

## Status
**Accepted**

## Date
2025-01-19

## Context
Architectural analysis revealed critical circular dependencies:

1. **lib/rbac.ts** → **components/team/RoleBadge**
2. **lib/design/index.ts** → **components/design/PremiumStates**
3. **components/dashboard/tickets/TicketChatArea** → **lib/ticket-utils** → components

Circular dependencies cause:
- Build failures
- Runtime errors
- Tight coupling between modules
- Difficult to test and maintain

## Decision
We will eliminate circular dependencies by:

### 1. Centralize Shared Types
**Create:** `types/rbac.ts`

Move shared types from components to a centralized types module:
```typescript
export type TeamRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';
export type PermissionLevel = 'none' | 'read' | 'write';
export type PermissionCategory = 'projects' | 'billing' | 'team' | 'settings' | 'content' | 'analytics';
export interface PermissionConfig { ... }
```

**Benefits:**
- Single source of truth for types
- No import cycles
- Components and lib can both import from types

### 2. Dependency Direction Rule
**Enforce:** Lib → Components is NEVER allowed

```
✅ ALLOWED:
components/team/RoleBadge.tsx → types/rbac.ts
lib/rbac.ts → types/rbac.ts

❌ FORBIDDEN:
lib/rbac.ts → components/team/RoleBadge.tsx
lib/design/index.ts → components/design/PremiumStates.tsx
```

### 3. Module Boundaries
**Establish clear boundaries:**

```
types/          # Shared types (no dependencies)
  ↓
lib/            # Business logic (can import from types)
  ↓
components/     # UI components (can import from types and lib)
```

### 4. Barrel Exports
**Create:** `types/index.ts`

Export all types from a central entry point:
```typescript
export * from './common.types';
export * from './rbac';
```

## Implementation

### Changes Made:

1. **Created `types/rbac.ts`**
   - Moved `TeamRole`, `PermissionLevel`, `PermissionCategory`, `PermissionConfig`
   - Provides single source of truth for RBAC types

2. **Updated `lib/rbac.ts`**
   - Changed imports from `components/team/RoleBadge` to `types/rbac`
   - Eliminated circular dependency

3. **Updated `components/team/RoleBadge.tsx`**
   - Changed to import `TeamRole` from `types/rbac`
   - Maintains component functionality

4. **Updated `components/team/PermissionSelector.tsx`**
   - Changed to import types from `types/rbac`
   - Eliminates duplicate type definitions

5. **Updated `lib/design/index.ts`**
   - Removed component re-exports
   - Added documentation comment explaining import path
   - Eliminated circular dependency

## Consequences

### Positive
- **Zero Circular Dependencies:** All import cycles eliminated
- **Better Separation of Concerns:** Clear module boundaries
- **Improved Testability:** Modules can be tested independently
- **Easier Refactoring:** Changes in one module don't cascade

### Negative
- **Import Path Changes:** Some imports need to be updated
- **Learning Curve:** Team needs to understand dependency rules

### Mitigation
- ESLint rule to prevent lib → components imports
- Documentation of dependency direction rules
- Code review checklist for circular dependencies

## Verification

### How to Detect Circular Dependencies:
```bash
# Using madge
npx madge --circular src/

# Using dependency-cruiser
npx depcruise --validate .dependency-cruiser.js src/
```

### Prevention:
1. ESLint rule: `import/no-cycle`
2. Pre-commit hooks with circular dependency detection
3. Architecture decision records for new modules

## Alternatives Considered

### 1. Allow Circular Dependencies
**Pros:** No refactoring needed
**Cons:** Build failures, runtime errors, tight coupling
**Rejected:** Unacceptable technical debt

### 2. Use Barrel Files Exclusively
**Pros:** Centralized imports
**Cons:** Can hide circular dependencies
**Rejected:** Doesn't solve root cause

## References
- [Circular Dependency Detection](https://www.npmjs.com/package/madge)
- [Dependency Cruiser](https://github.com/sverweij/dependency-cruiser)
- SOLID Principles: Dependency Inversion Principle
