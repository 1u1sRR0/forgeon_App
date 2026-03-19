'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseProvider, useCourse } from '@/contexts/CourseContext';
import { BookOpen, CheckCircle, Clock, RefreshCw, Sparkles, Trophy } from 'lucide-react';

function CourseOverviewContent({ projectId }: { projectId: string }) {
  const { course, loading, error, refreshCourse } = useCourse();
  const router = useRouter();
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/course?regenerate=true`);
      if (response.ok) {
        await refreshCourse();
      }
    } catch (err) {
      console.error('Error regenerating course:', err);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">No se encontró ningún curso</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
        <p className="text-gray-400">{course.description}</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Niveles</p>
              <p className="text-2xl font-bold text-white">{course.levels.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Lecciones</p>
              <p className="text-2xl font-bold text-white">
                {course.levels.reduce((acc, level) => acc + level.lessons.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">Completado</p>
              <p className="text-2xl font-bold text-white">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Levels List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Niveles del Curso</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
              {regenerating ? 'Regenerando...' : 'Regenerar Curso'}
            </button>
            <button
              onClick={() => router.push(`/dashboard/projects/${projectId}/course/glossary`)}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              Ver Glosario →
            </button>
          </div>
        </div>

        {course.levels.map((level) => (
          <div
            key={level.id}
            onClick={() => router.push(`/dashboard/projects/${projectId}/course/levels/${level.id}`)}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-500 font-bold">Level {level.order}</span>
                  <h3 className="text-xl font-bold text-white">{level.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{level.description}</p>
                
                {/* Learning Objectives */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Objetivos de Aprendizaje:</p>
                  <ul className="space-y-1">
                    {level.learningObjectives.slice(0, 3).map((objective, idx) => (
                      <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                {level.contentGenerated ? (
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>{level.lessons.length} lecciones</span>
                    <span>
                      {level.lessons.filter((l) => l.quiz).length} quizzes
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="inline-flex items-center rounded-full bg-amber-400/10 px-3 py-1 text-amber-400 border border-amber-400/20">
                      Se genera al acceder
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="ml-4">
                <div className="w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">0%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CourseOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <CourseProvider projectId={id}>
      <CourseOverviewContent projectId={id} />
    </CourseProvider>
  );
}
