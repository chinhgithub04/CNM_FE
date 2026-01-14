import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PublicOnlyRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Redirect based on role
  if (user?.Role === 'Admin') {
    return <Navigate to='/admin' replace />;
  }

  return <Navigate to='/' replace />;
};

export default PublicOnlyRoute;
