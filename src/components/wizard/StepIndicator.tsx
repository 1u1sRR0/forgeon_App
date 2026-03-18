'use client';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepIndex: number) => void;
}

export function StepIndicator({
  totalSteps,
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = completedSteps.includes(i);
          const isCurrent = stepNum === currentStep;
          const isPast = stepNum < currentStep;
          const isClickable = isCompleted || isPast;

          return (
            <div key={stepNum} className="flex items-center">
              {/* Step circle */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick(stepNum)}
                disabled={!isClickable}
                aria-label={`Paso ${stepNum}`}
                className={`
                  relative flex items-center justify-center w-9 h-9 rounded-full
                  text-sm font-semibold transition-all duration-200
                  ${
                    isCompleted
                      ? 'bg-purple-600 text-white cursor-pointer hover:bg-purple-500'
                      : isCurrent
                      ? 'border-2 border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 border border-white/10 text-gray-500 cursor-default'
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </button>

              {/* Connecting line */}
              {stepNum < totalSteps && (
                <div
                  className={`w-6 h-0.5 mx-1 transition-colors duration-200 ${
                    isCompleted || isPast
                      ? 'bg-purple-600'
                      : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step label */}
      <p className="text-center text-sm text-gray-400 mt-3">
        Paso {currentStep} de {totalSteps}
      </p>
    </div>
  );
}
