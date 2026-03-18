'use client';

import {
  Cloud,
  Globe,
  FileText,
  Store,
  Wrench,
  Brain,
  ShoppingCart,
  HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BusinessTypeSelectorProps {
  selected: string | null;
  onSelect: (type: string) => void;
}

interface BusinessTypeOption {
  type: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const BUSINESS_TYPES: BusinessTypeOption[] = [
  { type: 'SAAS', label: 'SaaS', description: 'Subscription-based software service', icon: Cloud },
  { type: 'WEB_APP', label: 'Web App', description: 'Interactive web application', icon: Globe },
  { type: 'LANDING_PAGE', label: 'Landing Page', description: 'High-converting landing page', icon: FileText },
  { type: 'MARKETPLACE', label: 'Marketplace', description: 'Two-sided marketplace platform', icon: Store },
  { type: 'INTERNAL_TOOL', label: 'Internal Tool', description: 'Internal business tool', icon: Wrench },
  { type: 'AI_TOOL', label: 'AI Tool', description: 'AI-powered application', icon: Brain },
  { type: 'ECOMMERCE', label: 'E-commerce', description: 'Online store or shop', icon: ShoppingCart },
  { type: 'GUIDED', label: "I'm not sure", description: 'Let AI help you decide', icon: HelpCircle },
];

export function BusinessTypeSelector({ selected, onSelect }: BusinessTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {BUSINESS_TYPES.map(({ type, label, description, icon: Icon }) => {
        const isSelected = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`group relative flex flex-col items-start gap-3 p-5 rounded-xl border text-left
              backdrop-blur-sm transition-all duration-200
              ${
                isSelected
                  ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'bg-gray-900/80 border-gray-700/50 hover:border-gray-600/60 hover:bg-gray-900/90'
              }`}
          >
            <div
              className={`p-2.5 rounded-lg transition-colors duration-200 ${
                isSelected
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-gray-800/60 text-gray-400 group-hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3
                className={`text-sm font-semibold mb-1 transition-colors ${
                  isSelected ? 'text-purple-300' : 'text-gray-200'
                }`}
              >
                {label}
              </h3>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
