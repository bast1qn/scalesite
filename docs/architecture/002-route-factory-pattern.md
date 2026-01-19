# ADR 002: Route Factory Pattern Implementation

## Status
Accepted

## Context
The original routing implementation in `App.tsx` violated the **Open/Closed Principle**:
```typescript
// Old approach - requires modification for new routes
const getPage = useCallback(() => {
  switch (currentPage) {
    case 'home': return <HomePage />;
    case 'dashboard': return <DashboardPage />;
    // Adding new route = modifying this function
  }
}, [currentPage]);
```

### Problems
1. **Violation of Open/Closed**: Must modify existing code to add routes
2. **Scattered Logic**: Route config mixed with component logic
3. **No Centralization**: Route metadata (titles, priorities) hardcoded
4. **Testing Difficulty**: Cannot test routing in isolation

## Decision
Implement **Factory Pattern** for route management with configuration-based routing.

### New Architecture
```
lib/routing/
├── RouteTypes.ts       # Interfaces and types
├── RouterFactory.ts    # Factory pattern for route creation
├── RouteRenderer.ts    # Strategy pattern for rendering
└── index.ts           # Barrel export
```

### Implementation
```typescript
// Configuration-based approach (Open/Closed)
routerFactory.registerRoute({
  path: 'dashboard',
  component: () => import('../../pages/DashboardPage'),
  title: 'Mein Dashboard | ScaleSite',
  protected: true,
  priority: 'ondemand'
});

// Usage
const route = routerFactory.createRoute(currentPage);
const element = await routeRenderer.renderRoute(currentPage, context);
```

### Key Patterns
1. **Factory Pattern**: Centralized route creation
2. **Open/Closed Principle**: Add routes without modifying existing code
3. **Strategy Pattern**: Different rendering strategies for protected/public routes
4. **Singleton Pattern**: Single router factory instance

### Benefits
1. **Open/Closed**: Add routes via configuration, not code modification
2. **Centralized Metadata**: Titles, priorities, protection in one place
3. **Testability**: Can test routing logic independently
4. **Lazy Loading**: Built-in support for code splitting
5. **Type Safety**: Full TypeScript support

### Route Priority System
```typescript
type RoutePriority = 'high' | 'medium' | 'low' | 'ondemand';

// High-priority: Prefetch immediately
// Medium-priority: Prefetch on hover
// Low-priority: Load on demand
// Ondemand: Load only when accessed
```

## Consequences
- **Positive**: Extensible, maintainable, testable routing system
- **Positive**: Built-in performance optimization (prefetching strategies)
- **Negative**: Slight learning curve for new developers
- **Mitigation**: Clear documentation and examples

## Migration Path
1. Create factory with all existing routes
2. Replace switch statement with factory calls
3. Remove old routing code
4. Update documentation

## Related
- [Open/Closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
- [Factory Pattern](https://refactoring.guru/design-patterns/factory-method)
- [ADR 001: Auth Context Refactoring](./001-auth-context-refactoring.md)
