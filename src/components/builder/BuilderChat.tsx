'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, RotateCcw, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface BuilderChatProps {
  sessionId: string;
  currentHtml: string;
  onHtmlUpdate: (newHtml: string) => void;
}

export default function BuilderChat({ sessionId, currentHtml, onHtmlUpdate }: BuilderChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText ?? input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);
    setLastFailedMessage(null);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`/api/generate/sessions/${sessionId}/builder-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentHtml,
          conversationHistory: [...messages, userMsg].slice(-10),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.assistantMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.modifiedHtml && data.modifiedHtml !== currentHtml) {
        onHtmlUpdate(data.modifiedHtml);
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión. Intenta de nuevo.');
      setLastFailedMessage(text);
      // Remove the user message on error so they can retry
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      sendMessage(lastFailedMessage);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold text-white">Builder Chat</span>
        <span className="text-xs text-gray-500">— Modifica tu negocio con lenguaje natural</span>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500 text-center">
              Escribe un cambio para tu negocio digital.<br />
              <span className="text-xs text-gray-600">Ej: &quot;Cambia el color principal a rojo&quot; o &quot;Agrega una sección de testimonios&quot;</span>
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-md'
                  : 'bg-white/5 border border-white/10 text-gray-300 rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span className="text-sm text-gray-400">Procesando cambios...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 bg-red-900/20 border border-red-500/30 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-300 flex-1">{error}</span>
          {lastFailedMessage && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reintentar
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un cambio..."
            disabled={loading}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
