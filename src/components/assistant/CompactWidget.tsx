'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Send, Bot, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompactWidgetProps {
  onClose: () => void;
  isVisible: boolean;
  onAnimationEnd?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function CompactWidget({ onClose, isVisible, onAnimationEnd }: CompactWidgetProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTransitionEnd = () => {
    onAnimationEnd?.();
  };

  const initConversation = async () => {
    const savedId = localStorage.getItem('widgetConversationId');
    if (savedId) {
      try {
        const res = await fetch(`/api/assistant/conversations/${savedId}/messages`);
        if (res.ok) {
          const msgs = await res.json();
          setConversationId(savedId);
          setMessages(Array.isArray(msgs) ? msgs : []);
          return;
        }
      } catch {}
    }
    await createNewConversation();
  };

  const createNewConversation = async () => {
    try {
      const res = await fetch('/api/assistant/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Quick Chat' }),
      });
      if (!res.ok) return;
      const conv = await res.json();
      setConversationId(conv.id);
      setMessages([]);
      localStorage.setItem('widgetConversationId', conv.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || sending) return;
    const msg = input.trim();
    setInput('');
    setSending(true);

    const tempMsg: Message = { id: 'temp-' + Date.now(), role: 'user', content: msg };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: msg }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempMsg.id),
        data.userMessage,
        data.assistantMessage,
      ]);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-white/10 rounded text-purple-300 text-xs">$1</code>');
      if (processed.startsWith('- ')) {
        return <li key={i} className="ml-3 list-disc text-xs" dangerouslySetInnerHTML={{ __html: processed.slice(2) }} />;
      }
      if (processed.match(/^\d+\.\s/)) {
        return <li key={i} className="ml-3 list-decimal text-xs" dangerouslySetInnerHTML={{ __html: processed.replace(/^\d+\.\s/, '') }} />;
      }
      if (processed.trim() === '') return <br key={i} />;
      return <p key={i} className="text-xs" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div
      ref={panelRef}
      onTransitionEnd={handleTransitionEnd}
      className={`fixed bottom-24 right-6 w-[380px] h-[520px] rounded-2xl shadow-2xl shadow-black/50 flex flex-col z-40 overflow-hidden border max-md:bottom-0 max-md:right-0 max-md:w-full max-md:h-full max-md:rounded-none ${
        isVisible ? 'translate-x-0' : 'translate-x-[110%]'
      }`}
      style={{
        background: 'var(--bg-secondary, #111118)',
        borderColor: 'var(--border-subtle, #1e1e2e)',
        transition: isVisible
          ? 'transform 300ms ease-out'
          : 'transform 200ms ease-in',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle, #1e1e2e)' }}>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <span className="font-semibold text-white text-sm">Forgeon Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { router.push('/dashboard/assistant'); onClose(); }}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
            aria-label="Abrir página completa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && !sending && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-10 h-10 text-purple-400/40 mb-3" />
            <p className="text-gray-500 text-xs">Pregúntame lo que quieras sobre tus proyectos o Forgeon</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full flex-shrink-0 bg-purple-600/20 flex items-center justify-center">
                <Bot className="w-3 h-3 text-purple-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-sm'
                  : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-sm'
              }`}
            >
              <div className="space-y-0.5">{renderContent(msg.content)}</div>
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full flex-shrink-0 bg-gray-700 flex items-center justify-center">
                <User className="w-3 h-3 text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full flex-shrink-0 bg-purple-600/20 flex items-center justify-center">
              <Bot className="w-3 h-3 text-purple-400" />
            </div>
            <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border-subtle, #1e1e2e)' }}>
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
            placeholder="Pregúntame lo que quieras..."
            className="flex-1 px-3 py-2 rounded-lg text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            style={{ background: 'var(--bg-elevated, #16161f)', border: '1px solid var(--border-subtle, #1e1e2e)' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="p-2 rounded-lg text-white transition-all disabled:opacity-30 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            aria-label="Enviar"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
