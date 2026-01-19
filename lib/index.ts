/**
 * SCALESITE LIBRARY - BARREL EXPORT
 *
 * PURPOSE: Clean, organized public API for the lib module
 * ARCHITECTURE: Enterprise-grade module organization
 * PRINCIPLES: SOLID, DRY, Clean Code
 */

// ============================================================================
// CORE UTILITIES
// ============================================================================

// Constants
export * from './constants';

// Hooks
export * from './hooks';

// Animations
export * from './animations';

// Utilities
export * from './utils';
export * from './ui-patterns';
export * from './date-utils';

// ============================================================================
// VALIDATION & SECURITY
// ============================================================================

// Validation (OWASP compliant)
export * from './validation';

// Security components
export { ProtectedRoute, withAuth } from './ProtectedRoute';

// Security utilities
export * from './sessionSecurity';
export * from './errorHandler';
export * from './useToast';
export * from './secureLogger';

// ============================================================================
// DATA LAYER
// ============================================================================

// API layer
export * from './api';

// Database
export * from './neon';
export * from './supabase';

// Repository Pattern (Enterprise-grade)
export * from './repositories';

// ============================================================================
// DESIGN PATTERNS
// ============================================================================

// Singleton, Factory, Observer, Strategy
export * from './patterns';

// ============================================================================
// UI & TRANSLATIONS
// ============================================================================

// Translations (i18n)
export * from './translations';

// Confetti
export * from './confetti';

// Dashboard specific
export * from './dashboardAlerts';
