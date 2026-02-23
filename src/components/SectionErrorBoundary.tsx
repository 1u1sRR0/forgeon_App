'use client';

import { ErrorBoundary } from './ErrorBoundary';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  sectionName: string;
}

export function SectionErrorBoundary({ children, sectionName }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg
              className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Error in {sectionName}
              </h3>
              <p className="text-sm text-red-700 mb-3">
                This section encountered an error and couldn't be displayed. Other parts of the app should still work.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error(`Error in ${sectionName}:`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
