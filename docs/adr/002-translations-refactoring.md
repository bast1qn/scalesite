# ADR 002: Translations Domain Separation

## Status
**Accepted**

## Date
2026-01-19 (Loop 19/200 - Phase 5)

## Context
The original `lib/translations.ts` file contained **1847 lines** with all translations for both German (de) and English (en) in a single monolithic object. This created maintenance challenges.

### Problems Identified
1. **Large File Size**: 1847 LOC with nested translation objects
2. **Poor Organization**: All domains (auth, nav, general, etc.) mixed together
3. **Hard to Navigate**: Finding specific translations required scrolling through large file
4. **Merge Conflicts**: Multiple developers editing same file
5. **No Type Safety**: Nested objects made it hard to track available translation keys

### Existing Structure (Before)
```
lib/
  translations.ts (1847 LOC) ❌
    export const translations = {
      de: {
        general: { ... },
        nav: { ... },
        auth: { ... },
        validation: { ... },
        errors: { ... },
        ... 900+ lines
      },
      en: {
        general: { ... },
        nav: { ... },
        auth: { ... },
        ... 900+ lines
      }
    }
```

## Decision
Split translations into **domain-specific modules** following **Domain-Driven Design (DDD)** principles.

### New Structure (After)
```
lib/translations/
  index.ts          # Barrel export & legacy compatibility
  general.ts        # General UI translations
  navigation.ts     # Navigation/menu translations
  auth.ts           # Authentication translations
  validation.ts     # Form validation messages
  errors.ts         # Error messages
```

Each file exports both languages:
```typescript
// auth.ts
export const auth = {
  de: { ... },
  en: { ... }
};
```

## Rationale

### 1. **Single Responsibility Principle (SRP)**
Each file handles ONE translation domain:
- `auth.ts` handles ONLY authentication-related translations
- `navigation.ts` handles ONLY navigation translations
- etc.

### 2. **Improved Navigation**
Developers can quickly find translations by domain:
```typescript
// Before: Search in 1847 LOC file
import { translations } from '@/lib/translations';
const t = translations.de.auth.login_btn;

// After: Import specific domain
import { auth } from '@/lib/translations';
const t = auth.de.login_btn;
```

### 3. **Better Type Safety**
Domain-specific exports enable better IntelliSense:
```typescript
import type { TranslationKeys } from '@/lib/translations';

// TypeScript knows available keys for each domain
type AuthKey = TranslationKeys['auth'];
```

### 4. **Reduced Merge Conflicts**
Different developers can work on different domains without conflicts:
- Developer A edits `auth.ts`
- Developer B edits `navigation.ts`
- No merge conflicts!

### 5. **Backward Compatibility**
The `index.ts` barrel export maintains the legacy structure:
```typescript
export const translations = {
  de: {
    general: general.de,
    nav: navigation.de,
    auth: auth.de,
    // ... maintains compatibility
  },
  en: { ... }
};
```

Existing code continues to work:
```typescript
import { translations } from '@/lib/translations';
// Still works! No breaking changes
```

### 6. **Easier Addition of New Languages**
When adding a new language (e.g., French):
```typescript
// Only need to update each domain file
export const auth = {
  de: { ... },
  en: { ... },
  fr: { ... }, // Add French
};
```

## Implementation

### Phase 1: Domain Separation (✅ Completed)
- Created `lib/translations/` directory
- Split translations into domain files:
  - `general.ts` - General UI text (buttons, labels, etc.)
  - `navigation.ts` - Navigation and menu items
  - `auth.ts` - Authentication and authorization
  - `validation.ts` - Form validation messages
  - `errors.ts` - Error messages and alerts
- Created `index.ts` with barrel export and legacy compatibility

### Phase 2: Helper Functions (✅ Completed)
Added utility functions for type-safe translation access:
```typescript
export function getTranslation(
  domain: TranslationDomain,
  key: string,
  lang: Language = 'de'
): string
```

### Phase 3: Migration (Future)
- Gradually migrate imports from legacy to domain-specific:
  ```typescript
  // From:
  import { translations } from '@/lib/translations';

  // To:
  import { auth, navigation } from '@/lib/translations';
  ```
- Update components to use domain-specific imports
- Remove legacy compatibility layer in future major version

## Consequences

### Positive
✅ **Maintainability**: Smaller files organized by domain
✅ **Navigation**: Quick access to specific translations
✅ **Type Safety**: Better TypeScript support per domain
✅ **Collaboration**: Reduced merge conflicts
✅ **Extensibility**: Easy to add new languages or domains
✅ **Backward Compatible**: No breaking changes

### Negative
⚠️ **Migration Effort**: Need to update imports across codebase (optional)
⚠️ **Initial Complexity**: More files to understand (but organized)
⚠️ **File Count**: Increased from 1 to 6 files

### Neutral
⚖️ **Bundle Size**: No change in final bundle (same translations, just organized)
⚖️ **Runtime Performance**: No performance impact (same object structure in memory)

## Alternatives Considered

### Alternative 1: Keep Monolithic File
**Rejected**: Hard to maintain, poor navigation, frequent merge conflicts

### Alternative 2: Split by Language (de.ts, en.ts)
**Rejected**: When adding a feature, would need to edit both files anyway. Domain separation is more practical.

### Alternative 3: Use i18n Library (i18next, react-i18next)
**Rejected**: Over-engineering for current needs. Current structure is sufficient and has zero dependencies.

### Alternative 4: JSON Files for Translations
**Rejected**: Would require build step or fetch requests. TypeScript files provide better type safety.

## Best Practices Applied

1. **Domain-Driven Design (DDD)**: Organized by business domains
2. **Barrel Pattern**: Clean exports via `index.ts`
3. **Backward Compatibility**: No breaking changes for existing code
4. **Type Safety**: Full TypeScript support
5. **Single Responsibility**: Each file handles one domain

## References
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [i18n Best Practices](https://www.i18next.com/principles/best-practices)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

## Related Decisions
- ADR 001: API Modules Refactoring
- ADR 003: Circular Dependency Resolution (Pending)

## Authors
**Senior Software Architect (Claude)**
**Loop**: 19/200 - Phase 5 (CLEANUP TIME)
**Date**: 2026-01-19
