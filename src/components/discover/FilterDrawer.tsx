'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface FilterDrawerProps {
  searchQuery: string;
  sector: string;
  minViability: string;
  difficulty: string;
  monetizationType: string;
  sort: string;
  sectors: string[];
  onSearchChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onMinViabilityChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onMonetizationTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

export function FilterDrawer(props: FilterDrawerProps) {
  const [localSearch, setLocalSearch] = useState(props.searchQuery);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => props.onSearchChange(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const selectStyle = {
    backgroundColor: 'var(--bg-elevated)',
    borderColor: 'var(--border-subtle)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="mb-6">
      <button onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden w-full mb-4 px-4 py-3 rounded-xl flex items-center justify-between border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
        <span className="font-medium">Filters</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
      </button>

      <div className={`${isCollapsed ? 'hidden lg:block' : 'block'} p-4 rounded-xl border backdrop-blur-sm`}
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
              <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={selectStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Sector</label>
            <select value={props.sector} onChange={(e) => props.onSectorChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500" style={selectStyle}>
              <option value="">All Sectors</option>
              {props.sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Min Viability</label>
            <select value={props.minViability} onChange={(e) => props.onMinViabilityChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500" style={selectStyle}>
              <option value="">Any</option>
              <option value="60">60+</option>
              <option value="70">70+</option>
              <option value="80">80+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Difficulty</label>
            <select value={props.difficulty} onChange={(e) => props.onDifficultyChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500" style={selectStyle}>
              <option value="">Any</option>
              <option value="1-2">Easy (1-2)</option>
              <option value="3">Medium (3)</option>
              <option value="4-5">Hard (4-5)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Sort By</label>
            <select value={props.sort} onChange={(e) => props.onSortChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500" style={selectStyle}>
              <option value="viability-desc">Highest Viability</option>
              <option value="difficulty-asc">Lowest Difficulty</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={props.onClearFilters}
            className="px-4 py-2 rounded-lg transition-colors text-sm font-medium border"
            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}
