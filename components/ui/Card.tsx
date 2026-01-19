import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

// ============================================
// CARD VARIANTS - Consistent Design System
// ============================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'ghost';
  hover?: boolean;
  spotlight?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      hover = false,
      spotlight = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'relative rounded-3xl transition-all duration-300 ease-out';

    const variantClasses = {
      default: 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-card',
      elevated: 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-premium',
      ghost: 'bg-transparent border border-transparent',
    };

    const hoverClasses = hover
      ? 'hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
      : '';

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
