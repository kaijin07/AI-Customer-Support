import axiosInstance from '../api/axiosInstance';

const ticketService = {
  fetchTickets: async () => {
    const response = await axiosInstance.get('/tickets');
    return response.data;
  },
  updateTicketStatus: async (id, status) => {
    const response = await axiosInstance.put(`/tickets/${id}`, { status });
    return response.data;
  },
  deleteTicket: async (id) => {
    const response = await axiosInstance.delete(`/tickets/${id}`);
    return response.data;
  },
  getConversation: async (userId) => {
    const response = await axiosInstance.get(`/conversations/${userId}`);
    return response.data;
  },
  sendMessage: async (userId, message) => {
    const response = await axiosInstance.post('/messages', { userId, message, sender: 'agent' });
    return response.data;
  },
  toggleTakeover: async (userId, takeover) => {
    const response = await axiosInstance.put(`/conversations/${userId}/takeover`, { takeover });
    return response.data;
  }
};

export default ticketService;
