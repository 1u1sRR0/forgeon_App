'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Target,
  FileText,
  TrendingUp,
  Cpu,
  DollarSign,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  Coins,
  Star,
  Eye,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  extractBusinessStructure,
  downloadFullPackage,
  type BusinessStructure,
  type ArtifactData,
} from '@/modules/preview/previewUtils';
import BuilderChat from '@/components/builder/BuilderChat';

// ─── Types ───

interface DocumentCard {
  type: string;
  title: string;
  icon: LucideIcon;
  color: string;
  summary: string;
  available: boolean;
  content: string;
}

interface BlueprintsData {
  sessionState: string;
  projectId: string | null;
  projectName: string;
  artifacts: Array<{
    agentType: string;
    content: Record<string, unknown>;
  }>;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

// ─── Document Config ───

const DOCUMENT_TYPES: Array<{
  agentType: string;
  type: string;
  title: string;
  icon: LucideIcon;
  color: string;
}> = [
  { agentType: 'DOCUMENT_BUSINESS_PLAN', type: 'BUSINESS_PLAN', title: 'Plan de Negocio', icon: Briefcase, color: 'text-purple-400' },
  { agentType: 'DOCUMENT_STRATEGY', type: 'STRATEGY', title: 'Estrategia', icon: Target, color: 'text-emerald-400' },
  { agentType: 'DOCUMENT_GROWTH_PLAN', type: 'GROWTH_PLAN', title: 'Plan de Crecimiento', icon: TrendingUp, color: 'text-cyan-400' },
  { agentType: 'DOCUMENT_TECHNICAL_ARCHITECTURE', type: 'TECHNICAL_ARCHITECTURE', title: 'Arquitectura Técnica', icon: Cpu, color: 'text-orange-400' },
  { agentType: 'DOCUMENT_FINANCIAL_PROJECTIONS', type: 'FINANCIAL_PROJECTIONS', title: 'Proyecciones Financieras', icon: DollarSign, color: 'text-yellow-400' },
];

// ─── Helpers ───

function buildDocumentCards(artifacts: ArtifactData[]): DocumentCard[] {
  return DOCUMENT_TYPES.map((docType) => {
    const artifact = artifacts.find((a) => a.agentType === docType.agentType);
    const content = artifact?.content as Record<string, unknown> | undefined;
    const markdown = typeof content?.markdown === 'string' ? content.markdown : '';
    const summary = markdown
      ? markdown.replace(/^#.*\n/gm, '').trim().substring(0, 200) + '...'
      : 'Documento no disponible';
    return {
      type: docType.type,
      title: docType.title,
      icon: docType.icon,
      color: docType.color,
      summary,
      available: !!artifact,
      content: markdown,
    };
  });
}

const VIEWPORT_SIZES: Record<ViewportMode, { width: string; label: string; icon: LucideIcon }> = {
  desktop: { width: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: '768px', label: 'Tablet', icon: Tablet },
  mobile: { width: '375px', label: 'Móvil', icon: Smartphone },
};

// ─── Component ───

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessStructure, setBusinessStructure] = useState<BusinessStructure | null>(null);
  const [documentCards, setDocumentCards] = useState<DocumentCard[]>([]);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [projectName, setProjectName] = useState('Mi Negocio Digital');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeSrcdoc, setIframeSrcdoc] = useState<string | null>(null);

  // Fetch session data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/generate/sessions/${sessionId}/blueprints`);
        if (!res.ok) {
          setError('No se pudieron cargar los datos de la sesión.');
          return;
        }
        const data: BlueprintsData = await res.json();
        setProjectName(data.projectName || 'Mi Negocio Digital');
        if (data.artifacts.length === 0) {
          setError('Los documentos aún no se han generado. Ejecuta el pipeline de agentes primero.');
          return;
        }
        const structure = extractBusinessStructure(data.artifacts, data.projectName);
        setBusinessStructure(structure);
        const cards = buildDocumentCards(data.artifacts);
        setDocumentCards(cards);
      } catch (err) {
        console.error('Error loading preview data:', err);
        setError('Error al cargar los datos del preview.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  const handleDownloadAll = async () => {
    setDownloadingZip(true);
    try {
      await downloadFullPackage(sessionId);
    } catch (err) {
      console.error('Download error:', err);
      alert('Error al descargar el paquete de documentos');
    } finally {
      setDownloadingZip(false);
    }
  };

  const toggleDocument = (type: string) => {
    setExpandedDoc(expandedDoc === type ? null : type);
  };

  const handleHtmlUpdate = (newHtml: string) => {
    setIframeSrcdoc(newHtml);
  };

  const previewUrl = `/api/generate/sessions/${sessionId}/preview`;

  // Fetch initial HTML for builder chat context
  useEffect(() => {
    if (!loading && !error) {
      fetch(previewUrl)
        .then((res) => res.ok ? res.text() : null)
        .then((html) => { if (html) setIframeSrcdoc(html); })
        .catch(() => {});
    }
  }, [loading, error, previewUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Cargando preview de tu negocio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error al cargar</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Reintentar
            </button>
            <button
              onClick={() => router.push(`/dashboard/generate/${sessionId}/blueprints`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 rounded-xl text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Blueprints
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/generate/${sessionId}/blueprints`)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <h1 className="text-lg font-semibold text-white">{projectName}</h1>
              <p className="text-xs text-gray-500">Preview de tu negocio digital</p>
            </div>
          </div>
          <button
            onClick={handleDownloadAll}
            disabled={downloadingZip}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadingZip ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Descargar Todo
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* ═══ VISUAL PREVIEW SECTION ═══ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Preview Visual</h2>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                Landing Page
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Viewport switcher */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                {(Object.keys(VIEWPORT_SIZES) as ViewportMode[]).map((mode) => {
                  const vp = VIEWPORT_SIZES[mode];
                  const Icon = vp.icon;
                  return (
                    <button
                      key={mode}
                      onClick={() => setViewportMode(mode)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        viewportMode === mode
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                      }`}
                      title={vp.label}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{vp.label}</span>
                    </button>
                  );
                })}
              </div>
              {/* Fullscreen toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              {/* Open in new tab */}
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                title="Abrir en nueva pestaña"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Browser Frame with iframe */}
          <div
            className={`transition-all duration-300 ${
              isFullscreen
                ? 'fixed inset-0 z-50 bg-gray-950 p-4'
                : 'relative'
            }`}
          >
            {/* Fullscreen close button */}
            {isFullscreen && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">{projectName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                    {(Object.keys(VIEWPORT_SIZES) as ViewportMode[]).map((mode) => {
                      const vp = VIEWPORT_SIZES[mode];
                      const Icon = vp.icon;
                      return (
                        <button
                          key={mode}
                          onClick={() => setViewportMode(mode)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            viewportMode === mode
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{vp.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10 bg-gray-900/50 backdrop-blur-sm ${isFullscreen ? 'h-[calc(100vh-80px)]' : ''}`}>
              {/* Chrome bar */}
              <div className="px-4 py-2.5 flex items-center gap-3 border-b border-white/10 bg-gray-900/80">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-2">
                  <div className="bg-white/5 rounded-lg px-4 py-1 text-xs text-white/30 text-center max-w-sm mx-auto truncate">
                    {projectName.toLowerCase().replace(/\s+/g, '-')}.app
                  </div>
                </div>
              </div>

              {/* Iframe container */}
              <div
                className={`bg-white flex justify-center ${isFullscreen ? 'h-[calc(100%-40px)]' : 'h-[600px]'}`}
              >
                {iframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80 z-10 mt-10">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Cargando preview...</p>
                    </div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={iframeSrcdoc ? undefined : previewUrl}
                  srcDoc={iframeSrcdoc || undefined}
                  className="border-0 h-full transition-all duration-300"
                  style={{ width: VIEWPORT_SIZES[viewportMode].width, maxWidth: '100%' }}
                  onLoad={() => setIframeLoading(false)}
                  title={`Preview de ${projectName}`}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BUILDER CHAT SECTION ═══ */}
        <section>
          <BuilderChat
            sessionId={sessionId}
            currentHtml={iframeSrcdoc || ''}
            onHtmlUpdate={handleHtmlUpdate}
          />
        </section>


        {/* ═══ BUSINESS STRUCTURE SECTION ═══ */}
        {businessStructure && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Estructura del Negocio</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</span>
                </div>
                <p className="text-white font-semibold text-sm">{businessStructure.name}</p>
              </div>
              {businessStructure.valueProposition && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Propuesta de Valor</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{businessStructure.valueProposition}</p>
                </div>
              )}
              {businessStructure.targetMarket && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mercado Objetivo</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{businessStructure.targetMarket}</p>
                </div>
              )}
              {businessStructure.monetizationModel && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monetización</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{businessStructure.monetizationModel}</p>
                </div>
              )}
            </div>
            {businessStructure.keyFeatures.length > 0 && (
              <div className="mt-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Características Clave</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {businessStructure.keyFeatures.map((feature, i) => (
                    <span key={i} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ═══ DOCUMENTS SECTION ═══ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Documentos Generados</h2>
            <span className="text-sm text-gray-500">
              ({documentCards.filter((d) => d.available).length} de {documentCards.length})
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {documentCards.map((doc) => {
              const Icon = doc.icon;
              const isExpanded = expandedDoc === doc.type;
              return (
                <div
                  key={doc.type}
                  className={`bg-white/5 backdrop-blur-sm border rounded-2xl transition-all duration-200 ${
                    doc.available ? 'border-white/10 hover:border-white/20 cursor-pointer' : 'border-white/5 opacity-50'
                  }`}
                >
                  <button
                    onClick={() => doc.available && toggleDocument(doc.type)}
                    className="w-full flex items-center gap-4 p-5 text-left"
                    disabled={!doc.available}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${doc.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm">{doc.title}</h3>
                      {!isExpanded && (
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {doc.available ? doc.summary : 'No generado'}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {doc.available ? (
                        isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">Pendiente</span>
                      )}
                    </div>
                  </button>
                  {isExpanded && doc.available && (
                    <div className="px-5 pb-5 border-t border-white/5">
                      <div className="mt-4 bg-gray-900/50 rounded-xl p-5 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                          {doc.content || 'Contenido no disponible'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ ACTIONS FOOTER ═══ */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <button
            onClick={() => router.push(`/dashboard/generate/${sessionId}/blueprints`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 rounded-xl text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Ver Blueprints Detallados
          </button>
          <button
            onClick={handleDownloadAll}
            disabled={downloadingZip}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadingZip ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Descargar Todo
          </button>
        </section>
      </div>
    </div>
  );
}
