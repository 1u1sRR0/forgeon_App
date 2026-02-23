'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BuildValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export default function BuildPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [validation, setValidation] = useState<BuildValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build parameters
  const [appName, setAppName] = useState('');
  const [entityName, setEntityName] = useState('Item');

  useEffect(() => {
    validateBuildGate();
  }, [params.id]);

  const validateBuildGate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${params.id}/build/validate`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to validate build gate');
      }

      setValidation(data.validation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initiateBuild = async () => {
    try {
      setBuilding(true);
      setError(null);

      const res = await fetch(`/api/projects/${params.id}/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          entityName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate build');
      }

      // Redirect to progress page
      router.push(`/dashboard/projects/${params.id}/build/progress`);
    } catch (err: any) {
      setError(err.message);
      setBuilding(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/dashboard/projects/${params.id}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Project
        </Link>
        <h1 className="text-3xl font-bold mb-2">Generate MVP</h1>
        <p className="text-gray-600">
          Configure and generate your MVP codebase
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Build Gate Validation */}
      {validation && !validation.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-800 mb-4">
            Build Gate Failed
          </h2>
          <p className="text-red-700 mb-4">
            Your project cannot proceed to build due to the following issues:
          </p>
          <ul className="list-disc list-inside space-y-2 text-red-700">
            {validation.errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
          <div className="mt-6">
            <Link
              href={`/dashboard/projects/${params.id}/evaluation`}
              className="text-blue-600 hover:underline"
            >
              View Evaluation Results →
            </Link>
          </div>
        </div>
      )}

      {/* Build Configuration */}
      {validation && validation.isValid && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Build Configuration</h2>

          {validation.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
              <p className="font-semibold mb-2">Warnings:</p>
              <ul className="list-disc list-inside space-y-1">
                {validation.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="My Awesome App"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                The name of your generated application
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entity Name
              </label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Item"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                The main entity/resource in your app (e.g., Product, Listing, Post)
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={initiateBuild}
              disabled={building || !appName}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {building ? 'Initiating Build...' : 'Generate MVP'}
            </button>
            <Link
              href={`/dashboard/projects/${params.id}`}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      )}

      {/* Build Gate Success */}
      {validation && validation.isValid && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✓ Build Gate Passed
          </h3>
          <p className="text-green-700">
            Your project meets all requirements for MVP generation.
          </p>
        </div>
      )}
    </div>
  );
}
