'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'dashboard',
    target: '[data-onboarding="dashboard"]',
    title: 'Tu Panel Principal',
    description: 'Aquí ves un resumen de todos tus proyectos y las acciones más importantes.',
    position: 'bottom',
  },
  {
    id: 'projects',
    target: '[data-onboarding="projects"]',
    title: 'Tus Proyectos',
    description: 'Cada idea de negocio se convierte en un proyecto. Aquí los gestionas todos.',
    position: 'right',
  },
  {
    id: 'generate',
    target: '[data-onboarding="generate"]',
    title: 'Generar Negocio',
    description: 'La IA te ayuda a crear un negocio digital completo paso a paso. Solo responde unas preguntas.',
    position: 'right',
  },
  {
    id: 'evaluation',
    target: '[data-onboarding="evaluation"]',
    title: 'Evaluación',
    description: '5 agentes de IA analizan tu idea y te dicen si es viable antes de invertir tiempo.',
    position: 'right',
  },
  {
    id: 'build',
    target: '[data-onboarding="build"]',
    title: 'Construir MVP',
    description: 'Genera automáticamente el código de tu aplicación. Descárgalo como ZIP y ejecútalo.',
    position: 'right',
  },
  {
    id: 'learn',
    target: '[data-onboarding="learn"]',
    title: 'Aprender',
    description: 'Cursos personalizados para tu proyecto. Aprende lo que necesitas para lanzar tu negocio.',
    position: 'right',
  },
  {
    id: 'discover',
    target: '[data-onboarding="discover"]',
    title: 'Descubrir',
    description: 'Encuentra oportunidades de negocio y brechas de mercado que puedes aprovechar.',
    position: 'right',
  },
  {
    id: 'assistant',
    target: '[data-onboarding="assistant"]',
    title: 'Tu Asistente IA',
    description: 'Pregúntale lo que quieras sobre tu negocio, tecnología o estrategia. Siempre está disponible.',
    position: 'left',
  },
];

interface OnboardingOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingOverlay({ onComplete, onSkip }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = ONBOARDING_STEPS[currentStep];

  const updateTargetRect = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    return () => window.removeEventListener('resize', updateTargetRect);
  }, [updateTargetRect]);

  const goNext = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      if (currentStep < ONBOARDING_STEPS.length - 1) {
        let nextStep = currentStep + 1;
        // Skip steps whose target element doesn't exist
        while (nextStep < ONBOARDING_STEPS.length - 1) {
          const el = document.querySelector(ONBOARDING_STEPS[nextStep].target);
          if (el) break;
          nextStep++;
        }
        setCurrentStep(nextStep);
      } else {
        onComplete();
        return;
      }
      setVisible(true);
    }, 200);
  }, [currentStep, onComplete]);

  const getTooltipPosition = (): React.CSSProperties => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const padding = 16;
    const pos = step.position;

    if (pos === 'bottom') {
      return {
        top: targetRect.bottom + padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      };
    }
    if (pos === 'top') {
      return {
        bottom: window.innerHeight - targetRect.top + padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      };
    }
    if (pos === 'right') {
      return {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + padding,
        transform: 'translateY(-50%)',
      };
    }
    // left
    return {
      top: targetRect.top + targetRect.height / 2,
      right: window.innerWidth - targetRect.left + padding,
      transform: 'translateY(-50%)',
    };
  };

  // Spotlight clip path: full overlay with a cutout around the target
  const getClipPath = (): string => {
    if (!targetRect) return 'none';
    const p = 6; // padding around highlight
    const x = targetRect.left - p;
    const y = targetRect.top - p;
    const w = targetRect.width + p * 2;
    const h = targetRect.height + p * 2;
    const r = 12; // border radius

    // Outer rectangle (full viewport) + inner rounded rect cutout using polygon + inset
    return `polygon(
      0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
      ${x}px ${y + r}px,
      ${x + r}px ${y}px,
      ${x + w - r}px ${y}px,
      ${x + w}px ${y + r}px,
      ${x + w}px ${y + h - r}px,
      ${x + w - r}px ${y + h}px,
      ${x + r}px ${y + h}px,
      ${x}px ${y + h - r}px,
      ${x}px ${y + r}px
    )`;
  };

  return (
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true">
      {/* Semi-transparent overlay with spotlight cutout */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity duration-200"
        style={{
          clipPath: targetRect ? getClipPath() : undefined,
          opacity: visible ? 1 : 0,
        }}
        onClick={onSkip}
      />

      {/* Highlight border around target */}
      {targetRect && (
        <div
          className="absolute border-2 border-purple-500 rounded-xl pointer-events-none transition-all duration-200"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            opacity: visible ? 1 : 0,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute z-[10000] max-w-sm transition-opacity duration-200"
        style={{
          ...getTooltipPosition(),
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="bg-gray-900 border border-purple-500/40 rounded-2xl p-5 shadow-2xl shadow-purple-900/20">
          {/* Step counter */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-purple-400 font-medium">
              Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
            </span>
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              aria-label="Cerrar tutorial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">{step.description}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Saltar Tutorial
            </button>
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              {currentStep < ONBOARDING_STEPS.length - 1 ? (
                <>
                  Siguiente <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                '¡Empezar!'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
