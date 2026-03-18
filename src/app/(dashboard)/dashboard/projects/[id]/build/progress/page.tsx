'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Pipeline Step Types ---
interface PipelineStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message?: string;
}

const INITIAL_PIPELINE_STEPS: PipelineStep[] = [
  { id: 'validation', label: 'Validación', status: 'pending' },
  { id: 'schema', label: 'Generación de Esquema', status: 'pending' },
  { id: 'api', label: 'Generación de API', status: 'pending' },
  { id: 'ui', label: 'Generación de UI', status: 'pending' },
  { id: 'quality', label: 'Quality Gates', status: 'pending' },
  { id: 'packaging', label: 'Empaquetado ZIP', status: 'pending' },
];

// --- Build Log → Pipeline Step Mapping ---
export function parseBuildLogToSteps(
  buildLog: string[],
  buildStatus: string
): PipelineStep[] {
  const steps: PipelineStep[] = INITIAL_PIPELINE_STEPS.map((s) => ({ ...s }));

  // Track which step index is currently active
  let lastActiveIndex = -1;

  for (const entry of buildLog) {
    if (/Starting build/i.test(entry)) {
      steps[0].status = 'in_progress';
      lastActiveIndex = Math.max(lastActiveIndex, 0);
    }
    if (/Generating Prisma schema/i.test(entry)) {
      // Mark validation as completed
      if (steps[0].status === 'in_progress') steps[0].status = 'completed';
      steps[1].status = 'in_progress';
      lastActiveIndex = Math.max(lastActiveIndex, 1);
    }
    if (/Generating.*API|Generating.*route/i.test(entry)) {
      if (steps[1].status === 'in_progress') steps[1].status = 'completed';
      steps[2].status = 'in_progress';
      lastActiveIndex = Math.max(lastActiveIndex, 2);
    }
    if (/Generating.*page|Generating.*UI/i.test(entry)) {
      if (steps[2].status === 'in_progress') steps[2].status = 'completed';
      steps[3].status = 'in_progress';
      lastActiveIndex = Math.max(lastActiveIndex, 3);
    }
    if (/Running quality gates/i.test(entry)) {
      if (steps[3].status === 'in_progress') steps[3].status = 'completed';
      steps[4].status = 'in_progress';
      lastActiveIndex = Math.max(lastActiveIndex, 4);
    }
    if (/Creating ZIP/i.test(entry)) {
      if (steps[4].status === 'in_progress') steps[4].status = 'completed';
      steps[5].status = 'in_progress';
      lastActiveIndex = Math.max(lastActiveIndex, 5);
    }
    if (/Build completed/i.test(entry)) {
      // Mark all as completed
      for (const step of steps) {
        step.status = 'completed';
      }
      lastActiveIndex = 5;
    }
    if (/Build failed|FAILED/i.test(entry)) {
      // Mark current in_progress step as failed
      const currentStep = steps.find((s) => s.status === 'in_progress');
      if (currentStep) {
        currentStep.status = 'failed';
        currentStep.message = entry;
      }
    }
  }

  return steps;
}

// --- API Response Type ---
interface BuildStatusResponse {
  buildId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  buildLog: string[];
  errorMessage: string | null;
  zipPath: string | null;
  qualityChecksPassed: boolean;
  templateType: string;
  createdAt: string;
  completedAt: string | null;
}

