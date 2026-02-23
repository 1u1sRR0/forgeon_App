// Template generators for dashboard pages

import { BuildParameters } from '../types';

export class DashboardPagesGenerator {
  /**
   * Generate src/app/(dashboard)/dashboard/page.tsx
   */
  static generateDashboardPage(params: BuildParameters): string {
    const entityNameLower = params.entityName.toLowerCase();
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);
    const entityNamePlural = entityNameLower + 's';
    const entityNamePluralUpper = entityNameUpper + 's';

    return `'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ${entityNameUpper} {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [${entityNamePlural}, set${entityNamePluralUpper}] = useState<${entityNameUpper}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetch${entityNamePluralUpper}();
    }
  }, [status, router]);

  const fetch${entityNamePluralUpper} = async () => {
    try {
      const res = await fetch('/api/${entityNamePlural}');
      const data = await res.json();
      set${entityNamePluralUpper}(data.${entityNamePlural} || []);
    } catch (error) {
      console.error('Failed to fetch ${entityNamePlural}:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ${entityNameLower}?')) {
      return;
    }

    try {
      const res = await fetch(\`/api/${entityNamePlural}/\${id}\`, {
        method: 'DELETE',
      });

      if (res.ok) {
        set${entityNamePluralUpper}(${entityNamePlural}.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete ${entityNameLower}');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">${params.appName}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{session?.user?.name || session?.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My ${entityNamePluralUpper}</h2>
            <Link
              href="/dashboard/${entityNamePlural}/new"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
            >
              Create ${entityNameUpper}
            </Link>
          </div>

          {${entityNamePlural}.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">No ${entityNamePlural} yet. Create your first one!</p>
              <Link
                href="/dashboard/${entityNamePlural}/new"
                className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700"
              >
                Create ${entityNameUpper}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {${entityNamePlural}.map((${entityNameLower}) => (
                <div key={${entityNameLower}.id} className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {${entityNameLower}.title}
                  </h3>
                  {${entityNameLower}.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {${entityNameLower}.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Link
                      href={\`/dashboard/${entityNamePlural}/\${${entityNameLower}.id}\`}
                      className="text-primary hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </Link>
                    <Link
                      href={\`/dashboard/${entityNamePlural}/\${${entityNameLower}.id}/edit\`}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(${entityNameLower}.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/[entityPlural]/new/page.tsx
   */
  static generateNewEntityPage(params: BuildParameters): string {
    const entityNameLower = params.entityName.toLowerCase();
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);
    const entityNamePlural = entityNameLower + 's';

    return `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function New${entityNameUpper}Page() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/${entityNamePlural}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create ${entityNameLower}');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-primary hover:text-blue-700 flex items-center"
          >
            <svg
              className="h-5 w-5 mr-1"
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

        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New ${entityNameUpper}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter description (optional)"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create ${entityNameUpper}'}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/[entityPlural]/[id]/page.tsx
   */
  static generateViewEntityPage(params: BuildParameters): string {
    const entityNameLower = params.entityName.toLowerCase();
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);
    const entityNamePlural = entityNameLower + 's';

    return `'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ${entityNameUpper} {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function View${entityNameUpper}Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [${entityNameLower}, set${entityNameUpper}] = useState<${entityNameUpper} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch${entityNameUpper}();
  }, [params.id]);

  const fetch${entityNameUpper} = async () => {
    try {
      const res = await fetch(\`/api/${entityNamePlural}/\${params.id}\`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '${entityNameUpper} not found');
        setLoading(false);
        return;
      }

      set${entityNameUpper}(data.${entityNameLower});
    } catch (err) {
      setError('Failed to load ${entityNameLower}');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this ${entityNameLower}?')) {
      return;
    }

    try {
      const res = await fetch(\`/api/${entityNamePlural}/\${params.id}\`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to delete ${entityNameLower}');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !${entityNameLower}) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || '${entityNameUpper} not found'}</p>
          <Link
            href="/dashboard"
            className="text-primary hover:text-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-primary hover:text-blue-700 flex items-center"
          >
            <svg
              className="h-5 w-5 mr-1"
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

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{${entityNameLower}.title}</h1>
            <div className="flex gap-2">
              <Link
                href={\`/dashboard/${entityNamePlural}/\${${entityNameLower}.id}/edit\`}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          {${entityNameLower}.description && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
              <p className="text-gray-900 whitespace-pre-wrap">{${entityNameLower}.description}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(${entityNameLower}.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(${entityNameLower}.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
  }

  /**
   * Generate src/app/(dashboard)/dashboard/[entityPlural]/[id]/edit/page.tsx
   */
  static generateEditEntityPage(params: BuildParameters): string {
    const entityNameLower = params.entityName.toLowerCase();
    const entityNameUpper = params.entityName.charAt(0).toUpperCase() + params.entityName.slice(1);
    const entityNamePlural = entityNameLower + 's';

    return `'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Edit${entityNameUpper}Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch${entityNameUpper}();
  }, [params.id]);

  const fetch${entityNameUpper} = async () => {
    try {
      const res = await fetch(\`/api/${entityNamePlural}/\${params.id}\`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '${entityNameUpper} not found');
        setLoading(false);
        return;
      }

      setTitle(data.${entityNameLower}.title);
      setDescription(data.${entityNameLower}.description || '');
    } catch (err) {
      setError('Failed to load ${entityNameLower}');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(\`/api/${entityNamePlural}/\${params.id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update ${entityNameLower}');
        setSaving(false);
        return;
      }

      router.push(\`/dashboard/${entityNamePlural}/\${params.id}\`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href={\`/dashboard/${entityNamePlural}/\${params.id}\`}
            className="text-primary hover:text-blue-700 flex items-center"
          >
            <svg
              className="h-5 w-5 mr-1"
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
            Back to ${entityNameUpper}
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit ${entityNameUpper}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter description (optional)"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={\`/dashboard/${entityNamePlural}/\${params.id}\`}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
`;
  }
}
