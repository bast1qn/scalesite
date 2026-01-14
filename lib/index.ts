// Central exports for cleaner imports across the application

// Constants
export * from './constants';

// Hooks
export * from './hooks';

// Animations
export * from './animations';

// Utilities
export * from './utils';
export * from './ui-patterns';

// Validation
export * from './validation';

// API
export * from './api';

// Neon Database
export * from './neon';

// Supabase (Mock for backward compatibility - will be removed)
export * from './supabase';

// Translations
export * from './translations';

// Confetti
export * from './confetti';

// Dashboard specific
export * from './dashboardAlerts';

// Security components
export { ProtectedRoute, withAuth } from './ProtectedRoute';

// Security utilities
export * from './sessionSecurity';
export * from './errorHandler';
