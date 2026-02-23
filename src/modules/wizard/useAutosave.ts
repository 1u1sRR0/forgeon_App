'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AutosaveOptions {
  onSave: (value: string | null) => Promise<void>;
  delay?: number;
}

export function useAutosave({ onSave, delay = 500 }: AutosaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const save = useCallback(
    async (value: string | null) => {
      if (isSavingRef.current) {
        return;
      }

      try {
        isSavingRef.current = true;
        await onSave(value);
      } catch (error) {
        console.error('Autosave error:', error);
      } finally {
        isSavingRef.current = false;
      }
    },
    [onSave]
  );

  const debouncedSave = useCallback(
    (value: string | null) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        save(value);
      }, delay);
    },
    [save, delay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { debouncedSave, save };
}
