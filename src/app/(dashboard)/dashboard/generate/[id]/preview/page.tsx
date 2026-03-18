'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  ArrowLeft,
  Download,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  extractBusinessStructure,
  downloadFullPackage,
  type BusinessStructure,
  type ArtifactData,
} from '@/modules/preview/previewUtils';

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

// ─── Document Config ───

const DOCUMENT_TYPES: Array<{
  agentType: string;
  type: string;
  title: string;
  icon: LucideIcon;
  color: string;
}> = [
  {
    agentType: 'DOCUMENT_BUSINESS_PLAN',
    type: 'BUSINESS_PLAN',
    title: 'Plan de Negocio',
    icon: Briefcase,
    color: 'text-purple-400',
  },
  {
    agentType: 'DOCUMENT_STRATEGY',
    type: 'STRATEGY',
    title: 'Estrategia',
    icon: Target,
    color: 'text-emerald-400',
  },
  {
    agentType: 'DOCUMENT_GROWTH_PLAN',
    type: 'GROWTH_PLAN',
    title: 'Plan de Crecimiento',
    icon: TrendingUp,
    color: 'text-cyan-400',
  },
  {
    agentType: 'DOCUMENT_TECHNICAL_ARCHITECTURE',
    type: 'TECHNICAL_ARCHITECTURE',
    title: 'Arquitectura Técnica',
    icon: Cpu,
    color: 'text-orange-400',
  },
  {
    agentType: 'DOCUMENT_FINANCIAL_PROJECTIONS',
    type: 'FINANCIAL_PROJECTIONS',
    title: 'Proyecciones Financieras',
    icon: DollarSign,
    color: 'text-yellow-400',
  },
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

        // Extract business structure
        const structure = extractBusinessStructure(data.artifacts, data.projectName);
        setBusinessStructure(structure);

        // Build document cards
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

  // Handle ZIP download
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

  // Toggle document expansion
  const toggleDocument = (type: string) => {
    setExpandedDoc(expandedDoc === type ? null : type);
  };

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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/generate/${sessionId}/blueprints`)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <h1 className="text-lg font-semibold text-white">
                {projectName}
              </h1>
              <p className="text-xs text-gray-500">Preview de tu negocio digital</p>
            </div>
          </div>

          <button
            onClick={handleDownloadAll}
            disabled={downloadingZip}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadingZip ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Descargar Todo
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Business Structure Section */}
        {businessStructure && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Estructura del Negocio</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Name */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</span>
                </div>
                <p className="text-white font-semibold text-sm">{businessStructure.name}</p>
              </div>

              {/* Value Proposition */}
              {businessStructure.valueProposition && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Propuesta de Valor</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {businessStructure.valueProposition}
                  </p>
                </div>
              )}

              {/* Target Market */}
              {businessStructure.targetMarket && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mercado Objetivo</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {businessStructure.targetMarket}
                  </p>
                </div>
              )}

              {/* Monetization */}
              {businessStructure.monetizationModel && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monetización</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {businessStructure.monetizationModel}
                  </p>
                </div>
              )}
            </div>

            {/* Key Features */}
            {businessStructure.keyFeatures.length > 0 && (
              <div className="mt-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Características Clave</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {businessStructure.keyFeatures.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Documents Section */}
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
                    doc.available
                      ? 'border-white/10 hover:border-white/20 cursor-pointer'
                      : 'border-white/5 opacity-50'
                  }`}
                >
                  <button
                    onClick={() => doc.available && toggleDocument(doc.type)}
                    className="w-full flex items-center gap-4 p-5 text-left"
                    disabled={!doc.available}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
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
                        isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )
                      ) : (
                        <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Expanded content */}
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

        {/* Actions Footer */}
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
            {downloadingZip ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Descargar Todo
          </button>
        </section>
      </div>
    </div>
  );
}
