'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Bot, Loader2, CheckCircle2, XCircle, Clock, Rocket, FolderKanban, Eye, Sparkles } from 'lucide-react';

interface AgentStatus {
  agentType: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;
}

interface StatusResponse {
  sessionState: string;
  projectId: string | null;
  agents: AgentStatus[];
}

const AGENT_META: Record<string, { name: string; emoji: string }> = {
  BUSINESS_STRATEGIST: { name: 'Estrategia de Negocio', emoji: '📊' },
  PRODUCT_ARCHITECT: { name: 'Arquitectura de Producto', emoji: '🏗️' },
  UX_UI_AGENT: { name: 'Diseño UX/UI', emoji: '🎨' },
  TECHNICAL_ARCHITECT: { name: 'Arquitectura Técnica', emoji: '⚙️' },
  QA_CRITICAL_AGENT: { name: 'Revisión QA', emoji: '🔍' },
  BUILD_PLANNER: { name: 'Plan de Construcción', emoji: '📋' },
  MONETIZATION_GTM: { name: 'Monetización & GTM', emoji: '💰' },
};

const AGENT_ORDER = [
  'BUSINESS_STRATEGIST',
  'PRODUCT_ARCHITECT',
  'UX_UI_AGENT',
  'TECHNICAL_ARCHITECT',
  'QA_CRITICAL_AGENT',
  'BUILD_PLANNER',
  'MONETIZATION_GTM',
];

