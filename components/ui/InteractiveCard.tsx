/**
 * InteractiveCard - Reusable card component with consistent hover effects
 *
 * Provides a standardized card with:
 * - Subtle scale animation on hover/active
 * - Dark mode support
 * - Premium shadow effects
 * - Optional border highlight
 *
 * @example
 * ```tsx
 * <InteractiveCard>
 *   <YourContent />
 * </InteractiveCard>
 *
 * <InteractiveCard withBorderHighlight>
 *   <YourContent />
 * </InteractiveCard>
 * ```
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { COLOR_PATTERNS, HOVER_CARD, SHADOW_VARIANTS, TRANSITION_STYLES } from '@/lib/constants';

interface InteractiveCardProps {
  /** Card content */
  children: ReactNode;
  /** Additional className for custom styling */
  className?: string;
  /** Enable border highlight on hover */
  withBorderHighlight?: boolean;
  /** Enable shadow enhancement on hover */
  withShadow?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Make card clickable */
  clickable?: boolean;
  /** Custom HTML tag */
  as?: 'div' | 'button' | 'a';
}

export const InteractiveCard = ({
  children,
  className,
  withBorderHighlight = false,
  withShadow = false,
  onClick,
  clickable = false,
  as = 'div',
}) => {
  const Component = as;

  const baseClasses = [
    COLOR_PATTERNS.backgroundSoft,
    'backdrop-blur-xl',
    'rounded-3xl',
    'overflow-hidden',
    COLOR_PATTERNS.border,
    HOVER_CARD.interactive,
    TRANSITION_STYLES.smooth,
  ];

  const hoverClasses = [];
  if (withBorderHighlight) {
    hoverClasses.push(HOVER_CARD.withBorderHighlight);
  }
  if (withShadow) {
    hoverClasses.push(SHADOW_VARIANTS.premium);
    hoverClasses.push(HOVER_CARD.withShadow);
  }

  const interactiveClasses = clickable || onClick ? 'cursor-pointer' : '';

  return (
    <Component
      className={cn(
        ...baseClasses,
        ...hoverClasses,
        interactiveClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default InteractiveCard;
