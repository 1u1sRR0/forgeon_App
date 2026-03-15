'use client';

import { Clock, Zap } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: {
    id: string;
    title: string;
    hook: string;
    sector: string;
    viabilityScore: number;
    executionDifficulty: number;
    monetizationType?: string;
    timeToMVP: string;
  };
  onClick: () => void;
}

export default function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  const viabilityColor =
    opportunity.viabilityScore >= 70
      ? 'text-green-400 bg-green-500/15'
      : opportunity.viabilityScore >= 50
        ? 'text-yellow-400 bg-yellow-500/15'
        : 'text-red-400 bg-red-500/15';

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      aria-label={`View details for ${opportunity.title}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs px-2 py-1 rounded font-medium"
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
        >
          {opportunity.sector}
        </span>
        <span className={`text-xs px-2 py-1 rounded font-bold ${viabilityColor}`}>
          {opportunity.viabilityScore}%
        </span>
      </div>

      <h3
        className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors"
        style={{ color: 'var(--text-primary)' }}
      >
        {opportunity.title}
      </h3>
      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
        {opportunity.hook}
      </p>

      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < opportunity.executionDifficulty ? 'bg-purple-500' : 'bg-gray-700'}`} />
            ))}
          </div>
        </div>
        {opportunity.monetizationType && (
          <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>
            {opportunity.monetizationType}
          </span>
        )}
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <Clock className="w-3 h-3" />
          {opportunity.timeToMVP}
        </div>
      </div>
    </div>
  );
}
