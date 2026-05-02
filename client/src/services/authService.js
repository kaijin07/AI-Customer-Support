import axiosInstance from '../api/axiosInstance';

const authService = {
  signup: async (userData) => {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  googleLogin: async (idToken, businessName) => {
    const response = await axiosInstance.post('/auth/google', { idToken, businessName });
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.get('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
};

export default authService;
