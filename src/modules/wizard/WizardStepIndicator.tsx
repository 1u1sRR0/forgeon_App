'use client';

interface WizardStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  onStepClick?: (step: number) => void;
}

export function WizardStepIndicator({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick,
}: WizardStepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {completedSteps} / {totalSteps} completed
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step <= completedSteps;
          const isCurrent = step === currentStep;
          const isClickable = onStepClick && step <= completedSteps + 1;

          return (
            <button
              key={step}
              onClick={() => isClickable && onStepClick(step)}
              disabled={!isClickable}
              className={`flex-1 h-2 rounded-full transition-colors ${
                isCurrent
                  ? 'bg-blue-600'
                  : isCompleted
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              } ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
              aria-label={`Step ${step}`}
            />
          );
        })}
      </div>
    </div>
  );
}
