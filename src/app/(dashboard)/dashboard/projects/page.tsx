'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Search, FolderKanban, Clock, Filter,
  ArrowRight, Rocket, Zap, CheckCircle2, AlertTriangle,
  Hammer, MoreHorizontal, Plus, TrendingUp,
  Lightbulb, Shield, Package,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

const STATES: Record<string, {
  label: string;
  color: string;
  bg: string;
  icon: typeof Lightbulb;
  gradient: string;
  step: number;
  totalSteps: number;
}> = {
  IDEA: {
    label: 'Idea',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15 border-blue-500/30',
    icon: Lightbulb,
    gradient: 'from-blue-600/20 to-blue-400/5',
    step: 1,
    totalSteps: 5,
  },
  WIZARD_COMPLETE: {
    label: 'Estructurado',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15 border-cyan-500/30',
    icon: CheckCircle2,
    gradient: 'from-cyan-600/20 to-cyan-400/5',
    step: 2,
    totalSteps: 5,
  },
  VALIDATED: {
    label: 'Validado',
    color: 'text-green-400',
    bg: 'bg-green-500/15 border-green-500/30',
    icon: Shield,
    gradient: 'from-green-600/20 to-green-400/5',
    step: 3,
    totalSteps: 5,
  },
  BUILD_READY: {
    label: 'Listo para Build',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/30',
    icon: Zap,
    gradient: 'from-emerald-600/20 to-emerald-400/5',
    step: 3,
    totalSteps: 5,
  },
  BUILDING: {
    label: 'Construyendo',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/15 border-yellow-500/30',
    icon: Hammer,
    gradient: 'from-yellow-600/20 to-yellow-400/5',
    step: 4,
    totalSteps: 5,
  },
  MVP_GENERATED: {
    label: 'MVP Generado',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15 border-purple-500/30',
    icon: Package,
    gradient: 'from-purple-600/20 to-purple-400/5',
    step: 5,
    totalSteps: 5,
  },
  BUILT: {
    label: 'Construido',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15 border-purple-500/30',
    icon: Package,
    gradient: 'from-purple-600/20 to-purple-400/5',
    step: 5,
    totalSteps: 5,
  },
  BLOCKED: {
    label: 'Bloqueado',
    color: 'text-red-400',
    bg: 'bg-red-500/15 border-red-500/30',
    icon: AlertTriangle,
    gradient: 'from-red-600/20 to-red-400/5',
    step: 0,
    totalSteps: 5,
  },
  LIVE: {
    label: 'En Vivo',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/30',
    icon: Rocket,
    gradient: 'from-emerald-600/20 to-emerald-400/5',
    step: 5,
    totalSteps: 5,
  },
};

function getState(s: string) {
  return STATES[s] || {
    label: s,
    color: 'text-gray-400',
    bg: 'bg-gray-500/15 border-gray-500/30',
    icon: FolderKanban,
    gradient: 'from-gray-600/20 to-gray-400/5',
    step: 0,
    totalSteps: 5,
  };
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora mismo';
  if (mins < 60) return `Hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('ALL');

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchState = filterState === 'ALL' || p.state === filterState;
    return matchSearch && matchState;
  });

  // Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => !['BLOCKED'].includes(p.state)).length;
  const completedProjects = projects.filter((p) => ['BUILT', 'MVP_GENERATED', 'LIVE'].includes(p.state)).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mis Proyectos</h1>
          <p className="text-gray-400 mt-1">
            {totalProjects === 0
              ? 'Crea tu primer negocio digital'
              : `${totalProjects} proyecto${totalProjects !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/generate')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.25)]"
        >
          <Plus className="w-4 h-4" /> Nuevo Proyecto
        </button>
      </div>

      {/* Stats Cards */}
      {totalProjects > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalProjects}</p>
              <p className="text-xs text-gray-500">Total Proyectos</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeProjects}</p>
              <p className="text-xs text-gray-500">Activos</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedProjects}</p>
              <p className="text-xs text-gray-500">Completados</p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer"
          >
            <option value="ALL">Todos los Estados</option>
            {Object.entries(STATES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full mb-4" />
              <div className="h-3 bg-white/5 rounded w-full mb-2" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-5">
            <FolderKanban className="w-8 h-8 text-purple-400/60" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {search || filterState !== 'ALL' ? 'Sin resultados' : 'Aún no tienes proyectos'}
          </h3>
          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
            {search || filterState !== 'ALL'
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'Genera tu primer negocio digital con IA. Evalúa tu idea, genera blueprints y construye tu MVP.'}
          </p>
          {!search && filterState === 'ALL' && (
            <button
              onClick={() => router.push('/dashboard/generate')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-xl transition-all font-semibold flex items-center gap-2 mx-auto shadow-[0_0_20px_rgba(168,85,247,0.25)]"
            >
              <Sparkles className="w-4 h-4" /> Crear Primer Proyecto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => {
            const st = getState(project.state);
            const Icon = st.icon;
            const progress = Math.round((st.step / st.totalSteps) * 100);

            return (
              <div
                key={project.id}
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="group relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-2xl border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] overflow-hidden"
              >
                {/* Top gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${st.gradient.replace('to-', 'to-transparent via-')}`} />

                <div className="p-6">
                  {/* Header: Icon + State */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.gradient} border border-white/10 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${st.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <span className={`text-xs ${st.color} font-medium`}>{st.label}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/projects/${project.id}`);
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Progreso</span>
                      <span className="text-[10px] text-gray-400 font-medium">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress === 100
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                            : progress >= 60
                              ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  {project.description ? (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600 italic mb-4">Sin descripción</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px]">{timeAgo(project.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-all text-xs font-medium">
                      Ver proyecto <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Project Card */}
          <div
            onClick={() => router.push('/dashboard/generate')}
            className="group relative bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/30 cursor-pointer transition-all duration-300 flex items-center justify-center min-h-[220px]"
          >
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center mx-auto mb-3 transition-all">
                <Plus className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-400 group-hover:text-purple-300 transition-colors">
                Nuevo Proyecto
              </p>
              <p className="text-xs text-gray-600 mt-1">Genera con IA</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
