'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import FloatingButton from './FloatingButton';
import CompactWidget from './CompactWidget';

export default function FloatingAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide on the full assistant page (it has its own UI)
  if (pathname?.includes('/dashboard/assistant')) return null;

  return (
    <>
      <FloatingButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      {isOpen && <CompactWidget onClose={() => setIsOpen(false)} />}
    </>
  );
}
