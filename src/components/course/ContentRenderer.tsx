'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, Lightbulb, Info } from 'lucide-react';

interface ContentBlock {
  type: string;
  content?: string;
  language?: string;
  items?: string[];
  title?: string;
  steps?: string[];
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2]) parts.push(<strong key={key++} className="text-white font-semibold">{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={key++} className="italic">{match[3]}</em>);
    else if (match[4]) parts.push(<code key={key++} className="bg-gray-700 text-blue-300 px-1.5 py-0.5 rounded text-sm">{match[4]}</code>);
    else if (match[5] && match[6]) parts.push(<a key={key++} href={match[6]} className="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer">{match[5]}</a>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    if (line.startsWith('# ')) {
      elements.push(<h2 key={key++} className="text-2xl font-bold text-white mt-6 mb-3">{renderInline(line.slice(2))}</h2>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h3 key={key++} className="text-xl font-bold text-white mt-5 mb-2">{renderInline(line.slice(3))}</h3>);
      i++; continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h4 key={key++} className="text-lg font-semibold text-white mt-4 mb-2">{renderInline(line.slice(4))}</h4>);
      i++; continue;
    }
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) { quoteLines.push(lines[i].slice(2)); i++; }
      elements.push(
        <blockquote key={key++} className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-blue-900/10 rounded-r-lg">
          <p className="text-gray-300 italic">{renderInline(quoteLines.join(' '))}</p>
        </blockquote>
      );
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, '')); i++; }
      elements.push(
        <ol key={key++} className="space-y-2 my-3 ml-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-300">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-sm flex items-center justify-center font-semibold mt-0.5">{idx + 1}</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) { items.push(lines[i].slice(2)); i++; }
      elements.push(
        <ul key={key++} className="space-y-2 my-3 ml-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-300">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('>') && !lines[i].startsWith('- ') && !lines[i].startsWith('* ') && !/^\d+\.\s/.test(lines[i])) {
      paraLines.push(lines[i]); i++;
    }
    if (paraLines.length > 0) {
      elements.push(<p key={key++} className="text-gray-300 leading-relaxed my-2">{renderInline(paraLines.join(' '))}</p>);
    }
  }
  return <>{elements}</>;
}

export default function ContentRenderer({ content }: { content: ContentBlock[] }) {
  if (!content || content.length === 0) {
    return <p className="text-gray-500 italic">Sin contenido disponible.</p>;
  }

  return (
    <div className="space-y-6">
      {content.map((block, index) => {
        switch (block.type) {
          case 'text':
            return (
              <div key={index} className="prose-custom">
                {renderMarkdown(block.content || '')}
              </div>
            );

          case 'code':
            return (
              <div key={index} className="rounded-lg overflow-hidden border border-gray-700">
                {block.language && (
                  <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-b border-gray-700 font-mono">
                    {block.language}
                  </div>
                )}
                <pre className="bg-gray-900 p-4 overflow-x-auto">
                  <code className="text-sm text-green-300 font-mono whitespace-pre">
                    {block.content}
                  </code>
                </pre>
              </div>
            );

          case 'checklist':
            return (
              <div key={index} className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                {block.title && (
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {block.title}
                  </h4>
                )}
                <ul className="space-y-2">
                  {(block.items || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded border border-gray-600 mt-0.5" />
                      <span>{renderInline(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case 'warning':
            return (
              <div key={index} className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-5">
                <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {block.title || 'Advertencia'}
                </h4>
                <div className="text-yellow-200/80">{renderMarkdown(block.content || '')}</div>
              </div>
            );

          case 'tip':
            return (
              <div key={index} className="bg-green-900/20 border border-green-700/50 rounded-lg p-5">
                <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  {block.title || 'Consejo'}
                </h4>
                <div className="text-green-200/80">{renderMarkdown(block.content || '')}</div>
              </div>
            );

          case 'callout':
            return (
              <div key={index} className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-5">
                <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {block.title || 'Nota'}
                </h4>
                <div className="text-blue-200/80">{renderMarkdown(block.content || '')}</div>
              </div>
            );

          case 'step':
            return (
              <div key={index} className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                {block.title && (
                  <h4 className="text-white font-semibold mb-4">{block.title}</h4>
                )}
                <ol className="space-y-3">
                  {(block.steps || []).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="pt-1">{renderInline(step)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );

          default:
            return block.content ? (
              <div key={index} className="text-gray-300">
                {renderMarkdown(block.content)}
              </div>
            ) : null;
        }
      })}
    </div>
  );
}
