'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingButton({ onClick, isOpen }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg shadow-purple-900/30 flex items-center justify-center transition-all z-40 hover:scale-110 active:scale-95 overflow-hidden border-2 border-purple-500/30"
      style={{ background: isOpen ? '#1e1e2e' : 'transparent' }}
      aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white" />
      ) : (
        <Image
          src="/bot_forgeon.png"
          alt="Forgeon Assistant"
          width={64}
          height={64}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Fallback to chatbot_logo if bot_forgeon doesn't exist
            (e.target as HTMLImageElement).src = '/chatbot_logo.png';
          }}
        />
      )}
    </button>
  );
}
