import { create } from 'zustand';
import { AuthResponse } from './types';

interface AuthState {
  user: AuthResponse['user'] | null;
  setUser: (user: AuthResponse['user'] | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => {
  // Vérifier si le token et l'utilisateur existent dans le localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  return {
    user,
    isAuthenticated: !!token && !!user,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
  };
});