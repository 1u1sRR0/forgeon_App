'use client';

import { X } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  isAnimating?: boolean;
}

export default function FloatingButton({ onClick, isOpen, isAnimating = false }: FloatingButtonProps) {
  const handleClick = () => {
    if (isAnimating) return;
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAnimating}
      data-onboarding="assistant"
      className={`fixed bottom-6 right-6 w-24 h-24 rounded-full flex items-center justify-center transition-all z-40 border-0 bg-transparent p-0 ${
        isAnimating ? 'cursor-not-allowed opacity-70' : 'hover:scale-110 active:scale-95'
      }`}
      style={{
        filter: isOpen
          ? 'none'
          : 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.6)) drop-shadow(0 0 24px rgba(124, 58, 237, 0.3))',
      }}
      aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <div className="w-full h-full rounded-full bg-[#1e1e2e] border-2 border-purple-500/40 flex items-center justify-center">
          <X className="w-6 h-6 text-white" />
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/chatbot_logo.png"
          alt="Forgeon Assistant"
          className="w-full h-full object-contain"
        />
      )}
    </button>
  );
}
