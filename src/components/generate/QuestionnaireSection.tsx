'use client';

import type { FieldDefinition } from '@/modules/multiAgent/questionnaire/questionnaireSchema';
import type { BusinessType, QuestionnaireAnswers } from '@/modules/multiAgent/types';
import { QuestionnaireField } from './QuestionnaireField';

interface QuestionnaireSectionProps {
  sectionId: string;
  fields: FieldDefinition[];
  answers: Record<string, unknown>;
  businessType: string;
  onFieldChange: (field: string, value: unknown) => void;
  onAiSuggest?: (field: string) => void;
}

export function QuestionnaireSection({
  sectionId,
  fields,
  answers,
  businessType,
  onFieldChange,
  onAiSuggest,
}: QuestionnaireSectionProps) {
  // Build a minimal QuestionnaireAnswers object for conditional checks
  const sectionKey = `section${sectionId}` as keyof QuestionnaireAnswers;
  const questionnaireAnswers: QuestionnaireAnswers = {
    [sectionKey]: answers,
  };

  const visibleFields = fields.filter((field) => {
    if (!field.conditional) return true;
    return field.conditional(businessType as BusinessType, questionnaireAnswers);
  });

  return (
    <div className="space-y-6">
      {visibleFields.map((field) => {
        const fieldValue = answers[field.name];
        const isEmpty = fieldValue === undefined || fieldValue === null || fieldValue === '';
        const showAi = isEmpty && field.aiSuggestible;

        return (
          <QuestionnaireField
            key={field.name}
            field={field}
            value={fieldValue}
            onChange={(val) => onFieldChange(field.name, val)}
            showAiSuggestion={showAi}
            onAiSuggest={onAiSuggest ? () => onAiSuggest(field.name) : undefined}
          />
        );
      })}
    </div>
  );
}
