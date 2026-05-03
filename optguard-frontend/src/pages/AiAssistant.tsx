import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiAssistant = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your OPTGuard AI assistant. How can I help you with your OPT or STEM OPT compliance today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/ai/chat', 
        { question: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again or check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">AI Assistant</h1>
          <p className="text-secondary mt-2">Get educational guidance on OPT rules and regulations.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold">GPT-4o Powered</span>
        </div>
      </header>

      <div className="flex-1 glass rounded-[2rem] flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-primary text-white' : 'bg-white/10 text-secondary'
                }`}>
                  {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>
                <div className={`p-5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white/5 border border-white/10 text-secondary'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 text-secondary" />
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-secondary italic">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer Area */}
        <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 text-orange-400" />
          <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">
            Educational guidance only • Not legal advice • Confirm with your DSO or USCIS
          </p>
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white/5 border-t border-white/10">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about STEM OPT filing, unemployment rules, reporting..."
              className="w-full bg-background border border-white/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder:text-secondary/50"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
