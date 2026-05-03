import { useState, useCallback } from 'react';
import ticketService from '../services/ticketService';

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.fetchTickets();
      setTickets(data.data);
      setLoading(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      setLoading(false);
    }
  }, []);

  const updateTicket = useCallback(async (id, status) => {
    try {
      await ticketService.updateTicketStatus(id, status);
      await fetchTickets(); // Refresh list after update
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return false;
    }
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    updateTicket,
  };
};
