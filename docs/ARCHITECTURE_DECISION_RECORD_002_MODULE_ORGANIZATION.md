# Architecture Decision Record 002: Enterprise Module Organization

## Status
PROPOSED

## Date
2026-01-19 (Loop 17/Phase 5)

## Context
Current module organization lacks clear boundaries and dependency direction. This leads to:
- Circular dependencies (42 found)
- Tight coupling between UI layers
- Difficult onboarding for new developers
- Unclear ownership and responsibilities

### Current Structure Issues
```
❌ ANTI-PATTERN:
components/
  ├── index.ts (exports everything)
  ├── Layout.tsx (imports from index.ts ❌)
  └── dashboard/
      ├── DashboardLayout.tsx (imports from pages ❌)
      └── Overview.tsx (imports from pages ❌)

pages/
  └── DashboardPage.tsx (imports from components ✅)
```

## Decision
Implement **Layered Architecture** with clear dependency rules and module boundaries.

### Target Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│                   (pages/*Page.tsx)                  │
│  Orchestration only, no business logic              │
└──────────────────┬──────────────────────────────────┘
                   │ imports types, components
                   │
┌──────────────────▼──────────────────────────────────┐
│                      Types Layer                     │
│                    (types/*.ts)                      │
│  Shared contracts, zero dependencies                 │
└──────────────────┬──────────────────────────────────┘
                   │ imports
                   │
┌──────────────────▼──────────────────────────────────┐
│                   Components Layer                   │
│                (components/*.tsx)                    │
│  Reusable UI, no page knowledge                     │
└──────────────────┬──────────────────────────────────┘
                   │ imports
                   │
┌──────────────────▼──────────────────────────────────┐
│                   Business Logic Layer               │
│                    (lib/*.ts)                        │
│  Services, utilities, patterns                       │
└──────────────────┬──────────────────────────────────┘
                   │ imports
                   │
┌──────────────────▼──────────────────────────────────┐
│                   Data Layer                         │
│          (lib/api-modules/, contexts/)               │
│  External integrations, state management             │
└─────────────────────────────────────────────────────┘
```

### Module Categories

#### 1. **Domain Modules** (Feature-based)
```
components/
├── auth/           # Authentication UI
├── dashboard/      # Dashboard feature
├── billing/        # Billing feature
├── projects/       # Project management
├── newsletter/     # Newsletter feature
└── analytics/      # Analytics feature
```

**Rules:**
- Each module is self-contained
- No cross-module imports (use shared types/lib)
- Each module has its own `index.ts` barrel export

#### 2. **Shared Modules** (Horizontal)
```
components/
├── ui/             # Generic UI components (Button, Input, etc.)
├── forms/          # Form-related components
├── layout/         # Layout components (Header, Footer, etc.)
└── feedback/       # Feedback components (Toast, Modal, etc.)
```

**Rules:**
- No domain-specific logic
- Highly reusable
- Feature modules can import these

#### 3. **Type Definition Modules**
```
types/
├── index.ts        # Barrel export
├── common.ts       # Shared types
├── auth.ts         # Auth types
├── dashboard.ts    # Dashboard types
├── billing.ts      # Billing types
└── api.ts          # API response types
```

**Rules:**
- NO imports from other modules
- Pure TypeScript types and interfaces
- Export from barrel for convenience

### Dependency Rules

#### ✅ ALLOWED Dependencies
```
pages → types
pages → components
pages → lib

components → types
components → lib
components → components (shared modules only)

lib → types
lib → lib (utilities only)
```

#### ❌ FORBIDDEN Dependencies
```
components → pages
types → anything
lib → components
lib → pages
```

### Implementation Strategy

#### Phase 1: Type Extraction (Days 1-2)
```typescript
// types/dashboard.ts - Extract shared dashboard types
export type DashboardView =
  | 'übersicht'
  | 'ticket-support'
  | 'dienstleistungen'
  | 'transaktionen'
  | 'einstellungen'
  | 'analytics';

export interface DashboardState {
  activeView: DashboardView;
  sidebarOpen: boolean;
}

export interface DashboardProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  setCurrentPage: (page: string) => void;
}
```

#### Phase 2: Component Decoupling (Days 3-4)
```typescript
// components/dashboard/DashboardLayout.tsx
import type { DashboardProps } from '../../../types/dashboard';

// BEFORE: import from pages ❌
// import type { DashboardView } from '../../../pages/DashboardPage';

// AFTER: import from types ✅
import type { DashboardProps } from '../../../types/dashboard';
```

#### Phase 3: Barrel Export Optimization (Day 5)
```typescript
// components/dashboard/index.ts
// Only export public API
export { default as DashboardLayout } from './DashboardLayout';
export type { DashboardProps } from './DashboardLayout';

// Don't re-export internal dependencies
// export { something } from './utils'; ❌
```

### File Naming Conventions

```
Feature Components:
  - PascalCase for component files: DashboardLayout.tsx
  - camelCase for utilities: dashboardUtils.ts
  - kebab-case for styles: dashboard-styles.css

Shared Components:
  - Group by function: ui/, forms/, layout/
  - Clear, descriptive names: PrimaryButton.tsx

Type Files:
  - Match feature name: dashboard.ts, auth.ts
  - Singular for shared: common.ts
```

### Import Path Rules

```typescript
// ✅ GOOD - Absolute paths with clear hierarchy
import { Button } from '@/components/ui/Button';
import type { DashboardProps } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

// ❌ BAD - Relative path hell
import { Button } from '../../../components/ui/Button';
import type { DashboardProps } from '../pages/DashboardPage';
```

**Update tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/types/*": ["./types/*"],
      "@/lib/*": ["./lib/*"],
      "@/contexts/*": ["./contexts/*"],
      "@/pages/*": ["./pages/*"]
    }
  }
}
```

## Module Communication Patterns

### 1. **Props drilling for direct children**
```typescript
// Parent passes data to child
<DashboardLayout activeView={activeView} setActiveView={setActiveView}>
  <DashboardContent />
</DashboardLayout>
```

### 2. **Context for deep trees**
```typescript
// Auth context available everywhere
const { user } = useAuth();
```

### 3. **Event Bus for cross-feature communication**
```typescript
// Using Observer pattern
import { EventBus, AppEventType } from '@/lib/patterns';

EventBus.getInstance().publish(AppEventType.USER_LOGIN, userData);
```

### 4. **Service layer for business logic**
```typescript
// Services orchestrate, don't hold state
import { billingService } from '@/lib/services/billing';

const invoice = await billingService.generateInvoice(orderId);
```

## Validation & Enforcement

### 1. ESLint Rules
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-cycle': 'error',
    'import/no-cycle': 'error',
    'import/no-relative-parent-imports': 'error',
  },
};
```

### 2. Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
npx madge --circular --extensions ts,tsx . || {
  echo "❌ Circular dependencies detected!"
  exit 1
}
```

### 3. CI/CD Check
```yaml
# .github/workflows/ci.yml
- name: Check circular dependencies
  run: npx madge --circular --extensions ts,tsx .
```

## Consequences

### Positive
- **Clear ownership**: Each module has a single responsibility
- **Independent testing**: Test modules in isolation
- **Parallel development**: Teams work on different modules without conflicts
- **Easy onboarding**: New developers understand structure quickly
- **Better performance**: Optimized bundle splitting

### Negative
- **Initial refactoring**: 3-5 days of migration work
- **More files**: Additional type modules and facades
- **Discipline required**: Team must follow rules

### Migration Timeline
- **Week 1**: Type extraction, update tsconfig.json
- **Week 2**: Component decoupling, remove self-imports
- **Week 3**: Documentation, team training
- **Week 4**: Validation, linting, CI/CD integration

## Examples

### Before (Anti-pattern)
```typescript
// components/Layout.tsx
import { Header, Footer } from './index'; // ❌ Self-import

// components/dashboard/DashboardLayout.tsx
import type { DashboardView } from '../../../pages/DashboardPage'; // ❌ Wrong direction
```

### After (Correct)
```typescript
// components/Layout.tsx
import { Header } from './Header';
import { Footer } from './Footer'; // ✅ Direct imports

// components/dashboard/DashboardLayout.tsx
import type { DashboardView } from '../../../types/dashboard'; // ✅ Correct direction

// pages/DashboardPage.tsx
import type { DashboardView } from '../../types/dashboard'; // ✅ Shared types
```

## References
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Module Patterns](https://reactpatterns.com/)
- [Module Boundaries in TypeScript](https://basarat.gitbook.io/typescript/main-1/moduleboundary)

## Authors
Senior Software Architect (Loop 17/Phase 5)

## Related Decisions
- ADR-001: Circular Dependencies
- ADR-003: Barrel Export Strategy
