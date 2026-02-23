// Wizard validation logic

import { WIZARD_STEPS, MANDATORY_FIELDS, WizardCompletionStatus } from './types';

export function validateField(key: string, value: string | null): string | null {
  const field = WIZARD_STEPS.flatMap((s) => s.fields).find((f) => f.key === key);

  if (!field) {
    return 'Invalid field';
  }

  // Check required
  if (field.required && (!value || value.trim() === '')) {
    return `${field.label} is required`;
  }

  // Skip validation if empty and not required
  if (!value || value.trim() === '') {
    return null;
  }

  // Check validation rules
  if (field.validation) {
    const { minLength, maxLength, pattern, custom } = field.validation;

    if (minLength && value.length < minLength) {
      return `${field.label} must be at least ${minLength} characters`;
    }

    if (maxLength && value.length > maxLength) {
      return `${field.label} must be at most ${maxLength} characters`;
    }

    if (pattern && !pattern.test(value)) {
      return `${field.label} format is invalid`;
    }

    if (custom) {
      const customError = custom(value);
      if (customError) {
        return customError;
      }
    }
  }

  return null;
}

export function checkWizardCompletion(
  answers: Array<{ step: number; key: string; value: string | null; completed: boolean }>
): WizardCompletionStatus {
  const totalSteps = WIZARD_STEPS.length;

  // Count completed steps (at least one field filled per step)
  const stepsWithAnswers = new Set(answers.filter((a) => a.value).map((a) => a.step));
  const completedSteps = stepsWithAnswers.size;

  // Check mandatory fields
  const mandatoryAnswers = answers.filter((a) => MANDATORY_FIELDS.includes(a.key));
  const filledMandatoryFields = mandatoryAnswers.filter(
    (a) => a.value && a.value.trim() !== ''
  );

  const missingMandatoryFields = MANDATORY_FIELDS.filter(
    (field) => !filledMandatoryFields.some((a) => a.key === field)
  );

  const mandatoryFieldsFilled = missingMandatoryFields.length === 0;

  // Can transition to STRUCTURED if all mandatory fields are filled
  const canTransitionToStructured = mandatoryFieldsFilled;

  return {
    totalSteps,
    completedSteps,
    mandatoryFieldsFilled,
    canTransitionToStructured,
    missingMandatoryFields,
  };
}
