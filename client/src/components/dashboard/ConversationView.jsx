import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, User, UserCheck } from 'lucide-react';
import { io } from 'socket.io-client';
import ticketService from '../../services/ticketService';
import toast from 'react-hot-toast';

const ConversationView = ({ ticket, onClose }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [takeover, setTakeover] = useState(false);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await ticketService.getConversation(ticket.visitorId);
        if (res.success) {
          setConversation(res.data);
          setMessages(res.data.messages);
          setTakeover(res.data.humanTakeover || false);
        }
      } catch (err) {
        toast.error('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [ticket.visitorId]);

  useEffect(() => {
    // Determine backend URL for socket
    const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    newSocket.emit('joinConversation', ticket.visitorId);

    newSocket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.close();
  }, [ticket.visitorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTakeoverToggle = async () => {
    try {
      const newState = !takeover;
      const res = await ticketService.toggleTakeover(ticket.visitorId, newState);
      if (res.success) {
        setTakeover(newState);
        toast.success(newState ? 'You have taken over the conversation' : 'AI is back in control');
      }
    } catch (err) {
      toast.error('Failed to toggle takeover');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Optimistically add message
    const msg = { sender: 'agent', text: inputText, createdAt: new Date().toISOString() };
    // setMessages((prev) => [...prev, msg]); // Let socket handle it to avoid duplicates
    setInputText('');

    try {
      await ticketService.sendMessage(ticket.visitorId, msg.text);
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="card p-6 w-full max-w-2xl bg-bg border border-border flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card p-0 w-full max-w-3xl bg-bg border border-border h-[80vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              Conversation with {ticket.userName || 'Visitor'}
            </h3>
            <p className="text-xs text-muted">Ticket ID: {ticket._id}</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className={`text-sm ${takeover ? 'text-primary font-bold' : 'text-muted'}`}>
                {takeover ? 'Human Control' : 'AI Control'}
              </span>
              <div 
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${takeover ? 'bg-primary' : 'bg-muted'}`}
                onClick={handleTakeoverToggle}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${takeover ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
            </label>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-muted hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            const isAgent = msg.sender === 'agent';
            const isBot = msg.sender === 'bot';

            return (
              <div key={idx} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[75%] rounded-lg p-3 ${
                  isUser ? 'bg-surface text-white border border-border' : 
                  isAgent ? 'bg-primary/20 text-white border border-primary/30' : 
                  'bg-white/5 text-white border border-white/10'
                }`}>
                  <div className="flex items-center gap-1 mb-1 opacity-70">
                    {isUser ? <User size={12} /> : isAgent ? <UserCheck size={12} className="text-primary" /> : <Bot size={12} />}
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      {isUser ? 'User' : isAgent ? 'Human Agent' : 'AI Bot'}
                    </span>
                    {msg.createdAt && (
                      <span className="text-[10px] ml-auto">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-surface">
          {!takeover ? (
            <div className="text-center p-3 border border-dashed border-border rounded-lg text-muted text-sm">
              Take over the conversation to send messages.
              <button 
                onClick={handleTakeoverToggle}
                className="ml-2 text-primary hover:underline font-medium"
              >
                Take Over
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message as an agent..." 
                className="flex-1 bg-bg border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="bg-primary hover:bg-primary-hover text-black p-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ConversationView;
