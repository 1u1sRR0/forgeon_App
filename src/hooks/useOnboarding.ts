'use client';

import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_STORAGE_KEY = 'forgeon_onboarding_complete';

export function useOnboarding() {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    try {
      const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (completed !== 'true') {
        setShouldShowOnboarding(true);
      }
    } catch {
      // localStorage not available (SSR or privacy mode)
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setShouldShowOnboarding(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {
      // ignore
    }
    setShouldShowOnboarding(true);
  }, []);

  return { shouldShowOnboarding, completeOnboarding, resetOnboarding };
}
