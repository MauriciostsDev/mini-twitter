import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';

export function Layout() {
  const { user, token, isDarkMode, toggleTheme } = useAppStore();
  const { logout } = useAuthViewModel();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-500">Mini Twitter</h1>
          
          <div className="flex items-center gap-4">
            <button
               onClick={toggleTheme}
               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
               title={isDarkMode ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'}
            >
               {isDarkMode ? '🌙' : '☀️'}
            </button>

            {(user || token) && (
              <div className="flex items-center gap-3">
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   {user?.name || 'Sessão Expirando'}
                 </span>
                 <button 
                   onClick={handleLogout}
                   className="text-sm text-red-500 hover:text-red-600 font-medium py-1 px-3 border border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                 >
                   Sair
                 </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}
