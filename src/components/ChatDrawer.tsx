import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, FinancialProfile, ChatSession, ChatMessage } from '../types';
import {
  X,
  Plus,
  Send,
  Mic,
  Copy,
  Check,
  Volume2,
  Trash2,
  Edit2,
  Search,
  Sparkles,
  Bot,
  User as UserIcon,
  MessageSquare,
  ThumbsUp,
  Download,
} from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  finances: FinancialProfile;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onAddMessage: (sessionId: string, message: ChatMessage) => void;
  onOpenVoiceAssistant: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  user,
  finances,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onAddMessage,
  onOpenVoiceAssistant,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const activeSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (!customPrompt) setInputText('');
    onAddMessage(activeSession.id, userMessage);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...activeSession.messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
          userProfile: user,
          userFinances: {
            monthlyIncome: finances.monthlyIncome,
            monthlySavings: finances.monthlySavings,
            monthlyDebt: finances.debts.reduce((sum, d) => sum + d.minPayment, 0),
            emergencyMonths: finances.emergencyFundMonths,
            portfolioValue: finances.investments.reduce((sum, i) => sum + i.shares * i.currentPrice, 0),
          },
        }),
      });

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.text || 'I analyzed that for you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onAddMessage(activeSession.id, assistantMessage);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'I had trouble connecting to the cloud service. For budgeting, ensure you maintain the 50/30/20 guideline and an emergency fund.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onAddMessage(activeSession.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSpeakMessage = (id: string, text: string) => {
    if (!synthRef.current) return;

    if (speakingMessageId === id) {
      synthRef.current.cancel();
      setSpeakingMessageId(null);
      return;
    }

    synthRef.current.cancel();
    const clean = text.replace(/[*#_`~>]/g, '').slice(0, 500);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    synthRef.current.speak(utterance);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(s.id);
    setEditTitleText(s.title);
  };

  const saveRename = (id: string) => {
    if (editTitleText.trim()) {
      onRenameSession(id, editTitleText.trim());
    }
    setEditingSessionId(null);
  };

  // Render markdown with nice formatting
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-blue-500 inline-block" />
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-slate-900 mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <span>{parseBold(itemText)}</span>
          </div>
        );
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="text-xs sm:text-sm text-slate-700 my-1 font-medium pl-1">
            {parseBold(line)}
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Normal paragraph
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-0.5">
          {parseBold(line)}
        </p>
      );
    });
  };

  function parseBold(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] glass-panel-accent rounded-3xl border border-white/95 shadow-2xl flex overflow-hidden">
        {/* ================= LEFT SIDEBAR: CHAT HISTORY (ChatGPT / Gemini style) ================= */}
        <div className="w-72 sm:w-80 h-full border-r border-slate-200/80 bg-white/60 flex flex-col backdrop-blur-xl">
          {/* Top Brand & New Chat */}
          <div className="p-4 border-b border-slate-200/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight">Chat History</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {sessions.length} chats
              </span>
            </div>

            {/* New Chat Button */}
            <button
              type="button"
              onClick={onNewSession}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>

            {/* Search History */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/70 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Saved Logs
            </div>

            {filteredSessions.map((session) => {
              const isSelected = session.id === activeSession.id;
              const isEditing = editingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200/80 shadow-2xs'
                      : 'hover:bg-white/80 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-4 h-4 flex-shrink-0 ${
                        isSelected ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />

                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitleText}
                        onChange={(e) => setEditTitleText(e.target.value)}
                        onBlur={() => saveRename(session.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveRename(session.id)}
                        className="w-full text-xs font-medium px-1.5 py-0.5 rounded bg-white border border-blue-400 focus:outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="min-w-0">
                        <span className="text-xs truncate block">{session.title}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {session.messages.length} messages • {session.updatedAt}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                    <button
                      type="button"
                      onClick={(e) => startRename(session, e)}
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700"
                      title="Rename conversation"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* User profile bottom dock */}
          <div className="p-3 border-t border-slate-200/60 bg-white/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.avatarColor}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT MAIN CONVERSATION AREA ================= */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/50">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span>{activeSession.title}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                    AetherBot AI
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Financial Advisor & Casual Companion • Powered by Gemini 3.8 Flash
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick switch to Voice Assistant Mode */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoiceAssistant();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>Voice Mode</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat drawer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeSession.messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isCopied = copiedMessageId === msg.id;
              const isSpeaking = speakingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-xs ${
                      isUser
                        ? `${user.avatarColor} text-white`
                        : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                    }`}
                  >
                    {isUser ? user.name.charAt(0).toUpperCase() : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Bubble Container */}
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border shadow-xs transition-all ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none border-blue-500'
                        : 'glass-panel rounded-tl-none border-white/90'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-4 mb-2 pb-1 border-b border-black/5">
                      <span className={`text-[11px] font-bold ${isUser ? 'text-blue-100' : 'text-slate-600'}`}>
                        {isUser ? user.name : 'AetherBot'}
                      </span>
                      <span className={`text-[10px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Content */}
                    <div className={isUser ? 'text-xs sm:text-sm text-white' : ''}>
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : (
                        renderFormattedContent(msg.content)
                      )}
                    </div>

                    {/* Assistant Message Actions (Copy, TTS) */}
                    {!isUser && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/50">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSpeakMessage(msg.id, msg.content)}
                          className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                            isSpeaking ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{isSpeaking ? 'Stop Audio' : 'Listen (TTS)'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="glass-panel rounded-2xl rounded-tl-none p-4 border border-white/90 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-500 font-medium ml-1">
                    AetherBot is formulating financial calculations...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Prompts Carousel */}
          <div className="px-4 py-2 border-t border-slate-200/60 bg-white/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
              Suggestions:
            </span>
            {[
              'Explain 50/30/20 budget with my income',
              'Debt Avalanche vs Snowball math',
              'Calculate compound interest over 20 years',
              'How are you doing today, AetherBot?',
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] px-3 py-1 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-blue-700 border border-slate-200/80 shadow-2xs whitespace-nowrap transition-all flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-4 bg-white/80 border-t border-slate-200/80 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic shortcut */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoiceAssistant();
                }}
                className="p-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200/80 transition-all"
                title="Switch to Voice Assistant"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                placeholder="Ask AetherBot about budgeting, loans, savings, investments, or daily life..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm text-slate-800 placeholder-slate-400"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
