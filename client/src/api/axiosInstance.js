import axios from 'axios';

/**
 * Global Axios Instance
 * 
 * configured with a base URL and 'withCredentials: true' to 
 * automatically include authentication cookies in all requests 
 * sent to the backend.
 */
const api = axios.create({
  // The base URL for all API requests
  baseURL: 'http://localhost:5000/api',
  
  // This allows the browser to include cookies in the request
  // (Crucial for the HttpOnly JWT token we are now using)
  withCredentials: true,
});

export default api;
