'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getStateBadgeClasses,
  getStateDescription,
  getNextActions,
} from '@/modules/projects/stateMachine';

interface Project {
  id: string;
  name: string;
  description: string | null;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectId, setProjectId] = useState<string>('');

  useEffect(() => {
    params.then((p) => {
      setProjectId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load project');
        setLoading(false);
        return;
      }

      setProject(data.project);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Project not found'}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const nextActions = getNextActions(project.state as any);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                MVP Incubator
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* Project Header */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                {project.description && (
                  <p className="text-gray-600">{project.description}</p>
                )}
              </div>
              <span className={getStateBadgeClasses(project.state as any)}>
                {project.state}
              </span>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-gray-700 mb-4">{getStateDescription(project.state as any)}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Actions:</h3>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  {nextActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(project.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(project.updatedAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Project ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{project.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.state}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              {project.state === 'IDEA' && (
                <Link
                  href={`/dashboard/projects/${projectId}/wizard`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Start Wizard
                </Link>
              )}
              {(project.state === 'IDEA' || project.state === 'STRUCTURED') && (
                <Link
                  href={`/dashboard/projects/${projectId}/wizard`}
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50"
                >
                  {project.state === 'IDEA' ? 'Start Wizard' : 'Edit Wizard'}
                </Link>
              )}
              {project.state === 'STRUCTURED' && (
                <Link
                  href={`/dashboard/projects/${projectId}/evaluation`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                >
                  Run Evaluation
                </Link>
              )}
              {(project.state === 'VALIDATED' || project.state === 'BUILD_READY' || project.state === 'BLOCKED') && (
                <Link
                  href={`/dashboard/projects/${projectId}/evaluation`}
                  className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 text-sm font-medium rounded-md hover:bg-green-50"
                >
                  View Evaluation
                </Link>
              )}
              {project.state === 'BUILD_READY' && (
                <Link
                  href={`/dashboard/projects/${projectId}/build`}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
                >
                  Generate MVP
                </Link>
              )}
              {project.state === 'MVP_GENERATED' && (
                <Link
                  href={`/dashboard/projects/${projectId}/build/result`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                >
                  Download MVP
                </Link>
              )}
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
