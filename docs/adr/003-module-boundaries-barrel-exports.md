# ADR 003: Module Boundaries & Barrel Exports

## Status
Accepted

## Context
Scalesite hat eine komplexe Modul-Struktur mit **300+ Dateien**. Wir brauchen:
- Klare Modul-Grenzen
- Saubere Import/Export Pfade
- Vermeidung von Circular Dependencies
- Konsistente Barrel Exports

## Current Architecture Analysis

### Existing Barrel Exports
```
lib/
├── index.ts              # Main barrel export
├── hooks/index.ts        # Hooks barrel
├── services/index.ts     # Services barrel
├── patterns/index.ts     # Patterns barrel
├── constants/index.ts    # Constants barrel

components/
├── index.ts              # Main components barrel
├── ui/index.ts           # UI components barrel
├── seo/index.ts          # SEO components barrel
├── pricing/index.ts      # Pricing barrel
├── ai-content/index.ts   # AI content barrel
└── ...
```

### Circular Dependency Issues Found
**33 Circular Dependencies detected:**
- Components importing from their own `index.ts`
- Dashboard components importing from `pages/DashboardPage.tsx`
- SEO components with internal circular references

## Decision

### 1. Module Boundary Rules

#### **Allowed Dependencies:**
```
components/ → lib/ (services, hooks, utils)
pages/ → components/, lib/
lib/ → NO circular deps within lib/

HIGH LEVEL (pages, components)
    ↓ depend on
LOW LEVEL (lib/services, lib/hooks, lib/utils)
```

#### **Forbidden Patterns:**
❌ **Components importing from their own barrel:**
```typescript
// DON'T
import { AnimatedSection } from './index';

// DO
import { AnimatedSection } from './AnimatedSection';
```

❌ **Lib importing from Components:**
```typescript
// DON'T (in lib/)
import { MyComponent } from '../../components/MyComponent';

// DO (lift logic to lib/)
// Move shared logic to lib/utils or lib/hooks
```

### 2. Barrel Export Strategy

#### **When to use Barrel Exports:**
✅ **Use Barrels for:**
- Public API of a module
- Re-exports from subdirectories
- Grouping related functionality
- Simplifying import paths

❌ **Avoid Barrels for:**
- Internal implementation details
- Large files (>100 exports)
- Frequently changing exports

#### **Barrel Structure Template:**
```typescript
// components/example/index.ts

// Public API only
export { ExampleComponent } from './ExampleComponent';
export { useExampleHook } from './useExampleHook';
export type { ExampleProps } from './types';

// DON'T export internals
// export { internalHelper } from './internal';
```

### 3. Import Path Guidelines

#### **Priority Order:**
1. **External Libraries** (react, next, etc.)
2. **Absolute Imports** (`@/lib/...`, `@/components/...`)
3. **Relative Imports** (`./sibling`, `../parent`)

#### **Preferred Import Styles:**
```typescript
// ✅ GOOD: Absolute imports
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';

// ✅ GOOD: Relative for same directory
import { Helper } from './Helper';

// ❌ BAD: Deep relative imports
import { Helper } from '../../../utils/Helper';

// ❌ BAD: Barrel self-import
import { Component } from './index';
```

### 4. Dependency Direction

#### **Dependency Rule:**
```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (pages, components)                    │
└──────────────┬──────────────────────────┘
               │ depend on
┌──────────────▼──────────────────────────┐
│         BUSINESS LOGIC LAYER            │
│  (services, repositories)               │
└──────────────┬──────────────────────────┘
               │ depend on
┌──────────────▼──────────────────────────┐
│         FOUNDATION LAYER                │
│  (utils, constants, types, patterns)    │
└─────────────────────────────────────────┘
```

**No backward dependencies allowed!**

### 5. Circular Dependency Prevention

#### **Detection:**
```bash
# Run circular dependency check
npm run check:circular
# or
npx madge --circular --extensions ts,tsx lib/ components/
```

#### **Resolution Strategies:**

1. **Extract Common Dependency:**
```typescript
// BEFORE: Circular
// A.ts → B.ts → A.ts

// AFTER: Extract
// A.ts → Common.ts ← B.ts
```

2. **Dependency Injection:**
```typescript
// Pass dependencies as parameters
class A {
  constructor(private b: IB) {}
}
```

3. **Event Bus (Observer Pattern):**
```typescript
// Decouple using events
eventBus.emit('A_CHANGED', data);
eventBus.on('A_CHANGED', () => { /* B's logic */ });
```

## Implementation

### ESLint Rule for Import Order:
```json
{
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index"
        ],
        "newlines-between": "always",
        "alphabetize": { "order": "asc" }
      }
    ],
    "no-cycle": "error"
  }
}
```

### Automated Fixes:
```bash
# Run this in CI/CD
npm run lint:circular
```

## Migration Plan

### Phase 1: Fix Critical Circularity (DONE)
- [x] Run madge to detect all circular dependencies
- [x] Document all 33 circular deps
- [x] Fix component self-imports

### Phase 2: Establish Boundaries (TODO)
- [ ] Document all module boundaries
- [ ] Create dependency diagram
- [ ] Add ESLint rules

### Phase 3: Monitor (TODO)
- [ ] Add circular dependency check to CI/CD
- [ ] Pre-commit hooks for import order
- [ ] Regular architecture audits

## Benefits

### ✅ Positive Consequences:
- **No Runtime Errors**: Circular dependencies cause crashes
- **Better Tree Shaking**: Clearer dependencies
- **Faster Builds**: No dependency resolution issues
- **Easier Refactoring**: Clear dependency direction
- **Better Testing**: Mock dependencies easily

### ⚠️ Trade-offs:
- **Stricter Rules**: More discipline required
- **Initial Effort**: Fixing existing circular deps takes time
- **Import verbosity**: Direct imports can be longer

## References
- [Webpack Circular Dependencies](https://webpack.js.org/guides/code-splitting/#circular-dependencies)
- [Madge Documentation](https://github.com/pahen/madge)
- [Module Boundaries in TypeScript](https://basarat.gitbook.io/typescript/main-1/module)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

## Date
2026-01-19

## Author
Senior Software Architect (Loop 20/Phase 5)
