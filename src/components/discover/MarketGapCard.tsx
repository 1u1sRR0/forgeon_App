'use client';

import type { MarketGapData } from '@/modules/marketGapEngine/marketGapTypes';

interface MarketGapCardProps {
  gap: MarketGapData;
  onClick: () => void;
}

export function MarketGapCard({ gap, onClick }: MarketGapCardProps) {
  const competitionColor =
    gap.competitionLevel === 'low' ? 'bg-green-500/15 text-green-400'
    : gap.competitionLevel === 'medium' ? 'bg-yellow-500/15 text-yellow-400'
    : 'bg-red-500/15 text-red-400';

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      role="button" tabIndex={0} aria-label={`View details for ${gap.title}`}
      className="group rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold group-hover:text-purple-400 transition-colors line-clamp-2" style={{ color: 'var(--text-primary)' }}>
          {gap.title}
        </h3>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${competitionColor}`}>
          {gap.competitionLevel}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
          {gap.sector}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Underserved Segment:</p>
        <p className="text-sm font-medium text-purple-400">{gap.underservedSegment}</p>
      </div>

      <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--text-secondary)' }}>{gap.gapDescription}</p>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {gap.evidence.length} evidence signal{gap.evidence.length !== 1 ? 's' : ''}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{gap.estimatedMarketSize}</span>
      </div>
    </div>
  );
}
