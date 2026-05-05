import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../store/AuthContext';
import { AppSidebar } from '../components/AppSidebar';
import { Topbar } from '../components/Topbar';

export function MainLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <Topbar />
      <main className="ml-64 pt-16">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
