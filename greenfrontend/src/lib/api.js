// API service layer for GreenBucks frontend
import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8787'; // Backend runs on port 8787 based on vite proxy config

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('gb:user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      error.message = 'Network error. Please check your connection and try again.';
      return Promise.reject(error);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to auth
      localStorage.removeItem('gb:user');
      window.location.href = '/auth';
      return Promise.reject(error);
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      error.message = 'Server error. Please try again later.';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  list: async (skip = 0, limit = 100) => {
    const response = await api.get('/users', { params: { skip, limit } });
    return response.data;
  },
};

// Transactions API
export const transactionsAPI = {
  list: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },
  
  create: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
  
  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
  
  importCSV: async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    
    const response = await api.post('/transactions/import_csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Receipts API
export const receiptsAPI = {
  upload: async (file, transactionId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (transactionId) {
      formData.append('transaction_id', transactionId);
    }
    
    const response = await api.post('/receipts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Plaid API
export const plaidAPI = {
  createLinkToken: async (userId) => {
    const response = await api.post('/plaid/link_token', { user_id: userId });
    return response.data;
  },
  
  exchangePublicToken: async (publicToken, userId, institutionName = null) => {
    const response = await api.post('/plaid/exchange_public_token', {
      public_token: publicToken,
      user_id: userId,
      institution_name: institutionName,
    });
    return response.data;
  },
  
  syncTransactions: async (userId, itemId = null) => {
    const response = await api.post('/plaid/sync', { user_id: userId, item_id: itemId });
    return response.data;
  },
  
  createSandboxToken: async () => {
    const response = await api.post('/plaid/sandbox_public_token');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
