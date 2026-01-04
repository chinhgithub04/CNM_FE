import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '..//../contexts/AuthContext';

const PublicOnlyRoute = () => {
  const { user } = useAuth();

  return user ? <Navigate to='/' replace /> : <Outlet />;
};

export default PublicOnlyRoute;
