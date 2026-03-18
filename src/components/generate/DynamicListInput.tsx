'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface DynamicListInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export function DynamicListInput({ items, onChange, placeholder = 'Add an item...' }: DynamicListInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setInputValue('');
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-lg text-sm text-gray-200 placeholder-gray-500
            bg-gray-800/60 border border-gray-700/50
            focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25
            transition-colors duration-200"
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!inputValue.trim()}
          className="px-3 py-2 rounded-lg text-sm font-medium
            bg-purple-600/20 text-purple-400 border border-purple-500/30
            hover:bg-purple-600/30 disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300
                bg-gray-800/40 border border-gray-700/30"
            >
              <span className="flex-1">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-gray-500 hover:text-red-400 transition-colors"
                aria-label={`Remove ${item}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
