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
export {
  // Loading States
  PremiumSpinner,
  SkeletonLoader,
  DotsLoader,
  PageLoader,

  // Empty/Error/Success States
  EmptyState,
  ErrorState,
  SuccessState,
  CardSkeleton,
} from '../../components/design/PremiumStates';

export {
  // Interactive Components
  MagneticButton,
  SpotlightCard,
  GlassCard,
  AnimatedLink,
  FloatingLabelInput,
  ToggleSwitch,
  TiltCard,
  RippleButton,
} from '../../components/design/PremiumUI';

// ========================================================================
// RE-EXPORT COMMONLY USED UTILITIES
// ========================================================================

import { tokens } from './tokens';
import { patterns } from './patterns';
import { animations } from './animations';
import { darkMode } from './darkMode';

// Design system object
export const designSystem = {
  tokens,
  patterns,
  animations,
  darkMode,
} as const;

// Default export
export default designSystem;
