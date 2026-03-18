'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2, Rocket, BookOpen, ChevronDown, ChevronUp,
  BarChart3, Package, Palette, Cpu, Shield, Hammer, DollarSign,
  ArrowLeft, FolderKanban, Download, Eye, Sparkles,
  FileCode, FileText,
} from 'lucide-react';

interface Artifact {
  agentType: string;
  content: Record<string, unknown>;
}

interface BlueprintsData {
  sessionState: string;
  projectId: string | null;
  projectName: string;
  artifacts: Artifact[];
}

const AGENT_CONFIG: Record<string, { name: string; emoji: string; icon: typeof BarChart3; color: string; gradient: string }> = {
  BUSINESS_STRATEGIST: { name: 'Estrategia de Negocio', emoji: '📊', icon: BarChart3, color: 'text-blue-400', gradient: 'from-blue-600/20 to-blue-500/5 border-blue-500/30' },
  PRODUCT_ARCHITECT: { name: 'Arquitectura de Producto', emoji: '🏗️', icon: Package, color: 'text-cyan-400', gradient: 'from-cyan-600/20 to-cyan-500/5 border-cyan-500/30' },
  UX_UI_AGENT: { name: 'Diseño UX/UI', emoji: '🎨', icon: Palette, color: 'text-pink-400', gradient: 'from-pink-600/20 to-pink-500/5 border-pink-500/30' },
  TECHNICAL_ARCHITECT: { name: 'Arquitectura Técnica', emoji: '⚙️', icon: Cpu, color: 'text-green-400', gradient: 'from-green-600/20 to-green-500/5 border-green-500/30' },
  QA_CRITICAL_AGENT: { name: 'Revisión QA', emoji: '🔍', icon: Shield, color: 'text-yellow-400', gradient: 'from-yellow-600/20 to-yellow-500/5 border-yellow-500/30' },
  BUILD_PLANNER: { name: 'Plan de Construcción', emoji: '📋', icon: Hammer, color: 'text-orange-400', gradient: 'from-orange-600/20 to-orange-500/5 border-orange-500/30' },
  MONETIZATION_GTM: { name: 'Monetización & GTM', emoji: '💰', icon: DollarSign, color: 'text-emerald-400', gradient: 'from-emerald-600/20 to-emerald-500/5 border-emerald-500/30' },
};

