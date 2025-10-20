import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// =====================================================
// Simple API Client
// =====================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// =====================================================
// Token Management
// =====================================================

const TOKEN_KEY = 'auth_token';

export const tokenManager = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clearToken: (): void => localStorage.removeItem(TOKEN_KEY),
};

// =====================================================
// Request Interceptor - Add JWT Token
// =====================================================

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// =====================================================
// Response Interceptor - Handle 401 Errors
// =====================================================

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
