'use client';

import type { MarketGapData } from '@/modules/marketGapEngine/marketGapTypes';

interface MarketGapCardProps {
  gap: MarketGapData;
  onClick: () => void;
}

export function MarketGapCard({ gap, onClick }: MarketGapCardProps) {
  const competitionColor =
    gap.competitionLevel === 'low'
      ? 'bg-green-500/20 text-green-400'
      : gap.competitionLevel === 'medium'
        ? 'bg-yellow-500/20 text-yellow-400'
        : 'bg-red-500/20 text-red-400';

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${gap.title}`}
      className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
          {gap.title}
        </h3>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${competitionColor}`}>
          {gap.competitionLevel} competition
        </span>
      </div>

      {/* Sector Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-sm">
          {gap.sector}
        </span>
      </div>

      {/* Underserved Segment */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-1">Underserved Segment:</p>
        <p className="text-sm text-purple-400 font-medium">{gap.underservedSegment}</p>
      </div>

      {/* Gap Description */}
      <p className="text-sm text-gray-300 line-clamp-3 mb-4">{gap.gapDescription}</p>

      {/* Evidence Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-gray-400">
            {gap.evidence.length} evidence signal{gap.evidence.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span className="text-xs text-gray-500">{gap.estimatedMarketSize}</span>
      </div>

      {/* Hover Arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-5 h-5 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
