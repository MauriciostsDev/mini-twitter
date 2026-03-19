import axios from 'axios';
import { useAppStore } from '../../presentation/store/useAppStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'; 

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o token JWT
apiClient.interceptors.request.use(
  (config) => {
    // Busca o token do estado global do Zustand
    const token = useAppStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Padrão JWT com "Bearer "
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      useAppStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
