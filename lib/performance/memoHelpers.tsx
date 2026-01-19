// ========================================================================
// ✅ PERFORMANCE: React.memo HOCs with Custom Comparison
// ========================================================================
// Prevents unnecessary re-renders for expensive components
// Uses shallow comparison for props to avoid deep object checks
// ========================================================================

import { memo, type ComponentType, type EqualityFn } from 'react';

/**
 * Standard memo with shallow props comparison
 * Use for components that receive primitive props or stable object references
 */
export function memoDefault<P extends object>(
  Component: ComponentType<P>,
  areEqual?: EqualityFn<P>
) {
  return memo(Component, areEqual);
}

/**
 * Memo for components with frequently changing props
 * Only re-renders if specific props change
 */
export function memoSelective<P extends object>(
  Component: ComponentType<P>,
  propsToCompare: (keyof P)[]
) {
  const areEqual: EqualityFn<P> = (prevProps, nextProps) => {
    // Only compare the specified props
    for (const prop of propsToCompare) {
      if (prevProps[prop] !== nextProps[prop]) {
        return false;
      }
    }
    return true;
  };

  return memo(Component, areEqual);
}

/**
 * Memo for components that should never re-render after initial mount
 * Use for static content that doesn't depend on props
 */
export function memoStatic<P extends object>(Component: ComponentType<P>) {
  return memo(Component, () => true); // Always return true = never re-render
}

/**
 * Memo for list items with ID-based comparison
 * Prevents re-render when other items in the list change
 */
export function memoListItem<P extends { id: string | number }>(
  Component: ComponentType<P>
) {
  return memo(Component, (prevProps, nextProps) => {
    return prevProps.id === nextProps.id;
  });
}

/**
 * Deep comparison for objects (use sparingly - has performance cost)
 * Only use when props are new objects every render but have same content
 */
export function memoDeep<P extends object>(Component: ComponentType<P>) {
  const areEqual: EqualityFn<P> = (prevProps, nextProps) => {
    const prevKeys = Object.keys(prevProps) as (keyof P)[];
    const nextKeys = Object.keys(nextProps) as (keyof P)[];

    if (prevKeys.length !== nextKeys.length) {
      return false;
    }

    for (const key of prevKeys) {
      const prevValue = prevProps[key];
      const nextValue = nextProps[key];

      // Primitive comparison
      if (prevValue !== nextValue) {
        // For objects, check if they're both objects
        if (typeof prevValue === 'object' && typeof nextValue === 'object') {
          if (JSON.stringify(prevValue) !== JSON.stringify(nextValue)) {
            return false;
          }
        } else {
          return false;
        }
      }
    }

    return true;
  };

  return memo(Component, areEqual);
}
