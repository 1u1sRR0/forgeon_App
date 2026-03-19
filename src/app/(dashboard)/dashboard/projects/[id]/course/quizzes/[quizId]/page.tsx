'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: Question[];
  lesson: {
    id: string;
    title: string;
  };
}

interface QuizOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question: string;
  options: QuizOption[];
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const { id: projectId, quizId } = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/course/quizzes/${quizId}`);
        const data = await response.json();
        setQuiz(data.quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [projectId, quizId]);

  const handleSubmit = async () => {
    if (!quiz) return;

    const allAnswered = quiz.questions.every((q) => answers[q.id]);
    if (!allAnswered) {
      alert('Please answer all questions before submitting');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `/api/projects/${projectId}/course/quizzes/${quizId}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        }
      );

      const result = await response.json();
      router.push(`/dashboard/projects/${projectId}/course/quizzes/${quizId}/results?score=${result.score}&passed=${result.passed}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Quiz not found</p>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
        <p className="text-gray-400">Passing score: {quiz.passingScore}%</p>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-bold text-white">
              {answeredCount} / {quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">
              {index + 1}. {question.question}
            </h3>
            <div className="space-y-2">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    answers[question.id] === option.id
                      ? 'bg-blue-600/20 border-2 border-blue-500'
                      : 'bg-gray-700 border-2 border-transparent hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={(e) =>
                      setAnswers({ ...answers, [question.id]: e.target.value })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount < quiz.questions.length}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
}
