'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Plus, Clock, ArrowRight, Loader2,
  Globe, ShoppingCart, Cpu, Layout, Wrench, Bot, Store, Compass,
  CheckCircle2, Circle, Play,
} from 'lucide-react';

interface GenerationSession {
  id: string;
  businessType: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

const STATE_CONFIG: Record<string, { label: string; color: string; step: number }> = {
  QUESTIONNAIRE: { label: 'Cuestionario', color: 'text-yellow-400', step: 1 },
  PROMPT_REVIEW: { label: 'Revisión', color: 'text-blue-400', step: 2 },
  GENERATING: { label: 'Generando', color: 'text-purple-400', step: 3 },
  BLUEPRINTS_READY: { label: 'Blueprints Listos', color: 'text-green-400', step: 4 },
  PREVIEW_READY: { label: 'Preview Listo', color: 'text-emerald-400', step: 5 },
  COMPLETED: { label: 'Completado', color: 'text-gray-400', step: 5 },
};

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Globe; color: string }> = {
  SAAS: { label: 'SaaS', icon: Cpu, color: 'text-blue-400 bg-blue-500/15' },
  WEB_APP: { label: 'Web App', icon: Globe, color: 'text-cyan-400 bg-cyan-500/15' },
  LANDING_PAGE: { label: 'Landing Page', icon: Layout, color: 'text-pink-400 bg-pink-500/15' },
  MARKETPLACE: { label: 'Marketplace', icon: Store, color: 'text-orange-400 bg-orange-500/15' },
  INTERNAL_TOOL: { label: 'Internal Tool', icon: Wrench, color: 'text-gray-400 bg-gray-500/15' },
  AI_TOOL: { label: 'AI Tool', icon: Bot, color: 'text-purple-400 bg-purple-500/15' },
  ECOMMERCE: { label: 'E-commerce', icon: ShoppingCart, color: 'text-emerald-400 bg-emerald-500/15' },
  GUIDED: { label: 'Guided', icon: Compass, color: 'text-amber-400 bg-amber-500/15' },
};

const STEPS = ['Cuestionario', 'Revisión', 'Agentes IA', 'Blueprints', 'Preview'];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function GenerateListPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<GenerationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/generate/sessions')
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setSessions(Array.isArray(d) ? d : []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/generate/sessions', { method: 'POST' });
      if (res.ok) {
        const { id } = await res.json();
        router.push(`/dashboard/generate/${id}/questionnaire`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setCreating(false);
    }
  };

  const getSessionRoute = (session: GenerationSession) => {
    switch (session.state) {
      case 'QUESTIONNAIRE': return `/dashboard/generate/${session.id}/questionnaire`;
      case 'PROMPT_REVIEW': return `/dashboard/generate/${session.id}/prompt`;
      case 'GENERATING': return `/dashboard/generate/${session.id}/agents`;
      case 'BLUEPRINTS_READY':
      case 'PREVIEW_READY':
      case 'COMPLETED': return `/dashboard/generate/${session.id}/blueprints`;
      default: return `/dashboard/generate/${session.id}/questionnaire`;
    }
  };

  const getActionLabel = (state: string) => {
    switch (state) {
      case 'QUESTIONNAIRE': return 'Continuar cuestionario';
      case 'PROMPT_REVIEW': return 'Revisar prompt';
      case 'GENERATING': return 'Ver progreso';
      case 'BLUEPRINTS_READY': return 'Ver blueprints';
      case 'PREVIEW_READY': return 'Ver preview';
      case 'COMPLETED': return 'Ver resultado';
      default: return 'Continuar';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Generar</h1>
          <p className="text-gray-400 mt-1">Crea negocios digitales con IA</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Nuevo
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        /* Empty state — single prominent CTA */
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 via-gray-900/50 to-fuchsia-900/20 p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.1),transparent_70%)]" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/15 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Crea tu primer negocio digital</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
              Responde un cuestionario, nuestros agentes de IA generarán blueprints completos, y podrás ver un preview funcional de tu negocio.
            </p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Crear Negocio Digital
            </button>
            {/* Steps preview */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-medium">
                      {i + 1}
                    </div>
                    <span className="text-[11px] text-gray-500">{step}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="w-4 h-px bg-white/10" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Sessions list — clean rows, not cards */
        <div className="space-y-3">
          {sessions.map((s) => {
            const stateInfo = STATE_CONFIG[s.state] ?? STATE_CONFIG.QUESTIONNAIRE;
            const typeInfo = TYPE_CONFIG[s.businessType] ?? { label: s.businessType, icon: Globe, color: 'text-gray-400 bg-gray-500/15' };
            const Icon = typeInfo.icon;
            const currentStep = stateInfo.step;
            const isComplete = currentStep >= 5;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => router.push(getSessionRoute(s))}
                className="group w-full text-left bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/10 hover:border-purple-500/30 p-5 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Type icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                        {typeInfo.label}
                      </h3>
                      <span className={`text-[11px] font-medium ${stateInfo.color}`}>
                        · {stateInfo.label}
                      </span>
                    </div>

                    {/* Progress steps */}
                    <div className="flex items-center gap-1">
                      {STEPS.map((_, i) => {
                        const stepNum = i + 1;
                        const done = stepNum < currentStep;
                        const active = stepNum === currentStep;
                        return (
                          <div key={i} className="flex items-center gap-1">
                            {done ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : active ? (
                              <Play className="w-3 h-3 text-purple-400 fill-purple-400" />
                            ) : (
                              <Circle className="w-3 h-3 text-gray-700" />
                            )}
                            {i < STEPS.length - 1 && (
                              <div className={`w-3 h-px ${done ? 'bg-emerald-500/40' : 'bg-white/5'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right side: time + action */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px]">{timeAgo(s.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-purple-400 opacity-0 group-hover:opacity-100 transition-all">
                      {getActionLabel(s.state)}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* New session row */}
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full text-left bg-white/[0.01] hover:bg-white/[0.04] rounded-xl border border-dashed border-white/10 hover:border-purple-500/30 p-5 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center flex-shrink-0 transition-all">
                {creating ? (
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 group-hover:text-purple-300 transition-colors">
                  Crear nuevo negocio digital
                </p>
                <p className="text-[11px] text-gray-600">Cuestionario → Agentes IA → Blueprints → Preview</p>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
