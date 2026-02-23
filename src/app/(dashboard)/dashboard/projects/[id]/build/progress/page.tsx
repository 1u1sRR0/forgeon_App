'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BuildJob {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  buildLog: string[];
  errorMessage?: string;
  zipPath?: string;
  qualityChecksPassed: boolean;
}

export default function BuildProgressPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [buildJob, setBuildJob] = useState<BuildJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuildStatus();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchBuildStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [params.id]);

  const fetchBuildStatus = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/build`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch build status');
      }

      setBuildJob(data.buildJob);
      setLoading(false);

      // Redirect to result page when completed or failed
      if (data.buildJob.status === 'COMPLETED' || data.buildJob.status === 'FAILED') {
        setTimeout(() => {
          router.push(`/dashboard/projects/${params.id}/build/result`);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          href={`/dashboard/projects/${params.id}`}
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          ← Back to Project
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Build in Progress</h1>
        <p className="text-gray-600">
          Your MVP is being generated. This may take a few minutes.
        </p>
      </div>

      {buildJob && (
        <>
          {/* Status Badge */}
          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                buildJob.status
              )}`}
            >
              {buildJob.status.replace('_', ' ')}
            </span>
          </div>

          {/* Progress Indicator */}
          {buildJob.status === 'IN_PROGRESS' && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-2/3"></div>
              </div>
            </div>
          )}

          {/* Build Log */}
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 font-mono text-sm">
            <h2 className="text-lg font-semibold mb-4 text-white">Build Log</h2>
            {buildJob.buildLog.length > 0 ? (
              <div className="space-y-1">
                {buildJob.buildLog.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">Waiting for build to start...</div>
            )}
          </div>

          {/* Error Message */}
          {buildJob.errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold mb-2">Build Error:</p>
              <p>{buildJob.errorMessage}</p>
            </div>
          )}

          {/* Loading Spinner */}
          {(buildJob.status === 'PENDING' || buildJob.status === 'IN_PROGRESS') && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
