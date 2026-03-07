'use client';

import { Clock, TrendingUp, Zap } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: {
    id: string;
    title: string;
    hook: string;
    sector: string;
    viabilityScore: number;
    executionDifficulty: number;
    timeToMVP: string;
  };
  onClick: () => void;
}

export default function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  const getViabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-500/20';
    if (score >= 60) return 'text-yellow-500 bg-yellow-500/20';
    return 'text-red-500 bg-red-500/20';
  };

  const getDifficultyDots = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < difficulty ? 'bg-blue-500' : 'bg-gray-600'
        }`}
      />
    ));
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${opportunity.title}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
          {opportunity.sector}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded font-bold ${getViabilityColor(
            opportunity.viabilityScore
          )}`}
        >
          {opportunity.viabilityScore}% viable
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {opportunity.title}
      </h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{opportunity.hook}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-gray-500" />
          <div className="flex gap-1">{getDifficultyDots(opportunity.executionDifficulty)}</div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {opportunity.timeToMVP}
        </div>
      </div>
    </div>
  );
}
