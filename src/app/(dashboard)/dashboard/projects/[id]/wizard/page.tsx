'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WIZARD_STEPS, WizardAnswerData, WizardCompletionStatus } from '@/modules/wizard/types';
import { WizardStepIndicator } from '@/modules/wizard/WizardStepIndicator';
import { WizardField } from '@/modules/wizard/WizardField';
import { useAutosave } from '@/modules/wizard/useAutosave';

export default function WizardPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [completionStatus, setCompletionStatus] = useState<WizardCompletionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    params.then((p) => {
      setProjectId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (projectId) {
      fetchWizardData();
    }
  }, [projectId]);

  const fetchWizardData = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/wizard`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load wizard data');
        setLoading(false);
        return;
      }

      // Convert answers array to object
      const answersObj: Record<string, string | null> = {};
      data.answers.forEach((answer: WizardAnswerData) => {
        answersObj[answer.key] = answer.value;
      });

      setAnswers(answersObj);
      setCompletionStatus(data.completionStatus);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const saveAnswer = async (key: string, value: string | null) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/projects/${projectId}/wizard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          key,
          value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Save error:', data.error);
        return;
      }

      // Update completion status
      if (data.completionStatus) {
        setCompletionStatus(data.completionStatus);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const { debouncedSave } = useAutosave({
    onSave: async (value: string | null) => {
      // This will be called by individual fields
    },
    delay: 500,
  });

  const handleFieldChange = (key: string, value: string | null) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    debouncedSave(value);
    saveAnswer(key, value);
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading wizard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            Back to Project
          </Link>
        </div>
      </div>
    );
  }

  const step = WIZARD_STEPS[currentStep - 1];

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
            <div className="flex items-center space-x-4">
              {saving && <span className="text-sm text-gray-500">Saving...</span>}
              <Link
                href={`/dashboard/projects/${projectId}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to Project
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <WizardStepIndicator
          currentStep={currentStep}
          totalSteps={WIZARD_STEPS.length}
          completedSteps={completionStatus?.completedSteps || 0}
          onStepClick={handleStepClick}
        />

        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h1>
          <p className="text-gray-600 mb-6">{step.description}</p>

          <div className="space-y-6">
            {step.fields.map((field) => (
              <WizardField
                key={field.key}
                field={field}
                value={answers[field.key] || null}
                onChange={(value) => handleFieldChange(field.key, value)}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < WIZARD_STEPS.length ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <Link
                href={`/dashboard/projects/${projectId}`}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block"
              >
                Complete
              </Link>
            )}
          </div>

          {/* Completion Status */}
          {completionStatus && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900">
                {completionStatus.canTransitionToStructured ? (
                  <span className="font-semibold">
                    ✓ All mandatory fields completed! Your project is ready for evaluation.
                  </span>
                ) : (
                  <span>
                    Complete all mandatory fields to proceed to evaluation.
                    {completionStatus.missingMandatoryFields.length > 0 && (
                      <span className="block mt-1">
                        Missing: {completionStatus.missingMandatoryFields.join(', ')}
                      </span>
                    )}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
