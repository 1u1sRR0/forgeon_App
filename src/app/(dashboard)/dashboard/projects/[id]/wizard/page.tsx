'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WIZARD_STEPS, WizardAnswerData, WizardCompletionStatus } from '@/modules/wizard/types';
import { StepIndicator } from '@/components/wizard/StepIndicator';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);

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
        setError(data.error || 'Error al cargar el wizard');
        setLoading(false);
        return;
      }

      const answersObj: Record<string, string | null> = {};
      data.answers.forEach((answer: WizardAnswerData) => {
        answersObj[answer.key] = answer.value;
      });

      setAnswers(answersObj);
      setCompletionStatus(data.completionStatus);
      setLoading(false);
    } catch (err) {
      setError('Ocurrió un error inesperado');
      setLoading(false);
    }
  };

  const saveAnswer = async (key: string, value: string | null) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/projects/${projectId}/wizard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: currentStep, key, value }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error al guardar:', data.error);
        return;
      }

      if (data.completionStatus) {
        setCompletionStatus(data.completionStatus);
      }
    } catch (err) {
      console.error('Error al guardar:', err);
    } finally {
      setSaving(false);
    }
  };

  const { debouncedSave } = useAutosave({
    onSave: async (value: string | null) => {},
    delay: 500,
  });

  const handleFieldChange = (key: string, value: string | null) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    debouncedSave(value);
    saveAnswer(key, value);
  };

  const transitionToStep = useCallback((newStep: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Fade out
    setContentVisible(false);

    setTimeout(() => {
      setCurrentStep(newStep);
      // Fade in
      requestAnimationFrame(() => {
        setContentVisible(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 150);
      });
    }, 150);
  }, [isTransitioning]);

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length && !isTransitioning) {
      transitionToStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1 && !isTransitioning) {
      transitionToStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step !== currentStep && !isTransitioning) {
      transitionToStep(step);
    }
  };

  // Build completedSteps array (indices) for StepIndicator
  const completedStepIndices: number[] = [];
  if (completionStatus) {
    for (let i = 0; i < completionStatus.completedSteps; i++) {
      completedStepIndices.push(i);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-gray-400">Cargando wizard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md backdrop-blur">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            Volver al Proyecto
          </Link>
        </div>
      </div>
    );
  }

  const step = WIZARD_STEPS[currentStep - 1];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === WIZARD_STEPS.length;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="bg-white/5 border-b border-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Forgeon
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {saving && <span className="text-sm text-gray-500">Guardando...</span>}
              <Link
                href={`/dashboard/projects/${projectId}`}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                Volver al Proyecto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <StepIndicator
          totalSteps={WIZARD_STEPS.length}
          currentStep={currentStep}
          completedSteps={completedStepIndices}
          onStepClick={handleStepClick}
        />

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
          {/* Step content with fade transition */}
          <div
            className="transition-opacity duration-150"
            style={{ opacity: contentVisible ? 1 : 0 }}
          >
            <h1 className="text-2xl font-bold text-white mb-2">{step.title}</h1>
            <p className="text-gray-400 mb-6">{step.description}</p>

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
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep || isTransitioning}
              className={`
                px-6 py-3 rounded-lg text-sm font-medium transition-all duration-150
                ${isFirstStep
                  ? 'opacity-50 cursor-not-allowed bg-white/5 border border-white/10 text-gray-500'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }
                ${isTransitioning ? 'pointer-events-none' : ''}
              `}
            >
              Anterior
            </button>

            {isLastStep ? (
              <Link
                href={`/dashboard/projects/${projectId}`}
                className={`
                  px-6 py-3 rounded-lg text-sm font-medium text-white
                  bg-gradient-to-r from-purple-600 to-purple-500
                  hover:from-purple-500 hover:to-purple-400
                  transition-all duration-150 inline-block
                  ${isTransitioning ? 'pointer-events-none' : ''}
                `}
              >
                Completar
              </Link>
            ) : (
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className={`
                  px-6 py-3 rounded-lg text-sm font-medium text-white
                  bg-purple-600 hover:bg-purple-500
                  transition-all duration-150
                  ${isTransitioning ? 'pointer-events-none' : ''}
                `}
              >
                Siguiente
              </button>
            )}
          </div>

          {/* Completion Status */}
          {completionStatus && (
            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-sm text-purple-200">
                {completionStatus.canTransitionToStructured ? (
                  <span className="font-semibold">
                    ✓ ¡Todos los campos obligatorios completados! Tu proyecto está listo para evaluación.
                  </span>
                ) : (
                  <span>
                    Completa todos los campos obligatorios para continuar a la evaluación.
                    {completionStatus.missingMandatoryFields.length > 0 && (
                      <span className="block mt-1 text-gray-400">
                        Faltan: {completionStatus.missingMandatoryFields.join(', ')}
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
