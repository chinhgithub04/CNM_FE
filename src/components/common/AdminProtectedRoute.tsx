import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminProtectedRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (user?.Role !== 'Admin') {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
