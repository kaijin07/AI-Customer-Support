import React from 'react';
import { Bot, Settings, Ticket as TicketIcon, Code } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', name: 'Overview', icon: <Bot size={18} /> },
    { id: 'config', name: 'Bot Config', icon: <Settings size={18} /> },
    { id: 'tickets', name: 'Tickets', icon: <TicketIcon size={18} /> },
    { id: 'embed', name: 'Embed Widget', icon: <Code size={18} /> },
  ];

  return (
    <div className="w-full md:w-64 border-r border-border p-4 space-y-2 shrink-0">
      <div className="mb-8 px-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">Main Menu</p>
      </div>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
            activeTab === tab.id 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'text-muted hover:text-white hover:bg-surface'
          }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
