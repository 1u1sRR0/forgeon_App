'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OpportunityCard from '@/components/discover/OpportunityCard';
import OpportunityModal from '@/components/discover/OpportunityModal';
import { FilterDrawer } from '@/components/discover/FilterDrawer';
import type { BusinessIntelligenceDossier } from '@/modules/opportunityEngine/opportunityTypes';

export default function OpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<(BusinessIntelligenceDossier & { id: string })[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<(BusinessIntelligenceDossier & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sector, setSector] = useState('');
  const [minViability, setMinViability] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [monetizationType, setMonetizationType] = useState('');
  const [sort, setSort] = useState('viability-desc');

  useEffect(() => {
    fetchOpportunities();
  }, [searchQuery, sector, minViability, difficulty, monetizationType, sort, page]);

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

      const response = await fetch(`/api/discover/opportunities?${params}`);
      if (!response.ok) throw new Error('Failed to fetch opportunities');

      const data = await response.json();
      setOpportunities(data.opportunities);
      setSectors(data.sectors);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!selectedOpportunity) return;

    try {
      const response = await fetch(`/api/opportunities/${selectedOpportunity.id}/start-project`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to create project');

      const data = await response.json();
      router.push(`/dashboard/projects/${data.projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSector('');
    setMinViability('');
    setDifficulty('');
    setMonetizationType('');
    setSort('viability-desc');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discover Opportunities</h1>
          <p className="text-gray-400">
            AI-powered business opportunities with comprehensive market intelligence
          </p>
        </div>

        {/* Filters */}
        <FilterDrawer
          searchQuery={searchQuery}
          sector={sector}
          minViability={minViability}
          difficulty={difficulty}
          monetizationType={monetizationType}
          sort={sort}
          sectors={sectors}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          onSectorChange={(value) => {
            setSector(value);
            setPage(1);
          }}
          onMinViabilityChange={(value) => {
            setMinViability(value);
            setPage(1);
          }}
          onDifficultyChange={(value) => {
            setDifficulty(value);
            setPage(1);
          }}
          onMonetizationTypeChange={(value) => {
            setMonetizationType(value);
            setPage(1);
          }}
          onSortChange={(value) => {
            setSort(value);
            setPage(1);
          }}
          onClearFilters={handleClearFilters}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Opportunities Grid */}
        {!isLoading && opportunities.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onClick={() => setSelectedOpportunity(opp)}
                />
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
        {!isLoading && opportunities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No opportunities found</p>
            <button
              onClick={fetchOpportunities}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onCreateProject={handleCreateProject}
        />
      )}
    </div>
  );
}
