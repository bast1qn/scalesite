// ============================================
// ARRAY UTILITY FUNCTIONS
// ============================================

/**
 * Remove duplicate values from array
 */
export const unique = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

/**
 * Remove duplicate objects from array based on key
 */
export const uniqueBy = <T>(arr: T[], key: keyof T): T[] => {
  const seen = new Set();
  return arr.filter(item => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
};

/**
 * Chunk array into smaller arrays of specific size
 */
export const chunk = <T>(arr: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random item from array
 */
export const random = <T>(arr: T[]): T | undefined => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Get multiple random items from array
 */
export const randomSample = <T>(arr: T[], count: number): T[] => {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(count, arr.length));
};

/**
 * Sort array of objects by key
 */
export const sortBy = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array items by key
 */
export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Create an array of numbers from start to end
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Sum array of numbers
 */
export const sum = (arr: number[]): number => {
  return arr.reduce((acc, num) => acc + num, 0);
};

/**
 * Calculate average of array of numbers
 */
export const average = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
};

/**
 * Find maximum value in array
 */
export const max = (arr: number[]): number => {
  return Math.max(...arr);
};

/**
 * Find minimum value in array
 */
export const min = (arr: number[]): number => {
  return Math.min(...arr);
};

/**
 * Find item in array by key
 */
export const findBy = <T>(arr: T[], key: keyof T, value: unknown): T | undefined => {
  return arr.find(item => item[key] === value);
};

/**
 * Filter array by key value
 */
export const filterBy = <T>(arr: T[], key: keyof T, value: unknown): T[] => {
  return arr.filter(item => item[key] === value);
};

/**
 * Partition array into two arrays based on predicate
 */
export const partition = <T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  return arr.reduce(
    ([pass, fail], item) => {
      return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []] as [T[], T[]]
  );
};

/**
 * Flatten nested array
 */
export const flatten = <T>(arr: (T | T[])[]): T[] => {
  return arr.reduce<T[]>((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

/**
 * Flatten array to specific depth
 */
export const flattenDepth = <T>(arr: (T | T[])[], depth: number = 1): T[] => {
  const result: T[] = [];
  const flatten = (items: (T | T[])[], currentDepth: number) => {
    for (const item of items) {
      if (Array.isArray(item) && currentDepth < depth) {
        flatten(item, currentDepth + 1);
      } else if (Array.isArray(item)) {
        result.push(...(item as T[]));
      } else {
        result.push(item);
      }
    }
  };
  flatten(arr, 0);
  return result;
};

/**
 * Check if arrays are equal
 */
export const areEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

/**
 * Remove item from array
 */
export const remove = <T>(arr: T[], item: T): T[] => {
  return arr.filter(i => i !== item);
};

/**
 * Remove items from array by index
 */
export const removeAt = <T>(arr: T[], index: number): T[] => {
  return arr.filter((_, i) => i !== index);
};

/**
 * Insert item at specific index
 */
export const insertAt = <T>(arr: T[], index: number, item: T): T[] => {
  return [...arr.slice(0, index), item, ...arr.slice(index)];
};

/**
 * Update item at specific index
 */
export const updateAt = <T>(arr: T[], index: number, item: T): T[] => {
  return [...arr.slice(0, index), item, ...arr.slice(index + 1)];
};

/**
 * Move item from one index to another
 */
export const move = <T>(arr: T[], from: number, to: number): T[] => {
  const item = arr[from];
  const newArr = removeAt(arr, from);
  return insertAt(newArr, to, item);
};

/**
 * Get first n items from array
 */
export const first = <T>(arr: T[], n: number = 1): T[] => {
  return arr.slice(0, n);
};

/**
 * Get last n items from array
 */
export const last = <T>(arr: T[], n: number = 1): T[] => {
  return arr.slice(-n);
};

/**
 * Get array without first n items
 */
export const dropFirst = <T>(arr: T[], n: number = 1): T[] => {
  return arr.slice(n);
};

/**
 * Get array without last n items
 */
export const dropLast = <T>(arr: T[], n: number = 1): T[] => {
  return arr.slice(0, -n);
};

/**
 * Zip multiple arrays together
 */
export const zip = <T extends unknown[]>(...arrays: T[][]): T[] => {
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  return Array.from({ length: maxLength }, (_, i) =>
    arrays.map(arr => arr[i])
  ) as T[];
};

/**
 * Unzip array of tuples into separate arrays
 */
export const unzip = <T>(arr: T[][]): T[][] => {
  return arr.reduce(
    (acc, item) => {
      item.forEach((val, i) => {
        if (!acc[i]) acc[i] = [];
        acc[i].push(val);
      });
      return acc;
    },
    [] as T[][]
  );
};

/**
 * Create array with same value repeated n times
 */
export const repeat = <T>(value: T, count: number): T[] => {
  return Array.from({ length: count }, () => value);
};

/**
 * Find intersection of two arrays
 */
export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => arr2.includes(item));
};

/**
 * Find difference of two arrays (items in arr1 not in arr2)
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => !arr2.includes(item));
};

/**
 * Find symmetric difference of two arrays
 */
export const symmetricDifference = <T>(arr1: T[], arr2: T[]): T[] => {
  return [...difference(arr1, arr2), ...difference(arr2, arr1)];
};

/**
 * Union of two arrays (unique items from both)
 */
export const union = <T>(arr1: T[], arr2: T[]): T[] => {
  return unique([...arr1, ...arr2]);
};

/**
 * Check if array is empty
 */
export const isEmpty = <T>(arr: T[]): boolean => {
  return arr.length === 0;
};

/**
 * Check if array includes all items
 */
export const includesAll = <T>(arr: T[], items: T[]): boolean => {
  return items.every(item => arr.includes(item));
};

/**
 * Check if array includes any items
 */
export const includesAny = <T>(arr: T[], items: T[]): boolean => {
  return items.some(item => arr.includes(item));
};

/**
 * Count occurrences of item in array
 */
export const countOccurrences = <T>(arr: T[], item: T): number => {
  return arr.filter(i => i === item).length;
};

/**
 * Count occurrences of all items in array
 */
export const countAll = <T>(arr: T[]): Map<T, number> => {
  return arr.reduce((acc, item) => {
    acc.set(item, (acc.get(item) || 0) + 1);
    return acc;
  }, new Map<T, number>());
};

/**
 * Pick specific keys from array of objects
 */
export const pick = <T, K extends keyof T>(arr: T[], keys: K[]): Pick<T, K>[] => {
  return arr.map(item =>
    keys.reduce((obj, key) => {
      if (key in item) {
        obj[key] = item[key];
      }
      return obj;
    }, {} as Pick<T, K>)
  );
};

/**
 * Omit specific keys from array of objects
 */
export const omit = <T, K extends keyof T>(arr: T[], keys: K[]): Omit<T, K>[] => {
  return arr.map(item => {
    const newObj = { ...item };
    keys.forEach(key => delete newObj[key]);
    return newObj;
  });
};
