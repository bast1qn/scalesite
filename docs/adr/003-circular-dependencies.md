# ADR 003: Circular Dependency Resolution

## Status
**Accepted** (with ongoing mitigation)

## Date
2026-01-19 (Loop 19/200 - Phase 5)

## Context
During architectural analysis, **madge** detected **42 circular dependency chains** in the codebase. Circular dependencies create tight coupling, make code harder to understand, and can cause runtime issues.

### Problems Identified
1. **Tight Coupling**: Modules depend on each other, making changes risky
2. **Hard to Test**: Circular dependencies complicate unit testing
3. **Runtime Issues**: Can cause initialization order problems
4. **Build Complexity**: Makes bundling and tree-shaking less effective
5. **Code Comprehension**: Difficult to understand dependency flow

### Detected Circular Dependencies (42 chains)

#### Category 1: Barrel Export Circles (14 chains)
**Pattern**: `components/index.ts` → individual components → `components/index.ts`

```typescript
// components/index.ts
export * from './AfterHandoverSection';
export * from './BlogSection';
// ... exports all components

// AfterHandoverSection.tsx
import { Something } from './index'; // ❌ Circular!
```

**Impact**: Low (barrel exports, but creates implicit dependency)
**Severity**: Minor

#### Category 2: Dashboard Circular Imports (10 chains)
**Pattern**: Dashboard components import from pages, pages import from dashboard

```typescript
// pages/DashboardPage.tsx
import { DashboardLayout } from '../components/dashboard/DashboardLayout';

// components/dashboard/DashboardLayout.tsx
import { Something } from '../../pages/DashboardPage'; // ❌ Circular!
```

**Impact**: Medium (actual component dependencies)
**Severity**: Moderate

#### Category 3: SEO Components (2 chains)
**Pattern**: Structured data components importing from parent

```typescript
// components/seo/StructuredData.tsx
import { SchemaFormFields } from './structured-data/SchemaFormFields';

// components/seo/structured-data/SchemaFormFields.tsx
import { Something } from '../StructuredData'; // ❌ Circular!
```

**Impact**: Medium
**Severity**: Moderate

#### Category 4: Onboarding Wizard (3 chains)
**Pattern**: Wizard steps import wizard, wizard imports steps

```typescript
// components/onboarding/OnboardingWizard.tsx
import { BasicInfoStep } from './BasicInfoStep';

// components/onboarding/BasicInfoStep.tsx
import { OnboardingWizard } from './OnboardingWizard'; // ❌ Circular!
```

**Impact**: High (parent-child coupling)
**Severity**: High

#### Category 5: Configurator Components (4 chains)
**Pattern**: Configurator components importing each other

```typescript
// components/configurator/Configurator.tsx
import { ContentEditor } from './ContentEditor';

// components/configurator/ContentEditor.tsx
import { Configurator } from './Configurator'; // ❌ Circular!
```

**Impact**: High (tight component coupling)
**Severity**: High

#### Category 6: Protected Route Circle (1 chain)
**Pattern**: Deep circular through multiple files

```typescript
components/index.ts
  → components/NewsletterSection.tsx
    → lib/index.ts
      → lib/ProtectedRoute.tsx
        → pages/DashboardPage.tsx
          → components/dashboard/DashboardLayout.tsx
            → components/index.ts ❌ Complete circle!
```

**Impact**: Very High (cross-layer circular dependency)
**Severity**: Critical

## Decision
Apply **Dependency Inversion Principle** and **introduce abstraction layers** to break circular dependencies.

### Resolution Strategies

#### Strategy 1: Extract Shared Interfaces (High Priority)
Create shared type definitions to remove implementation dependencies:

**Before**:
```typescript
// OnboardingWizard.tsx
import { BasicInfoStep } from './BasicInfoStep';

// BasicInfoStep.tsx
import { OnboardingWizard } from './OnboardingWizard';
```

**After**:
```typescript
// onboarding/types.ts
export interface OnboardingStepProps {
  onNext: () => void;
  onPrev: () => void;
  // ... shared props
}

// OnboardingWizard.tsx
import type { OnboardingStepProps } from './types';

// BasicInfoStep.tsx
import type { OnboardingStepProps } from './types';
// No longer imports OnboardingWizard!
```

#### Strategy 2: Use React Context for Parent-Child Communication
Replace direct parent imports with context:

**Before**:
```typescript
// Configurator.tsx
export function Configurator() { ... }

// ContentEditor.tsx
import { Configurator } from './Configurator';
function ContentEditor() {
  const configurator = useContext(ConfiguratorContext); // ❌ Still circular
}
```

**After**:
```typescript
// configurator/context.ts
export const ConfiguratorContext = createContext<ConfiguratorValue>(null);

// Configurator.tsx
import { ConfiguratorProvider } from './context';
export function Configurator() {
  return (
    <ConfiguratorProvider value={...}>
      {children}
    </ConfiguratorProvider>
  );
}

// ContentEditor.tsx
import { ConfiguratorContext } from './context'; // ✅ No direct import!
function ContentEditor() {
  const context = useContext(ConfiguratorContext);
}
```

#### Strategy 3: Lift State Up (For Dashboard Components)
Move shared state to common ancestor:

