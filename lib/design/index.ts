// ========================================================================
// SCALEITE DESIGN SYSTEM - BARREL EXPORT
// ========================================================================
// Single import point for all design system utilities
// Reference: Linear, Vercel, Stripe design systems
// ========================================================================

// ========================================================================
// DESIGN TOKENS
// ========================================================================
export * from './tokens';

// ========================================================================
// DESIGN PATTERNS
// ========================================================================
export * from './patterns';

// ========================================================================
// ANIMATIONS (GPU-ACCELERATED)
// ========================================================================
export * from './animations';

// ========================================================================
// DARK MODE
// ========================================================================
export * from './darkMode';

// ========================================================================
// PREMIUM COMPONENTS
// ========================================================================
// NOTE: Premium components are now imported directly from their source
// to avoid circular dependencies. Use:
// import { PremiumSpinner } from '@/components/design/PremiumStates';
// import { MagneticButton } from '@/components/design/PremiumUI';

// ========================================================================
// RE-EXPORT COMMONLY USED UTILITIES
// ========================================================================

import { tokens } from './tokens';
import { patterns } from './patterns';
import { animations } from './animations';
import { darkMode } from './darkMode';

// Design system object (core utilities only)
export const designSystem = {
  tokens,
  patterns,
  animations,
  darkMode,
} as const;

// Default export
export default designSystem;
