import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isInitializing) return <FullScreenLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export const AdminRoute = () => {
  const { isAuthenticated, isInitializing, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isInitializing) return <FullScreenLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export const GuestOnlyRoute = () => {
  const { isAuthenticated, isInitializing, user } = useSelector((state) => state.auth);

  if (isInitializing) return <FullScreenLoader />;

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }
  return <Outlet />;
};

const FullScreenLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-sand-100">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-bamboo-200 border-t-bamboo-600" />
  </div>
);
