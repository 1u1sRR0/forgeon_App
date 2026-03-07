'use client';

import { CheckCircle, AlertTriangle, Lightbulb, Info } from 'lucide-react';

interface ContentBlock {
  type: string;
  content?: string;
  language?: string;
  items?: string[];
  title?: string;
  steps?: string[];
}

export default function ContentRenderer({ content }: { content: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {content.map((block, index) => {
        switch (block.type) {
          case 'text':
            return (
              <div key={index} className="text-gray-300 leading-relaxed">
                {block.content}
              </div>
            );

          case 'code':
            return (
              <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-gray-300">{block.content}</code>
                </pre>
              </div>
            );

          case 'checklist':
            return (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <ul className="space-y-2">
                  {block.items?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case 'warning':
            return (
              <div key={index} className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    {block.title && (
                      <h4 className="font-semibold text-yellow-500 mb-1">{block.title}</h4>
                    )}
                    <p className="text-gray-300">{block.content}</p>
                  </div>
                </div>
              </div>
            );

          case 'tip':
            return (
              <div key={index} className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    {block.title && (
                      <h4 className="font-semibold text-blue-500 mb-1">{block.title}</h4>
                    )}
                    <p className="text-gray-300">{block.content}</p>
                  </div>
                </div>
              </div>
            );

          case 'callout':
            return (
              <div key={index} className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    {block.title && (
                      <h4 className="font-semibold text-purple-500 mb-1">{block.title}</h4>
                    )}
                    <p className="text-gray-300">{block.content}</p>
                  </div>
                </div>
              </div>
            );

          case 'step':
            return (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                {block.title && (
                  <h4 className="font-semibold text-white mb-3">{block.title}</h4>
                )}
                <ol className="space-y-2 list-decimal list-inside">
                  {block.steps?.map((step, idx) => (
                    <li key={idx} className="text-gray-300">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
