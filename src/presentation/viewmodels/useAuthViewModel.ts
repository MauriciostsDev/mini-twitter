import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authRepository } from '../../data/repositories/authRepository';
import { useAppStore } from '../store/useAppStore';
import { LoginFormData, RegisterFormData } from '../../domain/schemas/authSchema';
import { useNavigate } from 'react-router-dom';

export function useAuthViewModel() {
  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setAuth);
  const clearAuth = useAppStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authRepository.login(data),
    onSuccess: (data) => {
      // Salva no global state e redireciona (o interceptor cuidará do header nas reqs seguintes)
      setAuth(data.token, data.user);
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // O backend retorna apenas o usuário no registro, não o token.
      // Precisamos fazer o login imediatamente após o registro.
      await authRepository.register(data);
      return authRepository.login({ email: data.email, password: data.password });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
    onError: () => {
      // Mesmo se a API falhar o logout, limpa localmente
      clearAuth();
      queryClient.clear();
    }
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutate,
  };
}
