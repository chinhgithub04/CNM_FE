import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - log requests and auto-attach token
apiClient.interceptors.request.use(
  (config) => {
    // Auto-attach token from localStorage to every request
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`➡️ ${config.method?.toUpperCase()} ${config.url}`, config.data);
    console.log('   Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - log responses and handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const method = error.config.method?.toUpperCase();
      const url = error.config.url;

      console.error(`❌ ${status} ${method} ${url}`, {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      // Handle authentication errors
      if (status === 401 || status === 403) {
        console.error('🔒 Authentication failed - Token may be invalid or expired');
        console.error('   Please try logging out and logging in again');

        // If it's a 403, token might be expired or invalid
        if (status === 403) {
          const token = localStorage.getItem('access_token');
          if (!token) {
            console.error('   No token found in localStorage!');
          } else {
            console.error('   Token exists but backend rejected it (403 Forbidden)');
            console.error('   This usually means:');
            console.error('   1. Token has expired');
            console.error('   2. User does not have required permissions');
            console.error('   3. Token format is incorrect');
          }
        }
      }
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