// --- Step Icon Components ---
function StepIcon({ status }: { status: PipelineStep['status'] }) {
  if (status === 'completed') {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-scale-in">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === 'in_progress') {
    return (
      <div className="w-8 h-8 rounded-full border-2 border-purple-500 bg-purple-500/20 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="w-8 h-8 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  // pending
  return (
    <div className="w-8 h-8 rounded-full border-2 border-gray-600 bg-gray-800 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-gray-600" />
    </div>
  );
}


// --- Main Page Component ---
export default function BuildProgressPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [buildData, setBuildData] = useState<BuildStatusResponse | null>(null);
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_PIPELINE_STEPS.map((s) => ({ ...s })));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBuildStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/build`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener el estado del build');
      }

      setBuildData(data);
      setSteps(parseBuildLogToSteps(data.buildLog || [], data.status));
      setLoading(false);

      // Auto-redirect to result page on COMPLETED after 1 second
      if (data.status === 'COMPLETED' && !redirectTimerRef.current) {
        redirectTimerRef.current = setTimeout(() => {
          router.push(`/dashboard/projects/${params.id}/build/result`);
        }, 1000);
      }
      // Also redirect on FAILED after 1 second
      if (data.status === 'FAILED' && !redirectTimerRef.current) {
        redirectTimerRef.current = setTimeout(() => {
          router.push(`/dashboard/projects/${params.id}/build/result`);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [params.id, router]);

  // Polling every 2 seconds
  useEffect(() => {
    fetchBuildStatus();
    const interval = setInterval(fetchBuildStatus, 2000);
    return () => {
      clearInterval(interval);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [fetchBuildStatus]);

  // Auto-scroll build log to latest entry
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [buildData?.buildLog]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-800 rounded w-2/3 mb-8" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl mb-6">
            {error}
          </div>
          <Link
            href={`/dashboard/projects/${params.id}`}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            ← Volver al Proyecto
          </Link>
        </div>
      </div>
    );
  }

  const isActive = buildData?.status === 'PENDING' || buildData?.status === 'IN_PROGRESS';
  const isCompleted = buildData?.status === 'COMPLETED';
  const isFailed = buildData?.status === 'FAILED';

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/projects/${params.id}`}
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm mb-4 inline-block"
          >
            ← Volver al Proyecto
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isCompleted
              ? '¡Build Completado!'
              : isFailed
                ? 'Build Fallido'
                : 'Generando tu MVP...'}
          </h1>
          <p className="text-gray-400">
            {isActive
              ? 'Tu MVP se está generando. Esto puede tomar unos minutos.'
              : isCompleted
                ? 'Redirigiendo a la página de resultados...'
                : 'Hubo un error durante la generación.'}
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6">Pipeline de Generación</h2>
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4 py-3">
                {/* Connector line */}
                <div className="flex flex-col items-center">
                  <StepIcon status={step.status} />
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-6 mt-1 transition-colors duration-300 ${
                        step.status === 'completed'
                          ? 'bg-gradient-to-b from-purple-500 to-pink-500'
                          : step.status === 'failed'
                            ? 'bg-red-500/50'
                            : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1">
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${
                      step.status === 'completed'
                        ? 'text-white'
                        : step.status === 'in_progress'
                          ? 'text-purple-300'
                          : step.status === 'failed'
                            ? 'text-red-400'
                            : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.status === 'in_progress' && (
                    <span className="ml-2 text-xs text-purple-400 animate-pulse">En progreso...</span>
                  )}
                  {step.status === 'failed' && step.message && (
                    <p className="text-xs text-red-400 mt-1">{step.message}</p>
                  )}
                </div>

                {/* Status badge */}
                <div>
                  {step.status === 'completed' && (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      Completado
                    </span>
                  )}
                  {step.status === 'failed' && (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
                      Error
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Build Log Terminal */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <h2 className="text-sm font-medium text-gray-400 ml-2">Build Log</h2>
          </div>
          <div
            ref={logContainerRef}
            className="max-h-64 overflow-y-auto font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            {buildData?.buildLog && buildData.buildLog.length > 0 ? (
              buildData.buildLog.map((line, idx) => (
                <div
                  key={idx}
                  className={`py-0.5 ${
                    /error|fail|FAILED/i.test(line)
                      ? 'text-red-400'
                      : /warning/i.test(line)
                        ? 'text-yellow-400'
                        : /completed|success|passed/i.test(line)
                          ? 'text-green-400'
                          : 'text-gray-300'
                  }`}
                >
                  <span className="text-gray-600 select-none mr-2">{String(idx + 1).padStart(2, '0')}</span>
                  {line}
                </div>
              ))
            ) : (
              <div className="text-gray-500">Esperando inicio del build...</div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {buildData?.errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
            <p className="text-red-400 font-semibold mb-2">Error del Build:</p>
            <p className="text-red-300 font-mono text-sm">{buildData.errorMessage}</p>
          </div>
        )}

        {/* Active spinner */}
        {isActive && (
          <div className="flex items-center justify-center py-6">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-gray-700" />
              <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" />
            </div>
          </div>
        )}

        {/* Completed redirect notice */}
        {isCompleted && (
          <div className="text-center py-4">
            <p className="text-purple-400 animate-pulse">Redirigiendo a resultados...</p>
          </div>
        )}
      </div>
    </div>
  );
}
