import React from 'react';
import { motion } from 'framer-motion';
import { Ticket as TicketIcon, HelpCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TicketsTab = ({ tickets, updateTicket }) => {
  const handleCloseTicket = async (id) => {
    const success = await updateTicket(id, 'closed');
    if (success) {
      toast.success('Ticket marked as closed!');
    } else {
      toast.error('Failed to close ticket.');
    }
  };

  return (
    <motion.div 
      key="tickets"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="card min-h-[400px]">
        <div className="flex items-center gap-3 border-b border-border pb-6 mb-6">
          <TicketIcon className="text-primary" />
          <h3 className="text-xl font-bold text-white">Escalated Support Tickets ({(tickets || []).length})</h3>
        </div>
        
        {(!tickets || tickets.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <HelpCircle size={48} className="mb-4 opacity-20" />
            <p>No support tickets yet. Your bot is doing a great job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map(ticket => (
              <div key={ticket._id} className="p-5 bg-bg rounded-md border border-border hover:border-muted transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      ticket.status === 'open' ? 'bg-amber-500/20 text-amber-500' : 'bg-success/20 text-success'
                    }`}>
                      {ticket.status}
                    </span>
                    <h4 className="font-semibold text-white truncate max-w-md">{ticket.userName || 'Anonymous'}</h4>
                    <p className="text-[10px] text-muted">{new Date(ticket.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button className="text-xs text-primary hover:underline">View Conversation</button>
                    {ticket.status === 'open' && (
                      <button 
                        onClick={() => handleCloseTicket(ticket._id)}
                        className="text-xs flex items-center gap-1 text-success hover:underline"
                      >
                        <CheckCircle size={12} />
                        Mark Closed
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted bg-surface p-3 rounded italic">"{ticket.userMessage}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TicketsTab;
