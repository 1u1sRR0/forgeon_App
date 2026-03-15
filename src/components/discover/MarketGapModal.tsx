'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { MarketGapData, GapVariant } from '@/modules/marketGapEngine/marketGapTypes';

interface MarketGapModalProps {
  gap: MarketGapData;
  onClose: () => void;
  onGenerateVariants: (gapId: string) => Promise<GapVariant[]>;
  onCreateProject: (variantId: string) => Promise<void>;
}

export function MarketGapModal({ gap, onClose, onGenerateVariants, onCreateProject }: MarketGapModalProps) {
  const [variants, setVariants] = useState<GapVariant[]>(gap.variants || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
  }, [onClose]);

  const handleGenerateVariants = async () => {
    setIsGenerating(true);
    try { setVariants(await onGenerateVariants(gap.id)); } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleCreateProject = async (variantId: string) => {
    setIsCreatingProject(variantId);
    try { await onCreateProject(variantId); } catch (e) { console.error(e); setIsCreatingProject(null); }
  };

  const competitionColor = gap.competitionLevel === 'low' ? 'bg-green-500/15 text-green-400' : gap.competitionLevel === 'medium' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="relative rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 p-2 rounded-lg z-10 transition-colors" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-4">
              <h2 className="text-3xl font-bold flex-1" style={{ color: 'var(--text-primary)' }}>{gap.title}</h2>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${competitionColor}`}>{gap.competitionLevel}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{gap.sector}</span>
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{gap.estimatedMarketSize}</span>
            </div>
          </div>

          {/* Underserved Segment */}
          <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(168,85,247,0.05)', borderColor: 'rgba(168,85,247,0.2)' }}>
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Underserved Segment</h3>
            <p style={{ color: 'var(--text-primary)' }}>{gap.underservedSegment}</p>
          </div>

          {/* Gap Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Market Gap Analysis</h3>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{gap.gapDescription}</p>
          </div>

          {/* Evidence Signals */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Evidence Signals</h3>
            <div className="space-y-3">
              {gap.evidence.map((ev, i) => {
                const sc = ev.strength === 'strong' ? 'bg-green-500/15 text-green-400' : ev.strength === 'moderate' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-gray-500/15 text-gray-400';
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${sc}`}>{ev.strength}</span>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{ev.signal}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Source: {ev.source}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wedge Strategy */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Wedge Strategy</h3>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{gap.wedgeStrategy}</p>
          </div>

          {/* Variants */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Opportunity Variants</h3>
              {variants.length === 0 && (
                <button onClick={handleGenerateVariants} disabled={isGenerating}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                  {isGenerating ? 'Generating...' : 'Generate 3 Opportunities'}
                </button>
              )}
            </div>

            {variants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variants.map((v) => (
                  <div key={v.id} className="p-4 rounded-xl border transition-colors"
                    style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium mb-3 bg-purple-500/15 text-purple-400">{v.approach}</span>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h4>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{v.targetSubSegment}</p>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>{v.differentiator}</p>
                    <button onClick={() => handleCreateProject(v.id)} disabled={isCreatingProject === v.id}
                      className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                      style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                      {isCreatingProject === v.id ? 'Creating...' : 'Create Project'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Generate opportunity variants to explore different strategic approaches.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