export default function AgentsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [sessionState, setSessionState] = useState<string>('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const executedRef = useRef(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const executingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => { executingRef.current = executing; }, [executing]);

  const updateFromStatus = useCallback((data: StatusResponse) => {
    setSessionState(data.sessionState);
    if (data.projectId) setProjectId(data.projectId);
    const map: Record<string, AgentStatus> = {};
    data.agents.forEach((a) => { map[a.agentType] = a; });
    setAgentStatuses(map);
  }, []);

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/generate/sessions/${sessionId}/status`);
      if (!res.ok) return;
      const data: StatusResponse = await res.json();
      updateFromStatus(data);

      if (data.sessionState === 'COMPLETED' || data.sessionState === 'BLUEPRINTS_READY') {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setExecuting(false);
        // Auto-redirect to preview page after a short delay so user sees completion
        setTimeout(() => {
          router.push(`/dashboard/generate/${sessionId}/preview`);
        }, 1500);
      }

      // Pipeline failed — state reverted to PROMPT_REVIEW
      if (data.sessionState === 'PROMPT_REVIEW' && executingRef.current) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setExecuting(false);
        const failedAgents = data.agents.filter((a: AgentStatus) => a.status === 'FAILED');
        if (failedAgents.length > 0) {
          setError(`El pipeline falló en: ${failedAgents.map((a: AgentStatus) => AGENT_META[a.agentType]?.name || a.agentType).join(', ')}`);
        } else {
          setError('El pipeline falló inesperadamente. Verifica tu configuración de IA en .env.local y que tengas una API key válida.');
        }
      }
    } catch { /* ignore */ }
  }, [sessionId, updateFromStatus]);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    const start = async () => {
      // Check current status first
      try {
        const statusRes = await fetch(`/api/generate/sessions/${sessionId}/status`);
        if (statusRes.ok) {
          const data: StatusResponse = await statusRes.json();
          updateFromStatus(data);
          if (data.sessionState === 'COMPLETED') {
            // Already done — go to preview
            router.push(`/dashboard/generate/${sessionId}/preview`);
            return;
          }
          if (data.sessionState === 'GENERATING') {
            // Already running, just poll
            setExecuting(true);
            pollingRef.current = setInterval(pollStatus, 2000);
            return;
          }
        }
      } catch { /* continue */ }

      setExecuting(true);

      try {
        const res = await fetch(`/api/generate/sessions/${sessionId}/execute`, { method: 'POST' });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'La ejecución del pipeline falló');
          setExecuting(false);
          return;
        }

        if (data.status === 'already_completed') {
          router.push(`/dashboard/generate/${sessionId}/preview`);
          return;
        }

        // Started or already_running — poll for progress
        pollingRef.current = setInterval(pollStatus, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'La ejecución falló');
        setExecuting(false);
      }
    };

    start();
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [sessionId, pollStatus, updateFromStatus]);

  const completedCount = AGENT_ORDER.filter(
    (t) => agentStatuses[t]?.status === 'COMPLETED'
  ).length;
  const failedCount = AGENT_ORDER.filter(
    (t) => agentStatuses[t]?.status === 'FAILED'
  ).length;
  const isComplete = sessionState === 'COMPLETED';

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <button
        onClick={() => router.push(`/dashboard/generate/${sessionId}/prompt`)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Prompt
      </button>

      <div className="text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isComplete ? 'bg-green-500/20' : 'bg-purple-500/20'
        }`}>
          {isComplete ? (
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          ) : (
            <Bot className="w-8 h-8 text-purple-400" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {isComplete ? '¡Proyecto Generado!' : 'Pipeline de Agentes IA'}
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {isComplete
            ? `Los ${completedCount} agentes completaron el análisis de tu negocio digital.${failedCount > 0 ? ` (${failedCount} con errores)` : ''}`
            : executing
            ? `Procesando agentes... (${completedCount}/${AGENT_ORDER.length})`
            : 'Preparando el pipeline de agentes...'}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300 text-center">
          ❌ {error}
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            isComplete ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-purple-600 to-purple-400'
          }`}
          style={{ width: `${(completedCount / AGENT_ORDER.length) * 100}%` }}
        />
      </div>

      {/* Agent list */}
      <div className="space-y-3">
        {AGENT_ORDER.map((type) => {
          const meta = AGENT_META[type];
          const status = agentStatuses[type];
          const st = status?.status || 'PENDING';

          return (
            <div
              key={type}
              className={`bg-gray-900/80 border rounded-xl px-5 py-4 flex items-center gap-4 transition-all ${
                st === 'RUNNING'
                  ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : st === 'COMPLETED'
                  ? 'border-green-500/30'
                  : st === 'FAILED'
                  ? 'border-red-500/30'
                  : 'border-gray-800'
              }`}
            >
              <span className="text-2xl">{meta.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-300">{meta.name}</p>
                <p className={`text-xs ${
                  st === 'RUNNING' ? 'text-purple-400' :
                  st === 'COMPLETED' ? 'text-green-400' :
                  st === 'FAILED' ? 'text-red-400' :
                  'text-gray-500'
                }`}>
                  {st === 'RUNNING' ? 'Procesando...' :
                   st === 'COMPLETED' ? 'Completado ✓' :
                   st === 'FAILED' ? `Error: ${status?.errorMessage?.substring(0, 80) || 'Falló'}` :
                   'En espera'}
                </p>
              </div>
              {st === 'RUNNING' && <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />}
              {st === 'COMPLETED' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              {st === 'FAILED' && <XCircle className="w-5 h-5 text-red-400" />}
              {st === 'PENDING' && <Clock className="w-5 h-5 text-gray-600" />}
            </div>
          );
        })}
      </div>

      {/* Action buttons when complete */}
      {isComplete && (
        <div className="bg-gray-900/80 border border-green-500/20 rounded-xl p-6 text-center space-y-4">
          <p className="text-gray-300 text-sm">
            Tu proyecto ha sido creado con los blueprints generados por los agentes.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => router.push(`/dashboard/generate/${sessionId}/preview`)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 hover:from-purple-500 hover:via-purple-400 hover:to-fuchsia-400 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <Sparkles className="w-3.5 h-3.5" />
              Ver Preview
            </button>
            <button
              onClick={() => router.push(`/dashboard/generate/${sessionId}/blueprints`)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" /> Ver Blueprints
            </button>
            {projectId && (
              <button
                onClick={() => router.push(`/dashboard/projects/${projectId}`)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                <FolderKanban className="w-4 h-4" /> Ver Proyecto
              </button>
            )}
          </div>
        </div>
      )}

      {/* Retry button on error */}
      {error && !executing && (
        <div className="text-center">
          <button
            onClick={() => {
              setError(null);
              executedRef.current = false;
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            Reintentar Pipeline
          </button>
        </div>
      )}
    </div>
  );
}
