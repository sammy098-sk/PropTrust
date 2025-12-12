import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, MessageSquare, Bot, ChevronDown, User } from 'lucide-react';
import { sendRealEstateChatMessage } from '../services/geminiService';
import { Content } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTION_CHIPS = [
  "What fees should I pay?",
  "Is Yaba good for students?",
  "Red flags in agreements?",
  "How to verify a landlord?"
];

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am NaijaPropBot. Ask me anything about renting or buying property in Nigeria.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for Gemini API
    const history: Content[] = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Call API
    const responseText = await sendRealEstateChatMessage(history, textToSend);

    // Add AI response
    setMessages(prev => [...prev, { role: 'model', text: responseText || "I'm having a network issue, try again?" }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-brand-600 text-white p-4 rounded-full shadow-xl hover:bg-brand-700 transition-all hover:scale-105 active:scale-95 group"
        title="Ask Real Estate AI"
      >
        <Sparkles className="absolute -top-1 -right-1 text-yellow-300 w-5 h-5 animate-pulse" />
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 w-full max-w-[350px] sm:max-w-md animate-in slide-in-from-bottom-10 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
        {/* Header */}
        <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold">NaijaProp Assistant</h3>
              <p className="text-xs text-brand-100 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                Online • Powered by Gemini
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronDown size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => {
            const isBot = msg.role === 'model';
            return (
              <div key={idx} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  isBot 
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
                    : 'bg-brand-600 text-white rounded-tr-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex space-x-1 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
           {/* Chips (Only show if few messages) */}
           {messages.length < 3 && (
             <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
                {SUGGESTION_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleSend(chip)}
                    className="whitespace-nowrap px-3 py-1.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-100 hover:bg-brand-100"
                  >
                    {chip}
                  </button>
                ))}
             </div>
           )}

           <form 
             onSubmit={(e) => { e.preventDefault(); handleSend(); }}
             className="flex items-center gap-2"
           >
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Ask about rent, contracts..."
               className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
             />
             <button
               type="submit"
               disabled={!input.trim() || isLoading}
               className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 transition-colors"
             >
               <Send size={18} />
             </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;