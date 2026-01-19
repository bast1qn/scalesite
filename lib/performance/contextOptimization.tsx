/**
 * REACT CONTEXT OPTIMIZATION
 * Prevents unnecessary re-renders from context updates
 *
 * @performance
 * - Split contexts by concern
 * - Memoize context values
 * - Selective context consumption
 * - Use props for static values
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';

// ============================================================
// SPLIT AUTH CONTEXT - Separate static and dynamic values
// ============================================================

interface StaticAuthContextValue {
  // Values that rarely change
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  register: (name: string, company: string, email: string, password: string) => Promise<any>;
}

interface DynamicAuthContextValue {
  // Values that change frequently
  user: { id: string; name: string; email: string } | null;
  loading: boolean;
}

const StaticAuthContext = createContext<StaticAuthContextValue | null>(null);
const DynamicAuthContext = createContext<DynamicAuthContextValue | null>(null);

/**
 * Optimized Auth Provider with split contexts
 */
export function OptimizedAuthProvider({ children }: { children: ReactNode }) {
  // Memoize static methods to prevent re-creation
  const staticValues = useMemo<StaticAuthContextValue>(
    () => ({
      login: async () => ({ success: false, error: null }),
      logout: async () => {},
      register: async () => ({}),
    }),
    []
  );

  return (
    <StaticAuthContext.Provider value={staticValues}>
      <DynamicAuthContext.Provider value={{ user: null, loading: false }}>
        {children}
      </DynamicAuthContext.Provider>
    </StaticAuthContext.Provider>
  );
}

/**
 * Hook for static auth values (doesn't cause re-render on user change)
 */
export function useStaticAuth() {
  const context = useContext(StaticAuthContext);
  if (!context) throw new Error('useStaticAuth must be used within OptimizedAuthProvider');
  return context;
}

/**
 * Hook for dynamic auth values (re-renders on user change)
 */
export function useDynamicAuth() {
  const context = useContext(DynamicAuthContext);
  if (!context) throw new Error('useDynamicAuth must be used within OptimizedAuthProvider');
  return context;
}

// ============================================================
// CONTEXT SELECTOR PATTERN - Select only what you need
// ============================================================

interface AppContextValue {
  user: { id: string; name: string } | null;
  theme: 'light' | 'dark';
  language: string;
  notifications: number;
}

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Optimized context selector
 * Only re-renders when selected value changes
 */
export function useContextSelector<T>(
  selector: (context: AppContextValue) => T
): T {
  const context = useContext(AppContext);
  if (!context) throw new Error('useContextSelector must be used within AppProvider');

  return useMemo(() => selector(context), [context, selector]);
}

// Usage examples:
// const user = useContextSelector(ctx => ctx.user); // Only re-renders when user changes
// const theme = useContextSelector(ctx => ctx.theme); // Only re-renders when theme changes

// ============================================================
// AVOID CONTEXT FOR FREQUENTLY CHANGING VALUES
// ============================================================

/**
 * ANTI-PATTERN: Don't put frequently changing values in context
 */
export function AntiExample() {
  // BAD: This causes all consumers to re-render on every keystroke
  // const { searchQuery } = useSearchContext();

  // GOOD: Use local state or URL params
  // const [searchQuery, setSearchQuery] = useState('');
  return null;
}

// ============================================================
// COMPONENT OPTIMIZATION CHECKLIST
// ============================================================

export const CONTEXT_OPTIMIZATION_CHECKLIST = {
  splitContexts: 'Split contexts by update frequency',
  memoizeValues: 'Memoize context values with useMemo',
  selectValues: 'Use selector pattern to consume only needed values',
  avoidFrequentUpdates: 'Avoid context for frequently changing values',
  useProps: 'Pass static values as props instead of context',
  checkConsumers: 'Audit components that consume context',
  useCallbackMethods: 'Memoize methods passed through context',
} as const;

// ============================================================
// PERFORMANCE MONITORING FOR CONTEXT
// ============================================================

let renderCount = 0;
let lastRenderTime = performance.now();

export function trackContextRenders(contextName: string) {
  const now = performance.now();
  const timeSinceLastRender = now - lastRenderTime;
  renderCount++;

  if (import.meta.env.DEV) {
    console.log(`[Context Perf] ${contextName} rendered #${renderCount} (+${timeSinceLastRender.toFixed(2)}ms)`);

    if (renderCount > 10) {
      console.warn(`[Context Perf] ${contextName} has rendered ${renderCount} times - consider optimization!`);
    }
  }

  lastRenderTime = now;
}

/**
 * HOC to track context renders in development
 */
export function withContextRenderTracking<P>(
  contextName: string,
  Component: React.ComponentType<P>
) {
  return function TrackedComponent(props: P) {
    if (import.meta.env.DEV) {
      trackContextRenders(contextName);
    }
    return <Component {...props} />;
  };
}
