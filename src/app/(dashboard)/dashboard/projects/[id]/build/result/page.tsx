'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

interface BuildJob {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  buildLog: string[];
  errorMessage?: string;
  zipPath?: string;
  qualityChecksPassed: boolean;
}

export default function BuildResultPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [buildJob, setBuildJob] = useState<BuildJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuildStatus();
  }, [params.id]);

  const fetchBuildStatus = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/build`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch build status');
      }

      setBuildJob(data.buildJob);
    } catch (err: any) {
      setError(err.message);
    } finally {
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

  if (error || !buildJob) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error || 'Build not found'}
        </div>
        <Link
          href={`/dashboard/projects/${params.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Project
        </Link>
      </div>
    );
  }

  const isSuccess = buildJob.status === 'COMPLETED';
  const isFailed = buildJob.status === 'FAILED';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/dashboard/projects/${params.id}`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Project
        </Link>
        <h1 className="text-3xl font-bold mb-2">
          {isSuccess ? 'Build Completed!' : 'Build Failed'}
        </h1>
        <p className="text-gray-600">
          {isSuccess
            ? 'Your MVP has been generated successfully.'
            : 'There was an error generating your MVP.'}
        </p>
      </div>

      {/* Success State */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-green-600 text-4xl">✓</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                MVP Generated Successfully
              </h2>
              <p className="text-green-700 mb-4">
                Your MVP codebase is ready to download. The generated project includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-green-700 mb-6">
                <li>Next.js application with TypeScript</li>
                <li>Prisma database schema</li>
                <li>Authentication setup</li>
                <li>API routes and UI pages</li>
                <li>README with setup instructions</li>
              </ul>

              {buildJob.qualityChecksPassed && (
                <div className="bg-white border border-green-300 rounded p-3 mb-4">
                  <p className="text-green-800 font-medium">
                    ✓ All quality checks passed
                  </p>
                </div>
              )}

              {buildJob.zipPath && (
                <a
                  href={`/api/builds/${buildJob.id}/download`}
                  download
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Download MVP (ZIP)
                </a>
              )}

              {!buildJob.zipPath && (
                <div className="text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3">
                  Download link will be available shortly...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Failure State */}
      {isFailed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-red-600 text-4xl">✗</div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Build Failed
              </h2>
              {buildJob.errorMessage && (
                <div className="bg-white border border-red-300 rounded p-4 mb-4">
                  <p className="text-red-800 font-mono text-sm">
                    {buildJob.errorMessage}
                  </p>
                </div>
              )}
              <p className="text-red-700 mb-4">
                Please try again or contact support if the issue persists.
              </p>
              <Link
                href={`/dashboard/projects/${params.id}/build`}
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Try Again
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Build Log */}
      <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm">
        <h2 className="text-lg font-semibold mb-4 text-white">Build Log</h2>
        {buildJob.buildLog.length > 0 ? (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {buildJob.buildLog.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No build log available</div>
        )}
      </div>

      {/* Next Steps */}
      {isSuccess && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Next Steps
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Download and extract the ZIP file</li>
            <li>Open terminal and navigate to the extracted folder</li>
            <li>Copy .env.example to .env and configure your database URL</li>
            <li>Run: <code className="bg-blue-100 px-2 py-1 rounded">npm install</code></li>
            <li>Run: <code className="bg-blue-100 px-2 py-1 rounded">npx prisma generate</code></li>
            <li>Run: <code className="bg-blue-100 px-2 py-1 rounded">npx prisma migrate dev --name init</code></li>
            <li>(Optional) Run: <code className="bg-blue-100 px-2 py-1 rounded">npx prisma db seed</code></li>
            <li>Run: <code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code></li>
            <li>Open http://localhost:3000 in your browser</li>
            <li>Start customizing your MVP!</li>
          </ol>
          <div className="mt-4 p-3 bg-white border border-blue-300 rounded">
            <p className="text-sm text-blue-800">
              <strong>Demo credentials (if you ran the seed):</strong><br />
              Email: demo@example.com<br />
              Password: demo123
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
