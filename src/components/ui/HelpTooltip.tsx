'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function HelpTooltip({ text, position = 'top' }: HelpTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        // Auto-close after 5 seconds
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setOpen(false), 5000);
      } else {
        if (timerRef.current) clearTimeout(timerRef.current);
      }
      return next;
    });
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={toggle}
        className="text-gray-500 hover:text-purple-400 transition-colors duration-200 p-0.5"
        aria-label="Ayuda"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {open && (
        <div
          className={`absolute z-50 w-56 ${positionClasses[position]}`}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
            <p className="text-xs text-gray-300 leading-relaxed">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
