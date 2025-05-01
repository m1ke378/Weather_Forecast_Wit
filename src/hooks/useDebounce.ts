import { useState, useEffect } from "react";

/**
 * useDebounce returns a debounced value that updates after the received delay.
 *
 * @param value - The input value to debounce
 * @param delay - Delay in milliseconds
 */

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
