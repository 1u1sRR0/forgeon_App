'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Sparkles,
  Loader2,
  RefreshCw,
  Edit3,
  Save,
  ArrowLeft,
  Rocket,
  Copy,
  Check,
  History,
} from 'lucide-react';

interface PromptVersion {
  id: string;
  version: number;
  type: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

type Phase = 'generating' | 'review' | 'editing';

export default function PromptReviewPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [phase, setPhase] = useState<Phase>('generating');
  const [activePrompt, setActivePrompt] = useState<PromptVersion | null>(null);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if prompt already exists, otherwise generate it
  const loadOrGenerate = useCallback(async () => {
    try {
      // First check if prompt already exists
      const res = await fetch(`/api/generate/sessions/${sessionId}/prompt`);
      if (res.ok) {
        const data = await res.json();
        if (data.activePrompt) {
          setActivePrompt(data.activePrompt);
          setVersions(data.versions || []);
          setPhase('review');
          return;
        }
      }

      // No prompt yet — generate one
      setPhase('generating');
      const genRes = await fetch(`/api/generate/sessions/${sessionId}/prompt`, {
        method: 'POST',
      });

      if (!genRes.ok) {
        const errData = await genRes.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${genRes.status}: Error al generar el prompt`);
      }

      const genData = await genRes.json();
      setActivePrompt(genData.prompt);
      setVersions([genData.prompt]);
      setPhase('review');
    } catch (err) {
      console.error('Error loading/generating prompt:', err);
      setError(err instanceof Error ? err.message : 'Algo salió mal');
      setPhase('review');
    }
  }, [sessionId]);

  useEffect(() => {
    loadOrGenerate();
  }, [loadOrGenerate]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch(`/api/generate/sessions/${sessionId}/prompt`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Error al regenerar');
      const data = await res.json();
      setActivePrompt(data.prompt);
      // Refresh versions
      const vRes = await fetch(`/api/generate/sessions/${sessionId}/prompt`);
      if (vRes.ok) {
        const vData = await vRes.json();
        setVersions(vData.versions || []);
      }
    } catch (err) {
      setError('Error al regenerar el prompt. Intenta de nuevo.');
      console.error(err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleEdit = () => {
    setEditContent(activePrompt?.content || '');
    setPhase('editing');
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/generate/sessions/${sessionId}/prompt`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      const data = await res.json();
      setActivePrompt(data.prompt);
      // Refresh versions
      const vRes = await fetch(`/api/generate/sessions/${sessionId}/prompt`);
      if (vRes.ok) {
        const vData = await vRes.json();
        setVersions(vData.versions || []);
      }
      setPhase('review');
    } catch (err) {
      setError('Error al guardar el prompt.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    if (activePrompt?.content) {
      await navigator.clipboard.writeText(activePrompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectVersion = (v: PromptVersion) => {
    setActivePrompt(v);
    setShowVersions(false);
  };

  const handleLaunchAgents = () => {
    // TODO: In the future, this will trigger the agent pipeline
    // For now, navigate to a placeholder or back to projects
    router.push(`/dashboard/generate/${sessionId}/agents`);
  };

  // ─── Generating Phase ───
  if (phase === 'generating') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-purple-500/30 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Generando Master Prompt</h2>
          <p className="text-gray-400 text-sm max-w-md">
            El Arquitecto de Prompts está analizando tus respuestas del cuestionario y creando un prompt completo para el pipeline de agentes...
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Esto puede tomar un momento
          </div>
        </div>
      </div>
    );
  }

  // ─── Editing Phase ───
  if (phase === 'editing') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPhase('review')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a revisión
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={saving || !editContent.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Cambios
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Editar Master Prompt</h2>
          <p className="text-sm text-gray-400">Personaliza el prompt para que se ajuste mejor a tu visión.</p>
        </div>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-[60vh] p-4 bg-gray-900 border border-gray-700 rounded-xl text-gray-200 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:border-purple-500 transition-colors"
          placeholder="Edita tu master prompt..."
        />
      </div>
    );
  }

  // ─── Review Phase ───
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/dashboard/generate/${sessionId}/questionnaire`)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al cuestionario
        </button>
        <div className="flex items-center gap-2">
          {versions.length > 1 && (
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              v{activePrompt?.version} of {versions.length}
            </button>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Master Prompt</h1>
        <p className="text-gray-400 text-sm">
          Revisa y refina el prompt generado antes de lanzar el pipeline de agentes.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Version selector dropdown */}
      {showVersions && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 space-y-1">
          <p className="text-xs text-gray-500 mb-2 px-2">Versiones del Prompt</p>
          {versions.map((v) => (
            <button
              key={v.id}
              onClick={() => handleSelectVersion(v)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                v.id === activePrompt?.id
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="font-medium">v{v.version}</span>
              <span className="text-xs text-gray-500 ml-2">
                {v.type === 'ORIGINAL' ? 'Original' : v.type === 'CUSTOM' ? 'Personalizado' : v.type === 'OPTIMIZED' ? 'Optimizado' : v.type}
              </span>
              <span className="text-xs text-gray-600 ml-2">
                {new Date(v.createdAt).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Mock detection warning */}
      {activePrompt?.content?.startsWith('[Mock]') && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-300">
          <p className="font-medium mb-1">⚠️ Se usó el proveedor Mock (sin IA real)</p>
          <p className="text-yellow-400/80 text-xs">
            Ningún proveedor de IA respondió. Verifica tus API keys en <code className="bg-yellow-500/10 px-1 rounded">.env.local</code> y reinicia el servidor con <code className="bg-yellow-500/10 px-1 rounded">npm run dev</code>.
            Para diagnosticar, visita <a href="/api/generate/test-providers" target="_blank" className="underline hover:text-yellow-200">/api/generate/test-providers</a>
          </p>
        </div>
      )}

      {/* Prompt content */}
      {activePrompt ? (
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">
                Version {activePrompt.version}
                <span className="text-xs text-gray-500 ml-2">
                  ({activePrompt.type === 'ORIGINAL' ? 'Generado' : activePrompt.type === 'CUSTOM' ? 'Personalizado' : activePrompt.type})
                </span>
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <div className="p-5 max-h-[50vh] overflow-y-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
              {activePrompt.content}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/60 border border-gray-800 border-dashed rounded-xl p-10 text-center">
          <p className="text-gray-400">Aún no se ha generado un prompt.</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={handleEdit}
          disabled={!activePrompt}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 rounded-xl text-sm font-medium transition-colors"
        >
          <Edit3 className="w-4 h-4" /> Editar Prompt
        </button>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 rounded-xl text-sm font-medium transition-colors"
        >
          {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Regenerar
        </button>
        <div className="flex-1" />
        <button
          onClick={handleLaunchAgents}
          disabled={!activePrompt}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-40 text-white rounded-xl text-sm font-semibold shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all"
        >
          <Rocket className="w-4 h-4" /> Lanzar Pipeline de Agentes
        </button>
      </div>
    </div>
  );
}