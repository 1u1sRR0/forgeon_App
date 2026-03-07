'use client';

import { useEffect, useRef } from 'react';
import { X, TrendingUp, Users, DollarSign, Rocket, Target, AlertTriangle } from 'lucide-react';

interface OpportunityModalProps {
  opportunity: any;
  onClose: () => void;
  onCreateProject: () => void;
}

export default function OpportunityModal({
  opportunity,
  onClose,
  onCreateProject,
}: OpportunityModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" />
      
      <div
        ref={modalRef}
        className="relative bg-gray-900 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-start justify-between z-10">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-white mb-1">
              {opportunity.title}
            </h2>
            <p className="text-gray-400">{opportunity.hook}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview */}
          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Viability</p>
                <p className="text-2xl font-bold text-green-500">{opportunity.viabilityScore}%</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Difficulty</p>
                <p className="text-2xl font-bold text-yellow-500">{opportunity.executionDifficulty}/5</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Time to MVP</p>
                <p className="text-lg font-bold text-white">{opportunity.timeToMVP}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Sector</p>
                <p className="text-lg font-bold text-white">{opportunity.sector}</p>
              </div>
            </div>
          </section>

          {/* Problem Analysis */}
          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Problem Analysis
            </h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Target Audience</p>
                <p className="text-white">{opportunity.buyerPersona}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pain Level</p>
                <p className="text-white">{opportunity.painLevel}/10</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">MVP Scope</p>
                <p className="text-white">{opportunity.mvpScope}</p>
              </div>
            </div>
          </section>

          {/* Differentiation */}
          <section>
            <h3 className="text-lg font-bold text-white mb-3">Differentiation Angles</h3>
            <ul className="space-y-2">
              {opportunity.differentiationAngles.map((angle: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <span className="text-blue-500 mt-1">•</span>
                  {angle}
                </li>
              ))}
            </ul>
          </section>

          {/* Monetization */}
          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Monetization
            </h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Model</p>
                <p className="text-white capitalize">{opportunity.monetizationType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pricing Suggestions</p>
                <p className="text-white">{opportunity.pricingSuggestions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Rationale</p>
                <p className="text-white">{opportunity.pricingRationale}</p>
              </div>
            </div>
          </section>

          {/* Risks */}
          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Risks & Mitigations
            </h3>
            <div className="space-y-3">
              {opportunity.risks.map((risk: string, idx: number) => (
                <div key={idx} className="bg-gray-800 rounded-lg p-4">
                  <p className="text-white mb-2">
                    <span className="text-yellow-500 font-bold">Risk:</span> {risk}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-green-500 font-bold">Mitigation:</span>{' '}
                    {opportunity.mitigations[idx]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Next Steps */}
          <section>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-blue-500" />
              7-Day Action Plan
            </h3>
            <ol className="space-y-2">
              {opportunity.nextSteps.map((step: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="text-blue-500 font-bold">{idx + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-6">
          <button
            onClick={onCreateProject}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Create Project from this Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}
