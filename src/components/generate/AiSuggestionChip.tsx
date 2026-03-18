'use client';

import { Sparkles, Loader2 } from 'lucide-react';

interface AiSuggestionChipProps {
  onClick: () => void;
  loading?: boolean;
}

export function AiSuggestionChip({ onClick, loading }: AiSuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        bg-purple-500/10 text-purple-400 border border-purple-500/30
        hover:bg-purple-500/20 hover:border-purple-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      AI can help
    </button>
  );
}
