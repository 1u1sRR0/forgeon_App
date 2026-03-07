'use client';

import { X, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompactWidgetProps {
  onClose: () => void;
}

export default function CompactWidget({ onClose }: CompactWidgetProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-40 animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="font-semibold text-white">Assistant</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/assistant')}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Expand to full page"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-gray-400 text-sm">Assistant widget - Coming soon</p>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <input
          type="text"
          placeholder="Ask me anything..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}
