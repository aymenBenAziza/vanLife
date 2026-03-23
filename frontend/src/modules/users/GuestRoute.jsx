import { Navigate } from 'react-router-dom';

import { useAuth } from './useAuth.js';

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="screen-center">Checking session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
