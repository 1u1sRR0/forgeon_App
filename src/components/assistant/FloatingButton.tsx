'use client';

import { MessageCircle } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingButton({ onClick, isOpen }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40"
      aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      aria-expanded={isOpen}
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
