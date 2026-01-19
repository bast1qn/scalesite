/**
 * useListFiltering Hook
 * Provides common filtering and sorting logic for list components
 * Consolidates duplicate filtering logic across TeamList, ProjectList, CampaignList, etc.
 */

import { useMemo, useState } from 'react';
import { ViewMode, SortOrder } from '@/lib/constants/enums';

export interface UseListFilteringOptions<T> {
  /** Initial items to filter */
  items: T[];
  /** Initial search term */
  initialSearchTerm?: string;
  /** Initial filter status */
  initialFilter?: string;
  /** Initial sort order */
  initialSortOrder?: SortOrder;
  /** Initial view mode */
  initialViewMode?: ViewMode;
  /** Search key(s) to search in items */
  searchKeys?: (keyof T)[];
  /** Filter key for status filtering */
  filterKey?: keyof T;
  /** Sort key for sorting */
  sortKey?: keyof T;
}

export interface UseListFilteringReturn<T> {
  /** Current search term */
  searchTerm: string;
  /** Set search term */
  setSearchTerm: (term: string) => void;
  /** Current filter */
  filter: string;
  /** Set filter */
  setFilter: (filter: string) => void;
  /** Current sort order */
  sortOrder: SortOrder;
  /** Set sort order */
  setSortOrder: (order: SortOrder) => void;
  /** Current view mode */
  viewMode: ViewMode;
  /** Set view mode */
  setViewMode: (mode: ViewMode) => void;
  /** Filtered and sorted items */
  filteredItems: T[];
  /** Number of filtered items */
  filteredCount: number;
  /** Total number of items */
  totalCount: number;
  /** Whether filters are active */
  isFiltered: boolean;
  /** Clear all filters */
  clearFilters: () => void;
}

/**
 * Hook for managing list filtering, sorting, and view mode
 * @param options - Configuration options
 * @returns Filtering state and methods
 */
export function useListFiltering<T extends Record<string, any>>(
  options: UseListFilteringOptions<T>
): UseListFilteringReturn<T> {
  const {
    items,
    initialSearchTerm = '',
    initialFilter = 'all',
    initialSortOrder = SortOrder.Ascending,
    initialViewMode = ViewMode.Grid,
    searchKeys = [],
    filterKey,
    sortKey,
  } = options;

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filter, setFilter] = useState(initialFilter);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [viewMode, setViewMode] = useState(initialViewMode);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply search filter
    if (searchTerm && searchKeys.length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowerSearchTerm);
          }
          if (typeof value === 'number') {
            return value.toString().includes(lowerSearchTerm);
          }
          return false;
        })
      );
    }

    // Apply status filter
    if (filterKey && filter !== 'all') {
      result = result.filter((item) => {
        const value = item[filterKey];
        if (typeof value === 'string') {
          return value.toLowerCase() === filter.toLowerCase();
        }
        return value === filter;
      });
    }

    // Apply sorting
    if (sortKey) {
      result.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortOrder === SortOrder.Ascending ? comparison : -comparison;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue;
          return sortOrder === SortOrder.Ascending ? comparison : -comparison;
        }

        return 0;
      });
    }

    return result;
  }, [items, searchTerm, filter, sortOrder, searchKeys, filterKey, sortKey]);

  const filteredCount = filteredItems.length;
  const totalCount = items.length;
  const isFiltered = searchTerm !== '' || filter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setSortOrder(initialSortOrder);
  };

  return {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    filteredItems,
    filteredCount,
    totalCount,
    isFiltered,
    clearFilters,
  };
}
