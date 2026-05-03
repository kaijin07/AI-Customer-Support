import React, { useState } from 'react';
import { Ticket as TicketIcon, HelpCircle, CheckCircle, MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConversationView from './ConversationView';
import ticketService from '../../services/ticketService';
import { useGsapTabEnter } from '../../hooks/useGsapTabEnter';

const TicketsTab = ({ tickets, updateTicket, fetchTickets }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const rootRef = useGsapTabEnter({ opacity: 0, x: 20 });

  const handleCloseTicket = async (id) => {
    const success = await updateTicket(id, 'closed');
    if (success) {
      toast.success('Ticket marked as closed!');
    } else {
      toast.error('Failed to close ticket.');
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      const res = await ticketService.deleteTicket(id);
      if (res.success) {
        toast.success('Ticket deleted successfully');
        if (fetchTickets) fetchTickets();
      }
    } catch (err) {
      toast.error('Failed to delete ticket.');
    }
  };

  return (
    <div ref={rootRef} className="space-y-6">
      <div className="card min-h-[400px]">
        <div className="flex items-center gap-3 border-b border-border pb-6 mb-6">
          <TicketIcon className="text-primary" />
          <h3 className="text-xl font-bold text-white">
            Escalated Support Tickets ({(tickets || []).length})
          </h3>
        </div>

        {!tickets || tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted">
            <HelpCircle size={48} className="mb-4 opacity-20" />
            <p>No support tickets yet. Your bot is doing a great job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-6 bg-surface rounded-xl border border-border hover:border-primary/50 transition-all flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          ticket.status === 'open'
                            ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                            : 'bg-success/20 text-success border border-success/30'
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <h4 className="font-semibold text-lg text-white truncate max-w-[200px]">
                        {ticket.userName || 'Anonymous'}
                      </h4>
                      <p className="text-xs text-muted font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {ticket.status === 'open' && (
                        <button
                          type="button"
                          onClick={() => handleCloseTicket(ticket._id)}
                          className="p-2 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-colors"
                          title="Mark Closed"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {(ticket.status === 'closed' || ticket.status === 'resolved') && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTicket(ticket._id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          title="Delete Ticket"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="bg-bg p-4 rounded-lg mb-4 border border-border/50">
                    <p className="text-sm text-muted italic line-clamp-3">&quot;{ticket.userMessage}&quot;</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTicket(ticket)}
                  className="w-full py-3 mt-auto rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare size={16} />
                  View Conversation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <ConversationView ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default TicketsTab;
