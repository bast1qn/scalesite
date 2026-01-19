/**
 * Icon Optimizer Component
 *
 * ⚠️ DEPRECATED: This component is NOT optimal for tree-shaking!
 * It imports the entire lucide-react icons object (~200KB)
 *
 * ✅ USE INSTEAD: Import directly from @/lib/icons
 * - Only imports used icons from lucide-react
 * - Better tree-shaking with direct ESM imports
 * - Reduces bundle size by ~95%
 *
 * @example
 * // BAD: Imports entire icons object
 * import { OptimizedIcon } from './components/IconOptimizer';
 * <OptimizedIcon name="ArrowRight" />
 *
 * // GOOD: Direct import for maximal tree-shaking
 * import { ArrowRight } from '@/lib/icons';
 * <ArrowRight size={24} className="text-primary" />
 *
 * @performance
 * - lib/icons.ts: ~5-10KB (only used icons)
 * - IconOptimizer: ~200KB (entire lucide-react)
 */

import { memo, type SVGProps } from 'react';
import type { Icon as LucideIcon } from 'lucide-react';
import { icons } from 'lucide-react';

export interface OptimizedIconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  name: keyof typeof icons;
  size?: number | string;
  className?: string;
}

/**
 * @deprecated Use direct imports from @/lib/icons instead
 * This component exists for backward compatibility only
 */
export const OptimizedIcon = memo<OptimizedIconProps>(({ name, size = 24, className = '', ...props }) => {
  if (import.meta.env.DEV) {
    console.warn(
      '[IconOptimizer] This component is deprecated.\n' +
      'Use direct imports from @/lib/icons for better tree-shaking.\n' +
      'Example: import { ArrowRight } from "@/lib/icons"'
    );
  }

  const Icon = icons[name] as LucideIcon;

  if (!Icon) {
    if (import.meta.env.DEV) {
      console.warn(`Icon "${name}" not found in lucide-react`);
    }
    return null;
  }

  return (
    <Icon
      size={size}
      className={className}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
});

OptimizedIcon.displayName = 'OptimizedIcon';

/**
 * @deprecated Use direct imports from @/lib/icons instead
 */
export function createIconBundle<K extends keyof typeof icons>(iconNames: K[]) {
  return iconNames.reduce((acc, name) => {
    acc[name] = icons[name];
    return acc;
  }, {} as Record<K, LucideIcon>);
}

/**
 * @deprecated Use direct imports from @/lib/icons instead
 */
export const navigationIcons = createIconBundle([
  'ArrowRight',
  'ArrowLeft',
  'ChevronDown',
  'ChevronUp',
  'Menu',
  'X',
  'Home',
]);

export const actionIcons = createIconBundle([
  'Check',
  'X',
  'Plus',
  'Minus',
  'Search',
  'Filter',
  'Download',
  'Upload',
]);

export const uiIcons = createIconBundle([
  'Star',
  'Heart',
  'Bookmark',
  'Share',
  'Copy',
  'Trash',
  'Edit',
  'Settings',
]);

export default OptimizedIcon;
