'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FloatingButton from './FloatingButton';
import CompactWidget from './CompactWidget';

export default function FloatingAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show on auth pages or assistant page
  const shouldShow =
    session &&
    pathname?.startsWith('/dashboard') &&
    !pathname?.includes('/assistant');

  if (!shouldShow) return null;

  return (
    <>
      <FloatingButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      {isOpen && <CompactWidget onClose={() => setIsOpen(false)} />}
    </>
  );
}
