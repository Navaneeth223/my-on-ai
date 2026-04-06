"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? (JSON.parse(item) as T) : initialValue);
    } catch {
      setStoredValue(initialValue);
    } finally {
      setIsHydrated(true);
    }
  }, [initialValue, key]);

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((current) => {
      const nextValue = value instanceof Function ? value(current) : value;
      window.localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  };

  return [storedValue, setValue, isHydrated] as const;
}
