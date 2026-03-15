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
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [competitionLevel, setCompetitionLevel] = useState(searchParams.get('competitionLevel') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => { fetchGaps(); }, [sector, competitionLevel, sort, page]);

  const fetchGaps = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sector) params.set('sector', sector);
      if (competitionLevel) params.set('competitionLevel', competitionLevel);
      params.set('sort', sort);
      params.set('page', page.toString());
      const res = await fetch(`/api/discover/gaps?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setGaps(data.gaps); setSectors(data.sectors); setTotalPages(data.totalPages);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleGenerateVariants = async (gapId: string): Promise<GapVariant[]> => {
    const res = await fetch(`/api/discover/market-gaps/${gapId}/generate-variants`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed');
    return (await res.json()).variants;
  };

  const handleCreateProject = async (variantId: string) => {
    const res = await fetch(`/api/discover/market-gaps/${selectedGap?.id}/variants/${variantId}/start-project`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed');
    router.push(`/dashboard/projects/${(await res.json()).projectId}`);
  };

  const selectStyle = { backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Market Gaps</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Discover underserved market segments and generate opportunity variants</p>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Sector</label>
              <select value={sector} onChange={(e) => { setSector(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500" style={selectStyle}>
                <option value="">All Sectors</option>
                {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Competition</label>
              <select value={competitionLevel} onChange={(e) => { setCompetitionLevel(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500" style={selectStyle}>
                <option value="">All Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Sort By</label>
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500" style={selectStyle}>
                <option value="newest">Newest First</option>
                <option value="competition-asc">Lowest Competition</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => { setSector(''); setCompetitionLevel(''); setSort('newest'); setPage(1); }}
                className="w-full px-4 py-2 rounded-lg border transition-colors text-sm font-medium"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-primary)' }} />
            <span className="ml-3" style={{ color: 'var(--text-secondary)' }}>Loading market gaps...</span>
          </div>
        )}

        {!isLoading && gaps.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {gaps.map((gap) => <MarketGapCard key={gap.id} gap={gap} onClick={() => setSelectedGap(gap)} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>Previous</button>
                <span style={{ color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>Next</button>
              </div>
            )}
          </>
        )}

        {!isLoading && gaps.length === 0 && (
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>No market gaps found</p>
            <button onClick={fetchGaps} className="px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>Refresh</button>
          </div>
        )}
      </div>

      {selectedGap && <MarketGapModal gap={selectedGap} onClose={() => setSelectedGap(null)} onGenerateVariants={handleGenerateVariants} onCreateProject={handleCreateProject} />}
    </div>
  );
}
