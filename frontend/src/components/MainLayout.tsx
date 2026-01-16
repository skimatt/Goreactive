import Sidebar from './Sidebar';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-slate-200">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Navbar */}
        <header className="h-16 border-b border-slate-700 bg-[#1e293b]/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Halaman / <span className="text-white">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-white relative">
              <FaBell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white leading-none">{user.username || 'Admin'}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase">{user.role || 'Superuser'}</p>
              </div>
              <FaUserCircle size={32} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-slate-500 text-sm border-t border-slate-700/50">
          &copy; 2026 ViteGo Fullstack Project • Build with ❤️ in Go & React
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;