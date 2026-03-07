'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MarketGapCard } from '@/components/discover/MarketGapCard';
import { MarketGapModal } from '@/components/discover/MarketGapModal';
import type { MarketGapData, GapVariant } from '@/modules/marketGapEngine/marketGapTypes';

export default function MarketGapsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gaps, setGaps] = useState<MarketGapData[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [selectedGap, setSelectedGap] = useState<MarketGapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [competitionLevel, setCompetitionLevel] = useState(searchParams.get('competitionLevel') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    fetchGaps();
  }, [sector, competitionLevel, sort, page]);

  const fetchGaps = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sector) params.set('sector', sector);
      if (competitionLevel) params.set('competitionLevel', competitionLevel);
      params.set('sort', sort);
      params.set('page', page.toString());

      const response = await fetch(`/api/discover/market-gaps?${params}`);
      if (!response.ok) throw new Error('Failed to fetch gaps');

      const data = await response.json();
      setGaps(data.gaps);
      setSectors(data.sectors);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching gaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVariants = async (gapId: string): Promise<GapVariant[]> => {
    const response = await fetch(`/api/discover/market-gaps/${gapId}/generate-variants`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to generate variants');
    const data = await response.json();
    return data.variants;
  };

  const handleCreateProject = async (variantId: string) => {
    const gapId = selectedGap?.id;
    const response = await fetch(
      `/api/discover/market-gaps/${gapId}/variants/${variantId}/start-project`,
      { method: 'POST' }
    );
    if (!response.ok) throw new Error('Failed to create project');
    const data = await response.json();
    router.push(`/dashboard/projects/${data.projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Market Gaps</h1>
          <p className="text-gray-400">
            Discover underserved market segments and generate opportunity variants
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
              <select
                value={sector}
                onChange={(e) => {
                  setSector(e.target.value);
                  setPage(1);
                }}
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

            {/* Competition Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition</label>
              <select
                value={competitionLevel}
                onChange={(e) => {
                  setCompetitionLevel(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Levels</option>
                <option value="low">Low Competition</option>
                <option value="medium">Medium Competition</option>
                <option value="high">High Competition</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="competition-asc">Lowest Competition</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSector('');
                  setCompetitionLevel('');
                  setSort('newest');
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Gaps Grid */}
        {!isLoading && gaps.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {gaps.map((gap) => (
                <MarketGapCard key={gap.id} gap={gap} onClick={() => setSelectedGap(gap)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && gaps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No market gaps found</p>
            <button
              onClick={fetchGaps}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedGap && (
        <MarketGapModal
          gap={selectedGap}
          onClose={() => setSelectedGap(null)}
          onGenerateVariants={handleGenerateVariants}
          onCreateProject={handleCreateProject}
        />
      )}
    </div>
  );
}
