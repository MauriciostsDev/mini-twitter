import { Outlet, Link } from 'react-router-dom';
import { useAppStore, useSearchStore } from '../../store/useAppStore';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { Search, LogOut, Sun, Moon } from 'lucide-react';

export function Layout() {
  const { user, token, isDarkMode, toggleTheme } = useAppStore();
  const { logout } = useAuthViewModel();
  const { searchQuery, setSearchQuery } = useSearchStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors font-sans">
      <header className="bg-[var(--bg-header)] border-b border-[var(--border-ui)] sticky top-0 z-10 transition-colors">
        <div className="relative w-full px-6 h-14 flex items-center justify-between">
          {/* Logo - fixed far left */}
          <div className="flex-none">
            <h1 className="text-[16px] font-bold text-[var(--color-brand)] dark:text-white tracking-wide transition-colors">Mini Twitter</h1>
          </div>

          {/* Search bar - centered, fixed width matching posts */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[550px] px-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} strokeWidth={2} />
              <input 
                type="text" 
                placeholder="Buscar por post..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-input)] border border-[var(--border-ui)] rounded-full focus:ring-1 focus:ring-blue-500/50 focus:outline-none focus:border-blue-500/50 transition-all text-[var(--text-main)] placeholder-[var(--text-muted)] text-[13px]"
              />
            </div>
          </div>

          {/* Buttons - fixed far right */}
          <div className="flex-none flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-[var(--bg-input)] border border-[var(--color-brand)] dark:border-[var(--border-ui)] hover:bg-[var(--color-brand)] dark:hover:bg-[var(--border-ui)] flex items-center justify-center text-[var(--color-brand)] dark:text-[var(--text-muted)] hover:text-white transition-all"
              title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {!(user || token) ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/register"
                  className="px-5 py-1.5 rounded-full border border-[var(--color-brand)] dark:border-[var(--border-ui)] text-[var(--color-brand)] dark:text-white hover:bg-[var(--bg-input)] transition-all text-[13px] font-semibold whitespace-nowrap"
                >
                  Registrar-se
                </Link>
                <Link 
                  to="/login"
                  className="px-6 py-1.5 rounded-full bg-[#0D93F2] hover:bg-[#0284c7] text-white transition-all text-[13px] font-bold shadow-sm whitespace-nowrap"
                >
                  Login
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleLogout}
                className="w-9 h-9 rounded-full bg-[var(--bg-input)] border border-[var(--color-brand)] dark:border-[var(--border-ui)] flex items-center justify-center text-[var(--color-brand)] hover:bg-[var(--border-ui)] transition-all"
                title="Sair"
                type="button"
              >
                <LogOut size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[700px] mx-auto py-6 px-4">
        {/* Mobile search visible only on small screens */}
        <div className="relative mb-5 sm:hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Buscar por post..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-input)] border border-[var(--border-ui)] rounded-full focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all text-[var(--text-main)] placeholder-[var(--text-muted)] text-[13px]"
          />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
