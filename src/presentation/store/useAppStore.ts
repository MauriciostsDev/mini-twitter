import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  // Auth State
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;

  // Theme State
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial Auth State
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),

      // Initial Theme State
      isDarkMode: true,
      toggleTheme: () =>
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newDarkMode };
        }),
    }),
    {
      name: 'mini-twitter-storage', // key in localStorage
    }
  )
);

export const useSearchStore = create<{ searchQuery: string; setSearchQuery: (q: string) => void }>()((set) => ({
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q })
}));
