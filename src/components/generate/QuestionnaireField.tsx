'use client';

import type { FieldDefinition } from '@/modules/multiAgent/questionnaire/questionnaireSchema';
import { AiSuggestionChip } from './AiSuggestionChip';
import { DynamicListInput } from './DynamicListInput';

interface QuestionnaireFieldProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  showAiSuggestion?: boolean;
  onAiSuggest?: () => void;
}

export function QuestionnaireField({
  field,
  value,
  onChange,
  showAiSuggestion,
  onAiSuggest,
}: QuestionnaireFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-gray-300">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {showAiSuggestion && field.aiSuggestible && onAiSuggest && (
          <AiSuggestionChip onClick={onAiSuggest} />
        )}
      </div>
      <FieldInput field={field} value={value} onChange={onChange} />
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const inputClasses =
    'w-full px-3 py-2 rounded-lg text-sm text-gray-200 placeholder-gray-500 bg-gray-800/60 border border-gray-700/50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-colors duration-200';

  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClasses}
        />
      );

    case 'textarea':
      return (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${inputClasses} resize-y min-h-[80px]`}
        />
      );

    case 'select':
      return (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'multi-select':
      return <MultiSelectInput field={field} value={value} onChange={onChange} />;

    case 'boolean':
      return (
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(!value)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            value ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
              value ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      );

    case 'dynamic-list':
      return (
        <DynamicListInput
          items={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );

    default:
      return null;
  }
}

function MultiSelectInput({
  field,
  value,
  onChange,
}: {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const toggle = (optValue: string) => {
    if (selected.includes(optValue)) {
      onChange(selected.filter((v) => v !== optValue));
    } else {
      onChange([...selected, optValue]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {field.options?.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              isSelected
                ? 'bg-purple-500/15 text-purple-400 border-purple-500/40'
                : 'bg-gray-800/40 text-gray-400 border-gray-700/40 hover:border-gray-600/60'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
