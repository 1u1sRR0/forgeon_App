'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import FloatingButton from './FloatingButton';
import CompactWidget from './CompactWidget';

export default function FloatingAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const pathname = usePathname();

  const handleAnimationEnd = useCallback(() => {
    setIsAnimating(false);
    if (!isOpen) {
      setHasBeenOpened(false);
    }
  }, [isOpen]);

  // Hide on the full assistant page (it has its own UI)
  if (pathname?.includes('/dashboard/assistant')) return null;

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!isOpen) {
      setHasBeenOpened(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsOpen(true);
        });
      });
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen(false);
  };

  return (
    <>
      <FloatingButton
        onClick={handleToggle}
        isOpen={isOpen}
        isAnimating={isAnimating}
      />
      {hasBeenOpened && (
        <CompactWidget
          onClose={handleClose}
          isVisible={isOpen}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
    </>
  );
}
