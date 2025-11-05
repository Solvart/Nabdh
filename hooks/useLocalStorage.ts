
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getStorageValue<T,>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const initial = JSON.parse(saved);
        return initial;
      } catch (error) {
        console.error("Error parsing JSON from localStorage", error);
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

// Fix: Imported Dispatch and SetStateAction from react and updated the return type signature to resolve "Cannot find namespace 'React'" error.
export const useLocalStorage = <T,>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
