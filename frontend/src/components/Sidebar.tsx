import { FaBox, FaUsers, FaFileAlt, FaChartPie, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaChartPie /> },
    { name: 'Produk', path: '/dashboard/products', icon: <FaBox /> },
    { name: 'Artikel', path: '/dashboard/articles', icon: <FaFileAlt /> },
    { name: 'Users', path: '/dashboard/users', icon: <FaUsers /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="w-64 bg-[#1e293b] h-screen flex flex-col border-r border-slate-700 fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          ViteGo Admin
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <FaSignOutAlt />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;