'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ViabilityScore {
  marketScore: number;
  productScore: number;
  financialScore: number;
  executionScore: number;
  totalScore: number;
  breakdownReasons: any[];
}

interface Finding {
  severity: string;
  code: string;
  message: string;
  blocksBuild: boolean;
}

interface Risk {
  category: string;
  title: string;
  description: string;
  impact: number;
  probability: number;
  riskScore: number;
  isCritical: boolean;
}

export default function EvaluationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string>('');
  const [score, setScore] = useState<ViabilityScore | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then((p) => {
      setProjectId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (projectId) {
      fetchEvaluation();
    }
  }, [projectId]);

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/evaluation`);
      
      if (response.status === 404) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setScore(data.viabilityScore);
        setFindings(data.findings || []);
        setRisks(data.risks || []);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load evaluation');
      setLoading(false);
    }
  };

  const runEvaluation = async () => {
    try {
      setEvaluating(true);
      setError('');
      
      const response = await fetch(`/api/projects/${projectId}/evaluate`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Evaluation failed');
        setEvaluating(false);
        return;
      }

      setScore(data.viabilityScore);
      setFindings(data.findings || []);
      setRisks(data.risks || []);
      setEvaluating(false);

      // Refresh page to show new state
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'CRITICAL') return 'bg-red-100 text-red-800 border-red-300';
    if (severity === 'WARNING') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              MVP Incubator
            </Link>
            <Link
              href={`/dashboard/projects/${projectId}`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Project
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Evaluation Results</h1>

        {!score && !evaluating && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No evaluation has been run yet.</p>
            <button
              onClick={runEvaluation}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Run Evaluation
            </button>
          </div>
        )}

        {evaluating && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-600">Running evaluation...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {score && (
          <>
            {/* Viability Score */}
            <div className="bg-white shadow rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Viability Score</h2>
              <div className={`text-6xl font-bold ${getScoreColor(score.totalScore)} mb-6`}>
                {score.totalScore.toFixed(1)} / 100
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Market</div>
                  <div className="text-2xl font-semibold">{score.marketScore.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Product</div>
                  <div className="text-2xl font-semibold">{score.productScore.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Financial</div>
                  <div className="text-2xl font-semibold">{score.financialScore.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Execution</div>
                  <div className="text-2xl font-semibold">{score.executionScore.toFixed(1)}</div>
                </div>
              </div>

              <button
                onClick={runEvaluation}
                disabled={evaluating}
                className="mt-6 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50"
              >
                Re-run Evaluation
              </button>
            </div>

            {/* Findings */}
            {findings.length > 0 && (
              <div className="bg-white shadow rounded-lg p-8 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Findings</h2>
                <div className="space-y-3">
                  {findings.map((finding, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-md ${getSeverityColor(finding.severity)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{finding.severity}</div>
                          <div className="text-sm mt-1">{finding.message}</div>
                        </div>
                        {finding.blocksBuild && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                            Blocks Build
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {risks.length > 0 && (
              <div className="bg-white shadow rounded-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Matrix</h2>
                <div className="space-y-3">
                  {risks.map((risk, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-md ${
                        risk.isCritical ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold">{risk.title}</div>
                        <div className="text-sm">
                          Score: {risk.riskScore}
                          {risk.isCritical && (
                            <span className="ml-2 text-red-600 font-semibold">⚠️ CRITICAL</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{risk.description}</div>
                      <div className="text-xs text-gray-500">
                        Impact: {risk.impact} | Probability: {risk.probability} | Category: {risk.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
