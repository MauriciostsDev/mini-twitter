import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Limpa a store antes de cada teste
    useAppStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isDarkMode: false,
    });
  });

  it('should have default initial state', () => {
    const state = useAppStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isDarkMode).toBe(false);
  });

  it('should authenticate correctly', () => {
    const { setAuth } = useAppStore.getState();
    
    setAuth('fake-token', { id: '1', name: 'Mau', email: 'mau@example.com' });
    
    const state = useAppStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('fake-token');
    expect(state.user?.name).toBe('Mau');
  });

  it('should toggle dark mode correctly', () => {
    // No JSDOM o document existe mas talvez não tenha o html completo. Vamos checar apenas o state otimista
    const { toggleTheme } = useAppStore.getState();
    
    toggleTheme();
    
    let state = useAppStore.getState();
    expect(state.isDarkMode).toBe(true);

    toggleTheme();
    
    state = useAppStore.getState();
    expect(state.isDarkMode).toBe(false);
  });
});
