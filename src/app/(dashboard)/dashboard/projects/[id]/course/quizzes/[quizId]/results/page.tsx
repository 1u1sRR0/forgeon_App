'use client';

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

export default function QuizResultsPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id: projectId, quizId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const score = parseInt(searchParams.get('score') || '0');
  const passed = searchParams.get('passed') === 'true';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-800 border-4 mb-4"
          style={{ borderColor: passed ? '#10b981' : '#ef4444' }}
        >
          {passed ? (
            <Trophy className="w-12 h-12 text-green-500" />
          ) : (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2">
          {passed ? 'Congratulations!' : 'Keep Trying!'}
        </h1>
        <p className="text-gray-400 mb-4">
          {passed
            ? 'You passed the quiz!'
            : 'You didn\'t pass this time, but you can try again.'}
        </p>
        
        <div className="inline-block bg-gray-800 rounded-lg px-8 py-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Your Score</p>
          <p className="text-5xl font-bold" style={{ color: passed ? '#10b981' : '#ef4444' }}>
            {score}%
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}/course/quizzes/${quizId}`)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </button>
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}/course`)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
}
