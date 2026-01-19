/**
 * useDashboardRealtime Hook
 *
 * Single Responsibility: Handle real-time dashboard updates
 * Part of Overview component SRP refactoring
 */

import { useEffect, useRef } from 'react';

export interface UseDashboardRealtimeOptions {
  enabled?: boolean;
  interval?: number;
  onUpdate?: () => void;
}

/**
 * Custom hook for real-time dashboard updates
 * Uses polling for data synchronization
 */
export function useDashboardRealtime(
  refresh: () => Promise<void>,
  options: UseDashboardRealtimeOptions = {}
) {
  const {
    enabled = true,
    interval = 30000, // 30 seconds default
    onUpdate
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Set up polling interval
    intervalRef.current = setInterval(async () => {
      await refresh();
      if (onUpdate) {
        onUpdate();
      }
    }, interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, refresh, onUpdate]);

  /**
   * Manual refresh trigger
   */
  const triggerRefresh = async () => {
    await refresh();
    if (onUpdate) {
      onUpdate();
    }
  };

  return {
    triggerRefresh,
    isPolling: enabled && intervalRef.current !== null
  };
}
