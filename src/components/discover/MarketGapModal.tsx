'use client';

import { useEffect, useState } from 'react';
import type { MarketGapData, GapVariant } from '@/modules/marketGapEngine/marketGapTypes';

interface MarketGapModalProps {
  gap: MarketGapData;
  onClose: () => void;
  onGenerateVariants: (gapId: string) => Promise<GapVariant[]>;
  onCreateProject: (variantId: string) => Promise<void>;
}

export function MarketGapModal({
  gap,
  onClose,
  onGenerateVariants,
  onCreateProject,
}: MarketGapModalProps) {
  const [variants, setVariants] = useState<GapVariant[]>(gap.variants || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleGenerateVariants = async () => {
    setIsGenerating(true);
    try {
      const newVariants = await onGenerateVariants(gap.id);
      setVariants(newVariants);
    } catch (error) {
      console.error('Failed to generate variants:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateProject = async (variantId: string) => {
    setIsCreatingProject(variantId);
    try {
      await onCreateProject(variantId);
    } catch (error) {
      console.error('Failed to create project:', error);
      setIsCreatingProject(null);
    }
  };

  const competitionColor =
    gap.competitionLevel === 'low'
      ? 'bg-green-500/20 text-green-400'
      : gap.competitionLevel === 'medium'
        ? 'bg-yellow-500/20 text-yellow-400'
        : 'bg-red-500/20 text-red-400';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors z-10"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-4">
              <h2 className="text-3xl font-bold text-white flex-1">{gap.title}</h2>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${competitionColor}`}>
                {gap.competitionLevel} competition
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">{gap.sector}</span>
              <span className="text-sm text-gray-500">{gap.estimatedMarketSize}</span>
            </div>
          </div>

          {/* Underserved Segment */}
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Underserved Segment</h3>
            <p className="text-white">{gap.underservedSegment}</p>
          </div>

          {/* Gap Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Market Gap Analysis</h3>
            <p className="text-gray-300 leading-relaxed">{gap.gapDescription}</p>
          </div>

          {/* Evidence Signals */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Evidence Signals</h3>
            <div className="space-y-3">
              {gap.evidence.map((evidence, index) => {
                const strengthColor =
                  evidence.strength === 'strong'
                    ? 'bg-green-500/20 text-green-400'
                    : evidence.strength === 'moderate'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400';

                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${strengthColor}`}>
                      {evidence.strength}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">{evidence.signal}</p>
                      <p className="text-gray-500 text-xs mt-1">Source: {evidence.source}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wedge Strategy */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Recommended Wedge Strategy</h3>
            <p className="text-gray-300 leading-relaxed">{gap.wedgeStrategy}</p>
          </div>

          {/* Variants Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Opportunity Variants</h3>
              {variants.length === 0 && (
                <button
                  onClick={handleGenerateVariants}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {isGenerating ? 'Generating...' : 'Generate 3 Opportunities'}
                </button>
              )}
            </div>

            {variants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-purple-500/50 transition-colors"
                  >
                    <div className="mb-3">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                        {variant.approach}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold mb-2">{variant.title}</h4>
                    <p className="text-sm text-gray-400 mb-2">{variant.targetSubSegment}</p>
                    <p className="text-xs text-gray-500 mb-4">{variant.differentiator}</p>
                    <button
                      onClick={() => handleCreateProject(variant.id)}
                      disabled={isCreatingProject === variant.id}
                      className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      {isCreatingProject === variant.id ? 'Creating...' : 'Create Project'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Generate opportunity variants to explore different strategic approaches to this market gap.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
