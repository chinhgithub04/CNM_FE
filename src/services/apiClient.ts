import axios from 'axios';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7052/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
