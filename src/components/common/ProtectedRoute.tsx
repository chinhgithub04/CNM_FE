import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '..//../contexts/AuthContext';
import { UserRole } from '../types/enums';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  requiredRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-neutral-50'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-neutral-900 mb-4'>403</h1>
            <p className='text-xl text-neutral-600 mb-4'>Access Denied</p>
            <p className='text-neutral-500'>
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
