'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="
            rounded-2xl overflow-hidden
            bg-white/5 backdrop-blur-md
            border border-white/10
            hover:border-white/20
            transition-all duration-300
          "
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <span className="text-lg font-semibold text-white pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={`
                flex-shrink-0 text-white/70 transition-transform duration-300
                ${openIndex === index ? 'rotate-180' : ''}
              `}
              size={20}
            />
          </button>
          
          <div
            className={`
              overflow-hidden transition-all duration-300
              ${openIndex === index ? 'max-h-96' : 'max-h-0'}
            `}
          >
            <div className="px-6 pb-4 text-white/70 leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
