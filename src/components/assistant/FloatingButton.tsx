'use client';

import { X } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingButton({ onClick, isOpen }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg shadow-purple-900/40 flex items-center justify-center transition-all z-40 hover:scale-110 active:scale-95 overflow-hidden border-2 border-purple-500/40 hover:border-purple-400/60"
      style={{ background: isOpen ? '#1e1e2e' : '#111118' }}
      aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white" />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/chatbot_logo.png"
          alt="Forgeon Assistant"
          className="w-full h-full object-cover rounded-full"
        />
      )}
    </button>
  );
}
