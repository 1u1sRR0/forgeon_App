'use client';

import { WizardField as WizardFieldType } from './types';

interface WizardFieldProps {
  field: WizardFieldType;
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string | null;
}

export function WizardField({ field, value, onChange, error }: WizardFieldProps) {
  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleDontKnow = () => {
    onChange('I don\'t know');
  };

  const baseInputClasses = `
    w-full px-4 py-3 text-base rounded-lg
    bg-white/5 border text-white placeholder-gray-500
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
    ${error ? 'border-red-500/70' : 'border-white/10'}
  `;

  const renderInput = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            rows={6}
            className={`${baseInputClasses} min-h-[120px]`}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={baseInputClasses}
          >
            <option value="" className="bg-gray-900 text-gray-400">Selecciona una opción...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={field.key}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  className="text-purple-600 focus:ring-purple-500 bg-white/5 border-white/20"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block mb-2">
        <span className="text-sm font-medium text-gray-300">
          {field.label}
          {field.required && <span className="text-purple-400 ml-1">*</span>}
        </span>
      </label>

      {renderInput()}

      {field.helpText && (
        <p className="mt-1.5 text-sm text-gray-500">{field.helpText}</p>
      )}

      {field.allowDontKnow && value !== 'I don\'t know' && (
        <button
          type="button"
          onClick={handleDontKnow}
          className="mt-2 text-sm text-purple-400 hover:text-purple-300 transition-colors duration-150"
        >
          No lo sé
        </button>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
