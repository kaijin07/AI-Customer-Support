import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, MessageSquare, LogOut, Loader2, Plus, Trash2, Ticket as TicketIcon } from 'lucide-react';
import api from '../api/axiosInstance.js';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [botConfig, setBotConfig] = useState({ faqs: [], instructions: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [savingConfig, setSavingConfig] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, configRes, ticketsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/bot-config'),
          api.get('/tickets')
        ]);

        if (userRes.data.success) {
          setUser(userRes.data.data);
          setBotConfig(configRes.data.data || { faqs: [], instructions: '' });
          setTickets(ticketsRes.data.data || []);
        } else {
          onLogout();
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        onLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      const response = await api.post('/bot-config', botConfig);
      if (response.data.success) {
        setBotConfig(response.data.data);
        alert('Bot configuration saved successfully!');
      }
    } catch (error) {
      alert('Failed to save configuration.');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    setBotConfig(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFaq]
    }));
    setNewFaq({ question: '', answer: '' });
  };

  const handleRemoveFaq = (index) => {
    setBotConfig(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-8 pt-16 flex-1 space-y-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.businessName}</h1>
        <button 
          onClick={onLogout} 
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-200 dark:hover:border-red-800 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chatbot Preview Card */}
        <div className="flex flex-col items-center text-center gap-4 p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm h-full">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <MessageSquare size={48} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Preview Chatbot</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Test how your AI customer support chatbot interacts with users in real-time.
          </p>
          <button 
            onClick={() => navigate('/chat')}
            className="mt-4 px-6 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-md transition-colors"
          >
            Start Preview
          </button>
        </div>

        {/* Support Tickets Card */}
        <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm h-full max-h-96 overflow-y-auto">
          <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 pb-4 mb-2">
            <TicketIcon className="text-primary" />
            <h3 className="text-xl font-semibold">Support Tickets ({tickets.length})</h3>
          </div>
          {tickets.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No tickets escalated yet.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket._id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ticket.status === 'open' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-gray-100 text-gray-800'}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2 mt-2">{ticket.userMessage}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bot Configuration Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="text-primary" />
            <h3 className="text-xl font-semibold">Bot Configuration</h3>
          </div>
          <button 
            onClick={handleSaveConfig}
            disabled={savingConfig}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-colors disabled:opacity-70"
          >
            {savingConfig ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold mb-2">Custom AI Instructions</label>
            <p className="text-xs text-gray-500 mb-2">Tell the AI how to behave, what tone to use, and any special rules.</p>
            <textarea 
              value={botConfig.instructions}
              onChange={(e) => setBotConfig(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="e.g. Always be cheerful. Recommend our premium plan if asked about pricing."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:ring-2 focus:ring-primary h-24"
            />
          </div>

          {/* FAQs */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Frequently Asked Questions ({botConfig.faqs.length})</label>
              <p className="text-xs text-gray-500">The AI will use these to answer instantly and save API costs.</p>
            </div>
            
            {/* FAQ List */}
            <div className="space-y-3 mb-6">
              {botConfig.faqs.map((faq, index) => (
                <div key={index} className="flex gap-4 items-start p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Q: {faq.question}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">A: {faq.answer}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveFaq(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add FAQ Form */}
            <div className="flex flex-col md:flex-row gap-3 items-start">
              <input 
                type="text"
                placeholder="Question"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                className="flex-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
              />
              <input 
                type="text"
                placeholder="Answer"
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                className="flex-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
              />
              <button 
                onClick={handleAddFaq}
                className="w-full md:w-auto px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={16} /> Add FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
