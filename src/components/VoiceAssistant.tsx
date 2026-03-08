import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Namaste! I am your AgroSync Assistant. Ask me any farming questions.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative bg-white w-full rounded-t-3xl shadow-2xl p-6 pointer-events-auto animate-fade-in flex flex-col items-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 active:scale-95"
          aria-label="Close Voice Assistant"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">AgroSync Assistant</h2>

        {/* Chat History */}
        <div className="w-full max-w-md bg-gray-50 flex-1 overflow-y-auto p-4 rounded-xl mb-4 space-y-4 shadow-inner max-h-[50vh] border border-gray-100">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-accent-yellow/20 text-gray-900 rounded-br-sm' : 'bg-primary-green text-white rounded-bl-sm shadow-md'}`} />
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-primary-green/80 text-white px-4 py-2 rounded-2xl rounded-bl-sm text-sm shadow-md flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="w-full max-w-md relative flex items-center mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your farming question here..."
            className="w-full pl-5 pr-14 py-4 rounded-full border-2 border-gray-200 outline-none focus:border-primary-green focus:shadow-md transition-all text-sm font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 p-2 bg-primary-green text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center font-medium uppercase tracking-wider">
          Powered by Gemini AI 2.5
        </p>

      </div>
    </div>
  );
};

export default VoiceAssistant;
