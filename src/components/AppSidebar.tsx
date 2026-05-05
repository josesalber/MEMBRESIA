import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Building2, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/instituciones', label: 'Instituciones', icon: Building2 },
  { path: '/instituciones/crear', label: 'Crear Institución', icon: PlusCircle },
];

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-orange-600">KUI</h1>
        <p className="text-sm text-gray-600 mt-1">Central</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
