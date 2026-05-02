import axiosInstance from '../api/axiosInstance';

const ticketService = {
  fetchTickets: async () => {
    const response = await axiosInstance.get('/tickets');
    return response.data;
  },
};

export default ticketService;