**Before**:
```typescript
// pages/DashboardPage.tsx
import { DashboardLayout } from '../components/dashboard/DashboardLayout';

// components/dashboard/DashboardLayout.tsx
import { Something } from '../../pages/DashboardPage';
```

**After**:
```typescript
// contexts/DashboardContext.tsx
export const DashboardContext = createContext(...);

// pages/DashboardPage.tsx
import { DashboardProvider } from '../../contexts/DashboardContext';

// components/dashboard/DashboardLayout.tsx
import { DashboardContext } from '../../../contexts/DashboardContext'; // ✅
```

#### Strategy 4: Create Service Layer (For Protected Route)
Extract business logic to separate services:

**Before**:
```typescript
// lib/ProtectedRoute.tsx
import { useAuth } from '../pages/DashboardPage'; // ❌ Cross-layer import
```

**After**:
```typescript
// lib/services/auth.ts
export function useAuthService() {
  // Auth logic here
}

// lib/ProtectedRoute.tsx
import { useAuthService } from './services/auth'; // ✅ Service layer

// pages/DashboardPage.tsx
import { useAuthService } from '../../lib/services/auth'; // ✅ Both use service
```

#### Strategy 5: Barrel Exports Cleanup (Low Priority)
Remove circular barrel exports by being explicit:

**Before**:
```typescript
// components/index.ts
export * from './AfterHandoverSection';
export * from './BlogSection';

// AfterHandoverSection.tsx
import { Something } from './index'; // ❌ Barrel circle
```

**After**:
```typescript
// AfterHandoverSection.tsx
import { Something } from './SpecificComponent'; // ✅ Explicit import
```

## Implementation Plan

### Phase 1: Critical Circles (Immediate) ✅
1. **Protected Route Circle**:
   - Create `lib/services/auth.ts`
   - Move auth logic to service layer
   - Update `ProtectedRoute.tsx` to use service

2. **Onboarding Wizard Circle**:
   - Extract `onboarding/types.ts`
   - Create `OnboardingContext`
   - Update wizard steps to use context

### Phase 2: High Severity (Short-term)
3. **Configurator Components**:
   - Create `ConfiguratorContext`
   - Remove direct component imports

4. **Dashboard Circles**:
   - Create `DashboardContext`
   - Lift shared state to page level

### Phase 3: Medium Severity (Medium-term)
5. **SEO Components**:
   - Extract shared types
   - Create `SEOContext` if needed

6. **Barrel Exports**:
   - Audit and remove circular barrel imports
   - Enforce explicit imports rule

### Phase 4: Prevention (Long-term)
7. **Add CI/CD Check**:
   ```bash
   # Add to package.json scripts
   "scripts": {
     "check:circular": "madge --circular --extensions ts,tsx components pages lib"
   }
   ```

8. **ESLint Rule**:
   ```json
   {
     "rules": {
       "import/no-cycle": "error"
     }
   }
   ```

9. **Documentation**:
   - Add architecture guidelines
   - Create dependency diagram
   - Document allowed import paths

## Consequences

### Positive
✅ **Loose Coupling**: Components depend on abstractions, not implementations
✅ **Testability**: Easy to mock dependencies for unit tests
✅ **Maintainability**: Clear dependency direction, easier to refactor
✅ **Scalability**: Can add new features without creating circles
✅ **Build Performance**: Better tree-shaking, smaller bundles

### Negative
⚠️ **Initial Effort**: Requires refactoring existing code
⚠️ **Context Overhead**: More context providers to manage
⚠️ **Learning Curve**: Team needs to understand new patterns

### Neutral
⚖️ **Code Volume**: Slight increase due to abstraction layers (but higher quality)

## Success Metrics
- **Before**: 42 circular dependency chains
- **After Target**: 0 circular dependency chains
- **Measurement**: `npx madge --circular components/ pages/ lib/`

## Alternatives Considered

### Alternative 1: Ignore Circles
**Rejected**: Creates technical debt, makes future changes risky

### Alternative 2: Use Dependency Injection Framework
**Rejected**: Over-engineering for React application, adds bundle size

### Alternative 3: Async Import (Lazy Loading)
**Rejected**: Doesn't solve architecture problem, just delays issues

### Alternative 4: Monolithic File Structure
**Rejected**: Goes against modular architecture principles

## Best Practices Applied

1. **Dependency Inversion Principle**: Depend on abstractions
2. **Shared Kernel Pattern**: Extract common interfaces/types
3. **Service Layer Pattern**: Separate business logic from UI
4. **Context Pattern**: React's recommended way to share state
5. **Explicit Imports**: Avoid barrel export circles

## References
- [Circular Dependency Detection](https://github.com/pahen/madge)
- **Dependency Inversion Principle**: SOLID principles
- [React Context Best Practices](https://react.dev/reference/react/useContext)
- [ESLint import/no-cycle](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md)

## Related Decisions
- ADR 001: API Modules Refactoring (reduces circles through modularization)
- ADR 002: Translations Domain Separation (prevents future circles)

## Authors
**Senior Software Architect (Claude)**
**Loop**: 19/200 - Phase 5 (CLEANUP TIME)
**Date**: 2026-01-19

---

## Appendix: Full Circular Dependency List

See `madge` output in the analysis section for complete list of 42 detected circular dependencies.
