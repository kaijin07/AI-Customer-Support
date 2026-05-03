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
};

export default ticketService;
