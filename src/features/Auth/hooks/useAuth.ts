import { create } from 'zustand';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/authService';
import { LoginCredentials } from '../types/AuthTypes';

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  checkAuth: () => {
    const isLoggedIn = document.cookie.includes('fetch-session-id');
    set({ isAuthenticated: isLoggedIn });
  }
}));

export const useAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, checkAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => apiLogin(credentials),
    onSuccess: () => {
      setIsAuthenticated(true);
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const logout = () => {
    // Here you would also call the logout endpoint
    setIsAuthenticated(false);
    navigate('/login');
  };

  return {
    isAuthenticated,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    logout,
    checkAuth,
  };
};
