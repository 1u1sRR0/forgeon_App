'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, X, Sparkles } from 'lucide-react';

interface AssistantActivationPopupProps {
  projectId: string;
  onNavigate?: () => void;
}

export function AssistantActivationPopup({ projectId, onNavigate }: AssistantActivationPopupProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if popup should be displayed
    const storageKey = `assistant-popup-dismissed-${projectId}`;
    const dismissed = localStorage.getItem(storageKey);

    if (!dismissed) {
      // Show popup after a short delay for better UX
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
    }
  }, [projectId]);

  const handleNavigate = () => {
    const storageKey = `assistant-popup-dismissed-${projectId}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({ dismissed: true, timestamp: Date.now(), navigated: true })
    );

    if (onNavigate) {
      onNavigate();
    }

    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      router.push('/dashboard/assistant');
    }, 300);
  };

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleDontShowAgain = () => {
    const storageKey = `assistant-popup-dismissed-${projectId}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({ dismissed: true, timestamp: Date.now(), permanent: true })
    );

    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleDismiss}
    >
      <div
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30 transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Close popup"
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Header */}
          <h2 className="text-2xl font-bold text-white text-center mb-3">
            Meet Your AI Assistant
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-center mb-6 leading-relaxed">
            Get instant help with your project. Ask questions, brainstorm ideas, and receive
            personalized guidance powered by AI.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              </div>
              <p className="text-sm text-gray-300">
                Context-aware responses based on your project
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              </div>
              <p className="text-sm text-gray-300">
                Persistent conversation history across sessions
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              </div>
              <p className="text-sm text-gray-300">Available 24/7 to support your journey</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleNavigate}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all font-medium shadow-lg shadow-purple-500/20"
            >
              Try Assistant Now
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                Maybe Later
              </button>
              <button
                onClick={handleDontShowAgain}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                Don't Show Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
