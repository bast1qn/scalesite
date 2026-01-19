/**
 * useAsyncOperation Hook
 *
 * Reusable hook for managing async operations with loading, error, and data states
 * Eliminates duplicate async handling logic across components
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOperationOptions {
  /** Execute operation immediately on mount */
  immediate?: boolean;
  /** Callback on success */
  onSuccess?: (data: any) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Reset data on new execution */
  resetOnExecute?: boolean;
}

export interface UseAsyncOperationReturn<T> {
  /** Current state */
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Execute the async operation */
  execute: (...args: any[]) => Promise<void>;
  /** Reset state to initial */
  reset: () => void;
  /** Clear error */
  clearError: () => void;
}

/**
 * Hook for managing async operations
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @returns State and methods
 */
export function useAsyncOperation<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    resetOnExecute = false,
  } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        data: resetOnExecute ? null : prev.data,
      }));

      try {
        const result = await asyncFunction(...args);

        if (isMounted.current) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
          onSuccess?.(result);
        }
      } catch (error) {
        if (isMounted.current) {
          const err =
            error instanceof Error ? error : new Error('An error occurred');
          setState({
            data: null,
            loading: false,
            error: err,
          });
          onError?.(err);
        }
      }
    },
    [asyncFunction, resetOnExecute, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    clearError,
  };
}

/**
 * Hook for managing async operations that return void
 */
export function useAsyncAction(
  asyncFunction: (...args: any[]) => Promise<void>,
  options: UseAsyncOperationOptions = {}
): Omit<UseAsyncOperationReturn<void>, 'data'> {
  const result = useAsyncOperation(asyncFunction, options);
  return {
    loading: result.loading,
    error: result.error,
    execute: result.execute,
    reset: result.reset,
    clearError: result.clearError,
  };
}

/**
 * Hook for fetching data on mount
 */
export function useFetch<T>(
  fetchFunction: () => Promise<T>,
  options: Omit<UseAsyncOperationOptions, 'immediate'> = {}
): UseAsyncOperationReturn<T> {
  return useAsyncOperation(fetchFunction, { ...options, immediate: true });
}

/**
 * Hook for submitting data (typically used with forms)
 */
export function useSubmit<T>(
  submitFunction: (data: any) => Promise<T>,
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T> {
  return useAsyncOperation(submitFunction, {
    ...options,
    immediate: false,
    resetOnExecute: true,
  });
}

/**
 * Hook for polling data at intervals
 */
export function usePoll<T>(
  pollFunction: () => Promise<T>,
  interval: number,
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T> & { start: () => void; stop: () => void } {
  const result = useAsyncOperation(pollFunction, {
    ...options,
    immediate: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      result.execute();
    }, interval);

    return () => clearInterval(timer);
  }, [interval, result.execute]);

  return {
    ...result,
    start: () => result.execute(),
    stop: () => {}, // Interval cleanup handles this
  };
}
