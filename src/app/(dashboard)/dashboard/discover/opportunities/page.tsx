'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OpportunityCard from '@/components/discover/OpportunityCard';
import OpportunityModal from '@/components/discover/OpportunityModal';
import { FilterDrawer } from '@/components/discover/FilterDrawer';

export default function OpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [sector, setSector] = useState('');
  const [minViability, setMinViability] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [monetizationType, setMonetizationType] = useState('');
  const [sort, setSort] = useState('viability-desc');

  useEffect(() => { fetchOpportunities(); }, [searchQuery, sector, minViability, difficulty, monetizationType, sort, page]);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (sector) params.set('sector', sector);
      if (minViability) params.set('minViability', minViability);
      if (difficulty) params.set('maxDifficulty', difficulty.split('-')[1] || difficulty);
      if (monetizationType) params.set('monetizationType', monetizationType);
      params.set('sort', sort);
      params.set('page', page.toString());

      const res = await fetch(`/api/discover/opportunities?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setOpportunities(data.opportunities);
      setSectors(data.sectors);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!selectedOpportunity) return;
    try {
      const res = await fetch(`/api/opportunities/${selectedOpportunity.id}/start-project`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      router.push(`/dashboard/projects/${data.projectId}`);
    } catch (error) { console.error('Error:', error); }
  };

  const handleClearFilters = () => {
    setSearchQuery(''); setSector(''); setMinViability(''); setDifficulty(''); setMonetizationType(''); setSort('viability-desc'); setPage(1);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Discover Opportunities</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AI-powered business opportunities with comprehensive market intelligence</p>
        </div>

        <FilterDrawer
          searchQuery={searchQuery} sector={sector} minViability={minViability}
          difficulty={difficulty} monetizationType={monetizationType} sort={sort} sectors={sectors}
          onSearchChange={(v) => { setSearchQuery(v); setPage(1); }}
          onSectorChange={(v) => { setSector(v); setPage(1); }}
          onMinViabilityChange={(v) => { setMinViability(v); setPage(1); }}
          onDifficultyChange={(v) => { setDifficulty(v); setPage(1); }}
          onMonetizationTypeChange={(v) => { setMonetizationType(v); setPage(1); }}
          onSortChange={(v) => { setSort(v); setPage(1); }}
          onClearFilters={handleClearFilters}
        />

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-primary)' }} />
            <span className="ml-3" style={{ color: 'var(--text-secondary)' }}>Generating opportunities...</span>
          </div>
        )}

        {!isLoading && opportunities.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} onClick={() => setSelectedOpportunity(opp)} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}>
                  Previous
                </button>
                <span style={{ color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                  style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && opportunities.length === 0 && (
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>No opportunities found</p>
            <button onClick={fetchOpportunities} className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
              Refresh
            </button>
          </div>
        )}
      </div>

      {selectedOpportunity && (
        <OpportunityModal opportunity={selectedOpportunity} onClose={() => setSelectedOpportunity(null)} onCreateProject={handleCreateProject} />
      )}
    </div>
  );
}
