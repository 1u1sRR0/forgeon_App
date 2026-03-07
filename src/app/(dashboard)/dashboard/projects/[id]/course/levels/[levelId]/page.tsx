'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface Level {
  id: string;
  title: string;
  description: string;
  order: number;
  learningObjectives: string[];
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  quiz?: { id: string };
}

interface Progress {
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export default function LevelDetailPage({
  params,
}: {
  params: Promise<{ id: string; levelId: string }>;
}) {
  const { id: projectId, levelId } = use(params);
  const router = useRouter();
  const [level, setLevel] = useState<Level | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/course/levels/${levelId}`);
        const data = await response.json();
        setLevel(data.level);
        setProgress(data.progress);
      } catch (error) {
        console.error('Error fetching level:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, [projectId, levelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Level not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/dashboard/projects/${projectId}/course`)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-blue-500 font-bold">Level {level.order}</span>
          <h1 className="text-3xl font-bold text-white">{level.title}</h1>
        </div>
        <p className="text-gray-400 mb-4">{level.description}</p>

        {/* Progress Bar */}
        {progress && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-bold text-white">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progress.completedLessons} of {progress.totalLessons} lessons completed
            </p>
          </div>
        )}
      </div>

      {/* Learning Objectives */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Learning Objectives</h2>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <ul className="space-y-3">
            {level.learningObjectives.map((objective, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lessons List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Lessons</h2>
        <div className="space-y-3">
          {level.lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => router.push(`/dashboard/projects/${projectId}/course/lessons/${lesson.id}`)}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <PlayCircle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-400">{lesson.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.estimatedMinutes} min
                      </span>
                      {lesson.quiz && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          Quiz included
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <CheckCircle className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
