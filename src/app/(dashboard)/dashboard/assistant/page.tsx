'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  _count: { Message: number };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export default function AssistantPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/assistant/conversations');
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setConversations(list);

      const savedId = localStorage.getItem('activeConversationId');
      if (savedId && list.find((c: Conversation) => c.id === savedId)) {
        setActiveConversation(savedId);
        fetchMessages(savedId);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/assistant/conversations/${conversationId}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const createConversation = async () => {
    try {
      const res = await fetch('/api/assistant/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      if (!res.ok) return;
      const newConv = await res.json();
      setConversations([newConv, ...conversations]);
      setActiveConversation(newConv.id);
      setMessages([]);
      localStorage.setItem('activeConversationId', newConv.id);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      await fetch(`/api/assistant/conversations/${id}`, { method: 'DELETE' });
      setConversations(conversations.filter((c) => c.id !== id));
      if (activeConversation === id) {
        setActiveConversation(null);
        setMessages([]);
        localStorage.removeItem('activeConversationId');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeConversation || sending) return;
    const msg = input.trim();
    setInput('');
    setSending(true);

    // Optimistic: add user message immediately
    const tempUserMsg: Message = {
      id: 'temp-user-' + Date.now(),
      role: 'user',
      content: msg,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConversation, message: msg }),
      });
      if (!res.ok) throw new Error('Failed to send');
      const data = await res.json();

      // Replace temp message with real ones
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        data.userMessage,
        data.assistantMessage,
      ]);

      // Update conversation title if generated
      if (data.title) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation ? { ...c, title: data.title } : c
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown renderer
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Bold
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Code inline
      processed = processed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-white/10 rounded text-purple-300 text-sm">$1</code>');
      // List items
      if (processed.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: processed.slice(2) }} />;
      }
      if (processed.match(/^\d+\.\s/)) {
        return <li key={i} className="ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: processed.replace(/^\d+\.\s/, '') }} />;
      }
      if (processed.trim() === '') return <br key={i} />;
      return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div className="flex h-full" style={{ background: 'var(--bg-primary, #0a0a0f)' }}>
      {/* Conversation Sidebar */}
      <div className="w-72 flex flex-col border-r" style={{ background: 'var(--bg-secondary, #111118)', borderColor: 'var(--border-subtle, #1e1e2e)' }}>
        <div className="p-4">
          <button
            onClick={createConversation}
            className="w-full px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-all text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConversation(conv.id);
                  fetchMessages(conv.id);
                  localStorage.setItem('activeConversationId', conv.id);
                }}
                className={`group px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                  activeConversation === conv.id
                    ? 'bg-purple-600/20 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-xs opacity-50">{conv._count?.Message || 0} messages</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 rounded transition-all"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.length === 0 && !sending && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Image src="/chatbot_logo.png" alt="Forgeon Bot" width={80} height={80} className="rounded-full mb-4 opacity-60" />
                  <h3 className="text-lg font-semibold text-white/80 mb-2">Forgeon Assistant</h3>
                  <p className="text-gray-500 text-sm max-w-md">
                    Your startup CTO + product strategist. Ask me anything about your projects, Forgeon features, startup strategy, or tech.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-purple-600/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-md'
                        : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-md'
                    }`}
                  >
                    <div className="space-y-1">{renderContent(msg.content)}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}

              {sending && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-purple-600/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle, #1e1e2e)' }}>
              <div className="flex gap-3 items-end max-w-4xl mx-auto">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={1}
                  className="flex-1 px-4 py-3 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                  style={{ background: 'var(--bg-elevated, #16161f)', border: '1px solid var(--border-subtle, #1e1e2e)' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="p-3 rounded-xl text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <Image src="/chatbot_logo.png" alt="Forgeon Bot" width={96} height={96} className="rounded-full mb-6 opacity-50" />
            <h2 className="text-xl font-semibold text-white/80 mb-2">Forgeon Assistant</h2>
            <p className="text-gray-500 text-sm max-w-md mb-6">
              Your AI-powered startup advisor. Ask about your projects, Forgeon features, startup strategy, tech stacks, or anything else.
            </p>
            <button
              onClick={createConversation}
              className="px-6 py-2.5 rounded-xl text-white font-medium transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              Start a conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
