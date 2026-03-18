'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Loader2, XCircle, Clock, Sparkles } from 'lucide-react';

// --- Types & Constants ---

export interface GenerationStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export const GENERATION_STEPS: GenerationStep[] = [
  { id: 'business', label: 'Generando plan de negocio...', status: 'pending' },
  { id: 'strategy', label: 'Diseñando estrategia...', status: 'pending' },
  { id: 'market', label: 'Analizando mercado...', status: 'pending' },
  { id: 'architecture', label: 'Creando arquitectura técnica...', status: 'pending' },
  { id: 'financial', label: 'Calculando proyecciones financieras...', status: 'pending' },
  { id: 'ux', label: 'Diseñando experiencia de usuario...', status: 'pending' },
  { id: 'qa', label: 'Revisando calidad...', status: 'pending' },
  { id: 'build', label: 'Preparando plan de construcción...', status: 'pending' },
];

export const AGENT_TO_STEP: Record<string, string> = {
  BUSINESS_STRATEGIST: 'business',
  PRODUCT_ARCHITECT: 'strategy',
  UX_UI_AGENT: 'ux',
  TECHNICAL_ARCHITECT: 'architecture',
  QA_CRITICAL_AGENT: 'qa',
  BUILD_PLANNER: 'build',
  MONETIZATION_GTM: 'financial',
};

// --- Component ---

export interface GenerationLoadingStepsProps {
  steps: GenerationStep[];
  allComplete: boolean;
  onCelebrationEnd: () => void;
}

export default function GenerationLoadingSteps({
  steps,
  allComplete,
  onCelebrationEnd,
}: GenerationLoadingStepsProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (allComplete && !showCelebration) {
      setShowCelebration(true);
    }
  }, [allComplete, showCelebration]);

  useEffect(() => {
    if (showCelebration) {
      redirectTimerRef.current = setTimeout(() => {
        onCelebrationEnd();
      }, 2000);
    }
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [showCelebration, onCelebrationEnd]);

  return (
    <div className="space-y-4">
      {/* Step list */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="animate-step-complete"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <StepRow step={step} />
          </div>
        ))}
      </div>

      {/* Celebration */}
      {showCelebration && (
        <div className="animate-celebration mt-8 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-blue-600/20 border border-purple-500/30">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold text-white">
              ¡Listo, ya lo tienes!
            </span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Redirigiendo al preview...
          </p>
        </div>
      )}
    </div>
  );
}

// --- Step Row ---

function StepRow({ step }: { step: GenerationStep }) {
  const isPending = step.status === 'pending';
  const isInProgress = step.status === 'in_progress';
  const isCompleted = step.status === 'completed';
  const isFailed = step.status === 'failed';

  return (
    <div
      className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-all duration-200 ${
        isInProgress
          ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.1)]'
          : isCompleted
          ? 'bg-green-500/5 border-green-500/20'
          : isFailed
          ? 'bg-red-500/5 border-red-500/20'
          : 'bg-gray-900/50 border-gray-800/50'
      }`}
    >
      {/* Status icon */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isPending && <Clock className="w-5 h-5 text-gray-600" />}
        {isInProgress && <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />}
        {isCompleted && (
          <div className="animate-checkmark">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
        )}
        {isFailed && <XCircle className="w-5 h-5 text-red-400" />}
      </div>

      {/* Label */}
      <span
        className={`text-sm font-medium ${
          isPending
            ? 'text-gray-500'
            : isInProgress
            ? 'text-purple-300'
            : isCompleted
            ? 'text-green-300'
            : 'text-red-300'
        }`}
      >
        {step.label}
      </span>
    </div>
  );
}
