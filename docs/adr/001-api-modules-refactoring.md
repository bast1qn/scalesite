# ADR 001: API Modules Refactoring

## Status
**Accepted**

## Date
2026-01-19 (Loop 19/200 - Phase 5)

## Context
The original `lib/api.ts` file contained **2850 lines of code** with all API functions in a single monolithic file. This violated the **Single Responsibility Principle** and created several maintenance issues:

### Problems Identified
1. **Large File Size**: 2850 LOC makes navigation and understanding difficult
2. **Mixed Responsibilities**: Authentication, tickets, projects, billing, and content all in one file
3. **Poor Testability**: Hard to unit test individual domains
4. **Merge Conflicts**: Multiple developers editing the same file
5. **Code Duplication**: Similar error handling and caching logic repeated
6. **SOLID Violations**:
   - **Single Responsibility**: One file handles too many concerns
   - **Open/Closed**: Adding new API functions requires modifying the large file
   - **Dependency Inversion**: No abstraction layers

### Existing Structure (Before)
```
lib/
  api.ts (2850 LOC) ❌
    - Authentication (200 LOC)
    - Tickets (400 LOC)
    - Projects (600 LOC)
    - Billing (300 LOC)
    - Content (250 LOC)
    - Error Handling (100 LOC)
    - Cache Logic (100 LOC)
    - ... more
```

## Decision
Split `lib/api.ts` into **domain-focused modules** following **SOLID principles** and **Clean Architecture** patterns.

### New Structure (After)
```
lib/api-modules/
  index.ts          # Barrel export (Facade Pattern)
  types.ts          # Shared types
  cache.ts          # Caching utilities
  error-handling.ts # Error classification & handling
  auth.ts           # Authentication helpers
  tickets.ts        # Ticket operations
  projects.ts       # Project operations
  billing.ts        # Billing & transactions
  content.ts        # Blog & content generation
```

## Rationale

### 1. **Single Responsibility Principle (SRP)**
Each module has ONE clear responsibility:
- `tickets.ts` handles ONLY ticket operations
- `projects.ts` handles ONLY project operations
- etc.

### 2. **Open/Closed Principle**
New domains can be added by creating new modules WITHOUT modifying existing code:
```typescript
// Add newsletter.ts without touching tickets.ts or projects.ts
export async function getCampaigns() { ... }
export async function createCampaign(data) { ... }
```

### 3. **Dependency Inversion**
All modules depend on abstractions (interfaces) from `types.ts`:
```typescript
import type { Ticket, Project, Invoice } from '../types';
```

### 4. **Facade Pattern**
The `index.ts` barrel export provides a clean public API:
```typescript
// Before
import { api } from '@/lib/api';
const tickets = await api.getTickets();

// After (cleaner import)
import { getTickets } from '@/lib/api-modules';
const tickets = await getTickets();
```

### 5. **Improved Testability**
Each module can be unit tested independently:
```typescript
// tests/api-modules/tickets.test.ts
describe('Tickets Module', () => {
  it('should fetch user tickets', async () => {
    const { data, error } = await getTickets();
    expect(data).toBeDefined();
  });
});
```

### 6. **Reduced Cognitive Load**
- **Before**: Need to understand 2850 LOC
- **After**: Only need to read the specific domain module (~200-300 LOC)

## Implementation

### Phase 1: Structure (✅ Completed)
- Created `lib/api-modules/` directory
- Extracted shared utilities: `types.ts`, `cache.ts`, `error-handling.ts`
- Created domain modules: `tickets.ts`, `projects.ts`, `billing.ts`, `content.ts`
- Added barrel export: `index.ts`

### Phase 2: Migration (Pending)
- Update `lib/api.ts` to import from modules
- Update all imports across the codebase
- Run tests to verify no breaking changes

### Phase 3: Documentation (Pending)
- Add JSDoc comments to all exported functions
- Create API documentation for each module
- Update architecture diagrams

## Consequences

### Positive
✅ **Maintainability**: Smaller files are easier to understand and modify
✅ **Testability**: Each module can be tested independently
✅ **Collaboration**: Reduced merge conflicts (different developers work on different modules)
✅ **Scalability**: Easy to add new domains without refactoring existing code
✅ **Code Splitting**: Better tree-shaking and bundle optimization
✅ **Type Safety**: Clearer type boundaries between modules

### Negative
⚠️ **Migration Effort**: Need to update all import statements across codebase
⚠️ **Initial Complexity**: More files to navigate for newcomers
⚠️ **Build Time**: Slightly increased build time due to more files (negligible)

### Neutral
⚖️ **Bundle Size**: No change in final bundle size (same code, just organized differently)

## Alternatives Considered

### Alternative 1: Keep Monolithic File
**Rejected**: Violates SRP, hard to maintain, poor testability

### Alternative 2: Split by Method (GET, POST, PUT, DELETE)
**Rejected**: Doesn't align with business domains, harder to find related functionality

### Alternative 3: Use tRPC or GraphQL
**Rejected**: Would require major architecture change, outside scope of this cleanup phase

### Alternative 4: Create Separate API Client Package
**Rejected**: Over-engineering for current needs, adds maintenance burden

## References
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Facade Pattern](https://refactoring.guru/design-patterns/facade)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

## Related Decisions
- ADR 002: Translations Module Refactoring (Pending)
- ADR 003: Circular Dependency Resolution (Pending)

## Authors
**Senior Software Architect (Claude)**
**Loop**: 19/200 - Phase 5 (CLEANUP TIME)
**Date**: 2026-01-19
