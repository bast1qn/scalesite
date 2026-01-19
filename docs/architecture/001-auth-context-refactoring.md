# ADR 001: Authentication Context Refactoring

## Status
Accepted

## Context
The original `AuthContext.tsx` violated multiple SOLID principles:
- **Single Responsibility**: Handled authentication, loading states, timeouts, security logging, and user transformation
- **Interface Segregation**: Large monolithic interface with all methods
- **Dependency Inversion**: Direct dependency on Clerk implementation

This made testing difficult, code hard to maintain, and extension challenging.

## Decision
Refactor authentication system using **Facade Pattern** and **Dependency Inversion Principle**:

### New Architecture
```
contexts/auth/
├── AuthTypes.ts           # Interface definitions (ISP)
├── UserMapper.ts          # Single responsibility: User mapping
├── AuthStateManager.ts    # SRP: State management only
├── AuthSecurityManager.ts # SRP: Security & timeouts
├── AuthenticationService.ts   # SRP: Login/logout operations
├── RegistrationService.ts     # SRP: Registration operations
├── AuthFacade.ts          # Facade: Unified interface
└── AuthContext.tsx        # React context integration
```

### Benefits
1. **Single Responsibility**: Each class has one clear purpose
2. **Interface Segregation**: Small, focused interfaces
3. **Dependency Inversion**: Services depend on abstractions (interfaces)
4. **Open/Closed**: Easy to extend without modifying existing code
5. **Testability**: Each service can be tested in isolation

### Implementation
```typescript
// Before: Monolithic context
const login = useCallback(async (email, password) => {
  // All logic mixed together
}, []);

// After: Delegated to service
const authService = new ClerkAuthenticationService(securityManager);
const login = authService.login.bind(authService);
```

## Consequences
- **Positive**: Improved maintainability, testability, extensibility
- **Negative**: More files to manage, slightly more boilerplate
- **Mitigation**: Barrel exports (index.ts) provide clean public API

## Related
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Facade Pattern](https://refactoring.guru/design-patterns/facade)
- [ADR 002: Route Factory Pattern](./002-route-factory-pattern.md)
