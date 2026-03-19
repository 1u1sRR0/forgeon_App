'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Loader2, PlayCircle, RefreshCw, Sparkles } from 'lucide-react';

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
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generatingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLevel = useCallback(async () => {
    setLoading(true);
    setGenerating(false);
    setError(null);

    // After 2 seconds of loading, switch to "generating" state
    generatingTimerRef.current = setTimeout(() => {
      setGenerating(true);
    }, 2000);

    try {
      const response = await fetch(`/api/projects/${projectId}/course/levels/${levelId}`);
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.error || `Error al cargar el nivel (código ${response.status})`;
        setError(message);
        return;
      }
      const data = await response.json();
      setLevel(data.level);
      setProgress(data.progress);
    } catch (err) {
      console.error('Error fetching level:', err);
      setError('Error de conexión. Verifica tu red e intenta de nuevo.');
    } finally {
      if (generatingTimerRef.current) {
        clearTimeout(generatingTimerRef.current);
        generatingTimerRef.current = null;
      }
      setLoading(false);
      setGenerating(false);
    }
  }, [projectId, levelId]);

  useEffect(() => {
    fetchLevel();
    return () => {
      if (generatingTimerRef.current) {
        clearTimeout(generatingTimerRef.current);
      }
    };
  }, [fetchLevel]);

  // Initial loading spinner (before generating state kicks in)
  if (loading && !generating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Generating state: animated progress bar with level info
  if (loading && generating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Generando contenido
            </h2>
            <p className="text-gray-400 mb-6">
              Preparando las lecciones y evaluaciones para este nivel. Esto puede tomar unos momentos...
            </p>
            {/* Indeterminate animated progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-indeterminate-progress"
                style={{ width: '40%' }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generando contenido...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-800 rounded-xl p-8 border border-red-500/30 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Error al generar contenido
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={fetchLevel}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Reintentar
              </button>
              <button
                onClick={() => router.push(`/dashboard/projects/${projectId}/course`)}
                className="flex items-center justify-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Curso
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Nivel no encontrado</p>
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
        Volver al Curso
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-blue-500 font-bold">Nivel {level.order}</span>
          <h1 className="text-3xl font-bold text-white">{level.title}</h1>
        </div>
        <p className="text-gray-400 mb-4">{level.description}</p>

        {/* Progress Bar */}
        {progress && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progreso</span>
              <span className="text-sm font-bold text-white">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progress.completedLessons} de {progress.totalLessons} lecciones completadas
            </p>
          </div>
        )}
      </div>

      {/* Learning Objectives */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Objetivos de Aprendizaje</h2>
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
        <h2 className="text-xl font-bold text-white mb-4">Lecciones</h2>
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
                          Incluye quiz
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
