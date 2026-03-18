'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  TrendingUp,
  Rocket,
  Sparkles,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  Zap,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import FocusCard from '@/components/dashboard/FocusCard';
import HelpTooltip from '@/components/ui/HelpTooltip';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingOverlay from '@/components/onboarding/OnboardingOverlay';

interface Project {
  id: string;
  name: string;
  description?: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

const STATE_CONFIG: Record<string, { label: string; color: string; bg: string; barColor: string; hex: string }> = {
  IDEA: { label: 'Idea', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30', barColor: 'bg-blue-500', hex: '#3b82f6' },
  WIZARD_COMPLETE: { label: 'Structured', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30', barColor: 'bg-cyan-500', hex: '#06b6d4' },
  VALIDATED: { label: 'Validated', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30', barColor: 'bg-green-500', hex: '#22c55e' },
  BUILDING: { label: 'Building', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30', barColor: 'bg-yellow-500', hex: '#eab308' },
  BUILT: { label: 'Built', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30', barColor: 'bg-purple-500', hex: '#a855f7' },
  LIVE: { label: 'Live', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', barColor: 'bg-emerald-500', hex: '#10b981' },
};

function getStateConfig(state: string) {
  return STATE_CONFIG[state] || { label: state, color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/30', barColor: 'bg-gray-500', hex: '#6b7280' };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { shouldShowOnboarding, completeOnboarding, resetOnboarding } = useOnboarding();

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const total = projects.length;
  const validated = projects.filter((p) => ['VALIDATED', 'BUILDING', 'BUILT', 'LIVE'].includes(p.state)).length;
  const inProgress = projects.filter((p) => ['IDEA', 'WIZARD_COMPLETE', 'BUILDING'].includes(p.state)).length;
  const recent = [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  // Most recent project for FocusCard
  const mostRecent = recent.length > 0 ? recent[0] : null;

  // Pipeline counts per state
  const pipeline = Object.keys(STATE_CONFIG).map((key) => ({
    key,
    ...STATE_CONFIG[key],
    count: projects.filter((p) => p.state === key).length,
  }));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Onboarding Overlay */}
      {shouldShowOnboarding && (
        <OnboardingOverlay onComplete={completeOnboarding} onSkip={completeOnboarding} />
      )}

      {/* Header */}
      <div data-onboarding="dashboard">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Tu centro de comando</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Focus Card — primary element, full width (Req 17.1) */}
          <div className="relative">
            <div className="absolute -top-1 right-0">
              <HelpTooltip text="Tu siguiente acción recomendada basada en el estado de tus proyectos" position="left" />
            </div>
            <FocusCard project={mostRecent} totalProjects={total} />
          </div>

          {total === 0 ? (
            /* Empty State */
            <div className="text-center py-16 bg-gray-900/60 rounded-xl border border-gray-800 border-dashed">
              <Rocket className="w-14 h-14 text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-300 mb-1">Bienvenido a Forgeon</p>
              <p className="text-sm text-gray-500 mb-6">Usa Generar para crear tu primer negocio digital con IA</p>
              <button
                onClick={() => router.push('/dashboard/generate')}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" /> Ir a Generar
              </button>
            </div>
          ) : (
            <>
              {/* Stats Row — reduced size below Focus Card (Req 17.2) */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <HelpTooltip text="Resumen numérico de tus proyectos" position="right" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-900/60 backdrop-blur rounded-lg p-3 border border-gray-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center">
                      <FolderKanban className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Proyectos</p>
                      <p className="text-lg font-bold text-white">{total}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur rounded-lg p-3 border border-gray-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Validados</p>
                      <p className="text-lg font-bold text-white">{validated}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur rounded-lg p-3 border border-gray-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">En Progreso</p>
                      <p className="text-lg font-bold text-white">{inProgress}</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              {/* Pipeline — reduced opacity (Req 17.3) */}
              <div className="opacity-70">
                <div className="bg-gray-900/60 backdrop-blur rounded-xl p-4 border border-gray-800/60">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <h2 className="text-sm font-semibold text-white">Pipeline</h2>
                    <HelpTooltip text="Muestra el estado de todos tus proyectos en cada fase" position="right" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {pipeline.map((s) => (
                      <div key={s.key} className="text-center p-2 rounded-lg bg-gray-800/40 border border-gray-700/40">
                        <p className="text-lg font-bold text-white">{s.count}</p>
                        <p className={`text-xs mt-0.5 ${s.color}`}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Quick Actions — lower visual prominence (Req 17.4) */}
      <div className="opacity-80" data-onboarding="build">
        <div className="flex items-center gap-1.5 mb-2">
          <h2 className="text-sm font-semibold text-gray-400">Acciones Rápidas</h2>
          <HelpTooltip text="Accesos directos a las funciones principales de Forgeon" position="right" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { label: 'Generar', icon: Sparkles, href: '/dashboard/generate', color: 'text-purple-400' },
            { label: 'Proyectos', icon: FolderKanban, href: '/dashboard/projects', color: 'text-blue-400' },
            { label: 'Descubrir', icon: Lightbulb, href: '/dashboard/discover/opportunities', color: 'text-yellow-400' },
            { label: 'Aprender', icon: BookOpen, href: '/dashboard/learn', color: 'text-green-400' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="bg-gray-900/40 border border-gray-800/60 hover:border-gray-600 rounded-xl p-3 flex items-center gap-2.5 transition-all duration-200 group"
            >
              <action.icon className={`w-4 h-4 ${action.color}`} />
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-200">{action.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 ml-auto transition-colors duration-200" />
            </button>
          ))}
          {/* Tour Guiado button */}
          <button
            onClick={resetOnboarding}
            className="bg-gray-900/40 border border-purple-800/40 hover:border-purple-600/60 rounded-xl p-3 flex items-center gap-2.5 transition-all duration-200 group"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400 group-hover:text-purple-300 transition-colors duration-200">Tour Guiado</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-purple-400 ml-auto transition-colors duration-200" />
          </button>
        </div>
      </div>

      {/* Recent Activity — lower visual prominence (Req 17.4), premium hover (Req 18) */}
      {recent.length > 0 && (
        <div className="opacity-80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-400">Actividad Reciente</h2>
            <button
              onClick={() => router.push('/dashboard/projects')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors duration-200"
            >
              Ver todo <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {recent.map((project) => {
              const stateConf = getStateConfig(project.state);
              return (
                <div
                  key={project.id}
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  className="bg-gray-900/80 rounded-xl px-5 py-4 border border-gray-800 border-l-[3px] hover:border-purple-500/50 hover:shadow-lg cursor-pointer transition-all duration-200 flex items-center gap-4 group"
                  style={{ borderLeftColor: stateConf.hex }}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors duration-200 truncate">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${stateConf.bg} ${stateConf.color} whitespace-nowrap`}>
                    {stateConf.label}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(project.updatedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tip */}
      {total > 0 && total < 3 && (
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-xl p-5 flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-white font-medium">Tip: Explora Oportunidades de Mercado</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Ve a Descubrir para encontrar ideas de startup validadas y brechas de mercado que puedes aprovechar.
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/discover/opportunities')}
            className="ml-auto px-4 py-2 text-sm bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg transition-all duration-200 whitespace-nowrap"
          >
            Explorar
          </button>
        </div>
      )}
    </div>
  );
}
