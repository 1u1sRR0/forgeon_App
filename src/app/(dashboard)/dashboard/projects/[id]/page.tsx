'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Loader2, Trash2, BookOpen, Download, ChevronDown, ChevronUp,
  BarChart3, Package, Palette, Cpu, Shield, Hammer, DollarSign,
  Rocket, FolderKanban, Sparkles, Clock, AlertTriangle, Eye, FileText, FileArchive, FileCode,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string | null;
  state: string;
  createdAt: string;
  updatedAt: string;
}

interface Artifact {
  agentType: string;
  content: Record<string, unknown>;
}

interface BlueprintsResponse {
  sessionId: string | null;
  artifacts: Artifact[];
}

const STATE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  IDEA: { label: 'Idea', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  STRUCTURED: { label: 'Structured', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' },
  VALIDATED: { label: 'Validated', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  BUILD_READY: { label: 'Build Ready', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  MVP_GENERATED: { label: 'MVP Generated', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  BLOCKED: { label: 'Blocked', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
};

const AGENT_CONFIG: Record<string, { name: string; icon: typeof BarChart3; color: string; gradient: string }> = {
  BUSINESS_STRATEGIST: { name: 'Estrategia de Negocio', icon: BarChart3, color: 'text-blue-400', gradient: 'from-blue-600/20 to-blue-500/5 border-blue-500/30' },
  PRODUCT_ARCHITECT: { name: 'Arquitectura de Producto', icon: Package, color: 'text-cyan-400', gradient: 'from-cyan-600/20 to-cyan-500/5 border-cyan-500/30' },
  UX_UI_AGENT: { name: 'Diseño UX/UI', icon: Palette, color: 'text-pink-400', gradient: 'from-pink-600/20 to-pink-500/5 border-pink-500/30' },
  TECHNICAL_ARCHITECT: { name: 'Arquitectura Técnica', icon: Cpu, color: 'text-green-400', gradient: 'from-green-600/20 to-green-500/5 border-green-500/30' },
  QA_CRITICAL_AGENT: { name: 'Revisión QA', icon: Shield, color: 'text-yellow-400', gradient: 'from-yellow-600/20 to-yellow-500/5 border-yellow-500/30' },
  BUILD_PLANNER: { name: 'Plan de Construcción', icon: Hammer, color: 'text-orange-400', gradient: 'from-orange-600/20 to-orange-500/5 border-orange-500/30' },
  MONETIZATION_GTM: { name: 'Monetización & GTM', icon: DollarSign, color: 'text-emerald-400', gradient: 'from-emerald-600/20 to-emerald-500/5 border-emerald-500/30' },
};

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
}

function BlueprintCard({ artifact }: { artifact: Artifact }) {
  const [expanded, setExpanded] = useState(false);
  const config = AGENT_CONFIG[artifact.agentType];
  if (!config) return null;

  const Icon = config.icon;
  const content = artifact.content;
  const keys = Object.keys(content);

  const renderSummary = () => {
    return keys.slice(0, 3).map((key) => {
      const val = content[key];
      if (typeof val === 'string') {
        return (
          <div key={key} className="mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{formatKey(key)}</p>
            <p className="text-sm text-gray-300 line-clamp-2">{val}</p>
          </div>
        );
      }
      if (Array.isArray(val)) {
        return (
          <div key={key} className="mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{formatKey(key)} ({val.length})</p>
            <div className="flex flex-wrap gap-1">
              {val.slice(0, 4).map((item, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">
                  {typeof item === 'string' ? item : (item as Record<string, string>)?.name || (item as Record<string, string>)?.title || '...'}
                </span>
              ))}
              {val.length > 4 && <span className="text-xs text-gray-500">+{val.length - 4}</span>}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className={`bg-gradient-to-br ${config.gradient} border rounded-2xl overflow-hidden transition-all`}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gray-900/60 flex items-center justify-center">
            <Icon className={`w-4.5 h-4.5 ${config.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{config.name}</h3>
            <p className="text-xs text-gray-500">{keys.length} secciones</p>
          </div>
        </div>
        {renderSummary()}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 bg-gray-900/40 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? 'Ocultar' : 'Ver detalles'}
      </button>
      {expanded && (
        <div className="px-4 pb-4 bg-gray-900/30">
          <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-x-auto max-h-80 overflow-y-auto mt-2 p-3 bg-gray-950/50 rounded-xl">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const load = async () => {
      try {
        // Fetch project and blueprints in parallel
        const [projRes, bpRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch(`/api/projects/${projectId}/blueprints`),
        ]);

        if (!projRes.ok) {
          setError('Proyecto no encontrado');
          setLoading(false);
          return;
        }

        const projData = await projRes.json();
        setProject(projData.project);

        if (bpRes.ok) {
          const bpData: BlueprintsResponse = await bpRes.json();
          setArtifacts(bpData.artifacts || []);
          setSessionId(bpData.sessionId);
        }
      } catch {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/dashboard/projects');
      } else {
        alert('Error al eliminar el proyecto');
      }
    } catch {
      alert('Error inesperado');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = (format: 'zip' | 'html' | 'markdown') => {
    if (!sessionId) return;
    window.open(`/api/generate/sessions/${sessionId}/download?format=${format}`, '_blank');
    setDownloadOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error || 'Proyecto no encontrado'}</p>
        <button
          onClick={() => router.push('/dashboard/projects')}
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          Volver a Proyectos
        </button>
      </div>
    );
  }

  const stateStyle = STATE_STYLES[project.state] || { label: project.state, color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/30' };
  const hasBlueprints = artifacts.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Back nav */}
      <button
        onClick={() => router.push('/dashboard/projects')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
      </button>

      {/* Project header */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <FolderKanban className="w-6 h-6 text-purple-400 flex-shrink-0" />
              <h1 className="text-2xl font-bold text-white truncate">{project.name}</h1>
            </div>
            {project.description && (
              <p className="text-gray-400 text-sm ml-9">{project.description}</p>
            )}
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border ${stateStyle.bg} ${stateStyle.color} whitespace-nowrap ml-4`}>
            {stateStyle.label}
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-500 ml-9">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Creado: {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Actualizado: {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}/course`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all"
        >
          <BookOpen className="w-4 h-4" /> Aprender a Implementar
        </button>
        {hasBlueprints && (
          <>
            {sessionId && (
              <>
                <button
                  onClick={() => router.push(`/dashboard/generate/${sessionId}/preview`)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all"
                >
                  <Eye className="w-4 h-4" /> Ver Preview
                </button>
                <button
                  onClick={() => router.push(`/dashboard/generate/${sessionId}/blueprints`)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Ver Blueprints Completos
                </button>
              </>
            )}
            <div className="relative">
              <button
                onClick={() => setDownloadOpen(!downloadOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" /> Descargar
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${downloadOpen ? 'rotate-180' : ''}`} />
              </button>
              {downloadOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={() => handleDownload('zip')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <FileArchive className="w-4 h-4 text-blue-400" />
                    <div className="text-left">
                      <p className="font-medium">Paquete ZIP</p>
                      <p className="text-xs text-gray-500">Landing + Plan de negocio</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDownload('html')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <FileCode className="w-4 h-4 text-green-400" />
                    <div className="text-left">
                      <p className="font-medium">Landing Page HTML</p>
                      <p className="text-xs text-gray-500">Archivo HTML standalone</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDownload('markdown')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-purple-400" />
                    <div className="text-left">
                      <p className="font-medium">Plan de Negocio</p>
                      <p className="text-xs text-gray-500">Documento Markdown</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex-1" />
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" /> {deleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>

      {/* Visual Preview Card */}
      {hasBlueprints && sessionId && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Preview de tu Negocio</h2>
          <p className="text-sm text-gray-400 mb-4">Vista previa de la landing page generada para tu proyecto</p>
          <div
            className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10 cursor-pointer group"
            onClick={() => router.push(`/dashboard/generate/${sessionId}/preview`)}
          >
            {/* Browser chrome bar */}
            <div className="px-4 py-2.5 flex items-center gap-3 border-b border-white/10 bg-gray-900/80">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-2">
                <div className="bg-white/5 rounded-lg px-4 py-1 text-xs text-white/30 text-center max-w-xs mx-auto truncate">
                  {project.name.toLowerCase().replace(/\s+/g, '-')}.app
                </div>
              </div>
            </div>
            {/* Iframe preview */}
            <div className="relative h-[400px] bg-white overflow-hidden">
              <iframe
                src={`/api/generate/sessions/${sessionId}/preview`}
                className="w-full h-[800px] border-0 pointer-events-none"
                style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '800px' }}
                title={`Preview de ${project.name}`}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
              />
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-3">
                <span className="px-6 py-3 bg-white text-gray-950 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Ver Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blueprints section */}
      {hasBlueprints ? (
        <>
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Blueprints del Proyecto</h2>
            <p className="text-sm text-gray-400">{artifacts.length} blueprints generados por el pipeline de agentes IA</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {artifacts.map((artifact) => (
              <BlueprintCard key={artifact.agentType} artifact={artifact} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gray-900/60 border border-gray-800 border-dashed rounded-2xl p-10 text-center">
          <Sparkles className="w-10 h-10 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Este proyecto aún no tiene blueprints generados</p>
          <p className="text-sm text-gray-500 mb-6">
            Los blueprints se generan automáticamente cuando creas un proyecto desde el flujo Generate
          </p>
          <button
            onClick={() => router.push('/dashboard/generate')}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all font-medium flex items-center gap-2 mx-auto"
          >
            <Rocket className="w-4 h-4" /> Ir a Generate
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      {hasBlueprints && (
        <div className="bg-gradient-to-r from-purple-900/30 to-emerald-900/30 border border-purple-500/20 rounded-2xl p-8 text-center">
          <Rocket className="w-10 h-10 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">¿Listo para construir?</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
            Tus blueprints están listos. Sigue un curso personalizado que te guiará paso a paso
            en la implementación de tu negocio digital.
          </p>
          <button
            onClick={() => router.push(`/dashboard/projects/${projectId}/course`)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-2 mx-auto"
          >
            <BookOpen className="w-4 h-4" /> Comenzar Curso
          </button>
        </div>
      )}
    </div>
  );
}
