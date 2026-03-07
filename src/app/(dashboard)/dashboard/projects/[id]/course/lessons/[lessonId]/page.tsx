'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import ContentRenderer from '@/components/course/ContentRenderer';

interface Lesson {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  content: any[];
  quiz?: { id: string; title: string };
  level: {
    id: string;
    title: string;
    order: number;
  };
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: projectId, lessonId } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/course/lessons/${lessonId}`);
        const data = await response.json();
        setLesson(data.lesson);
        setCompleted(data.completed);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [projectId, lessonId]);

  const handleMarkComplete = async () => {
    try {
      setMarking(true);
      const response = await fetch(
        `/api/projects/${projectId}/course/lessons/${lessonId}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeSpent: 0 }),
        }
      );

      if (response.ok) {
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}/course`)}
          className="hover:text-white"
        >
          Course
        </button>
        <span>/</span>
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}/course/levels/${lesson.level.id}`)}
          className="hover:text-white"
        >
          Level {lesson.level.order}
        </button>
        <span>/</span>
        <span className="text-white">{lesson.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
        <p className="text-gray-400 mb-4">{lesson.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {lesson.estimatedMinutes} minutes
          </span>
          {completed && (
            <span className="flex items-center gap-1 text-green-500">
              <CheckCircle className="w-4 h-4" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-8">
        <ContentRenderer content={lesson.content} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-700">
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}/course/levels/${lesson.level.id}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Level
        </button>

        <div className="flex items-center gap-3">
          {!completed && (
            <button
              onClick={handleMarkComplete}
              disabled={marking}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {marking ? 'Marking...' : 'Mark as Complete'}
            </button>
          )}
          {lesson.quiz && (
            <button
              onClick={() => router.push(`/dashboard/projects/${projectId}/course/quizzes/${lesson.quiz!.id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Take Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
