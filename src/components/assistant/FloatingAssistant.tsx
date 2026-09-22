import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  MapPin,
  Calendar,
  Layers,
  ChevronDown,
  Database
} from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import { ChatMessage } from '../../types';
import {
  askTravelAssistant,
  SUGGESTED_ASSISTANT_PROMPTS,
  getChatBotStatus,
  ChatBotStatus
} from '../../services/ai/travelAssistant';

interface FloatingAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (page: string) => void;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  isOpen,
  onToggle,
  onNavigate
}) => {
  const { activeTrip, trips, setActiveTripId } = useTrip();
  const [botStatus, setBotStatus] = useState<ChatBotStatus | null>(null);
  const [tripSelectorOpen, setTripSelectorOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I'm **Voyager AI**, your real-time travel concierge. I'm actively synced with your **${activeTrip.destination || 'trip'}** itinerary (${activeTrip.durationDays} days) and database records.\n\nAsk me anything about your daily schedule, budget calculations, hotel stays, restaurants, packing checklist, or map routes!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        type: 'apply-itinerary',
        label: 'View Detailed Itinerary'
      }
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatBotStatus().then((status) => {
      setBotStatus(status);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat history cleared. I'm actively focused on **${activeTrip.title || activeTrip.destination}**. What would you like to plan or review?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsTyping(true);

    try {
      const response = await askTravelAssistant(query, activeTrip, messages);
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `I'm ready to assist with your ${activeTrip.city || activeTrip.destination} itinerary. Let me know if you want to adapt activities, manage costs, or check weather tips!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    switch (action.type) {
      case 'open-budget':
        onNavigate('budget');
        onToggle();
        break;
      case 'open-packing':
        onNavigate('packing');
        onToggle();
        break;
      case 'view-weather':
        onNavigate('weather');
        onToggle();
        break;
      case 'apply-itinerary':
      case 'replace-activity':
        onNavigate('itinerary');
        onToggle();
        break;
      case 'view-map':
        onNavigate('map');
        onToggle();
        break;
      case 'view-food':
        onNavigate('food');
        onToggle();
        break;
      case 'view-accommodations':
        onNavigate('accommodations');
        onToggle();
        break;
      case 'view-documents':
        onNavigate('documents');
        onToggle();
        break;
      case 'view-trips':
        onNavigate('mytrips');
        onToggle();
        break;
      default:
        onNavigate('itinerary');
        onToggle();
    }
  };

  // Simple, robust Markdown parser for chat messages
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, lineIdx) => {
      // Bullet items
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.replace(/^[•\-]\s*/, '') : line;

      // Parse bold segments: **text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={pIdx} className="italic text-gray-600 dark:text-zinc-300">{part.slice(1, -1)}</em>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start space-x-2 my-0.5">
            <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0 mt-0.5">•</span>
            <div className="flex-1">{renderedParts}</div>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={lineIdx} className="h-1.5" />;
      }

      return <div key={lineIdx} className="leading-relaxed">{renderedParts}</div>;
    });
  };

  return (
    <>
      {/* Floating Action Button when closed */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 hidden md:block">
          <button
            onClick={onToggle}
            className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white shadow-xl shadow-teal-600/30 hover:shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Open Voyager AI Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-teal-700 animate-pulse" />
            </div>
            <span className="text-xs font-bold tracking-wide">Voyager AI</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 font-medium">
              Ask Trip
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-2 sm:inset-6 md:inset-10'
              : 'inset-x-0 bottom-0 top-14 sm:top-auto sm:bottom-4 sm:right-4 sm:left-auto sm:w-[450px] sm:h-[620px] sm:max-h-[88vh]'
          } flex flex-col rounded-t-2xl sm:rounded-2xl bg-white dark:bg-zinc-900 border-t sm:border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold tracking-tight">Voyager Concierge</h3>
                  <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    {botStatus?.geminiConfigured ? 'Gemini 3.8 Flash' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-teal-100/90 mt-0.5">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 inline text-emerald-300" />
                    {activeTrip.city || activeTrip.destination}
                  </span>
                  <span>•</span>
                  <span>{activeTrip.durationDays} Days</span>
                  {botStatus?.supabaseConnected && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emerald-300 font-medium">
                        <Database className="w-2.5 h-2.5" /> Supabase
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors hidden sm:inline-block"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Context Pill bar & Trip Switcher */}
          <div className="px-3.5 py-1.5 bg-teal-50/80 dark:bg-teal-950/40 border-b border-teal-100/60 dark:border-teal-900/40 flex items-center justify-between text-xs text-teal-800 dark:text-teal-300 relative">
            <div className="relative">
              <button
                onClick={() => setTripSelectorOpen(!tripSelectorOpen)}
                className="flex items-center space-x-1.5 font-semibold hover:text-teal-900 dark:hover:text-white text-left max-w-[240px] truncate transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="truncate">{activeTrip.title}</span>
                <ChevronDown className="w-3 h-3 opacity-70 shrink-0" />
              </button>

              {/* Trip Switcher Dropdown */}
              {tripSelectorOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 z-50 py-1 overflow-hidden">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-800">
                    Switch Active Trip Context
                  </div>
                  {trips.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTripId(t.id);
                        setTripSelectorOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        t.id === activeTrip.id
                          ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-bold'
                          : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div>{t.title}</div>
                        <div className="text-[10px] text-gray-400">{t.durationDays} Days • {t.destination}</div>
                      </div>
                      {t.id === activeTrip.id && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50">
                {activeTrip.travelStyle}
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50 dark:bg-zinc-950/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-teal-600 text-white rounded-br-none shadow-md shadow-teal-600/20'
                        : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 border border-gray-200/80 dark:border-zinc-700/80 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div>{renderFormattedText(msg.text)}</div>

                    {/* Interactive Action Card if present */}
                    {msg.suggestedAction && (
                      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-zinc-700">
                        <button
                          onClick={() => handleActionClick(msg.suggestedAction)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200/70 dark:border-teal-800/60 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                          <span>{msg.suggestedAction.label}</span>
                          <ArrowRight className="w-3 h-3 ml-0.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-400 dark:text-zinc-400 text-xs px-2 py-1">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-gray-500 ml-1">Voyager Concierge is reviewing trip details...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pills */}
          <div className="px-3 py-2 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 overflow-x-auto no-scrollbar flex items-center space-x-1.5">
            {SUGGESTED_ASSISTANT_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-gray-600 dark:text-zinc-300 hover:text-teal-700 dark:hover:text-teal-300 border border-transparent hover:border-teal-200 dark:hover:border-teal-800 transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about budget, schedule, packing, hotels, or route..."
                className="flex-1 px-3.5 py-2.5 text-base sm:text-sm bg-gray-100 dark:bg-zinc-800 border border-transparent focus:border-teal-500 dark:focus:border-teal-400 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isTyping}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white shadow-md shadow-teal-600/20 transition-all focus:outline-none cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
