'use client';

import { useEffect, useRef } from 'react';
import { X, TrendingUp, Users, DollarSign, Rocket, AlertTriangle } from 'lucide-react';

interface OpportunityModalProps {
  opportunity: any;
  onClose: () => void;
  onCreateProject: () => void;
}

export default function OpportunityModal({ opportunity, onClose, onCreateProject }: OpportunityModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => { modalRef.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className="relative rounded-xl border w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}
      >
        {/* Header */}
        <div className="sticky top-0 border-b p-6 flex items-start justify-between z-10" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div>
            <h2 id="modal-title" className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{opportunity.title}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{opportunity.hook}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-tertiary)' }} aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <section>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <TrendingUp className="w-5 h-5 text-blue-400" /> Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Viability', value: `${opportunity.viabilityScore}%`, color: opportunity.viabilityScore >= 70 ? 'text-green-400' : 'text-yellow-400' },
                { label: 'Difficulty', value: `${opportunity.executionDifficulty}/5`, color: 'text-yellow-400' },
                { label: 'Time to MVP', value: opportunity.timeToMVP, color: '' },
                { label: 'Sector', value: opportunity.sector, color: '' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`} style={stat.color ? {} : { color: 'var(--text-primary)' }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Problem Analysis */}
          <section>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users className="w-5 h-5 text-purple-400" /> Problem Analysis
            </h3>
            <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              {[
                { label: 'Buyer Persona', value: opportunity.buyerPersona },
                { label: 'Pain Level', value: `${opportunity.painLevel}/10` },
                { label: 'MVP Scope', value: opportunity.mvpScope },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>{item.label}</p>
                  <p style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Monetization */}
          <section>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <DollarSign className="w-5 h-5 text-green-400" /> Monetization
            </h3>
            <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <div><p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Model</p><p className="capitalize" style={{ color: 'var(--text-primary)' }}>{opportunity.monetizationType}</p></div>
              <div><p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Pricing</p><p style={{ color: 'var(--text-primary)' }}>{opportunity.pricingSuggestions}</p></div>
              <div><p className="text-sm mb-1" style={{ color: 'var(--text-tertiary)' }}>Rationale</p><p style={{ color: 'var(--text-primary)' }}>{opportunity.pricingRationale}</p></div>
            </div>
          </section>

          {/* Differentiation */}
          <section>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Differentiation Angles</h3>
            <ul className="space-y-2">
              {(opportunity.differentiationAngles || []).map((angle: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-purple-400 mt-1">•</span>{angle}
                </li>
              ))}
            </ul>
          </section>

          {/* Risks & Mitigations */}
          <section>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle className="w-5 h-5 text-yellow-400" /> Risks & Mitigations
            </h3>
            <div className="space-y-3">
              {(opportunity.risks || []).map((risk: string, idx: number) => (
                <div key={idx} className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <p className="mb-2" style={{ color: 'var(--text-primary)' }}><span className="text-yellow-400 font-bold">Risk:</span> {risk}</p>
                  <p style={{ color: 'var(--text-secondary)' }}><span className="text-green-400 font-bold">Mitigation:</span> {(opportunity.mitigations || [])[idx]}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7-Day Action Plan */}
          <section>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Rocket className="w-5 h-5 text-blue-400" /> 7-Day Action Plan
            </h3>
            <ol className="space-y-2">
              {(opportunity.nextSteps || []).map((step: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-purple-400 font-bold">{idx + 1}.</span>{step}
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 border-t p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={onCreateProject}
            className="w-full px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            Create Project from this Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}
