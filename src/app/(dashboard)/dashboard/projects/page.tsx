'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Search, FolderKanban, Clock, Filter } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description?: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

const STATES: Record<string, { label: string; color: string; bg: string }> = {
  IDEA: { label: 'Idea', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  WIZARD_COMPLETE: { label: 'Structured', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' },
  VALIDATED: { label: 'Validated', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' },
  BUILDING: { label: 'Building', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' },
  BUILT: { label: 'Built', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  LIVE: { label: 'Live', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
};

function getState(s: string) {
  return STATES[s] || { label: s, color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/30' };
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
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchState = filterState === 'ALL' || p.state === filterState;
    return matchSearch && matchState;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <p className="text-gray-400 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="ALL">All States</option>
            {Object.entries(STATES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/60 rounded-xl border border-gray-800 border-dashed">
          <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-1">{search || filterState !== 'ALL' ? 'No matching projects' : 'No projects yet'}</p>
          <p className="text-sm text-gray-500 mb-6">
            {search || filterState !== 'ALL' ? 'Try adjusting your filters' : 'Use Generate to create your first digital business'}
          </p>
          {!search && filterState === 'ALL' && (
            <button
              onClick={() => router.push('/dashboard/generate')}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all font-medium flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" /> Go to Generate
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const st = getState(project.state);
            return (
              <div
                key={project.id}
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="bg-gray-900/80 rounded-xl p-5 border border-gray-800 hover:border-purple-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{project.name}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${st.bg} ${st.color} whitespace-nowrap ml-2`}>{st.label}</span>
                </div>
                {project.description && <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>}
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