function BlueprintCard({ artifact }: { artifact: Artifact }) {
  const [expanded, setExpanded] = useState(false);
  const config = AGENT_CONFIG[artifact.agentType];
  if (!config) return null;

  const Icon = config.icon;
  const content = artifact.content;
  const keys = Object.keys(content);

  // Render a summary of the top-level keys
  const renderSummary = () => {
    const summaryKeys = keys.slice(0, 3);
    return summaryKeys.map((key) => {
      const val = content[key];
      if (typeof val === 'string') {
        return (
          <div key={key} className="mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{formatKey(key)}</p>
            <p className="text-sm text-gray-300 line-clamp-3">{val}</p>
          </div>
        );
      }
      if (Array.isArray(val)) {
        return (
          <div key={key} className="mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{formatKey(key)} ({val.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {val.slice(0, 5).map((item, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">
                  {typeof item === 'string' ? item : (item as Record<string, string>)?.name || (item as Record<string, string>)?.title || JSON.stringify(item).substring(0, 30)}
                </span>
              ))}
              {val.length > 5 && <span className="text-xs text-gray-500">+{val.length - 5} más</span>}
            </div>
          </div>
        );
      }
      if (typeof val === 'number') {
        return (
          <div key={key} className="mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{formatKey(key)}</p>
            <p className="text-2xl font-bold text-white">{val}</p>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className={`bg-gradient-to-br ${config.gradient} border rounded-2xl overflow-hidden transition-all`}>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gray-900/60 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{config.name}</h3>
            <p className="text-xs text-gray-500">{keys.length} secciones generadas</p>
          </div>
        </div>
        {renderSummary()}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 bg-gray-900/40 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? 'Ocultar detalles' : 'Ver detalles completos'}
      </button>
      {expanded && (
        <div className="px-5 pb-5 bg-gray-900/30">
          <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto mt-3 p-3 bg-gray-950/50 rounded-xl">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
}

export default function BlueprintsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [data, setData] = useState<BlueprintsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/generate/sessions/${sessionId}/blueprints`);
        if (!res.ok) {
          setError('No se pudieron cargar los blueprints');
          setLoading(false);
          return;
        }
        const d: BlueprintsData = await res.json();
        setData(d);
      } catch {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  const handleDownload = async (format: 'html' | 'markdown' | 'zip') => {
    setDownloading(format);
    setDownloadMenuOpen(false);

    try {
      const url = `/api/generate/sessions/${sessionId}/download?format=${format}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Error al descargar');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = `download.${format === 'zip' ? 'zip' : format === 'html' ? 'html' : 'md'}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download error:', err);
      alert('Error al descargar el archivo');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-red-400">{error || 'No data'}</p>
        <button onClick={() => router.push(`/dashboard/generate/${sessionId}/agents`)} className="mt-4 text-sm text-purple-400 hover:text-purple-300">
          Volver al pipeline
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push(`/dashboard/generate/${sessionId}/agents`)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al pipeline
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {data.projectName}
          </h1>
          <p className="text-gray-400">
            {data.artifacts.length} blueprints generados por el pipeline de agentes IA
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-3">
        {/* Ver Preview Funcional - prominent button */}
        <button
          onClick={() => router.push(`/dashboard/generate/${sessionId}/preview`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 hover:from-purple-500 hover:via-purple-400 hover:to-fuchsia-400 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <Eye className="w-4 h-4" />
          <Sparkles className="w-3.5 h-3.5" />
          Ver Preview Funcional
        </button>
        {data.projectId && (
          <button
            onClick={() => router.push(`/dashboard/projects/${data.projectId}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-medium transition-colors"
          >
            <FolderKanban className="w-4 h-4" /> Ver Proyecto
          </button>
        )}
        <button
          onClick={() => data.projectId && router.push(`/dashboard/projects/${data.projectId}/course`)}
          disabled={!data.projectId}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all"
        >
          <BookOpen className="w-4 h-4" /> Aprender a Implementar
        </button>

        {/* Download dropdown menu */}
        <div className="relative">
          <button
            onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${downloadMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {downloadMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDownloadMenuOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => handleDownload('html')}
                  disabled={downloading === 'html'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-200 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {downloading === 'html' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <FileCode className="w-4 h-4 text-cyan-400" />
                  )}
                  <div>
                    <p className="font-medium">Descargar Landing HTML</p>
                    <p className="text-xs text-gray-500">Página web standalone</p>
                  </div>
                </button>
                <button
                  onClick={() => handleDownload('markdown')}
                  disabled={downloading === 'markdown'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-200 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {downloading === 'markdown' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-emerald-400" />
                  )}
                  <div>
                    <p className="font-medium">Descargar Plan de Negocio</p>
                    <p className="text-xs text-gray-500">Documento Markdown</p>
                  </div>
                </button>
                <div className="border-t border-gray-700" />
                <button
                  onClick={() => handleDownload('zip')}
                  disabled={downloading === 'zip'}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-200 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {downloading === 'zip' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <Package className="w-4 h-4 text-orange-400" />
                  )}
                  <div>
                    <p className="font-medium">Descargar Paquete Completo</p>
                    <p className="text-xs text-gray-500">ZIP con todos los archivos</p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Blueprint cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.artifacts.map((artifact) => (
          <BlueprintCard key={artifact.agentType} artifact={artifact} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-purple-900/30 to-emerald-900/30 border border-purple-500/20 rounded-2xl p-8 text-center">
        <Rocket className="w-10 h-10 text-purple-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">¿Listo para construir?</h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
          Tus blueprints están listos. Ve a la sección Learn para seguir un curso personalizado
          que te guiará paso a paso en la implementación de tu negocio digital.
        </p>
        <div className="flex items-center justify-center gap-3">
          {data.projectId && (
            <>
              <button
                onClick={() => router.push(`/dashboard/projects/${data.projectId}/course`)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Comenzar Curso
              </button>
              <button
                onClick={() => router.push(`/dashboard/projects/${data.projectId}`)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                <FolderKanban className="w-4 h-4" /> Ver Proyecto
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
