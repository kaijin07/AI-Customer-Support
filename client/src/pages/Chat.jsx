import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Bot, User } from 'lucide-react';
import { useChat } from '../hooks/useChat.js';
import { useAuth } from '../hooks/useAuth.js';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const data = await sendMessage(userMessage.text, user?.name);
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 dark:bg-gray-900 w-full pt-16">
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
        
        {/* Chat Header */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 shrink-0">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 mr-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-lg leading-tight">AI Support Preview</h2>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                Online
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50 dark:bg-gray-900/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
              <Bot size={48} className="opacity-50" />
              <p>Send a message to start testing your bot!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 'bg-primary text-white'}`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'}`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
               <div className="flex gap-3 max-w-[80%]">
                 <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white">
                   <Bot size={16} />
                 </div>
                 <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-sm shadow-sm flex gap-1 items-center">
                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-1 top-1 bottom-1 aspect-square bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition-colors"
            >
              <Send size={18} className={input.trim() && !loading ? 'translate-x-px translate-y-px' : ''} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Chat;
