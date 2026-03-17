import { useMutation } from '@tanstack/react-query';
import { authRepository } from '../../data/repositories/authRepository';
import { useAppStore } from '../store/useAppStore';
import { LoginFormData, RegisterFormData } from '../../domain/schemas/authSchema';
import { useNavigate } from 'react-router-dom';

export function useAuthViewModel() {
  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setAuth);
  const clearAuth = useAppStore((state) => state.clearAuth);

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authRepository.login(data),
    onSuccess: (data) => {
      // Salva no global state e redireciona (o interceptor cuidará do header nas reqs seguintes)
      setAuth(data.token, data.user);
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authRepository.register(data),
    onSuccess: (data) => {
      // Alguns backends já loga o usuario no registro. Se não, precisaríamos ajustar isso.
      setAuth(data.token, data.user);
      navigate('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authRepository.logout(),
    onSuccess: () => {
      clearAuth();
      navigate('/login');
    },
    onError: () => {
      // Mesmo se a API falhar o logout, limpa localmente
      clearAuth();
      navigate('/login');
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
