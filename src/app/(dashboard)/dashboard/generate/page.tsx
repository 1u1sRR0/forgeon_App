'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Clock, ArrowRight, Loader2 } from 'lucide-react';

interface GenerationSession {
  id: string;
  businessType: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  QUESTIONNAIRE: { label: 'Cuestionario', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  PROMPT_REVIEW: { label: 'Revisión de Prompt', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  GENERATING: { label: 'Generando', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
  BLUEPRINTS_READY: { label: 'Blueprints Listos', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  PREVIEW_READY: { label: 'Preview Listo', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
  COMPLETED: { label: 'Completado', color: 'text-gray-400 bg-gray-400/10 border-gray-400/30' },
};

const TYPE_LABELS: Record<string, string> = {
  SAAS: 'SaaS',
  WEB_APP: 'Web App',
  LANDING_PAGE: 'Landing Page',
  MARKETPLACE: 'Marketplace',
  INTERNAL_TOOL: 'Internal Tool',
  AI_TOOL: 'AI Tool',
  ECOMMERCE: 'E-commerce',
  GUIDED: 'Guided',
};

export default function GenerateListPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<GenerationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/generate/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

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
      case 'QUESTIONNAIRE':
        return `/dashboard/generate/${session.id}/questionnaire`;
      case 'PROMPT_REVIEW':
        return `/dashboard/generate/${session.id}/prompt`;
      case 'GENERATING':
        return `/dashboard/generate/${session.id}/agents`;
      case 'BLUEPRINTS_READY':
      case 'PREVIEW_READY':
      case 'COMPLETED':
        return `/dashboard/generate/${session.id}/blueprints`;
      default:
        return `/dashboard/generate/${session.id}/questionnaire`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Generar</h1>
          <p className="text-gray-400">Crea y gestiona tus generaciones de negocios digitales.</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-purple-600 to-purple-500 text-white
            hover:from-purple-500 hover:to-purple-400
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]
            transition-all duration-200"
        >
          {creating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          Crear Negocio Digital
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/80 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Aún no hay generaciones</h2>
          <p className="text-gray-400 mb-6">Comienza creando tu primer negocio digital.</p>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-purple-600 to-purple-500 text-white
              hover:from-purple-500 hover:to-purple-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Crear Negocio Digital
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => {
            const stateInfo = STATE_LABELS[s.state] ?? STATE_LABELS.QUESTIONNAIRE;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => router.push(getSessionRoute(s))}
                className="group text-left bg-gray-900/80 rounded-xl p-5 border border-gray-700/50
                  hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]
                  backdrop-blur-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-200">
                    {TYPE_LABELS[s.businessType] ?? s.businessType}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>
                <span className={`inline-block text-xs px-2 py-1 rounded-md border ${stateInfo.color}`}>
                  {stateInfo.label}
                </span>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(s.createdAt).toLocaleDateString()}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}