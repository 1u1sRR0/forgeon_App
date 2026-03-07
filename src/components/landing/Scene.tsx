'use client';

import { useEffect, useRef, useState } from 'react';

interface SceneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  gradient?: {
    from: string;
    to: string;
    direction?: string;
  };
  radialGlow?: {
    color: string;
    position: string;
    intensity: 'low' | 'medium' | 'high';
  };
  noiseTexture?: boolean;
}

export default function Scene({
  id,
  children,
  className = '',
  gradient,
  radialGlow,
  noiseTexture = false,
}: SceneProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Fallback for browsers without Intersection Observer
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sceneRef.current) {
      observer.observe(sceneRef.current);
    }

    return () => {
      if (sceneRef.current) {
        observer.unobserve(sceneRef.current);
      }
    };
  }, []);

  // Radial glow position mapping
  const glowPositionClasses: Record<string, string> = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  // Radial glow intensity mapping - minimal for very subtle effect
  const glowIntensityClasses: Record<string, string> = {
    low: 'w-96 h-96 opacity-5',
    medium: 'w-[600px] h-[600px] opacity-8',
    high: 'w-[800px] h-[800px] opacity-10',
  };

  return (
    <section
      id={id}
      ref={sceneRef}
      className={`
        relative min-h-screen w-full overflow-hidden
        transition-all duration-800 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
    >
      {/* Gradient Overlay */}
      {gradient && (
        <div
          className={`
            absolute inset-0 pointer-events-none
            bg-gradient-${gradient.direction || 'to-b'}
            ${gradient.from} ${gradient.to}
          `}
        />
      )}

      {/* Radial Glow */}
      {radialGlow && (
        <div
          className={`
            absolute pointer-events-none blur-3xl rounded-full
            bg-${radialGlow.color}
            ${glowPositionClasses[radialGlow.position] || glowPositionClasses.center}
            ${glowIntensityClasses[radialGlow.intensity]}
          `}
        />
      )}

      {/* Noise Texture */}
      {noiseTexture && (
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
