'use client';

import { useState, useEffect } from 'react';

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

export function FilterDrawer({
  searchQuery,
  sector,
  minViability,
  difficulty,
  monetizationType,
  sort,
  sectors,
  onSearchChange,
  onSectorChange,
  onMinViabilityChange,
  onDifficultyChange,
  onMonetizationTypeChange,
  onSortChange,
  onClearFilters,
}: FilterDrawerProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="mb-6">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden w-full mb-4 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white flex items-center justify-between"
      >
        <span className="font-medium">Filters</span>
        <svg
          className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Content */}
      <div
        className={`${isCollapsed ? 'hidden lg:block' : 'block'} p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
            <select
              value={sector}
              onChange={(e) => onSectorChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Min Viability */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Min Viability</label>
            <select
              value={minViability}
              onChange={(e) => onMinViabilityChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Any</option>
              <option value="60">60+</option>
              <option value="70">70+</option>
              <option value="80">80+</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Any</option>
              <option value="1-2">Easy (1-2)</option>
              <option value="3">Medium (3)</option>
              <option value="4-5">Hard (4-5)</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="viability-desc">Highest Viability</option>
              <option value="difficulty-asc">Lowest Difficulty</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}
