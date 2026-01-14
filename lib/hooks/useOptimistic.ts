import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useOptimistic - Hook für Optimistic UI Updates
 *
 * Features:
 * - Sofortiges UI-Update vor API-Antwort
 * - Automatisches Rollback bei Fehler
 * - Debouncing für wiederholte Updates
 * - Loading States
 */
export function useOptimistic<T>(
  initialValue: T,
  mutationFn: (value: T) => Promise<T>
) {
  const [state, setState] = useState<T>(initialValue);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pendingValueRef = useRef<T | null>(null);

  const update = useCallback(async (newValue: T) => {
    // 🐛 BUG FIX: Use functional state update to avoid stale closure
    let previousValue: T;

    setState(prevState => {
      previousValue = prevState;
      return newValue;
    });

    pendingValueRef.current = newValue;
    setIsPending(true);
    setError(null);

    try {
      // API-Call
      const result = await mutationFn(newValue);
      pendingValueRef.current = null;
      setState(result);
      setIsPending(false);
      return result;
    } catch (err) {
      // Rollback bei Fehler
      pendingValueRef.current = null;
      setState(previousValue!);
      setIsPending(false);
      setError(err as Error);
      throw err;
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setState(initialValue);
    setError(null);
    setIsPending(false);
    pendingValueRef.current = null;
  }, [initialValue]);

  return {
    value: state,
    update,
    reset,
    isPending,
    error,
    hasPendingChanges: pendingValueRef.current !== null
  };
}

/**
 * useOptimisticList - Für Listen mit Optimistic Updates
 *
 * Features:
 * - Hinzufügen, Entfernen, Aktualisieren
 * - Individuelles Rollback pro Item
 * - Batch-Updates
 */
interface OptimisticListItem<T> {
  id: string;
  data: T;
  status: 'idle' | 'pending' | 'error';
  error?: Error;
}

export function useOptimisticList<T extends { id: string }>(
  initialItems: T[],
  mutationFns: {
    add?: (item: T) => Promise<T>;
    update?: (id: string, updates: Partial<T>) => Promise<T>;
    remove?: (id: string) => Promise<void>;
  }
) {
  const [items, setItems] = useState<OptimisticListItem<T>[]>(
    initialItems.map(item => ({ id: item.id, data: item, status: 'idle' }))
  );
  const [isPending, setIsPending] = useState(false);

  const add = useCallback(async (newItem: T) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: OptimisticListItem<T> = {
      id: tempId,
      data: newItem,
      status: 'pending'
    };

    // Sofortiges Hinzufügen
    setItems(prev => [...prev, optimisticItem]);
    setIsPending(true);

    try {
      if (mutationFns.add) {
        const result = await mutationFns.add(newItem);
        setItems(prev => prev.map(item =>
          item.id === tempId
            ? { id: result.id, data: result, status: 'idle' }
            : item
        ));
      }
      setIsPending(false);
    } catch (err) {
      // Rollback
      setItems(prev => prev.filter(item => item.id !== tempId));
      setIsPending(false);
      throw err;
    }
  }, [mutationFns]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    const previousItems = [...items];

    // Sofortiges Update
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, data: { ...item.data, ...updates }, status: 'pending' }
        : item
    ));
    setIsPending(true);

    try {
      if (mutationFns.update) {
        const result = await mutationFns.update(id, updates);
        setItems(prev => prev.map(item =>
          item.id === id
            ? { ...item, data: result, status: 'idle' }
            : item
        ));
      }
      setIsPending(false);
    } catch (err) {
      // Rollback
      setItems(previousItems);
      setIsPending(false);
      throw err;
    }
  }, [items, mutationFns]);

  const remove = useCallback(async (id: string) => {
    const previousItems = [...items];

    // Sofortiges Entfernen
    setItems(prev => prev.filter(item => item.id !== id));
    setIsPending(true);

    try {
      if (mutationFns.remove) {
        await mutationFns.remove(id);
      }
      setIsPending(false);
    } catch (err) {
      // Rollback
      setItems(previousItems);
      setIsPending(false);
      throw err;
    }
  }, [items, mutationFns]);

  const retry = useCallback(async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || item.status !== 'error') return;

    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'pending' } : i
    ));

    try {
      if (mutationFns.update && item.error) {
        const result = await mutationFns.update(id, item.data);
        setItems(prev => prev.map(i =>
          i.id === id ? { ...i, data: result, status: 'idle' } : i
        ));
      }
    } catch (err) {
      setItems(prev => prev.map(i =>
        i.id === id ? { ...i, status: 'error', error: err as Error } : i
      ));
      throw err;
    }
  }, [items, mutationFns]);

  return {
    items: items.map(i => i.data),
    add,
    update,
    remove,
    retry,
    isPending,
    hasPendingItems: items.some(i => i.status === 'pending'),
    hasErrorItems: items.some(i => i.status === 'error')
  };
}

/**
 * useLoadingState - Verwaltet Loading States mit Delay
 *
 * Features:
 * - Verzögertes Anzeigen (verhindert Flackern)
 * - Minimale Anzeigedauer
 * - Debouncing
 */
interface LoadingStateOptions {
  delay?: number; // Verzögerung vor Anzeige (ms)
  minDuration?: number; // Minimale Anzeigedauer (ms)
}

export function useLoadingState(options: LoadingStateOptions = {}) {
  const { delay = 200, minDuration = 500 } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  const startLoading = useCallback(() => {
    setIsLoading(true);

    // Verzögertes Anzeigen
    timeoutRef.current = setTimeout(() => {
      setShowLoading(true);
      startTimeRef.current = Date.now();
    }, delay);
  }, [delay]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Minimale Anzeigedauer
    if (showLoading && startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, minDuration - elapsed);

      if (remaining > 0) {
        timeoutRef.current = setTimeout(() => {
          setShowLoading(false);
        }, remaining);
        return;
      }
    }

    setShowLoading(false);
  }, [showLoading, minDuration, delay]);

  return {
    isLoading,
    showLoading,
    startLoading,
    stopLoading
  };
}

// useDebounce is now imported from ./useDebounce.ts to avoid code duplication
// Re-exporting for backwards compatibility
export { useDebounce } from './useDebounce';
