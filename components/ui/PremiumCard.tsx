// ============================================
// PREMIUM CARD SYSTEM
// Reference: Linear, Vercel, Stripe design systems
// Focus: Pixel-perfect cards, spotlight effects, smooth interactions
// ============================================

import { forwardRef, useState, type MouseEvent, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/* ==================== PREMIUM CARD VARIANTS ==================== */

export interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'spotlight' | 'glass' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  children: ReactNode;
}

/**
 * PremiumCard - Consistent card system with micro-interactions
 *
 * Features:
 * - Perfect pixel alignment
 * - Smooth hover effects (scale-[1.02])
 * - Spotlight effect on hover (optional)
 * - Glass morphism support
 * - Consistent spacing
 * - GPU-accelerated animations
 *
 * @example
 * <PremiumCard variant="spotlight" hover clickable>
 *   <h3>Title</h3>
 *   <p>Description</p>
 * </PremiumCard>
 */
export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({
    variant = 'default',
    padding = 'md',
    hover = true,
    clickable = false,
    className,
    children,
    onClick,
    onMouseMove,
    ...props
  }, ref) => {
    const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    // Handle mouse move for spotlight effect
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      if (!variant.includes('spotlight')) return;

      const rect = e.currentTarget.getBoundingClientRect();
      setGlowPosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    // Variant styles
    const variantStyles = {
      default: `
        relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
        border border-slate-200/60 dark:border-slate-700/60
        shadow-card
      `,
      spotlight: `
        relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
        border border-slate-200/60 dark:border-slate-700/60
        shadow-card overflow-hidden
      `,
      glass: `
        relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl
        border border-slate-200/50 dark:border-slate-700/50
        shadow-soft
      `,
      elevated: `
        relative bg-white dark:bg-slate-800
        border border-slate-200/80 dark:border-slate-700/80
        shadow-premium
      `,
    };

    // Padding styles
    const paddingStyles = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // Hover styles
    const hoverStyles = hover
      ? `
        hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-300 ease-out
        will-change: transform, box-shadow
      `
      : '';

    // Clickable styles
    const clickableStyles = clickable
      ? `
        cursor-pointer
        focus:ring-2 focus:ring-primary-500/50 focus:outline-none
      `
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          `
            rounded-3xl overflow-hidden
            ${variantStyles[variant]}
            ${paddingStyles[padding]}
            ${hoverStyles}
            ${clickableStyles}
          `,
          className
        )}
        style={{
          // CSS variables for spotlight effect
          ...(variant === 'spotlight' && {
            '--mouse-x': `${glowPosition.x}%`,
            '--mouse-y': `${glowPosition.y}%`,
          } as React.CSSProperties),
        }}
        onClick={onClick}
        onMouseMove={(e) => {
          handleMouseMove(e);
          onMouseMove?.(e);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Spotlight effect overlay */}
        {variant === 'spotlight' && (
          <div
            className="absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(75, 90, 237, 0.08), transparent 50%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';

/* ==================== PREMIUM CARD SECTIONS ==================== */

export interface PremiumCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: ReactNode;
}

/**
 * PremiumCardHeader - Consistent card header
 *
 * @example
 * <PremiumCardHeader
 *   title="Card Title"
 *   description="Card description"
 *   action={<button>Action</button>}
 * />
 */
export const PremiumCardHeader = forwardRef<HTMLDivElement, PremiumCardHeaderProps>(
  ({ title, description, action, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between gap-4 mb-4', className)}
        {...props}
      >
        <div className="flex-1">
          {title && (
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
          {children}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    );
  }
);

PremiumCardHeader.displayName = 'PremiumCardHeader';

/**
 * PremiumCardContent - Card content wrapper
 */
export const PremiumCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-slate-700 dark:text-slate-300', className)}
        {...props}
      />
    );
  }
);

PremiumCardContent.displayName = 'PremiumCardContent';

/**
 * PremiumCardFooter - Card footer with actions
 */
export const PremiumCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700', className)}
        {...props}
      />
    );
  }
);

PremiumCardFooter.displayName = 'PremiumCardFooter';

/* ==================== PREMIUM CARD GRID ==================== */

export interface PremiumCardGridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * PremiumCardGrid - Responsive card grid
 *
 * @example
 * <PremiumCardGrid cols={3} gap="md">
 *   <PremiumCard>Card 1</PremiumCard>
 *   <PremiumCard>Card 2</PremiumCard>
 *   <PremiumCard>Card 3</PremiumCard>
 * </PremiumCardGrid>
 */
export const PremiumCardGrid = forwardRef<HTMLDivElement, PremiumCardGridProps>(
  ({ cols = 3, gap = 'md', className, children, ...props }, ref) => {
    // Column styles
    const colsStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    // Gap styles
    const gapStyles = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colsStyles[cols],
          gapStyles[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCardGrid.displayName = 'PremiumCardGrid';
