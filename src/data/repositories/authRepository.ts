import { apiClient } from '../api/apiClient';
import { LoginFormData, RegisterFormData } from '../../domain/schemas/authSchema';
import { User } from '../../presentation/store/useAppStore';

export interface AuthResponse {
  token: string;
  user: User;
}

export const authRepository = {
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    // Axios já dispara exceção em caso de 4xx, 5xx
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterFormData): Promise<AuthResponse> => {
    // Assume que a rota default é essa e retorna o token + user igual o login
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  }
};
