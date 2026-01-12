import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to='/' replace /> : <Outlet />;
};

export default PublicOnlyRoute;
