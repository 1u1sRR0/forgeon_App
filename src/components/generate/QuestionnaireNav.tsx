'use client';

import { Check } from 'lucide-react';

type SectionStatus = 'empty' | 'in-progress' | 'complete';

interface QuestionnaireNavProps {
  sections: Record<string, SectionStatus>;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SECTION_LABELS: Record<string, string> = {
  A: 'Business Intent',
  B: 'Product Definition',
  C: 'Monetization',
  D: 'Brand & Expression',
  E: 'Technical Scope',
  F: 'Constraints',
};

const SECTION_ORDER = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuestionnaireNav({ sections, activeSection, onSectionChange }: QuestionnaireNavProps) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Questionnaire sections">
      {SECTION_ORDER.map((id) => {
        const status = sections[id] ?? 'empty';
        const isActive = activeSection === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm
              transition-all duration-200
              ${
                isActive
                  ? 'bg-gray-800/80 border border-gray-700/50 text-gray-100'
                  : 'border border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/40'
              }`}
          >
            <StatusIndicator status={status} />
            <span className="font-medium">
              {id}. {SECTION_LABELS[id]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function StatusIndicator({ status }: { status: SectionStatus }) {
  if (status === 'complete') {
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20">
        <Check className="w-3 h-3 text-green-400" />
      </span>
    );
  }

  if (status === 'in-progress') {
    return <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />;
  }

  return <span className="w-2.5 h-2.5 rounded-full bg-gray-600" />;
}
